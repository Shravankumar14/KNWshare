import React from 'react';
import { Star, Clock, Video, CheckCircle, Award, Calendar } from 'lucide-react';

export const ExpertCard = ({ expert, onBook }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-soft hover:shadow-soft-lg hover:border-brand-300 transition-all duration-200">
      <div>
        {/* Mentor Profile Header */}
        <div className="flex items-start gap-4">
          <img
            src={expert.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
            alt={expert.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-100 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900">{expert.name}</h3>
              <CheckCircle className="w-4 h-4 text-brand-600 fill-brand-100" />
            </div>
            <p className="text-xs font-semibold text-brand-700 mt-0.5 line-clamp-1">{expert.headline}</p>
            <p className="text-[11px] text-slate-500">{expert.companyOrCollege}</p>
          </div>
        </div>

        {/* Rating & Stats */}
        <div className="mt-4 py-2 px-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{expert.rating}</span>
            <span className="text-slate-400 font-normal">({expert.sessionsCompleted} sessions)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{expert.sessionDurationMinutes || 45} mins</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 mt-3.5 line-clamp-3 leading-relaxed">
          {expert.bio}
        </p>

        {/* Expertise Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {expert.expertiseAreas?.map((area, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md text-[10px] font-semibold border border-brand-100"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Booking Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Guidance</span>
          <span className="font-semibold text-emerald-600">1-on-1 Video Call</span>
        </div>

        <button
          onClick={() => onBook(expert)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-brand-600 text-xs font-bold shadow-sm transition-all"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Session</span>
        </button>
      </div>
    </div>
  );
};
