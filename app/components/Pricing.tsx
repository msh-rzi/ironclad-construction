"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Zap } from "lucide-react";
import siteData from "@/data/site.data.json";

const { pricing } = siteData;

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} style={{ padding: "100px max(24px, 5vw)", background: "var(--steel)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "-10%", top: "20%", width: 600, height: 600, background: "radial-gradient(circle, rgba(245,166,35,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 2, background: "var(--amber)" }} />
            <span style={{ fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)" }}>
              {pricing.eyebrow}
            </span>
            <div style={{ width: 40, height: 2, background: "var(--amber)" }} />
          </div>
          <h2 style={{ fontSize: "clamp(48px, 6vw, 80px)", color: "var(--white)", marginBottom: 16 }}>
            {pricing.headline[0]}<br />
            <span style={{ color: "var(--amber)" }}>{pricing.headline[1]}</span>
          </h2>
          <p style={{ fontSize: 16, color: "var(--concrete-light)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            {pricing.subheading}
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2, alignItems: "start" }}>
          {pricing.plans.map((p, i) => (
            <div key={p.name} style={{
              background: p.highlight ? "var(--steel-light)" : "var(--steel-mid)",
              padding: 36,
              borderTop: `4px solid ${p.color}`,
              position: "relative",
              opacity: visible ? 1 : 0,
              transform: visible ? (p.highlight ? "translateY(-12px)" : "translateY(0)") : "translateY(40px)",
              transition: `all 0.7s ease ${i * 0.12}s`,
              overflow: "hidden",
            }}>
              {p.highlight && (
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  background: "var(--amber)", color: "var(--steel)",
                  fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 11,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  padding: "4px 12px", display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Zap size={11} /> Most Popular
                </div>
              )}

              <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle at top right, ${p.color}10, transparent 70%)`, pointerEvents: "none" }} />

              <p style={{ fontFamily: "Barlow Condensed", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: p.color, marginBottom: 8 }}>{p.tagline}</p>
              <h3 style={{ fontFamily: "Bebas Neue", fontSize: 40, color: "var(--white)", marginBottom: 20 }}>{p.name}</h3>

              <div style={{ marginBottom: 28 }}>
                <span style={{ fontFamily: "Bebas Neue", fontSize: 52, color: p.color, lineHeight: 1 }}>{p.range}</span>
                <div style={{ fontFamily: "Barlow Condensed", fontSize: 13, color: "var(--concrete)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.unit}</div>
              </div>

              <div style={{ marginBottom: 28, padding: "12px 16px", background: `${p.color}10`, borderLeft: `3px solid ${p.color}` }}>
                <span style={{ fontFamily: "Barlow Condensed", fontSize: 13, color: "var(--concrete-light)", letterSpacing: "0.06em" }}>{p.note}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {p.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Check size={14} color={p.color} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "var(--concrete-light)", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>

              <a href={pricing.ctaHref} style={{
                display: "block", textAlign: "center",
                background: p.highlight ? p.color : "transparent",
                color: p.highlight ? "var(--steel)" : p.color,
                border: `1px solid ${p.color}`,
                padding: "13px 24px",
                fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 13,
                letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none",
                clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = p.color; el.style.color = "var(--steel)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = p.highlight ? p.color : "transparent"; el.style.color = p.highlight ? "var(--steel)" : p.color; }}
              >{pricing.ctaLabel}</a>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 40, fontSize: 13, color: "var(--concrete)", fontStyle: "italic" }}>
          {pricing.disclaimer}
        </p>
      </div>
    </section>
  );
}
