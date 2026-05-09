"use client";
import { useEffect, useRef, useState } from "react";
import { Building2, Home, Factory, Wrench, Leaf, ShieldCheck, LucideIcon } from "lucide-react";
import siteData from "@/data/site.data.json";

const { services } = siteData;

// Map JSON icon strings → Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Home,
  Factory,
  Wrench,
  Leaf,
  ShieldCheck,
};

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} style={{ padding: "100px max(24px, 5vw)", background: "var(--steel-mid)", position: "relative" }}>
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }} className="services-grid">
          {/* Left: copy */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 2, background: "var(--amber)" }} />
              <span style={{ fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)" }}>
                {services.eyebrow}
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(48px, 5vw, 72px)", color: "var(--white)", marginBottom: 24 }}>
              {services.headline[0]}<br />
              <span style={{ color: "var(--amber)" }}>{services.headline[1]}</span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--concrete-light)", lineHeight: 1.75, marginBottom: 32 }}>
              {services.body}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {services.credentials.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 6, height: 6, background: "var(--amber)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "Barlow Condensed", fontSize: 14, letterSpacing: "0.05em", color: "var(--concrete-light)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: service cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2 }}>
            {services.items.map((s, i) => {
              const Icon = ICON_MAP[s.icon] ?? Building2;
              return (
                <div key={i} style={{
                  background: "var(--steel)", padding: 28,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(40px)",
                  transition: `all 0.6s ease ${0.1 + i * 0.07}s`,
                  borderBottom: `3px solid ${s.color}`,
                  cursor: "default",
                }}>
                  <Icon size={28} color={s.color} style={{ marginBottom: 16 }} />
                  <h4 style={{ fontSize: 14, color: "var(--white)", marginBottom: 10 }}>{s.title}</h4>
                  <p style={{ fontSize: 13, color: "var(--concrete)", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .services-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>
    </section>
  );
}
