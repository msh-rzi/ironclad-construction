"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const REDIRECT_SECONDS = 10;

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
  const [beams, setBeams] = useState<{ x: number; delay: number; duration: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // Generate scan-line beams on mount (client only)
  useEffect(() => {
    setBeams(
      Array.from({ length: 6 }, (_, i) => ({
        x: 10 + i * 16,
        delay: i * 0.4,
        duration: 2.2 + i * 0.3,
      }))
    );
  }, []);

  // Countdown + redirect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  // Animated progress arc
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = countdown / REDIRECT_SECONDS;
  const dashOffset = circumference * (1 - progress);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500&display=swap');

        :root {
          --steel:       #0f1318;
          --steel-mid:   #161c23;
          --steel-light: #1e2730;
          --amber:       #f5a623;
          --amber-dim:   rgba(245,166,35,0.15);
          --amber-glow:  rgba(245,166,35,0.06);
          --white:       #f0ede8;
          --concrete:    #6b7480;
          --concrete-light: #9aa3ad;
          --danger:      #e04040;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--steel);
          font-family: 'Barlow', sans-serif;
          color: var(--white);
          overflow: hidden;
        }

        .page {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* ── Grid background ── */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        /* ── Scan beams ── */
        .beam {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(245,166,35,0.18), transparent);
          animation: scanDown var(--dur) var(--delay) ease-in-out infinite alternate;
        }

        @keyframes scanDown {
          0%   { transform: translateY(-60px); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(60px); opacity: 0; }
        }

        /* ── Ambient orbs ── */
        .orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }

        /* ── 404 code ── */
        .glitch-wrap {
          position: relative;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(140px, 22vw, 260px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(245,166,35,0.25);
          user-select: none;
        }

        .glitch-wrap::before,
        .glitch-wrap::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          font-family: inherit;
          font-weight: inherit;
          font-size: inherit;
          letter-spacing: inherit;
          color: transparent;
          -webkit-text-stroke: 1px var(--amber);
        }
        .glitch-wrap::before {
          clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%);
          animation: glitchTop 3.5s infinite;
          opacity: 0.6;
        }
        .glitch-wrap::after {
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
          animation: glitchBot 3.5s infinite;
          opacity: 0.6;
        }

        @keyframes glitchTop {
          0%, 88%, 100% { transform: translate(0); }
          90%           { transform: translate(-4px, -2px); -webkit-text-stroke-color: var(--danger); }
          92%           { transform: translate(4px, 2px); }
          94%           { transform: translate(0); }
        }
        @keyframes glitchBot {
          0%, 85%, 100% { transform: translate(0); }
          87%           { transform: translate(5px, 3px); -webkit-text-stroke-color: #4af; }
          90%           { transform: translate(-3px, -1px); }
          92%           { transform: translate(0); }
        }

        /* ── Warning stripe ── */
        .stripe {
          display: flex;
          align-items: center;
          gap: 0;
          overflow: hidden;
          width: 100%;
          max-width: 520px;
          height: 6px;
          margin: 12px 0 32px;
        }
        .stripe-block {
          flex: 1;
          height: 100%;
          background: repeating-linear-gradient(
            90deg,
            var(--amber) 0px,
            var(--amber) 14px,
            var(--steel-mid) 14px,
            var(--steel-mid) 28px
          );
          opacity: 0.7;
          animation: slideStripe 6s linear infinite;
        }
        @keyframes slideStripe {
          from { background-position: 0 0; }
          to   { background-position: 56px 0; }
        }

        /* ── Countdown ring ── */
        .ring-wrap {
          position: relative;
          width: 130px;
          height: 130px;
          flex-shrink: 0;
        }
        .ring-wrap svg {
          transform: rotate(-90deg);
        }
        .ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .ring-number {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 42px;
          color: var(--amber);
          line-height: 1;
        }
        .ring-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--concrete);
          margin-top: 2px;
        }

        /* ── Home button ── */
        .home-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 36px;
          background: var(--amber);
          color: var(--steel);
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
          transition: background 0.2s, transform 0.15s;
          margin-top: 32px;
        }
        .home-btn:hover {
          background: #ffc146;
          transform: translateY(-2px);
        }

        /* ── Error code tag ── */
        .error-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border: 1px solid rgba(245,166,35,0.3);
          margin-bottom: 16px;
        }
        .error-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--danger);
          animation: blink 1.1s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        .redirect-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 12px;
        }
        .redirect-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px;
          letter-spacing: 0.06em;
          color: var(--concrete-light);
          line-height: 1.5;
        }

        @media (max-width: 500px) {
          .redirect-row { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <div className="page">
        {/* Grid */}
        <div className="grid-bg" />

        {/* Scan beams */}
        {beams.map((b, i) => (
          <div
            key={i}
            className="beam"
            style={
              {
                left: `${b.x}%`,
                "--dur": `${b.duration}s`,
                "--delay": `${b.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Ambient orbs */}
        <div
          className="orb"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)",
            top: "50%", left: "50%",
            transform: "translate(-50%, -60%)",
          }}
        />
        <div
          className="orb"
          style={{
            width: 300, height: 300,
            background: "radial-gradient(circle, rgba(224,64,64,0.05) 0%, transparent 70%)",
            bottom: "5%", right: "10%",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px" }}>

          {/* Error tag */}
          <div className="error-tag">
            <div className="error-dot" />
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--concrete-light)" }}>
              Error · Page not found
            </span>
          </div>

          {/* Giant 404 */}
          <div className="glitch-wrap" data-text="404">404</div>

          {/* Animated warning stripe */}
          <div className="stripe">
            <div className="stripe-block" />
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Barlow Condensed'",
              fontWeight: 700,
              fontSize: "clamp(22px, 4vw, 36px)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--white)",
              marginBottom: 12,
            }}
          >
            Blueprint not on file
          </h1>

          <p
            style={{
              fontFamily: "'Barlow'",
              fontSize: 15,
              color: "var(--concrete-light)",
              lineHeight: 1.75,
              maxWidth: 400,
              marginBottom: 8,
            }}
          >
            The page you're looking for has been demolished, relocated, or never broke ground. We'll route you back to headquarters.
          </p>

          {/* Countdown + redirect text */}
          <div className="redirect-row">
            {/* Circular ring */}
            <div className="ring-wrap">
              <svg width="130" height="130" viewBox="0 0 130 130">
                {/* Track */}
                <circle
                  cx="65" cy="65" r={radius}
                  fill="none"
                  stroke="rgba(245,166,35,0.1)"
                  strokeWidth="4"
                />
                {/* Progress arc */}
                <circle
                  cx="65" cy="65" r={radius}
                  fill="none"
                  stroke="var(--amber)"
                  strokeWidth="4"
                  strokeLinecap="butt"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
                {/* Tick marks */}
                {Array.from({ length: REDIRECT_SECONDS }).map((_, i) => {
                  const angle = (i / REDIRECT_SECONDS) * 2 * Math.PI - Math.PI / 2;
                  const x1 = 65 + (radius - 8) * Math.cos(angle);
                  const y1 = 65 + (radius - 8) * Math.sin(angle);
                  const x2 = 65 + (radius + 2) * Math.cos(angle);
                  const y2 = 65 + (radius + 2) * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="rgba(245,166,35,0.25)"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
              <div className="ring-center">
                <span className="ring-number">{countdown}</span>
                <span className="ring-label">sec</span>
              </div>
            </div>

            <div className="redirect-text">
              Redirecting you to
              <br />
              <strong style={{ color: "var(--amber)", letterSpacing: "0.04em" }}>IronClad HQ</strong>
              <br />
              in {countdown} second{countdown !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Manual back button */}
          <a href="/" className="home-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6 1L1 7L6 13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Return to HQ now
          </a>

          {/* Bottom brand mark */}
          <p
            style={{
              marginTop: 48,
              fontFamily: "'Barlow Condensed'",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--concrete)",
            }}
          >
            IronClad Builders · Est. 1987
          </p>
        </div>
      </div>
    </>
  );
}