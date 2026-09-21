import React from 'react';
import {
  ExternalLink,
  Star,
  Clock,
  Bookmark,
  BookmarkCheck,
  Video,
  BookOpen,
  Code,
  GraduationCap,
  Layers,
  FileText
} from 'lucide-react';

const typeIcons = {
  youtube_playlist: Video,
  youtube_video: Video,
  doc: FileText,
  course_free: GraduationCap,
  course_paid: GraduationCap,
  book: BookOpen,
  practice_platform: Code,
  project: Layers,
  mock_test: GraduationCap,
  article: FileText,
};

export const ResourceCard = ({ resource, isSelected, onToggleSelect }) => {
  const IconComp = typeIcons[resource.type] || BookOpen;

  const getTypeLabel = (type) => {
    switch (type) {
      case 'youtube_playlist': return 'YouTube Playlist';
      case 'youtube_video': return 'Video Lecture';
      case 'doc': return 'Official Docs';
      case 'course_free': return 'Free Course';
      case 'course_paid': return 'Paid Course';
      case 'book': return 'Book / Manual';
      case 'practice_platform': return 'Practice Platform';
      case 'project': return 'Hands-on Project';
      case 'mock_test': return 'Mock Test Series';
      case 'article': return 'Deep Dive Article';
      default: return 'Study Material';
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'beginner': return { label: 'Beginner', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'intermediate': return { label: 'Intermediate', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'advanced': return { label: 'Advanced', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default: return { label: 'All Levels', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const diffBadge = getDifficultyBadge(resource.difficulty);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 flex flex-col justify-between shadow-soft hover:shadow-soft-lg hover:border-brand-300 transition-all duration-200 group">
      <div>
        
        {/* Stage & Topic Linking Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
            Stage {resource.stageNumber} • {resource.topicTitle}
          </span>

          <button
            onClick={() => onToggleSelect(resource._id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isSelected
                ? 'text-brand-600 bg-brand-50 hover:bg-brand-100'
                : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isSelected ? 'Remove from My Plan' : 'Save / Add to My Plan'}
          >
            {isSelected ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title and provider */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
            <IconComp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
              {resource.title}
            </h3>
            {resource.provider && (
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                by {resource.provider}
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${diffBadge.bg}`}>
            {diffBadge.label}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
            <Star className="w-3 h-3 fill-current" />
            <span>{resource.rating}</span>
          </div>
        </div>

        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-bold transition-colors"
        >
          <span>Open</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
