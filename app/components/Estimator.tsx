"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, DollarSign, Lock, PhoneCall } from "lucide-react";
import aiConfig from "@/ai.config.json";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Quota {
  requestsRemaining: number;
  tokensRemaining: number;
}

const MAX_REQUESTS = 3;

export default function Estimator() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: aiConfig.welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState<Quota>({
    requestsRemaining: MAX_REQUESTS,
    tokensRemaining: 3000,
  });
  const [limitHit, setLimitHit] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Persist limit state in sessionStorage so a page refresh doesn't reset UI
  // (the server will still block, but UX stays consistent)
  useEffect(() => {
    const stored = sessionStorage.getItem("est_quota");
    if (stored) {
      try {
        const parsed: Quota = JSON.parse(stored);
        setQuota(parsed);
        if (parsed.requestsRemaining <= 0 || parsed.tokensRemaining <= 0) {
          setLimitHit(true);
        }
      } catch {
        // ignore malformed storage
      }
    }
  }, []);

  // Intersection observer for entrance animation
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // // Scroll to bottom on new messages
  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || limitHit) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.status === 429) {
        // Rate or token limit hit on the server
        setLimitHit(true);
        const newQuota = { requestsRemaining: 0, tokensRemaining: 0 };
        setQuota(newQuota);
        sessionStorage.setItem("est_quota", JSON.stringify(newQuota));

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "You've reached the free estimate limit for today. Please contact us directly for a formal quote — we respond within one business day!",
          },
        ]);
        return;
      }

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error ?? `HTTP ${res.status}`);
      }

      const { reply, quota: serverQuota } = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      if (serverQuota) {
        const updated: Quota = {
          requestsRemaining: serverQuota.requestsRemaining,
          tokensRemaining: serverQuota.tokensRemaining,
        };
        setQuota(updated);
        sessionStorage.setItem("est_quota", JSON.stringify(updated));

        if (updated.requestsRemaining <= 0 || updated.tokensRemaining <= 0) {
          setLimitHit(true);
        }
      }
    } catch (err) {
      console.error("[Estimator] fetch error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiConfig.fallbackMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isInputDisabled = loading || limitHit;
  const usedRequests = MAX_REQUESTS - quota.requestsRemaining;

  return (
    <section
      id="estimator"
      ref={sectionRef}
      style={{
        padding: "100px max(24px, 5vw)",
        background: "var(--steel-mid)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          right: "10%",
          top: "20%",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "start",
            marginBottom: 48,
          }}
          className="est-header"
        >
          {/* Left: copy */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.7s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 2, background: "var(--amber)" }} />
              <span
                style={{
                  fontFamily: "Barlow Condensed",
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--amber)",
                }}
              >
                Powered by AI
              </span>
            </div>

            <h2
              style={{ fontSize: "clamp(44px, 5vw, 72px)", color: "var(--white)", marginBottom: 20 }}
            >
              AI PRICE
              <br />
              <span style={{ color: "var(--amber)" }}>ESTIMATOR</span>
            </h2>

            <p
              style={{
                fontSize: 16,
                color: "var(--concrete-light)",
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              Describe your project and our AI estimator will give you a realistic ballpark cost
              based on current US market data. No obligation, no sign-up.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "⚡", text: "Instant estimates in 30 seconds" },
                { icon: "📍", text: "Location-adjusted pricing" },
                { icon: "🏗️", text: "All project types supported" },
                { icon: "🤝", text: "No obligation or sign-up required" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span
                    style={{
                      fontFamily: "Barlow Condensed",
                      fontSize: 14,
                      color: "var(--concrete-light)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: quick prompts */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.7s 0.15s ease",
            }}
          >
            <p
              style={{
                fontFamily: "Barlow Condensed",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--concrete)",
                marginBottom: 16,
              }}
            >
              Try an example:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {aiConfig.quickPrompts.map((q: string, i: number) => (
                <button
                  key={i}
                  onClick={() => !limitHit && setInput(q)}
                  disabled={limitHit}
                  style={{
                    background: "var(--steel)",
                    border: "1px solid rgba(245,166,35,0.2)",
                    color: limitHit ? "var(--concrete)" : "var(--concrete-light)",
                    padding: "12px 18px",
                    textAlign: "left",
                    fontFamily: "Barlow",
                    fontSize: 14,
                    cursor: limitHit ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    opacity: limitHit ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!limitHit) {
                      e.currentTarget.style.borderColor = "var(--amber)";
                      e.currentTarget.style.color = "var(--white)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(245,166,35,0.2)";
                    e.currentTarget.style.color = limitHit
                      ? "var(--concrete)"
                      : "var(--concrete-light)";
                  }}
                >
                  <DollarSign size={14} color={limitHit ? "var(--concrete)" : "var(--amber)"} style={{ flexShrink: 0 }} />
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Limit Banner ── */}
        {limitHit && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(245,166,35,0.12) 0%, rgba(245,166,35,0.06) 100%)",
              border: "1px solid rgba(245,166,35,0.5)",
              padding: "20px 28px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
              animation: "fadeIn 0.4s ease",
            }}
            className="limit-banner"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(245,166,35,0.15)",
                  border: "1px solid rgba(245,166,35,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Lock size={18} color="var(--amber)" />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Barlow Condensed",
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--amber)",
                    marginBottom: 4,
                  }}
                >
                  Daily estimate limit reached
                </div>
                <div style={{ fontSize: 13, color: "var(--concrete-light)", lineHeight: 1.5 }}>
                  You've used all {MAX_REQUESTS} free AI estimates for today. The limit resets at
                  midnight UTC. For a formal quote, contact our team directly.
                </div>
              </div>
            </div>

            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--amber)",
                color: "var(--steel)",
                fontFamily: "Barlow Condensed",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "11px 22px",
                textDecoration: "none",
                clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <PhoneCall size={14} />
              Contact Us
            </a>
          </div>
        )}

        {/* ── Chat Box ── */}
        <div
          style={{
            background: "var(--steel)",
            border: limitHit
              ? "1px solid rgba(245,166,35,0.1)"
              : "1px solid rgba(245,166,35,0.2)",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.7s 0.2s ease",
            filter: limitHit ? "saturate(0.4)" : "none",
          }}
          className={limitHit ? "" : "glow-amber"}
        >
          {/* Chat header */}
          <div
            style={{
              background: "var(--steel-light)",
              padding: "16px 24px",
              borderBottom: "1px solid rgba(245,166,35,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: limitHit ? "var(--concrete)" : "var(--amber)",
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.3s",
                }}
              >
                <Bot size={18} color="var(--steel)" />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Barlow Condensed",
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--white)",
                  }}
                >
                  IronClad AI Estimator
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      background: limitHit ? "#888" : "#6be6a0",
                      borderRadius: "50%",
                      transition: "background 0.3s",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Barlow",
                      fontSize: 12,
                      color: limitHit ? "var(--concrete)" : "#6be6a0",
                    }}
                  >
                    {limitHit ? "Limit reached · Resets midnight UTC" : "Online · Instant Response"}
                  </span>
                </div>
              </div>
            </div>

            {/* Usage pip-counter */}
            {!limitHit && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  background: "var(--steel)",
                  border: "1px solid rgba(245,166,35,0.15)",
                }}
                title={`${quota.requestsRemaining} of ${MAX_REQUESTS} estimates remaining today`}
              >
                {Array.from({ length: MAX_REQUESTS }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: i < usedRequests ? "var(--concrete)" : "var(--amber)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
                <span
                  style={{
                    fontFamily: "Barlow Condensed",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: "var(--concrete)",
                    marginLeft: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {quota.requestsRemaining}/{MAX_REQUESTS} left
                </span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div
            style={{
              height: 380,
              overflowY: "auto",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className="chat-bubble"
                style={{
                  display: "flex",
                  gap: 12,
                  flexDirection: m.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background:
                      m.role === "assistant" ? "var(--amber)" : "var(--steel-light)",
                    border:
                      m.role === "user"
                        ? "1px solid rgba(245,166,35,0.3)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {m.role === "assistant" ? (
                    <Bot size={16} color="var(--steel)" />
                  ) : (
                    <User size={16} color="var(--amber)" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: "72%",
                    background:
                      m.role === "assistant"
                        ? "var(--steel-light)"
                        : "rgba(245,166,35,0.1)",
                    border:
                      m.role === "assistant"
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "1px solid rgba(245,166,35,0.2)",
                    padding: "12px 16px",
                    borderRadius:
                      m.role === "assistant" ? "0 8px 8px 8px" : "8px 0 8px 8px",
                    fontSize: 14,
                    lineHeight: 1.65,
                    color:
                      m.role === "assistant"
                        ? "var(--concrete-light)"
                        : "var(--white)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div
                className="chat-bubble"
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--amber)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={16} color="var(--steel)" />
                </div>
                <div
                  style={{
                    background: "var(--steel-light)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "14px 18px",
                    borderRadius: "0 8px 8px 8px",
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <Loader2
                    size={14}
                    color="var(--amber)"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  <span style={{ fontSize: 13, color: "var(--concrete)" }}>
                    Analyzing your project...
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid rgba(245,166,35,0.15)",
              display: "flex",
              gap: 12,
              position: "relative",
            }}
          >
            {/* Locked overlay */}
            {limitHit && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(20,22,26,0.75)",
                  backdropFilter: "blur(2px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  zIndex: 10,
                }}
              >
                <Lock size={15} color="var(--concrete)" />
                <span
                  style={{
                    fontFamily: "Barlow Condensed",
                    fontSize: 13,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--concrete)",
                  }}
                >
                  Chat disabled · Limit reached
                </span>
                <a
                  href="#contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "var(--amber)",
                    color: "var(--steel)",
                    fontFamily: "Barlow Condensed",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "7px 16px",
                    textDecoration: "none",
                    clipPath: "polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)",
                    marginLeft: 8,
                  }}
                >
                  <PhoneCall size={12} />
                  Contact Us
                </a>
              </div>
            )}

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              disabled={isInputDisabled}
              placeholder={
                limitHit
                  ? "Daily limit reached — contact us for a formal quote"
                  : "Describe your project (type, size, location, quality)..."
              }
              style={{
                flex: 1,
                background: "var(--steel-light)",
                border: "1px solid rgba(245,166,35,0.2)",
                color: isInputDisabled ? "var(--concrete)" : "var(--white)",
                padding: "12px 18px",
                fontFamily: "Barlow",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
                cursor: isInputDisabled ? "not-allowed" : "text",
              }}
              onFocus={(e) => {
                if (!isInputDisabled) e.target.style.borderColor = "var(--amber)";
              }}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(245,166,35,0.2)")
              }
            />
            <button
              onClick={sendMessage}
              disabled={isInputDisabled || !input.trim()}
              style={{
                background:
                  isInputDisabled || !input.trim()
                    ? "rgba(245,166,35,0.3)"
                    : "var(--amber)",
                border: "none",
                padding: "0 20px",
                clipPath:
                  "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                cursor: isInputDisabled || !input.trim() ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={18} color="var(--steel)" />
            </button>
          </div>
        </div>

        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            color: "var(--concrete)",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          AI estimates are for planning purposes only. Contact us for a formal, site-specific quote.{" "}
          <span style={{ opacity: 0.6 }}>
            · {MAX_REQUESTS} free estimates per day, resets at midnight UTC.
          </span>
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .est-header { grid-template-columns: 1fr !important; gap: 32px !important; }
          .limit-banner { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </section>
  );
}