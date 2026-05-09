"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import siteData from "@/data/site.data.json";

const { projects } = siteData;

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} style={{ padding: "100px max(24px, 5vw)", background: "var(--steel)", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 2, background: "var(--amber)" }} />
            <span style={{ fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)" }}>Featured Work</span>
          </div>
          <h2 style={{ fontSize: "clamp(48px, 6vw, 80px)", color: "var(--white)" }}>
            LANDMARK<br /><span style={{ color: "var(--amber)" }}>PROJECTS</span>
          </h2>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 2 }}>
          {projects.map((p, i) => (
            <div
              key={p.id}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{
                background: active === i ? "var(--steel-light)" : "var(--steel-mid)",
                padding: 32, cursor: "pointer",
                transition: "all 0.3s ease",
                borderTop: `3px solid ${active === i ? p.color : "transparent"}`,
                transform: active === i ? "translateY(-4px)" : "translateY(0)",
                opacity: visible ? 1 : 0,
                transitionDelay: `${i * 0.08}s`,
                position: "relative", overflow: "hidden",
              }}
            >
              {active === i && (
                <div style={{
                  position: "absolute", top: 0, right: 0, width: 200, height: 200,
                  background: `radial-gradient(circle at top right, ${p.color}15, transparent 70%)`,
                  pointerEvents: "none",
                }} />
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{
                  fontFamily: "Barlow Condensed", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: p.color, background: `${p.color}18`, padding: "4px 10px",
                }}>
                  {p.type}
                </span>
                <ArrowUpRight size={18} color={active === i ? p.color : "var(--concrete)"} style={{ transition: "color 0.3s", flexShrink: 0 }} />
              </div>

              <h3 style={{ fontFamily: "Bebas Neue", fontSize: 36, color: "var(--white)", marginBottom: 4 }}>{p.title}</h3>
              <p style={{ fontFamily: "Barlow Condensed", fontSize: 13, color: "var(--concrete)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
                {p.location} · {p.year}
              </p>
              <p style={{ fontSize: 14, color: "var(--concrete-light)", lineHeight: 1.6, marginBottom: 24 }}>{p.desc}</p>

              <div style={{ display: "flex", gap: 24 }}>
                <div>
                  <div style={{ fontFamily: "Bebas Neue", fontSize: 28, color: p.color }}>{p.value}</div>
                  <div style={{ fontFamily: "Barlow Condensed", fontSize: 11, letterSpacing: "0.1em", color: "var(--concrete)", textTransform: "uppercase" }}>Project Value</div>
                </div>
                <div>
                  <div style={{ fontFamily: "Bebas Neue", fontSize: 28, color: "var(--white)" }}>{p.sqft}</div>
                  <div style={{ fontFamily: "Barlow Condensed", fontSize: 11, letterSpacing: "0.1em", color: "var(--concrete)", textTransform: "uppercase" }}>Scale</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
