import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import aiConfig from "@/ai.config.json";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

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

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Request body must include a non-empty `messages` array." },
        { status: 400 }
      );
    }

    // Validate roles to guard against prompt-injection via crafted payloads
    const validRoles = new Set(["user", "assistant"]);
    const sanitized = messages
      .filter((m) => validRoles.has(m.role) && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content.trim() }));

    if (sanitized.length === 0) {
      return NextResponse.json(
        { error: "No valid messages found after sanitization." },
        { status: 400 }
      );
    }

    const response = await getOpenAI().responses.create({
      model: process.env.OPENAI_MODEL ?? aiConfig.model,
      instructions: aiConfig.systemPrompt,
      input: sanitized.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      max_output_tokens: aiConfig.max_tokens,
      store: false,
    });

    const reply = response.output_text?.trim() || aiConfig.fallbackMessage;

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("[/api/estimate] OpenAI error:", error);

    if (error instanceof Error && error.message === "Missing OPENAI_API_KEY.") {
      return NextResponse.json(
        { error: "Estimator service is missing OPENAI_API_KEY." },
        { status: 503 }
      );
    }

    // Surface OpenAI API errors with their status code when available
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
}
