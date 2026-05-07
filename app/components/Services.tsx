"use client";
import { useEffect, useRef, useState } from "react";
import { Building2, Home, Factory, Wrench, Leaf, ShieldCheck } from "lucide-react";

const services = [
  { icon: Building2, title: "Commercial Construction", desc: "Office towers, retail centers, mixed-use developments. We handle projects from $5M to $500M+.", color: "#f5a623" },
  { icon: Home, title: "Residential & Custom Homes", desc: "Luxury custom homes, master-planned communities, multi-family apartments.", color: "#6be6a0" },
  { icon: Factory, title: "Industrial & Warehouse", desc: "Distribution hubs, manufacturing plants, cold storage, data centers.", color: "#5b9cf6" },
  { icon: Wrench, title: "Renovation & Remodeling", desc: "Historic restoration, tenant improvements, full gut-renovations.", color: "#ffd166" },
  { icon: Leaf, title: "Sustainable Building", desc: "LEED-certified, net-zero, and ESG-compliant construction for tomorrow.", color: "#a8e6cf" },
  { icon: ShieldCheck, title: "Design-Build", desc: "Single-source accountability from concept to certificate of occupancy.", color: "#c77dff" },
];

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
          {/* Left */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 2, background: "var(--amber)" }} />
              <span style={{ fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)" }}>What We Do</span>
            </div>
            <h2 style={{ fontSize: "clamp(48px, 5vw, 72px)", color: "var(--white)", marginBottom: 24 }}>OUR<br /><span style={{ color: "var(--amber)" }}>SERVICES</span></h2>
            <p style={{ fontSize: 16, color: "var(--concrete-light)", lineHeight: 1.75, marginBottom: 32 }}>
              Full-service general contracting from site preparation through final inspection. We self-perform core trades and manage elite subcontractors with OSHA-certified safety oversight.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Licensed in all 50 states", "Bonded & fully insured up to $2B", "ISO 9001:2015 Certified", "Union & open-shop crews"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 6, height: 6, background: "var(--amber)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "Barlow Condensed", fontSize: 14, letterSpacing: "0.05em", color: "var(--concrete-light)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2 }}>
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{
                  background: "var(--steel)",
                  padding: 28,
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
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
