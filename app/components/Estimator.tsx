"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, DollarSign } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }

const SYSTEM_PROMPT = `You are IronClad Builders' AI Cost Estimator — a knowledgeable, professional construction estimator for one of America's top general contractors.

Your job: help customers get a realistic cost estimate for their construction project based on what they describe.

Guidelines:
- Ask clarifying questions if the customer is vague (location, size, type, quality level, timeline)
- Give realistic cost ranges based on current US construction market (2024-2025)
- Break down costs when helpful (materials, labor, permits, design, contingency)
- Reference typical per-square-foot costs for different project types
- Be warm, professional, and reassuring
- For residential: $100-$350/sqft depending on level
- For commercial: $150-$600/sqft
- For industrial: $60-$200/sqft
- Always mention that a formal quote requires a site visit
- Keep responses concise (3-6 sentences max per reply)
- End with a clear cost range or next clarifying question
- Format currency clearly with $ signs
- Mention IronClad Builders by name occasionally`;

export default function Estimator() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Welcome to IronClad's AI Cost Estimator! I can give you a ballpark estimate for your construction project in minutes. Just tell me — what are you looking to build?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text ?? "Sorry, I had trouble processing that. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having connectivity issues right now. Please try again or call us at 1-800-IRONCLAD." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "3,000 sq ft custom home in Texas",
    "Office renovation, 5,000 sq ft",
    "20,000 sq ft warehouse in Ohio",
    "Kitchen & bath remodel",
  ];

  return (
    <section id="estimator" ref={sectionRef} style={{ padding: "100px max(24px, 5vw)", background: "var(--steel-mid)", position: "relative", overflow: "hidden" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />

      {/* Ambient glow */}
      <div style={{ position: "absolute", right: "10%", top: "20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start", marginBottom: 48 }} className="est-header">
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 2, background: "var(--amber)" }} />
              <span style={{ fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)" }}>Powered by AI</span>
            </div>
            <h2 style={{ fontSize: "clamp(44px, 5vw, 72px)", color: "var(--white)", marginBottom: 20 }}>AI PRICE<br /><span style={{ color: "var(--amber)" }}>ESTIMATOR</span></h2>
            <p style={{ fontSize: 16, color: "var(--concrete-light)", lineHeight: 1.75, marginBottom: 24 }}>
              Describe your project and our AI estimator will give you a realistic ballpark cost based on current US market data. No obligation, no sign-up.
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
                  <span style={{ fontFamily: "Barlow Condensed", fontSize: 14, color: "var(--concrete-light)", letterSpacing: "0.04em" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick prompts */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s 0.15s ease" }}>
            <p style={{ fontFamily: "Barlow Condensed", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--concrete)", marginBottom: 16 }}>Try an example:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quickPrompts.map((q, i) => (
                <button key={i} onClick={() => setInput(q)} style={{
                  background: "var(--steel)",
                  border: "1px solid rgba(245,166,35,0.2)",
                  color: "var(--concrete-light)",
                  padding: "12px 18px",
                  textAlign: "left",
                  fontFamily: "Barlow", fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 10,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--amber)"; (e.currentTarget as HTMLElement).style.color = "var(--white)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,166,35,0.2)"; (e.currentTarget as HTMLElement).style.color = "var(--concrete-light)"; }}
                >
                  <DollarSign size={14} color="var(--amber)" style={{ flexShrink: 0 }} />
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Box */}
        <div style={{
          background: "var(--steel)",
          border: "1px solid rgba(245,166,35,0.2)",
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "all 0.7s 0.2s ease",
        }}
        className="glow-amber"
        >
          {/* Chat header */}
          <div style={{
            background: "var(--steel-light)", padding: "16px 24px",
            borderBottom: "1px solid rgba(245,166,35,0.15)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 36, height: 36,
              background: "var(--amber)",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bot size={18} color="var(--steel)" />
            </div>
            <div>
              <div style={{ fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--white)" }}>IronClad AI Estimator</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, background: "#6be6a0", borderRadius: "50%" }} />
                <span style={{ fontFamily: "Barlow", fontSize: 12, color: "#6be6a0" }}>Online · Instant Response</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ height: 380, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((m, i) => (
              <div key={i} className="chat-bubble" style={{
                display: "flex", gap: 12,
                flexDirection: m.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: m.role === "assistant" ? "var(--amber)" : "var(--steel-light)",
                  border: m.role === "user" ? "1px solid rgba(245,166,35,0.3)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {m.role === "assistant" ? <Bot size={16} color="var(--steel)" /> : <User size={16} color="var(--amber)" />}
                </div>
                <div style={{
                  maxWidth: "72%",
                  background: m.role === "assistant" ? "var(--steel-light)" : "rgba(245,166,35,0.1)",
                  border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(245,166,35,0.2)",
                  padding: "12px 16px",
                  borderRadius: m.role === "assistant" ? "0 8px 8px 8px" : "8px 0 8px 8px",
                  fontSize: 14, lineHeight: 1.65, color: m.role === "assistant" ? "var(--concrete-light)" : "var(--white)",
                  whiteSpace: "pre-wrap",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bot size={16} color="var(--steel)" />
                </div>
                <div style={{ background: "var(--steel-light)", border: "1px solid rgba(255,255,255,0.06)", padding: "14px 18px", borderRadius: "0 8px 8px 8px", display: "flex", gap: 6, alignItems: "center" }}>
                  <Loader2 size={14} color="var(--amber)" style={{ animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: 13, color: "var(--concrete)" }}>Analyzing your project...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(245,166,35,0.15)", display: "flex", gap: 12 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Describe your project (type, size, location, quality)..."
              style={{
                flex: 1,
                background: "var(--steel-light)", border: "1px solid rgba(245,166,35,0.2)",
                color: "var(--white)", padding: "12px 18px",
                fontFamily: "Barlow", fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--amber)")}
              onBlur={e => (e.target.style.borderColor = "rgba(245,166,35,0.2)")}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? "rgba(245,166,35,0.3)" : "var(--amber)",
                border: "none", padding: "0 20px",
                clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Send size={18} color="var(--steel)" />
            </button>
          </div>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: "var(--concrete)", fontStyle: "italic", textAlign: "center" }}>
          AI estimates are for planning purposes only. Contact us for a formal, site-specific quote.
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .est-header { grid-template-columns: 1fr !important; gap: 32px !important; } }
      `}</style>
    </section>
  );
}
