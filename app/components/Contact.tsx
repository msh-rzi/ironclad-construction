"use client";
import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" ref={sectionRef} style={{ padding: "100px max(24px, 5vw)", background: "var(--steel)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 0, top: 0, width: "40%", height: "100%", background: "linear-gradient(135deg, transparent 40%, rgba(245,166,35,0.04) 100%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 2, background: "var(--amber)" }} />
            <span style={{ fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)" }}>Let's Build Together</span>
          </div>
          <h2 style={{ fontSize: "clamp(48px, 6vw, 80px)", color: "var(--white)" }}>GET IN<br /><span style={{ color: "var(--amber)" }}>TOUCH</span></h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, alignItems: "start" }} className="contact-grid">
          {/* Info */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s 0.1s ease" }}>
            {[
              { icon: MapPin, label: "Headquarters", value: "2400 Commerce Dr\nDallas, TX 75201" },
              { icon: Phone, label: "Main Line", value: "1-800-IRONCLAD\n(1-800-476-6252)" },
              { icon: Mail, label: "Email", value: "projects@ironclad.build\nbids@ironclad.build" },
              { icon: Clock, label: "Office Hours", value: "Mon–Fri 7AM–6PM CST\nEmergency line 24/7" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: "flex", gap: 20, marginBottom: 32 }}>
                  <div style={{ width: 44, height: 44, background: "var(--steel-light)", border: "1px solid rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color="var(--amber)" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "Barlow Condensed", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--concrete)", marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 15, color: "var(--concrete-light)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.value}</div>
                  </div>
                </div>
              );
            })}

            {/* Office locations */}
            <div style={{ padding: "24px", background: "var(--steel-mid)", borderLeft: "3px solid var(--amber)" }}>
              <div style={{ fontFamily: "Barlow Condensed", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 12 }}>Regional Offices</div>
              {["Dallas, TX (HQ)", "Houston, TX", "Chicago, IL", "Phoenix, AZ", "Seattle, WA", "Nashville, TN"].map(city => (
                <div key={city} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 4, height: 4, background: "var(--amber)", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "var(--concrete-light)" }}>{city}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s 0.2s ease" }}>
            {sent ? (
              <div style={{ background: "var(--steel-mid)", border: "1px solid rgba(107,230,160,0.3)", padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "Bebas Neue", fontSize: 36, color: "var(--white)", marginBottom: 12 }}>Message Received</h3>
                <p style={{ color: "var(--concrete-light)", lineHeight: 1.7 }}>A project specialist will reach out within 24 business hours. For urgent matters, call 1-800-IRONCLAD.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[{ ph: "First Name *", type: "text" }, { ph: "Last Name *", type: "text" }].map(f => (
                    <input key={f.ph} type={f.type} placeholder={f.ph} required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                  ))}
                </div>
                <input type="email" placeholder="Email Address *" required style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                <input type="tel" placeholder="Phone Number" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                <select required style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusInput} onBlur={blurInput}>
                  <option value="">Project Type *</option>
                  {["Residential", "Commercial", "Industrial", "Renovation", "Other"].map(o => <option key={o}>{o}</option>)}
                </select>
                <input type="text" placeholder="Approximate Budget (optional)" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                <textarea placeholder="Tell us about your project..." rows={5} style={{ ...inputStyle, resize: "vertical" as const }} onFocus={focusInput} onBlur={blurInput} />
                <button type="submit" style={{
                  background: "var(--amber)", color: "var(--steel)", border: "none",
                  padding: "16px 32px",
                  fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 14,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
                  cursor: "pointer", transition: "background 0.2s",
                  alignSelf: "flex-start",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--amber-bright)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--amber)")}
                >Send Message →</button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }
      `}</style>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--steel-mid)",
  border: "1px solid rgba(245,166,35,0.15)",
  color: "var(--white)",
  padding: "14px 18px",
  fontFamily: "Barlow",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
  width: "100%",
};
const focusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = "var(--amber)"; };
const blurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = "rgba(245,166,35,0.15)"; };
