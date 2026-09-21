import React from 'react';
import { Star, Clock, Video, CheckCircle, Award, Calendar, Sparkles, Briefcase, MessageSquare, Zap } from 'lucide-react';

export const ExpertCard = ({ expert, onBook }) => {
  // Enhanced fallback mock data for slots & positions if backend returns basic fields
  const realLifePositions = expert.realLifePositions || expert.headline || 'Senior Engineer at Top Tech | Ex-Google | Ex-Amazon';
  const expertField = expert.expertField || expert.expertiseAreas?.[0] || 'Software Engineering & System Architecture';
  const whatTheyShare = expert.whatTheyShare || [
    '1-on-1 Code & Architecture Review',
    'Real-world System Design Drills (High Availability & Scale)',
    'Behavioral & Technical FAANG Mock Interviews',
    'Curated Roadmap Guidance & Doubt Clearance'
  ];
  const postedSlots = expert.postedSlots || expert.availableSlots?.map(s => `${s.dayOfWeek || 'Today'} ${s.startTime || '6:00 PM'}`) || [
    'Today 3:00 PM',
    'Today 6:30 PM',
    'Tomorrow 10:00 AM'
  ];

  return (
    <div className="knw-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
      {/* Top subtle red neon hairline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-knw-red to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Mentor Profile Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0 story-ring">
              <img
                src={expert.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt={expert.name}
                className="w-16 h-16 rounded-full object-cover bg-knw-bg p-[2px]"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-knw-red rounded-full flex items-center justify-center border-2 border-knw-bg shadow-sm">
                <CheckCircle className="w-3 h-3 text-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white group-hover:text-knw-red transition-colors">
                  {expert.name}
                </h3>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-knw-red/10 border border-knw-red/30 text-red-400 font-semibold">
                  Verified Mentor
                </span>
              </div>

              {/* Real life positions (e.g. Ex-Google, Former OpenAI, Microsoft) */}
              <p className="text-xs font-semibold text-knw-red mt-1 leading-tight flex items-center gap-1.5 flex-wrap">
                <Briefcase className="w-3.5 h-3.5 shrink-0 text-knw-redBright" />
                <span>{realLifePositions}</span>
              </p>

              <p className="text-[11px] text-knw-muted mt-0.5 font-mono">
                {expert.companyOrCollege || 'Top Industry Veteran'}
              </p>
            </div>
          </div>

          {/* Rating & Sessions Pill */}
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold font-mono">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{expert.rating || '4.95'}</span>
            </div>
            <span className="text-[10px] text-knw-muted block mt-1 font-mono">
              {expert.sessionsCompleted || '120+'} sessions
            </span>
          </div>
        </div>

        {/* Field of Expertise Highlight Badge */}
        <div className="mt-4 p-2.5 rounded-xl bg-knw-surface border border-white/5 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-knw-red shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-knw-muted block">Field of Expertise</span>
            <span className="text-xs font-bold text-white truncate block">{expertField}</span>
          </div>
        </div>

        {/* What They Share In Sessions */}
        <div className="mt-3.5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-knw-muted flex items-center gap-1.5 mb-1.5">
            <MessageSquare className="w-3 h-3 text-knw-red" />
            <span>What I Share in 1-on-1 Sessions:</span>
          </p>
          <div className="space-y-1 bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-xs text-knw-offWhite">
            {whatTheyShare.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-knw-red shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-knw-muted mt-3 line-clamp-2 leading-relaxed">
          {expert.bio}
        </p>

        {/* Real Live Posted Slot Timings */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 flex items-center gap-1 font-bold">
              <Clock className="w-3 h-3 text-knw-red" /> Available Posted Slots:
            </span>
            <span className="text-[10px] font-mono text-knw-subtle">Click to reserve</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {postedSlots.map((slot, idx) => (
              <button
                key={idx}
                onClick={() => onBook(expert)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-knw-red/10 border border-knw-red/40 text-red-300 hover:bg-knw-red hover:text-white transition-all shadow-sm flex items-center gap-1"
              >
                <span>🕐</span>
                <span>{slot}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {expert.expertiseAreas?.map((area, idx) => (
            <span
              key={idx}
              className="knw-tag-grey text-[10px]"
            >
              ✦ {area}
            </span>
          ))}
        </div>
      </div>

      {/* Booking Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
        <div className="text-xs">
          <span className="text-[10px] uppercase font-mono text-knw-subtle block">Format</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <Video className="w-3.5 h-3.5" /> 1-on-1 Video Session ({expert.sessionDurationMinutes || 45}m)
          </span>
        </div>

        <button
          onClick={() => onBook(expert)}
          className="btn-red flex items-center gap-2 px-5 py-2.5 text-xs font-bold shadow-red"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Session</span>
        </button>
      </div>
    </div>
  );
};
