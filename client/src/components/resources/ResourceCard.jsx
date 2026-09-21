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
      case 'beginner': return { label: 'Beginner', bg: 'bg-emerald-950/40 text-emerald-400 border-emerald-700/50' };
      case 'intermediate': return { label: 'Intermediate', bg: 'bg-yellow-950/40 text-yellow-400 border-yellow-700/50' };
      case 'advanced': return { label: 'Advanced', bg: 'bg-red-950/40 text-red-400 border-red-700/50' };
      default: return { label: 'All Levels', bg: 'bg-white/5 text-knw-muted border-white/10' };
    }
  };

  const diffBadge = getDifficultyBadge(resource.difficulty);

  return (
    <div className="knw-card rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-knw-red/40 to-transparent group-hover:via-knw-red transition-all" />

      <div>
        {/* Header Tags & Save Bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-knw-red/10 text-red-400 border border-knw-red/30">
              <IconComp className="w-3.5 h-3.5 text-knw-red" />
              <span>{getTypeLabel(resource.type)}</span>
            </span>

            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${diffBadge.bg}`}>
              {diffBadge.label}
            </span>
          </div>

          <button
            onClick={() => onToggleSelect(resource._id)}
            className={`p-2 rounded-xl transition-all ${
              isSelected
                ? 'bg-knw-red/20 text-knw-red border border-knw-red/50 shadow-red'
                : 'text-knw-muted hover:text-white hover:bg-white/5'
            }`}
            title={isSelected ? 'Saved to My Study List' : 'Save Resource'}
          >
            {isSelected ? (
              <BookmarkCheck className="w-4 h-4 text-knw-red fill-current" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-white mt-3 group-hover:text-knw-red transition-colors line-clamp-2 leading-snug">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-knw-muted mt-1.5 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Key Info Meta (Platform, Author, Rating) */}
        <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-knw-muted font-mono">
          <span className="font-semibold text-gray-300 truncate max-w-[150px]">
            {resource.platformOrAuthor || 'Curated Resource'}
          </span>

          <div className="flex items-center gap-3 shrink-0">
            {resource.rating && (
              <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <Star className="w-3 h-3 fill-current" />
                <span>{resource.rating}</span>
              </div>
            )}
            {resource.estimatedDurationHours && (
              <div className="flex items-center gap-1 text-knw-subtle">
                <Clock className="w-3 h-3" />
                <span>{resource.estimatedDurationHours}h</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
          resource.isFree
            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-700/50'
            : 'bg-white/5 text-knw-muted border border-white/10'
        }`}>
          {resource.isFree ? '100% Free' : 'Paid / Freemium'}
        </span>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-red-outline text-xs px-3 py-1.5 flex items-center gap-1 font-mono"
        >
          <span>Open Resource</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
