import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { StoryTray } from '../components/feed/StoryTray';
import { FeedCard } from '../components/feed/FeedCard';
import { useApp } from '../context/AppContext';
import { Sparkles, Flame, Layers } from 'lucide-react';
import { sounds } from '../services/soundManager';

export const FeedPage: React.FC = () => {
  const { posts } = useApp();
  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'knowledge' | 'lectures' | 'roadmaps' | 'challenges'>('all');

  const filteredPosts = posts.filter(post => {
    if (feedFilter === 'following') return post.creator.isFollowed;
    if (feedFilter === 'knowledge') return post.type === 'knowledge' || post.type === 'carousel';
    if (feedFilter === 'lectures') return post.type === 'lecture';
    if (feedFilter === 'roadmaps') return post.type === 'roadmap';
    if (feedFilter === 'challenges') return post.type === 'challenge';
    return true;
  });

  return (
    <MainLayout showRightRail={true}>
      <div className="w-full space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 font-sans">
              <span>The Nest</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Your Knowledge Universe · Deep learning meets creator velocity.
            </p>
          </div>

          {/* Feed Filter Tabs */}
          <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/10 text-xs font-mono overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Cosmos' },
              { id: 'following', label: 'Following' },
              { id: 'knowledge', label: 'Knowledge' },
              { id: 'lectures', label: 'Lectures' },
              { id: 'roadmaps', label: 'Roadmaps' },
              { id: 'challenges', label: 'Challenges' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setFeedFilter(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  feedFilter === tab.id
                    ? 'bg-purple-600 text-white font-bold shadow-glow-purple'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Creator Stories Tray (Knowledge Sparks) */}
        <StoryTray />

        {/* 39. CONTINUE YOUR JOURNEY (Subtle Widget) */}
        <div className="glass-panel rounded-2xl px-4 py-3 border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-purple-950/20 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  CONTINUE YOUR JOURNEY
                </span>
                <span className="text-[10px] font-mono text-slate-400">· Module 4 of 8</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100 mt-0.5">
                Full-Stack Generative AI Architect
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right hidden md:block">
              <span className="text-xs font-mono font-bold text-cyan-300">68%</span>
              <span className="text-[10px] font-mono text-slate-400 block">completed</span>
            </div>
            <a
              href="/lecture/lec-1"
              onClick={() => sounds.playClick()}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 hover:from-cyan-500/30 hover:to-purple-600/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-glow-cyan"
            >
              <span>Continue Learning →</span>
            </a>
          </div>
        </div>

        {/* Posts Stream */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 space-y-3">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto animate-pulse" />
              <h3 className="text-base font-bold text-white">No drops found for this filter</h3>
              <p className="text-xs text-slate-400">Try switching to 'All Cosmos' or follow more creators in the directory.</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <FeedCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};
