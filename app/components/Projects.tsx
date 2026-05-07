"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Pinnacle Tower",
    location: "Houston, TX",
    type: "Commercial High-Rise",
    value: "$420M",
    year: 2023,
    floors: 52,
    sqft: "1.2M sq ft",
    color: "#f5a623",
    desc: "52-story mixed-use tower featuring luxury offices, retail podium, and sky amenities. Completed 3 weeks ahead of schedule.",
  },
  {
    title: "Riverside Medical Center",
    location: "Nashville, TN",
    type: "Healthcare Facility",
    value: "$280M",
    year: 2022,
    floors: 8,
    sqft: "480K sq ft",
    color: "#5b9cf6",
    desc: "State-of-the-art regional medical center with 320 beds, surgical suites, and integrated research wing.",
  },
  {
    title: "Sunridge Estates",
    location: "Phoenix, AZ",
    type: "Residential Master Plan",
    value: "$195M",
    year: 2023,
    floors: null,
    sqft: "620 homes",
    color: "#6be6a0",
    desc: "650-acre master-planned community with 620 single-family homes, parks, and commercial center.",
  },
  {
    title: "Gateway Logistics Hub",
    location: "Memphis, TN",
    type: "Industrial / Warehouse",
    value: "$340M",
    year: 2024,
    floors: 3,
    sqft: "2.8M sq ft",
    color: "#e85f5f",
    desc: "Mega distribution center serving America's midsection, built with advanced automation-ready infrastructure.",
  },
  {
    title: "Lakeview Civic Center",
    location: "Minneapolis, MN",
    type: "Public / Municipal",
    value: "$115M",
    year: 2022,
    floors: 5,
    sqft: "210K sq ft",
    color: "#c77dff",
    desc: "Award-winning civic center housing city hall, library, and public plaza. LEED Platinum certified.",
  },
  {
    title: "Pacific Crest Hotel",
    location: "Seattle, WA",
    type: "Hospitality",
    value: "$260M",
    year: 2024,
    floors: 34,
    sqft: "580K sq ft",
    color: "#ffd166",
    desc: "34-story luxury hotel with 480 rooms, rooftop bar, conference center, and spa. AAA Five Diamond certified.",
  },
];

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
          <h2 style={{ fontSize: "clamp(48px, 6vw, 80px)", color: "var(--white)" }}>LANDMARK<br /><span style={{ color: "var(--amber)" }}>PROJECTS</span></h2>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 2 }}>
          {projects.map((p, i) => (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{
                background: active === i ? "var(--steel-light)" : "var(--steel-mid)",
                padding: 32,
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderTop: `3px solid ${active === i ? p.color : "transparent"}`,
                transform: active === i ? "translateY(-4px)" : "translateY(0)",
                opacity: visible ? 1 : 0,
                transitionDelay: `${i * 0.08}s`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Accent glow */}
              {active === i && (
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: 200, height: 200,
                  background: `radial-gradient(circle at top right, ${p.color}15, transparent 70%)`,
                  pointerEvents: "none",
                }} />
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{
                  fontFamily: "Barlow Condensed", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: p.color, background: `${p.color}18`,
                  padding: "4px 10px",
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
