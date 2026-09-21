import React, { useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SESSION_TYPES = [
  { id: 'one_on_one',   label: '1:1 Mentorship',  icon: '🎯', duration: '45 min', price: 'FREE' },
  { id: 'code_review',  label: 'Code Review',      icon: '💻', duration: '30 min', price: 'FREE' },
  { id: 'mock_interview', label: 'Mock Interview', icon: '🏆', duration: '60 min', price: 'FREE' },
  { id: 'career',       label: 'Career Guidance',  icon: '🚀', duration: '60 min', price: 'FREE' },
];

const TIME_SLOTS = [
  { id: 't1', label: 'Today 9AM',     booked: false },
  { id: 't2', label: 'Today 11AM',    booked: true  },
  { id: 't3', label: 'Today 2PM',     booked: false },
  { id: 't4', label: 'Today 4PM',     booked: false },
  { id: 't5', label: 'Today 6PM',     booked: true  },
  { id: 't6', label: 'Tomorrow 10AM', booked: false },
  { id: 't7', label: 'Tomorrow 1PM',  booked: false },
  { id: 't8', label: 'Tomorrow 3PM',  booked: false },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Blurred dark overlay */
function Overlay({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
      aria-hidden="true"
    />
  );
}

/** Section heading inside modal */
function SectionHeading({ children }) {
  return (
    <h3 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">
      {children}
    </h3>
  );
}

/** Session type card — 2×2 grid item */
function SessionTypeCard({ session, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(session.id)}
      className={`
        relative flex flex-col items-start gap-1 p-3 rounded-xl border text-left
        transition-all duration-200 active:scale-[0.97]
        ${selected
          ? 'border-red-500 bg-red-950/40 shadow-[0_0_16px_rgba(220,38,38,0.30)]'
          : 'border-zinc-700/60 bg-zinc-800/50 hover:border-red-800/70 hover:bg-zinc-800/80'
        }
      `}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
      )}
      <span className="text-xl leading-none">{session.icon}</span>
      <span className={`text-xs font-semibold leading-tight ${selected ? 'text-red-300' : 'text-gray-200'}`}>
        {session.label}
      </span>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-[10px] font-mono text-gray-500">{session.duration}</span>
        <span className="text-[10px] font-mono font-bold text-green-400">{session.price}</span>
      </div>
    </button>
  );
}

/** Time slot button */
function TimeSlotButton({ slot, selected, onClick }) {
  if (slot.booked) {
    return (
      <div
        className="
          flex items-center justify-center px-2 py-2 rounded-lg
          border border-zinc-800/60 bg-zinc-900/30
          text-[10px] font-mono text-gray-700 line-through
          cursor-not-allowed select-none
        "
      >
        {slot.label}
      </div>
    );
  }

  return (
    <button
      onClick={() => onClick(slot.id)}
      className={`
        flex items-center justify-center px-2 py-2 rounded-lg border
        text-[10px] font-mono transition-all duration-150 active:scale-95
        ${selected
          ? 'border-red-500 bg-red-900/40 text-red-300 shadow-[0_0_10px_rgba(220,38,38,0.25)]'
          : 'border-zinc-700/50 bg-zinc-800/40 text-gray-400 hover:border-red-800/70 hover:bg-red-950/30 hover:text-red-400'
        }
      `}
    >
      {slot.label}
    </button>
  );
}

/** Success state */
function SuccessView({ mentor, sessionId, slotId, onDone }) {
  const session = SESSION_TYPES.find((s) => s.id === sessionId);
  const slot    = TIME_SLOTS.find((s) => s.id === slotId);

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4 text-center">
      {/* Animated green checkmark */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-green-950/50 border-2 border-green-600/60 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.25)]">
          <svg className="w-10 h-10 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full animate-ping bg-green-500/10" />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-white text-xl font-bold">Booking Confirmed!</h2>
        <p className="text-gray-400 text-sm">Your session has been scheduled successfully.</p>
      </div>

      {/* Booking details card */}
      <div className="w-full max-w-xs bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-4 text-left flex flex-col gap-3">
        {/* Mentor */}
        <div className="flex items-center gap-3">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-red-800/60"
          />
          <div>
            <p className="text-white text-sm font-semibold">{mentor.name}</p>
            <p className="text-gray-500 text-[11px]">{mentor.company}</p>
          </div>
        </div>
        <div className="h-px bg-zinc-700/50" />
        {/* Details */}
        <div className="flex flex-col gap-1.5">
          {session && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Session</span>
              <span className="text-gray-200 text-xs font-semibold">{session.icon} {session.label}</span>
            </div>
          )}
          {slot && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Time</span>
              <span className="text-gray-200 text-xs font-semibold">📅 {slot.label}</span>
            </div>
          )}
          {session && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Duration</span>
              <span className="text-gray-200 text-xs font-semibold">⏱ {session.duration}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">Mode</span>
            <span className="text-gray-200 text-xs font-semibold">🎥 1-on-1 Video Call</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-[11px] font-mono">
        A confirmation link will be sent to your registered email.
      </p>

      <button
        onClick={onDone}
        className="
          w-full max-w-xs py-3 rounded-xl font-bold text-white
          bg-green-700 hover:bg-green-600 border border-green-600/80
          shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:shadow-[0_0_30px_rgba(34,197,94,0.40)]
          transition-all duration-200 active:scale-95
        "
      >
        Done ✓
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SlotBookingModal — main export
// ---------------------------------------------------------------------------
/**
 * Full-screen Netflix-dark booking modal.
 *
 * @param {{ mentor: object, onClose: () => void }} props
 */
export default function SlotBookingModal({ mentor, onClose }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSlot,    setSelectedSlot]    = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState(false);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape') onClose?.(); },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!mentor) return null;

  const canConfirm = selectedSession && selectedSlot;

  function handleConfirm() {
    if (!canConfirm) return;
    setLoading(true);
    // Simulate async booking
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1400);
  }

  return (
    <>
      {/* Dark overlay */}
      <Overlay onClick={success ? undefined : onClose} />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Book a session"
        className="
          fixed z-50 inset-0 flex items-center justify-center p-4
          pointer-events-none
        "
      >
        <div
          className="
            knw-glass
            pointer-events-auto
            relative w-full max-w-lg max-h-[92vh] overflow-y-auto
            rounded-2xl
            bg-zinc-950/95 border border-red-900/40
            shadow-[0_0_60px_rgba(220,38,38,0.18)]
            backdrop-blur-xl
            flex flex-col
            [scrollbar-width:thin]
            [scrollbar-color:#3f0000_transparent]
          "
        >
          {/* ── Red gradient accent line (top) ───────────────────────── */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-600 to-transparent flex-shrink-0 rounded-t-2xl" />

          {/* ── Close button ─────────────────────────────────────────── */}
          {!success && (
            <button
              onClick={onClose}
              className="
                absolute top-3 right-3 z-10
                w-8 h-8 rounded-full
                bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60
                text-gray-400 hover:text-white
                flex items-center justify-center
                transition-all duration-150
              "
              aria-label="Close modal"
            >
              ✕
            </button>
          )}

          {/* ── INNER CONTENT ─────────────────────────────────────────── */}
          {success ? (
            /* SUCCESS STATE */
            <SuccessView
              mentor={mentor}
              sessionId={selectedSession}
              slotId={selectedSlot}
              onDone={onClose}
            />
          ) : (
            <div className="flex flex-col gap-6 p-5 pb-6">

              {/* ── MENTOR HEADER ──────────────────────────────────────── */}
              <div className="flex items-center gap-3 pr-8">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-red-800/60 ring-1 ring-red-700/20">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Info */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-white font-bold text-base leading-tight">{mentor.name}</span>
                    {mentor.verified && (
                      <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-red-400/80 text-xs font-medium line-clamp-2 leading-tight">
                    {mentor.title}
                  </p>
                  {/* Rating row */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-3 h-3 ${i < Math.round(mentor.rating) ? 'text-red-500' : 'text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white text-xs font-semibold">{mentor.rating}</span>
                    <span className="text-gray-600 text-[10px] font-mono">({mentor.sessions} sessions)</span>
                  </div>
                </div>
              </div>

              {/* ── DIVIDER ────────────────────────────────────────────── */}
              <div className="h-px bg-zinc-800/80" />

              {/* ── SESSION TYPE — 2×2 grid ────────────────────────────── */}
              <div>
                <SectionHeading>📋 Choose Session Type</SectionHeading>
                <div className="grid grid-cols-2 gap-2.5">
                  {SESSION_TYPES.map((session) => (
                    <SessionTypeCard
                      key={session.id}
                      session={session}
                      selected={selectedSession === session.id}
                      onClick={setSelectedSession}
                    />
                  ))}
                </div>
              </div>

              {/* ── TIME SLOTS — 4-col grid ───────────────────────────── */}
              <div>
                <SectionHeading>🕐 Pick a Time Slot</SectionHeading>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <TimeSlotButton
                      key={slot.id}
                      slot={slot}
                      selected={selectedSlot === slot.id}
                      onClick={setSelectedSlot}
                    />
                  ))}
                </div>
                <p className="mt-2 text-[10px] font-mono text-gray-700">
                  ✗ = Already booked &nbsp;·&nbsp; Tap an available slot to select
                </p>
              </div>

              {/* ── CONFIRM BUTTON ─────────────────────────────────────── */}
              <button
                onClick={handleConfirm}
                disabled={!canConfirm || loading}
                className={`
                  btn-red w-full py-3.5 rounded-xl font-bold text-sm tracking-wider
                  border transition-all duration-200 active:scale-95
                  ${canConfirm && !loading
                    ? 'bg-red-700 hover:bg-red-600 border-red-600/80 hover:border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.30)] hover:shadow-[0_0_30px_rgba(220,38,38,0.50)] cursor-pointer'
                    : 'bg-zinc-800/50 border-zinc-700/40 text-gray-600 cursor-not-allowed shadow-none'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Confirming…
                  </span>
                ) : canConfirm ? (
                  'Confirm Booking →'
                ) : (
                  'Select session type & time slot'
                )}
              </button>

              {/* Info note */}
              <p className="text-center text-[10px] font-mono text-gray-700 -mt-3">
                🔒 All sessions are free · No credit card required
              </p>
            </div>
          )}

          {/* ── Bottom accent line ──────────────────────────────────────── */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-900/30 to-transparent flex-shrink-0 rounded-b-2xl" />
        </div>
      </div>
    </>
  );
}
