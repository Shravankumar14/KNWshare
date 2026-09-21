import React from 'react';

// ---------------------------------------------------------------------------
// Hardcoded mentor data
// ---------------------------------------------------------------------------
const MENTORS = [
  { id: 'm1', name: 'Priya S.',  avatar: 'https://i.pravatar.cc/150?img=47', badge: 'BOOK SLOT',    live: false, color: 'red'   },
  { id: 'm2', name: 'Rahul K.', avatar: 'https://i.pravatar.cc/150?img=12', badge: 'LIVE NOW',     live: true,  color: 'live'  },
  { id: 'm3', name: 'Dr. Arjun',avatar: 'https://i.pravatar.cc/150?img=33', badge: 'FREE Q&A',     live: false, color: 'green' },
  { id: 'm4', name: 'Devika P.',avatar: 'https://i.pravatar.cc/150?img=44', badge: 'SLOT OPEN',    live: false, color: 'red'   },
  { id: 'm5', name: 'Dr. Elena',avatar: 'https://i.pravatar.cc/150?img=25', badge: 'AI TALK',      live: false, color: 'white' },
  { id: 'm6', name: 'Marcus V.',avatar: 'https://i.pravatar.cc/150?img=15', badge: 'MINI LECTURE', live: false, color: 'white' },
  { id: 'm7', name: 'Rohan V.', avatar: 'https://i.pravatar.cc/150?img=52', badge: 'BOOK SLOT',    live: false, color: 'red'   },
];

// ---------------------------------------------------------------------------
// Badge style map
// ---------------------------------------------------------------------------
const BADGE_STYLES = {
  live:  'bg-red-600 text-white animate-pulse',
  red:   'bg-red-900/50 text-red-400 border border-red-700/50',
  green: 'bg-green-900/50 text-green-400 border border-green-700/50',
  white: 'bg-white/10 text-gray-300 border border-white/20',
};

// ---------------------------------------------------------------------------
// AddSpark — the "+" button as the first item
// ---------------------------------------------------------------------------
function AddSpark() {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group select-none">
      {/* Circle */}
      <div
        className="
          w-16 h-16 rounded-full
          bg-zinc-800 border-2 border-dashed border-red-700/60
          flex items-center justify-center
          group-hover:border-red-500 group-hover:bg-zinc-700
          transition-all duration-200
        "
      >
        <span className="text-red-500 text-2xl font-light leading-none">+</span>
      </div>
      {/* Label */}
      <span className="text-[10px] text-gray-500 font-mono tracking-wide group-hover:text-red-400 transition-colors duration-200">
        ADD SPARK
      </span>
      {/* Empty badge placeholder keeps alignment */}
      <span className="h-[18px]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// MentorStoryItem — individual mentor story bubble
// ---------------------------------------------------------------------------
function MentorStoryItem({ mentor, onClick }) {
  const badgeCls = BADGE_STYLES[mentor.color] ?? BADGE_STYLES.white;

  return (
    <button
      onClick={() => onClick?.(mentor)}
      className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group select-none bg-transparent border-0 outline-none focus:outline-none"
    >
      {/* Avatar wrapper with ring */}
      <div className="relative">
        {/* Ring / live ring */}
        {mentor.live ? (
          /* Animated live ring */
          <div
            className="
              absolute inset-0 rounded-full
              border-[2.5px] border-red-500
              animate-[spin_3s_linear_infinite]
              [background:conic-gradient(from_0deg,#ef4444,#991b1b,#ef4444)]
              opacity-80
            "
            style={{ margin: '-3px', borderRadius: '9999px' }}
          />
        ) : (
          /* Static gradient ring */
          <div
            className="absolute inset-0 rounded-full opacity-90"
            style={{
              margin: '-2.5px',
              background: 'conic-gradient(from 90deg, #dc2626, #7f1d1d, #dc2626)',
              borderRadius: '9999px',
            }}
          />
        )}

        {/* Avatar image */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-[2px] border-black z-10">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* LIVE dot indicator */}
        {mentor.live && (
          <span
            className="
              absolute -bottom-0.5 left-1/2 -translate-x-1/2 z-20
              bg-red-600 text-white text-[8px] font-bold font-mono
              px-1.5 py-px rounded-sm tracking-widest
              border border-black
            "
          >
            LIVE
          </span>
        )}
      </div>

      {/* Mentor name */}
      <span className="text-[10px] text-gray-300 font-medium leading-none tracking-wide max-w-[72px] truncate">
        {mentor.name}
      </span>

      {/* Badge pill */}
      <span
        className={`
          text-[9px] font-mono font-semibold tracking-widest
          px-2 py-0.5 rounded-full leading-none whitespace-nowrap
          ${badgeCls}
        `}
      >
        {mentor.badge}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// MentorStoriesRow — main export
// ---------------------------------------------------------------------------
/**
 * Instagram-style horizontal scrollable mentor stories row.
 *
 * @param {{ onStoryClick: (mentor: object) => void }} props
 */
export default function MentorStoriesRow({ onStoryClick }) {
  return (
    <section className="w-full">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-red-500 font-mono text-xs font-bold tracking-widest">
          ● MENTOR SPARKS
        </span>
        <span className="text-gray-600 text-xs font-mono hidden sm:inline">
          · Industry experts sharing live slots
        </span>
      </div>

      {/* Scrollable stories strip */}
      <div
        className="
          flex flex-row items-start gap-4 px-1 pb-2
          overflow-x-auto
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {/* Add Spark button */}
        <AddSpark />

        {/* Mentor story items */}
        {MENTORS.map((mentor) => (
          <MentorStoryItem key={mentor.id} mentor={mentor} onClick={onStoryClick} />
        ))}
      </div>
    </section>
  );
}
