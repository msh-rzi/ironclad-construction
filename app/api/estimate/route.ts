import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import aiConfig from "@/ai.config.json";

// Instantiated once — Next.js caches module-level singletons per worker
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Uncomment to support Azure or proxy overrides via .env.local:
  // baseURL: process.env.OPENAI_BASE_URL,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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

    const completion = await openai.chat.completions.create({
      model: aiConfig.model,
      max_tokens: aiConfig.max_tokens,
      temperature: aiConfig.temperature,
      messages: [
        { role: "system", content: aiConfig.systemPrompt },
        ...sanitized,
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? aiConfig.fallbackMessage;

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("[/api/estimate] OpenAI error:", error);

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