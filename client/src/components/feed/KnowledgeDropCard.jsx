import React, { useState } from "react";
import {
  Bookmark,
  Share2,
  MessageCircle,
  Flame,
  BadgeCheck,
  Plus,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Type-badge config
───────────────────────────────────────────── */
const TYPE_CONFIG = {
  "KNOWLEDGE DROP": {
    dot: "bg-red-500",
    pill: "bg-red-500/10 text-red-400 border border-red-500/30",
  },
  "LECTURE DROP": {
    dot: "bg-orange-500",
    pill: "bg-orange-500/10 text-orange-400 border border-orange-500/30",
  },
  "SLOT ANNOUNCEMENT": {
    dot: "bg-yellow-400",
    pill: "bg-yellow-400/10 text-yellow-300 border border-yellow-400/30",
  },
};

/* ─────────────────────────────────────────────
   Helper: truncate text
───────────────────────────────────────────── */
function truncate(str = "", max = 120) {
  return str.length <= max ? { text: str, truncated: false } : { text: str.slice(0, max).trimEnd(), truncated: true };
}

/* ─────────────────────────────────────────────
   KnowledgeDropCard
───────────────────────────────────────────── */
export default function KnowledgeDropCard({ post, onBook }) {
  const [following, setFollowing] = useState(post?.advisor?.isFollowing ?? false);
  const [bookmarked, setBookmarked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [reacted, setReacted] = useState(false);
  const [reactionCount, setReactionCount] = useState(post?.reactions ?? 0);

  if (!post) return null;

  const typeConfig = TYPE_CONFIG[post.type] ?? TYPE_CONFIG["KNOWLEDGE DROP"];
  const { text: descText, truncated } = truncate(post.description, 120);

  function handleReact() {
    setReacted((prev) => {
      setReactionCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }

  function handleBook() {
    setBookmarked((prev) => !prev);
    onBook?.(post.id);
  }

  return (
    <article
      className="knw-card w-full rounded-2xl overflow-hidden flex flex-col gap-0"
      style={{
        background: "#181818",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.55)",
      }}
    >
      {/* ── 1. Type badge + time ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${typeConfig.pill}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${typeConfig.dot} animate-pulse`} />
          {post.type}
        </span>
        <span className="text-[11px] text-white/30 font-mono">{post.timeAgo}</span>
      </div>

      {/* ── 2. Advisor row ── */}
      <div className="flex items-center gap-3 px-4 pb-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={post.advisor.avatar}
            alt={post.advisor.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-red-600/40"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.advisor.name)}&background=2d0000&color=ff4444`;
            }}
          />
          {post.advisor.verified && (
            <BadgeCheck
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-red-500"
              style={{ filter: "drop-shadow(0 0 4px #ef444488)" }}
            />
          )}
        </div>

        {/* Name / handle / credential */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] font-bold text-white leading-tight truncate">
              {post.advisor.name}
            </span>
            <span className="text-[11px] text-white/40 truncate">{post.advisor.handle}</span>
          </div>
          <span className="text-[10px] font-mono text-red-400/80">{post.advisor.credential}</span>
        </div>

        {/* Follow toggle */}
        <button
          onClick={() => setFollowing((f) => !f)}
          className={`flex-shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full border transition-all duration-200 ${
            following
              ? "bg-white/5 border-white/20 text-white/60 hover:border-red-500/40 hover:text-red-400"
              : "bg-red-600/10 border-red-500/50 text-red-400 hover:bg-red-600/20 hover:border-red-500"
          }`}
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>

      {/* ── 3 & 4. Cover image with overlaid tags ── */}
      <div className="relative mx-3 rounded-xl overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-52 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(15,0,0,0.85) 0%, rgba(15,0,0,0.3) 45%, transparent 100%)",
          }}
        />
        {/* Tags on bottom-left */}
        {post.tags?.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(20,0,0,0.75)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  color: "rgba(252,165,165,0.9)",
                  backdropFilter: "blur(6px)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── 5. Reaction bar ── */}
      <div className="flex items-center gap-1.5 px-3 pt-3 pb-1 flex-wrap">
        {/* Reactions */}
        <button
          onClick={handleReact}
          className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-all duration-200 ${
            reacted
              ? "bg-red-500/20 text-red-400 border border-red-500/40"
              : "bg-white/5 text-white/50 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${reacted ? "text-red-400" : "text-white/40"}`} />
          {reactionCount.toLocaleString()}
        </button>

        {/* Discussions */}
        <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10 hover:bg-white/8 hover:text-white/70 transition-all duration-200">
          <MessageCircle className="w-3.5 h-3.5 text-white/40" />
          {post.discussions?.toLocaleString()}
        </button>

        {/* Add to Trail */}
        <button
          className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full border transition-all duration-200 ml-0.5"
          style={{
            border: "1px solid rgba(239,68,68,0.45)",
            color: "rgba(252,165,165,0.85)",
            background: "rgba(239,68,68,0.06)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.14)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.7)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.06)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.45)";
          }}
        >
          <Plus className="w-3 h-3" />
          Add to Trail
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bookmark */}
        <button
          onClick={handleBook}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            bookmarked
              ? "text-red-400 bg-red-500/15"
              : "text-white/30 hover:text-white/60 hover:bg-white/8"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-red-400" : ""}`} />
        </button>

        {/* Share */}
        <button className="p-1.5 rounded-full text-white/30 hover:text-white/60 hover:bg-white/8 transition-all duration-200">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* ── 6. Title ── */}
      <div className="px-4 pt-2">
        <h3 className="text-[15px] font-bold text-white leading-snug">{post.title}</h3>
      </div>

      {/* ── 7. Description ── */}
      <div className="px-4 pt-1.5">
        <p className="text-[12px] text-white/50 leading-relaxed">
          {expanded ? post.description : descText}
          {!expanded && truncated && (
            <>
              {"... "}
              <button
                onClick={() => setExpanded(true)}
                className="text-red-500 font-semibold hover:text-red-400 transition-colors"
              >
                more
              </button>
            </>
          )}
          {expanded && (
            <>
              {" "}
              <button
                onClick={() => setExpanded(false)}
                className="text-red-500 font-semibold hover:text-red-400 transition-colors"
              >
                less
              </button>
            </>
          )}
        </p>
      </div>

      {/* ── 8. Hashtags ── */}
      {post.hashtags?.length > 0 && (
        <div className="px-4 pt-1.5 pb-4 flex flex-wrap gap-x-2 gap-y-0.5">
          {post.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-red-500/70 hover:text-red-400 cursor-pointer transition-colors duration-150"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
