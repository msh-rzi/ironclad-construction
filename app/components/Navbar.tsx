"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Projects", "Services", "Pricing", "Estimator", "Contact"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.4s ease",
        background: scrolled ? "rgba(26,31,46,0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(245,166,35,0.15)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        padding: "0 max(24px, 5vw)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 38, height: 38, background: "var(--amber)",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "var(--steel)", fontFamily: "Barlow Condensed"
          }}>IC</div>
          <span style={{ fontFamily: "Bebas Neue", fontSize: 24, letterSpacing: "0.06em", color: "var(--white)" }}>
            Iron<span style={{ color: "var(--amber)" }}>Clad</span> Builders
          </span>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="hidden-mobile">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: 14,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--concrete-light)",
              textDecoration: "none", transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--amber)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--concrete-light)")}
            >{l}</a>
          ))}
          <a href="#estimator" style={{
            background: "var(--amber)", color: "var(--steel)", padding: "9px 22px",
            fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 13,
            letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none",
            clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--amber-bright)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--amber)")}
          >Get Estimate</a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", color: "var(--amber)", cursor: "pointer", display: "none" }}
          className="show-mobile"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          background: "rgba(26,31,46,0.99)", padding: "16px 24px 24px",
          borderTop: "1px solid rgba(245,166,35,0.2)",
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{
                display: "block", padding: "12px 0",
                fontFamily: "Barlow Condensed", fontWeight: 600, fontSize: 18,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--concrete-light)", textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >{l}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
