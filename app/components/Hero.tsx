"use client";
import { useEffect, useRef } from "react";

const stats = [
  { value: "28+", label: "Years in Business" },
  { value: "1,400+", label: "Projects Completed" },
  { value: "$3.2B", label: "Total Project Value" },
  { value: "38", label: "States Served" },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,166,35,${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", handleResize); };
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "var(--steel)" }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      {/* Grid background */}
      <div className="grid-bg" style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.6 }} />

      {/* Geometric accent */}
      <div style={{
        position: "absolute", right: "-5%", top: "10%",
        width: "55vw", height: "80vh",
        background: "linear-gradient(135deg, rgba(245,166,35,0.08) 0%, rgba(245,166,35,0.02) 60%, transparent 100%)",
        clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute", right: "5%", top: "15%",
        width: 3, height: "60vh", background: "var(--amber)", opacity: 0.4, zIndex: 0,
      }} />
      <div style={{
        position: "absolute", right: "8%", top: "20%",
        width: 1, height: "50vh", background: "var(--amber)", opacity: 0.2, zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "120px max(24px, 5vw) 60px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div style={{ maxWidth: 760 }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ width: 40, height: 2, background: "var(--amber)" }} />
            <span style={{ fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--amber)" }}>
              Est. 1996 · Dallas, TX · Nationwide
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{ fontSize: "clamp(72px, 10vw, 140px)", color: "var(--white)", marginBottom: 16 }}>
            WE BUILD<br />
            <span style={{ color: "var(--amber)", WebkitTextStroke: "0px", textShadow: "0 0 60px rgba(245,166,35,0.3)" }}>AMERICA</span>
          </h1>

          <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "var(--concrete-light)", lineHeight: 1.7, maxWidth: 560, marginBottom: 48, fontWeight: 300 }}>
            From groundbreaking to ribbon-cutting, IronClad Builders has delivered{" "}
            <em style={{ color: "var(--off-white)", fontStyle: "normal", fontWeight: 500 }}>landmark commercial, industrial, and residential</em>{" "}
            projects for over two decades — on time, on budget, ironclad.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#projects" style={{
              background: "var(--amber)", color: "var(--steel)",
              padding: "16px 36px",
              fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 15,
              letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none",
              clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
              transition: "all 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--amber-bright)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--amber)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >View Our Work</a>

            <a href="#estimator" style={{
              border: "1px solid rgba(245,166,35,0.4)", color: "var(--amber)",
              padding: "16px 36px",
              fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 15,
              letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none",
              clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
              transition: "all 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(245,166,35,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >AI Price Estimator</a>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          marginTop: 80,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 2,
          maxWidth: 760,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: i % 2 === 0 ? "rgba(37,43,59,0.8)" : "rgba(46,53,72,0.8)",
              padding: "20px 24px",
              borderTop: "2px solid " + (i === 0 ? "var(--amber)" : "transparent"),
              backdropFilter: "blur(8px)",
            }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 36, color: "var(--amber)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "Barlow Condensed", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--concrete)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(transparent, var(--steel))", zIndex: 1 }} />
    </section>
  );
}
