import React from 'react';
import { CheckCircle2, Video } from 'lucide-react';

export const MentorCard = ({ mentor, onBook, variant = 'expanded' }) => {
  const mentorName = mentor.name || mentor.author || 'Verified Mentor';
  const mentorAvatar = mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=2d0000&color=ff4444`;
  const mentorHeadline = mentor.headline || mentor.credential || mentor.currentPosition?.jobTitle || 'Academic Coach';

  if (variant === 'compact') {
    return (
      <div
        className="flex items-center justify-between p-2.5 rounded-2xl bg-knw-surface border border-white/5 hover:border-knw-red/30 transition-all"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={mentorAvatar}
            alt={mentorName}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-knw-red/40 shrink-0"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=2d0000&color=ff4444`;
            }}
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white leading-tight truncate">{mentorName}</h4>
            <p className="text-[10px] text-knw-red font-mono truncate max-w-[130px]">
              {mentorHeadline}
            </p>
            {mentor.nextAvailableSlot && (
              <p className="text-[9px] text-emerald-400 font-mono">
                Next: {mentor.nextAvailableSlot}
              </p>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          {mentor.rating && (
            <span className="text-xs font-mono text-yellow-400 font-bold block">★ {mentor.rating}</span>
          )}
          <button
            type="button"
            onClick={() => onBook && onBook(mentor)}
            className="block text-[10px] font-mono text-knw-red hover:text-white mt-0.5 underline font-bold cursor-pointer"
          >
            Book Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="knw-card rounded-3xl p-5 border border-white/10 hover:border-knw-red/40 hover:shadow-red transition-all flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={mentorAvatar}
                alt={mentorName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-knw-red/50 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=2d0000&color=ff4444`;
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black" title="Verified Available" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white truncate">{mentorName}</h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20 shrink-0" />
              </div>
              <p className="text-xs text-knw-red font-mono truncate">
                {mentorHeadline}
              </p>
            </div>
          </div>
          {mentor.rating && (
            <span className="text-xs font-mono font-bold text-yellow-400 px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 shrink-0">
              ★ {mentor.rating}
            </span>
          )}
        </div>

        {mentor.nextAvailableSlot && (
          <div className="mb-4 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] font-mono text-emerald-300 truncate">
              Next Slot: {mentor.nextAvailableSlot}
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] font-mono text-knw-muted">1-on-1 Guidance</span>
        <button
          type="button"
          onClick={() => onBook && onBook(mentor)}
          className="btn-red px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono shadow-red inline-flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
        >
          <Video className="w-3 h-3" />
          <span>Book Slot</span>
        </button>
      </div>
    </div>
  );
};
