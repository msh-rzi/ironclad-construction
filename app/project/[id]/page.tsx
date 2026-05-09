import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "fs/promises";
import path from "path";
import { ArrowLeft, Building2, CalendarDays, MapPin, Ruler, Wallet } from "lucide-react";
import defaultSiteData from "@/data/site.data.json";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SiteData = typeof defaultSiteData;
type Project = SiteData["projects"][number];

const DATA_PATH = path.join(process.cwd(), "data", "site.data.json");

async function getSiteData(): Promise<SiteData> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as SiteData;
  } catch (error) {
    console.error("[project page] using bundled site data:", error);
    return defaultSiteData;
  }
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const siteData = await getSiteData();
  const project = siteData.projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const related = siteData.projects.filter((item) => item.id !== project.id).slice(0, 3);
  const focus = project.deliveryFocus;
  const narrative = project.detailNarrative || project.desc;

  return (
    <main style={{ minHeight: "100vh", background: "var(--steel)", color: "var(--white)" }}>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "32px max(24px, 5vw) 72px",
          background: `linear-gradient(135deg, var(--steel) 0%, var(--steel-mid) 50%, ${project.color}22 100%)`,
        }}
      >
        <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.45 }} />
        <div
          style={{
            position: "absolute",
            right: "-12vw",
            top: 0,
            width: "45vw",
            height: "100%",
            background: project.color,
            opacity: 0.08,
            clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0 100%)",
          }}
        />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Link
            href="/#projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              color: "var(--concrete-light)",
              textDecoration: "none",
              fontFamily: "Barlow Condensed",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 72,
            }}
          >
            <ArrowLeft size={16} color={project.color} />
            Back to projects
          </Link>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.6fr)", gap: 48, alignItems: "end" }} className="project-hero-grid">
            <div>
              <p
                style={{
                  display: "inline-block",
                  color: project.color,
                  background: `${project.color}18`,
                  padding: "6px 12px",
                  fontFamily: "Barlow Condensed",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  marginBottom: 22,
                }}
              >
                {project.type}
              </p>
              <h1 style={{ fontSize: "clamp(72px, 10vw, 148px)", color: "var(--white)", marginBottom: 22 }}>
                {project.title}
              </h1>
              <p style={{ maxWidth: 720, fontSize: 18, lineHeight: 1.75, color: "var(--concrete-light)" }}>
                {narrative}
              </p>
            </div>

            <div
              style={{
                background: "rgba(15,19,24,0.72)",
                border: `1px solid ${project.color}44`,
                padding: 28,
                backdropFilter: "blur(12px)",
              }}
            >
              {[
                { icon: MapPin, label: "Location", value: project.location },
                { icon: Wallet, label: "Value", value: project.value },
                { icon: Ruler, label: "Scale", value: project.sqft },
                { icon: CalendarDays, label: "Completed", value: String(project.year) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <Icon size={20} color={project.color} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontFamily: "Barlow Condensed", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--concrete)" }}>
                      {label}
                    </div>
                    <div style={{ fontFamily: "Bebas Neue", fontSize: 28, color: "var(--white)", marginTop: 2 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "72px max(24px, 5vw)", background: "var(--steel-mid)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 56 }} className="project-body-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 2, background: project.color }} />
              <span style={{ fontFamily: "Barlow Condensed", fontWeight: 700, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: project.color }}>
                Delivery Profile
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(42px, 5vw, 68px)", color: "var(--white)", marginBottom: 20 }}>
              Built for the project&apos;s actual constraints.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--concrete-light)" }}>{project.desc}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 2 }}>
            {focus.map((item, index) => (
              <div
                key={item}
                style={{
                  background: index % 2 === 0 ? "var(--steel)" : "var(--steel-light)",
                  borderTop: `3px solid ${project.color}`,
                  padding: 26,
                  minHeight: 150,
                }}
              >
                <Building2 size={22} color={project.color} style={{ marginBottom: 20 }} />
                <h3 style={{ fontSize: 14, color: "var(--white)", marginBottom: 10 }}>{item}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--concrete)" }}>
                  Managed with field-first planning, owner reporting, and disciplined trade coordination.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "72px max(24px, 5vw)", background: "var(--steel)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2 style={{ fontSize: 44, color: "var(--white)", marginBottom: 28 }}>More Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2 }}>
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/project/${item.id}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  background: "var(--steel-mid)",
                  padding: 24,
                  borderTop: `3px solid ${item.color}`,
                }}
              >
                <p style={{ fontFamily: "Barlow Condensed", fontSize: 11, color: item.color, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                  {item.location}
                </p>
                <h3 style={{ fontFamily: "Bebas Neue", fontSize: 32, color: "var(--white)", marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "var(--concrete)" }}>{item.type}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .project-hero-grid,
          .project-body-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
