"use client";
import { useEffect, useState } from "react";

export default function SecretAdminPage() {
  const [raw, setRaw]       = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [parseError, setParseError] = useState("");

  // Load current JSON on mount
  useEffect(() => {
    fetch("/api/site-data")
      .then((r) => r.json())
      .then((data) => setRaw(JSON.stringify(data, null, 2)))
      .catch(() => setRaw("// failed to load"));
  }, []);

  const handleSave = async () => {
    // Validate JSON before sending
    try {
      JSON.parse(raw);
      setParseError("");
    } catch (e: unknown) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
      return;
    }

    setStatus("saving");
    try {
      const res = await fetch("/api/site-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const statusLabel = {
    idle:   "",
    saving: "Saving…",
    saved:  "✓ Saved",
    error:  "✗ Save failed",
  }[status];

  return (
    <div style={{ fontFamily: "monospace", padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, marginBottom: 4 }}>site.data.json</h1>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
        Edit the raw JSON below and click Save. Changes are written to disk immediately.
      </p>

      {parseError && (
        <div style={{ background: "#fee", border: "1px solid #f99", padding: "8px 12px", marginBottom: 12, fontSize: 13, color: "#c00" }}>
          JSON error: {parseError}
        </div>
      )}

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        spellCheck={false}
        style={{
          width: "100%",
          height: "70vh",
          fontFamily: "monospace",
          fontSize: 13,
          padding: 16,
          border: "1px solid #ccc",
          resize: "vertical",
          background: "#fafafa",
          boxSizing: "border-box",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          style={{
            padding: "10px 28px",
            fontSize: 14,
            cursor: status === "saving" ? "not-allowed" : "pointer",
            background: "#111",
            color: "#fff",
            border: "none",
          }}
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>

        {statusLabel && (
          <span style={{ fontSize: 13, color: status === "saved" ? "green" : status === "error" ? "red" : "#555" }}>
            {statusLabel}
          </span>
        )}
      </div>
    </div>
  );
}