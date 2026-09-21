import React, { useState } from "react";
import { Clock, Zap, Users, ExternalLink } from "lucide-react";

/* ─────────────────────────────────────────────
   Type-pill config
───────────────────────────────────────────── */
const TYPE_CONFIG = {
  "UPCOMING SESSION": {
    pill: "bg-red-500/15 text-red-300 border border-red-500/35",
    icon: <Clock className="w-3 h-3" />,
  },
  SCHOLARSHIP: {
    pill: "bg-yellow-400/10 text-yellow-300 border border-yellow-400/30",
    icon: <Zap className="w-3 h-3" />,
  },
  "COURSE LAUNCH": {
    pill: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
    icon: <Users className="w-3 h-3" />,
  },
};

/* ─────────────────────────────────────────────
   StudyAdBanner
───────────────────────────────────────────── */
export default function StudyAdBanner({ ad }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  if (!ad) return null;

  const typeConfig = TYPE_CONFIG[ad.type] ?? TYPE_CONFIG["UPCOMING SESSION"];

  function handleCta() {
    setClicked(true);
    setTimeout(() => setClicked(false), 1800);
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${ad.gradientFrom ?? "#1a0000"} 0%, ${ad.gradientTo ?? "#2d0000"} 100%)`,
        border: "1px solid rgba(239,68,68,0.25)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(239,68,68,0.45), 0 0 28px rgba(239,68,68,0.18), 0 8px 32px rgba(0,0,0,0.6)"
          : "0 0 0 1px rgba(239,68,68,0.15), 0 4px 24px rgba(0,0,0,0.55)",
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Neon glow edge accent (top) ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(239,68,68,0.6) 40%, rgba(239,68,68,0.6) 60%, transparent 100%)",
        }}
      />

      {/* ── Decorative noise / grain overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.6,
        }}
      />

      {/* ── Decorative radial glow (bottom-right) ── */}
      <div
        className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-5">
        {/* Left: type pill + title + subtitle + time */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Type pill */}
          <span
            className={`self-start inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${typeConfig.pill}`}
          >
            {typeConfig.icon}
            {ad.type}
          </span>

          {/* Title */}
          <h3 className="text-[15px] font-extrabold text-white leading-snug line-clamp-2">
            {ad.title}
          </h3>

          {/* Subtitle */}
          {ad.subtitle && (
            <p className="text-[11px] text-white/45 leading-relaxed">{ad.subtitle}</p>
          )}

          {/* Time row */}
          {ad.time && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3 text-red-400/70 flex-shrink-0" />
              <span className="text-[11px] font-mono text-red-300/70">{ad.time}</span>
            </div>
          )}
        </div>

        {/* Right: FREE tag + CTA */}
        <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
          {/* FREE / tag badge */}
          {ad.tag && (
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
              style={{
                background: "rgba(239,68,68,0.18)",
                border: "1px solid rgba(239,68,68,0.5)",
                color: "#fca5a5",
                letterSpacing: "0.12em",
              }}
            >
              {ad.tag}
            </span>
          )}

          {/* CTA button */}
          <button
            onClick={handleCta}
            className="flex items-center gap-1.5 text-[12px] font-bold px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap"
            style={{
              background: clicked
                ? "rgba(239,68,68,0.25)"
                : hovered
                ? "rgba(239,68,68,0.85)"
                : "rgba(239,68,68,0.7)",
              border: "1px solid rgba(239,68,68,0.8)",
              color: "#fff",
              boxShadow: hovered
                ? "0 0 18px rgba(239,68,68,0.45), 0 4px 12px rgba(0,0,0,0.4)"
                : "0 0 8px rgba(239,68,68,0.2), 0 2px 8px rgba(0,0,0,0.3)",
              transform: hovered && !clicked ? "scale(1.03)" : "scale(1)",
            }}
          >
            {clicked ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                Reserving…
              </>
            ) : (
              <>
                {ad.cta ?? "Reserve Your Seat →"}
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Bottom neon accent line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 10%, rgba(239,68,68,0.3) 50%, transparent 90%)",
        }}
      />
    </div>
  );
}
