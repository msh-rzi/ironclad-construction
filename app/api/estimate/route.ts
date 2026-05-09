import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import aiConfig from "@/ai.config.json";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Rate-limit & token-budget store ────────────────────────────────────────
// Keyed by IP address. Resets automatically when a new UTC day begins.
// For multi-instance deployments, replace this Map with a Redis/KV store.

const MAX_REQUESTS_PER_DAY = 3;
const MAX_TOKENS_PER_DAY = 3000; // cumulative output tokens per user per day

interface UserQuota {
  date: string;        // "YYYY-MM-DD" in UTC — used to detect day rollover
  requests: number;
  tokensUsed: number;
}

const quotaStore = new Map<string, UserQuota>();

// ─── In-flight lock ──────────────────────────────────────────────────────────
// Prevents concurrent requests from the same IP racing past the quota check
// before any of them increments the counter (TOCTOU exploit).
const inFlight = new Set<string>();

function utcDateString(): string {
  return new Date().toISOString().slice(0, 10); // "2025-07-04"
}

function getQuota(ip: string): UserQuota {
  const today = utcDateString();
  const existing = quotaStore.get(ip);

  // Reset quota if it's a new day (or first visit)
  if (!existing || existing.date !== today) {
    const fresh: UserQuota = { date: today, requests: 0, tokensUsed: 0 };
    quotaStore.set(ip, fresh);
    return fresh;
  }

  return existing;
}

function saveQuota(ip: string, quota: UserQuota) {
  quotaStore.set(ip, quota);
}

// Clean up stale entries once per hour to avoid unbounded memory growth
let lastCleanup = Date.now();
function maybeCleanup() {
  if (Date.now() - lastCleanup < 3_600_000) return;
  lastCleanup = Date.now();
  const today = utcDateString();
  for (const [ip, quota] of quotaStore) {
    if (quota.date !== today) quotaStore.delete(ip);
  }
}

// ─── Guards ──────────────────────────────────────────────────────────────────
// Hard cap on conversation depth to prevent runaway history from inflating
// token usage and to block clients that loop messages artificially.
const MAX_CONVERSATION_TURNS = 20;    // user + assistant messages combined
const MAX_MESSAGE_LENGTH     = 2_000; // characters per individual message

// ─── OpenAI singleton ────────────────────────────────────────────────────────

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY.");
  }
  openai ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
  });
  return openai;
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  maybeCleanup();

  console.log("[/api/estimate] Incoming request from", req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown");

  // Resolve client IP (works behind Vercel / common reverse proxies)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // ── Concurrency lock ─────────────────────────────────────────────────────
  // Reject a second in-flight request from the same IP immediately so two
  // parallel calls can't both pass the quota check before either updates it.
  if (inFlight.has(ip)) {
    return NextResponse.json(
      { error: "A request from your session is already in progress. Please wait." },
      { status: 429 }
    );
  }
  inFlight.add(ip);

  try {
    // ── Quota check ────────────────────────────────────────────────────────
    const quota = getQuota(ip);

    if (quota.requests >= MAX_REQUESTS_PER_DAY) {
      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          message: `You've used all ${MAX_REQUESTS_PER_DAY} free estimates for today. Contact us for a formal quote or try again tomorrow.`,
          remaining: 0,
          resetsAt: "midnight UTC",
        },
        { status: 429 }
      );
    }

    if (quota.tokensUsed >= MAX_TOKENS_PER_DAY) {
      return NextResponse.json(
        {
          error: "token_limit_exceeded",
          message:
            "You've reached the daily token limit. Contact us for a formal quote or try again tomorrow.",
          remaining: 0,
          resetsAt: "midnight UTC",
        },
        { status: 429 }
      );
    }

    // ── Parse & validate body ──────────────────────────────────────────────
    let messages: ChatMessage[];
    try {
      ({ messages } = await req.json());
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Request body must include a non-empty `messages` array." },
        { status: 400 }
      );
    }

    // ── Conversation depth guard ───────────────────────────────────────────
    // A client sending an ever-growing history on every turn could inflate
    // token usage beyond the per-request cap, so we hard-truncate early.
    if (messages.length > MAX_CONVERSATION_TURNS) {
      return NextResponse.json(
        {
          error: "conversation_too_long",
          message: `Conversation exceeds the maximum of ${MAX_CONVERSATION_TURNS} messages. Please start a new session.`,
        },
        { status: 400 }
      );
    }

    const validRoles = new Set(["user", "assistant"]);
    const sanitized = messages
      .filter((m) => validRoles.has(m.role) && typeof m.content === "string")
      .map((m) => {
        // ── Per-message length guard ─────────────────────────────────────
        // Truncate individual messages that exceed the character cap so a
        // single giant payload can't sneak through token accounting.
        const trimmed = m.content.trim();
        const content =
          trimmed.length > MAX_MESSAGE_LENGTH
            ? trimmed.slice(0, MAX_MESSAGE_LENGTH)
            : trimmed;
        return { role: m.role, content };
      });

    if (sanitized.length === 0) {
      return NextResponse.json(
        { error: "No valid messages found after sanitization." },
        { status: 400 }
      );
    }

    // ── Call OpenAI ────────────────────────────────────────────────────────
    try {
      // Cap max_output_tokens so a single request can't exhaust the token budget
      const remainingTokens = MAX_TOKENS_PER_DAY - quota.tokensUsed;
      const cappedMaxTokens = Math.min(
        aiConfig.max_tokens as number,
        remainingTokens
      );

      const response = await getOpenAI().responses.create({
        model: process.env.OPENAI_MODEL ?? aiConfig.model,
        instructions: aiConfig.systemPrompt,
        input: sanitized.map((m) => ({ role: m.role, content: m.content })),
        max_output_tokens: cappedMaxTokens,
        store: false,
      });

      const reply = response.output_text?.trim() || aiConfig.fallbackMessage;

      // ── Update quota ──────────────────────────────────────────────────────
      const tokensUsedThisCall =
        (response.usage?.output_tokens as number | undefined) ?? 0;

      quota.requests += 1;
      quota.tokensUsed += tokensUsedThisCall;
      saveQuota(ip, quota);

      const requestsRemaining = MAX_REQUESTS_PER_DAY - quota.requests;

      return NextResponse.json(
        {
          reply,
          quota: {
            requestsRemaining,
            tokensRemaining: Math.max(0, MAX_TOKENS_PER_DAY - quota.tokensUsed),
          },
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("[/api/estimate] OpenAI error:", error);

      if (error instanceof Error && error.message === "Missing OPENAI_API_KEY.") {
        return NextResponse.json(
          { error: "Estimator service is missing OPENAI_API_KEY." },
          { status: 503 }
        );
      }

      if (error instanceof OpenAI.APIError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status ?? 500 }
        );
      }

      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  } finally {
    // Always release the lock — even if an error was thrown — so the IP
    // isn't permanently blocked for the rest of the server's lifetime.
    inFlight.delete(ip);
  }
}