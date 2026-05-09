"use client";
import siteData from "@/data/site.data.json";

const { footer, company } = siteData;

export default function Footer() {
  return (
    <footer style={{ background: "#111520", borderTop: "1px solid rgba(245,166,35,0.15)", padding: "48px max(24px, 5vw) 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 32, height: 32, background: "var(--amber)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 900, color: "var(--steel)", fontFamily: "Barlow Condensed",
              }}>
                {company.shortName}
              </div>
              <span style={{ fontFamily: "Bebas Neue", fontSize: 22, letterSpacing: "0.06em", color: "var(--white)" }}>
                Iron<span style={{ color: "var(--amber)" }}>Clad</span> Builders
              </span>
            </div>
            <p style={{ fontSize: 14, color: "var(--concrete)", lineHeight: 1.7, maxWidth: 300, marginBottom: 20 }}>
              {footer.tagline}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {company.socialHandles.map((s) => (
                <div key={s} style={{ width: 32, height: 32, background: "var(--steel-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "Barlow Condensed", fontWeight: 700, color: "var(--concrete)", cursor: "pointer", transition: "all 0.2s" }}>{s}</div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <div key={col.title}>
              <h6 style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--amber)", marginBottom: 16 }}>{col.title}</h6>
              {col.links.map((l) => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{ fontSize: 14, color: "var(--concrete)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--concrete)")}
                  >{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: "var(--concrete)" }}>
            © {footer.copyrightYear} {company.name}, Inc. All rights reserved. {company.legalLine}
          </p>
          <p style={{ fontSize: 12, color: "var(--concrete)" }}>
            {footer.legalLinks.join(" · ")}
          </p>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; } }`}</style>
    </footer>
  );
}
