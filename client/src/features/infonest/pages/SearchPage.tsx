import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { Search, Filter, BookOpen, Users, Sparkles, Layers, ArrowRight, Star } from 'lucide-react';
import { sounds } from '../services/soundManager';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<'all' | 'courses' | 'creators' | 'posts' | 'roadmaps'>('all');
  const [sortBy, setSortBy] = useState<'relevant' | 'newest' | 'popular'>('relevant');

  const { courses, creators, posts, roadmaps } = useApp();

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setSearchParams({ q: query });
  };

  const q = query.toLowerCase().trim();

  // Search matches
  const matchedCourses = courses.filter(c =>
    !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q))
  );

  const matchedCreators = creators.filter(cr =>
    !q || cr.name.toLowerCase().includes(q) || cr.role.toLowerCase().includes(q) || cr.specialty.toLowerCase().includes(q) || cr.expertiseTags.some(t => t.toLowerCase().includes(q))
  );

  const matchedPosts = posts.filter(p =>
    !q || p.title.toLowerCase().includes(q) || p.caption.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
  );

  const matchedRoadmaps = roadmaps.filter(r =>
    !q || r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.skillsCovered.some(s => s.toLowerCase().includes(q))
  );

  const totalResults =
    (filterType === 'all' || filterType === 'courses' ? matchedCourses.length : 0) +
    (filterType === 'all' || filterType === 'creators' ? matchedCreators.length : 0) +
    (filterType === 'all' || filterType === 'posts' ? matchedPosts.length : 0) +
    (filterType === 'all' || filterType === 'roadmaps' ? matchedRoadmaps.length : 0);

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-6">
        {/* Search Header Bar */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-black">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Knowledge Search Engine</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Index across peer-reviewed masterclasses, architecture blueprints, roadmaps, and verified educators.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic, architecture, author, or skill (e.g. eBPF, Transformers, Three.js, Raft)..."
              className="w-full pl-12 pr-28 py-3.5 bg-white/5 border border-white/15 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-glow-purple"
            >
              Search
            </button>
          </form>

          {/* Filter Chips & Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              {[
                { id: 'all', label: 'All Results' },
                { id: 'courses', label: 'Courses' },
                { id: 'creators', label: 'Creators' },
                { id: 'posts', label: 'Posts & Drops' },
                { id: 'roadmaps', label: 'Roadmaps' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setFilterType(tab.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    filterType === tab.id
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-slate-200 focus:outline-none"
              >
                <option value="relevant">Most Relevant</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
          <span>Found {totalResults} matches for "{query || 'all'}"</span>
        </div>

        {/* Results Sections */}
        {totalResults === 0 ? (
          <div className="text-center py-24 glass-panel rounded-3xl border border-white/10 space-y-3">
            <Search className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No knowledge matches found</h3>
            <p className="text-xs text-slate-400">Try searching for keywords like "AI", "Kafka", "Three.js", or "Reasoning".</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Courses Results */}
            {(filterType === 'all' || filterType === 'courses') && matchedCourses.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Masterclass Courses ({matchedCourses.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedCourses.map(course => (
                    <Link
                      key={course.id}
                      to={`/course/${course.id}`}
                      onClick={() => sounds.playClick()}
                      className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-purple-500/40 flex gap-4 transition-all group"
                    >
                      <img src={course.coverImage} alt={course.title} className="w-28 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform" />
                      <div className="min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-cyan-300">{course.level}</span>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-purple-300">{course.title}</h4>
                          <span className="text-[11px] text-slate-400 truncate block">{course.creator.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                          <span className="text-amber-400">★ {course.rating}</span>
                          <span>{course.estimatedHours}h</span>
                          <span>{course.studentsCount.toLocaleString()} learners</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Creators Results */}
            {(filterType === 'all' || filterType === 'creators') && matchedCreators.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>Educators & Authors ({matchedCreators.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedCreators.map(creator => (
                    <Link
                      key={creator.id}
                      to={`/creator/${creator.username}`}
                      onClick={() => sounds.playClick()}
                      className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-purple-500/40 flex items-center gap-3 transition-all group"
                    >
                      <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-purple-400" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300">{creator.name}</h4>
                        <span className="text-[11px] text-slate-400 truncate block">{creator.role}</span>
                        <span className="text-[10px] font-mono text-purple-400">{creator.followersCount.toLocaleString()} followers</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Roadmaps Results */}
            {(filterType === 'all' || filterType === 'roadmaps') && matchedRoadmaps.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Interactive Roadmaps ({matchedRoadmaps.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedRoadmaps.map(rm => (
                    <Link
                      key={rm.id}
                      to={`/roadmap/${rm.id}`}
                      onClick={() => sounds.playClick()}
                      className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-emerald-500/40 space-y-2 group transition-all"
                    >
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{rm.category}</span>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">{rm.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{rm.description}</p>
                      <div className="pt-2 flex justify-between text-xs font-mono text-slate-400 border-t border-white/5">
                        <span>{rm.totalMilestones} Phases</span>
                        <span>{rm.estimatedWeeks} Weeks</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Results */}
            {(filterType === 'all' || filterType === 'posts') && matchedPosts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Posts & Code Drops ({matchedPosts.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedPosts.map(post => (
                    <Link
                      key={post.id}
                      to={`/post/${post.id}`}
                      onClick={() => sounds.playClick()}
                      className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-amber-500/40 space-y-2 group transition-all"
                    >
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">{post.type}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 line-clamp-1">{post.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{post.caption}</p>
                      <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1">
                        <span>By {post.creator.name}</span>
                        <span>❤️ {post.likesCount}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
