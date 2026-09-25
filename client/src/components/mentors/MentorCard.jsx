import React, { useState } from 'react';

// ---------------------------------------------------------------------------
// Helper: Star rating display
// ---------------------------------------------------------------------------
function StarRating({ rating }) {
  const full  = Math.floor(rating);
  const frac  = rating - full;
  const empty = 5 - Math.ceil(rating);

  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} className="w-3 h-3 text-knw-red" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {frac > 0 && (
        <svg key="h" className="w-3 h-3 text-knw-red" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGrad)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// CompanyBadge — text fallback when no logo
// ---------------------------------------------------------------------------
function CompanyBadge({ company, logo }) {
  if (logo) {
    return <img src={logo} alt={company} className="h-4 w-auto object-contain" />;
  }
  return (
    <span
      className="
        inline-flex items-center px-2 py-0.5
        bg-zinc-800 border border-zinc-700/60
        rounded text-[10px] font-mono text-gray-400 tracking-wider
      "
    >
      {company}
    </span>
  );
}

// ---------------------------------------------------------------------------
// VerifiedBadge
// ---------------------------------------------------------------------------
function VerifiedBadge() {
  return (
    <svg className="w-4 h-4 text-knw-red flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MentorCard — main export
// ---------------------------------------------------------------------------
/**
 * Netflix-dark style mentor card with post, slots, tags and booking CTA.
 *
 * @param {{ mentor: object, onBook: (mentor: object) => void }} props
 */
export default function MentorCard({ mentor, onBook }) {
  const [followed, setFollowed] = useState(false);

  if (!mentor) return null;

  const {
    name,
    avatar,
    verified,
    title,
    company,
    companyLogo,
    rating,
    sessions,
    duration,
    bio,
    tags,
    availableSlots,
    expertise,
    postContent,
    postTime,
  } = mentor;

  return (
    <article
      className="
        knw-card
        relative w-full rounded-xl overflow-hidden
        bg-zinc-900/80 border border-zinc-800/80
        hover:border-knw-red/60 hover:shadow-red
        transition-all duration-300
        backdrop-blur-sm
      "
    >
      {/* ── TOP RED ACCENT LINE ─────────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-knw-redBright/60 to-transparent" />

      <div className="p-4 sm:p-5 flex flex-col gap-4">

        {/* ── 1. MENTOR HEADER ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          {/* Left: avatar + info */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-knw-red/60 ring-1 ring-knw-red/30">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Name, title, company, time */}
            <div className="flex flex-col gap-0.5 min-w-0">
              {/* Name + verified */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white font-semibold text-sm leading-tight">
                  {name}
                </span>
                {verified && <VerifiedBadge />}
              </div>
              {/* Title */}
              <p className="text-knw-red text-[11px] font-medium leading-tight line-clamp-1">
                {title}
              </p>
              {/* Company + post time */}
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <CompanyBadge company={company} logo={companyLogo} />
                <span className="text-gray-600 text-[10px] font-mono">·</span>
                <span className="text-gray-500 text-[10px] font-mono">{postTime}</span>
              </div>
            </div>
          </div>

          {/* Right: Follow button */}
          <button
            onClick={() => setFollowed((f) => !f)}
            className={`
              flex-shrink-0 text-xs font-semibold font-mono tracking-wider
              px-3 py-1.5 rounded-lg border transition-all duration-200
              ${followed
                ? 'bg-knw-red/20 border-knw-red/50 text-knw-red'
                : 'border-knw-red/60 text-knw-red hover:bg-knw-red/20 hover:border-knw-red'
              }
            `}
          >
            {followed ? '✓ FOLLOWING' : '+ FOLLOW'}
          </button>
        </div>

        {/* ── 2. POST CONTENT ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-1.5">
          <span className="text-gray-600 text-[10px] font-mono uppercase tracking-widest">
            📌 Posted a slot
          </span>
          <p className="text-gray-200 text-sm leading-relaxed">
            {postContent}
          </p>
        </div>

        {/* ── 3. AVAILABLE SLOTS ───────────────────────────────────────── */}
        {availableSlots?.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">
              🕐 Available Slots
            </span>
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => onBook?.(mentor)}
                  className="
                    bg-knw-red/15 border border-knw-red/40 text-knw-red
                    text-xs font-mono px-2 py-1 rounded-lg
                    hover:bg-knw-red/25 hover:border-knw-red/60
                    transition-all duration-150 active:scale-95
                  "
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. EXPERTISE TAGS ────────────────────────────────────────── */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="
                  knw-tag-grey
                  text-[10px] font-mono tracking-wide
                  px-2 py-0.5 rounded-md
                  bg-zinc-800/70 text-gray-400 border border-zinc-700/60
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── DIVIDER ──────────────────────────────────────────────────── */}
        <div className="h-px bg-zinc-800/80" />

        {/* ── 5. BOTTOM: guidance label + session info + book btn ──────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Left: label + session info */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {/* Guidance label */}
            <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">
              🎥 GUIDANCE: 1-on-1 Video Call
            </span>
            {/* Rating + sessions + duration */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <StarRating rating={rating} />
                <span className="text-white text-xs font-semibold">{rating}</span>
              </div>
              <span className="text-gray-600 text-[10px] font-mono">
                {sessions} sessions
              </span>
              <span className="text-gray-600 text-[10px]">·</span>
              <span className="text-gray-500 text-[10px] font-mono">
                ⏱ {duration} min
              </span>
            </div>
          </div>

          {/* Right: Book button */}
          <button
            onClick={() => onBook?.(mentor)}
            className="
              btn-red
              flex-shrink-0 w-full sm:w-auto
              text-xs sm:text-sm font-bold tracking-wider
              px-5 py-2.5 rounded-xl
              shadow-red
              transition-all duration-200 active:scale-95
            "
          >
            Book Session →
          </button>
        </div>
      </div>

      {/* Bottom red accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-knw-redDark/40 to-transparent" />
    </article>
  );
}
