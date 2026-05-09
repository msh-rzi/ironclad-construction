import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DATA_PATH = path.join(process.cwd(), "data", "site.data.json");
const DATA_DIR = path.dirname(DATA_PATH);

function jsonResponse(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "no-store, no-cache, max-age=0, must-revalidate");
  return response;
}

function isSiteData(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const data = value as Record<string, unknown>;
  return [
    "company",
    "hero",
    "navbar",
    "projects",
    "services",
    "pricing",
    "contact",
    "footer",
  ].every((key) => key in data);
}

export async function GET() {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return jsonResponse(JSON.parse(raw));
  } catch (error) {
    console.error("[/api/site-data] read error:", error);
    return jsonResponse({ error: "Could not read site data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!isSiteData(body)) {
      return jsonResponse({ error: "Invalid site data shape." }, { status: 400 });
    }

    await mkdir(DATA_DIR, { recursive: true });

    const tmpPath = `${DATA_PATH}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tmpPath, `${JSON.stringify(body, null, 2)}\n`, "utf-8");
    await rename(tmpPath, DATA_PATH);

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("[/api/site-data] write error:", error);
    return jsonResponse({ error: "Could not write site data." }, { status: 500 });
  }
}
