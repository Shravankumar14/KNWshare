import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle2, Star, BookOpen, Video, Share2, Award, Briefcase,
  ExternalLink, Calendar, Clock, ChevronRight, Download, Sparkles, FileText, ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export const FacultyProfileModal = ({ facultyId, isOpen, onClose, onBookSlot }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'materials' | 'posts' | 'slots'
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen || !facultyId) {
      setProfile(null);
      return;
    }

    setLoading(true);
    api.get(`/teachers/profile/${facultyId}`)
      .then((res) => {
        setProfile(res.data?.data || null);
      })
      .catch((err) => {
        console.warn('Failed to load faculty profile:', err.message);
        // Fallback to /teachers/available list to find mentor
        api.get('/teachers/available')
          .then((availRes) => {
            const list = availRes.data?.data || [];
            const found = list.find(m => m.teacherId === facultyId || m._id === facultyId);
            if (found) {
              setProfile(found);
            }
          })
          .catch(() => null);
      })
      .finally(() => setLoading(false));
  }, [isOpen, facultyId]);

  if (!isOpen) return null;

  const teacherName = profile?.name || 'Verified Faculty Mentor';
  const teacherAvatar = profile?.photo || profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=2d0000&color=ff4444`;
  const teacherHeadline = profile?.headline || 'Academic Mentor & Coach';
  const currentPos = profile?.currentPosition?.company
    ? `${profile.currentPosition.jobTitle || 'Faculty'} · ${profile.currentPosition.company}`
    : (profile?.currentPosition?.jobTitle || null);
  const materials = profile?.materials || [];
  const posts = profile?.posts || [];
  const slots = profile?.availableSlots || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden bg-knw-surface border border-knw-red/40 shadow-red-lg">
        
        {/* Top Banner Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-knw-red via-knw-redBright to-knw-red" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-knw-red border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-knw-muted">Loading faculty profile...</p>
          </div>
        ) : !profile ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm text-gray-300">Faculty profile details could not be loaded.</p>
            <button
              onClick={onClose}
              className="btn-red px-4 py-2 rounded-xl text-xs font-mono font-bold"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Faculty Header Card */}
            <div className="p-5 sm:p-6 pb-4 border-b border-white/10 relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <div className="story-ring-live">
                    <img
                      src={teacherAvatar}
                      alt={teacherName}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover bg-black p-[2px]"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=2d0000&color=ff4444`;
                      }}
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" title="Verified Active" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black text-white truncate">{teacherName}</h2>
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20 shrink-0" />
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-700/50 uppercase">
                      VERIFIED FACULTY MENTOR
                    </span>
                  </div>

                  {currentPos && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                      <Briefcase className="w-3 h-3 text-knw-red" />
                      <span>{currentPos}</span>
                    </div>
                  )}

                  <p className="text-xs text-knw-red font-semibold leading-tight">
                    {teacherHeadline}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-knw-muted">
                    {profile.rating && (
                      <span className="text-yellow-400 font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <span>{profile.rating} Rating</span>
                      </span>
                    )}
                    {profile.qualification && (
                      <span className="text-gray-400">· {profile.qualification}</span>
                    )}
                    {profile.experienceYears && (
                      <span className="text-gray-400">· {profile.experienceYears}y Exp</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/5 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-knw-red text-white shadow-red'
                      : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  Overview & Bio
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'materials'
                      ? 'bg-knw-red text-white shadow-red'
                      : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Educational Materials ({materials.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'posts'
                      ? 'bg-knw-red text-white shadow-red'
                      : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Share2 className="w-3 h-3" />
                  <span>Posts ({posts.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('slots')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'slots'
                      ? 'bg-knw-red text-white shadow-red'
                      : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>Book Slot ({slots.length})</span>
                </button>
              </div>
            </div>

            {/* Scrollable Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* Bio */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-knw-muted font-bold mb-2">
                      About the Faculty
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      {profile.bio || 'Experienced academic mentor dedicated to helping ambitious students master complex concepts, develop problem-solving rigor, and excel in competitive technical careers.'}
                    </p>
                  </div>

                  {/* Subjects & Expertise */}
                  {(profile.subjects?.length > 0 || profile.expertise?.length > 0) && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-knw-muted font-bold mb-2">
                        Specialization & Focus Areas
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.subjects?.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-knw-red/15 text-knw-red border border-knw-red/40"
                          >
                            ✦ {s}
                          </span>
                        ))}
                        {profile.expertise?.map((exp, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-xl text-xs font-mono bg-white/5 text-gray-300 border border-white/10"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Goals Supported */}
                  {profile.goalsSupported?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-knw-muted font-bold mb-2">
                        Supported Tracks
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.goalsSupported.map((g, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work Experience */}
                  {profile.workExperiences?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-knw-muted font-bold mb-2">
                        Professional Background
                      </h4>
                      <div className="space-y-2">
                        {profile.workExperiences.map((we, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between">
                            <div>
                              <h5 className="text-xs font-bold text-white">{we.jobTitle}</h5>
                              <p className="text-[11px] text-knw-red font-mono">{we.company}</p>
                              {we.description && (
                                <p className="text-[11px] text-gray-400 mt-1">{we.description}</p>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-knw-muted">
                              {we.startDate} {we.current ? '– Present' : (we.endDate ? `– ${we.endDate}` : '')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: EDUCATIONAL CONTENT UPLOADED BY TEACHER */}
              {activeTab === 'materials' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-knw-muted font-bold">
                      Published Notes, Practice Sheets & PDFs
                    </span>
                    <span className="text-xs font-mono text-knw-red font-bold">
                      {materials.length} Materials
                    </span>
                  </div>

                  {materials.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <BookOpen className="w-8 h-8 text-knw-muted mx-auto opacity-50" />
                      <p className="text-xs text-knw-muted">This faculty has not published any study notes or PDFs yet.</p>
                    </div>
                  ) : (
                    materials.map((item) => (
                      <div
                        key={item._id}
                        className="p-4 rounded-2xl bg-knw-surface border border-white/10 hover:border-knw-red/40 transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-knw-red/15 text-knw-red border border-knw-red/30">
                                {item.contentType?.toUpperCase() || 'PDF'}
                              </span>
                              {item.subject && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-blue-950/40 text-blue-300 border border-blue-700/40">
                                  {item.subject}
                                </span>
                              )}
                              {item.topic && (
                                <span className="text-[10px] font-mono text-gray-400">
                                  • {item.topic}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover:text-knw-red transition-colors">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-xs text-gray-300 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {item.mediaUrl && (
                            <a
                              href={item.mediaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-red px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 shadow-red"
                            >
                              <span>Open PDF</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: POSTS PUBLISHED BY TEACHER */}
              {activeTab === 'posts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-knw-muted font-bold">
                      Knowledge Feed Posts
                    </span>
                    <span className="text-xs font-mono text-knw-red font-bold">
                      {posts.length} Posts
                    </span>
                  </div>

                  {posts.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <Share2 className="w-8 h-8 text-knw-muted mx-auto opacity-50" />
                      <p className="text-xs text-knw-muted">No feed posts published by this faculty yet.</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div
                        key={post._id}
                        className="p-4 rounded-2xl bg-knw-surface border border-white/10 space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-knw-muted">
                          <span className="text-knw-red font-bold">✦ {post.goalSlug || 'General'}</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{post.title}</h4>
                        <p className="text-xs text-gray-300 whitespace-pre-line leading-relaxed">{post.text}</p>
                        {post.externalLink?.url && (
                          <a
                            href={post.externalLink.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-knw-red hover:underline font-mono"
                          >
                            <span>{post.externalLink.title || 'Open Link'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {post.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {post.tags.map((t, idx) => (
                              <span key={idx} className="text-[10px] font-mono text-knw-red/80">#{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: AVAILABLE SLOTS FOR 1-ON-1 GUIDANCE */}
              {activeTab === 'slots' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-knw-red/10 border border-knw-red/30 space-y-1">
                    <span className="text-[11px] font-mono font-bold text-knw-red uppercase block">
                      1-ON-1 Mentorship & Doubts Session
                    </span>
                    <p className="text-xs text-gray-300">
                      Book a dedicated slot with {teacherName} for code review, concept clarity, FAANG mock drill, or exam strategy.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {slots.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <Calendar className="w-8 h-8 text-knw-muted mx-auto opacity-50" />
                        <p className="text-xs text-knw-muted">No open slots available right now. Please check back later.</p>
                      </div>
                    ) : (
                      slots.map((slot) => (
                        <div
                          key={slot._id}
                          className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-knw-red/40 flex items-center justify-between transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">{slot.dayOfWeek}</h5>
                              <p className="text-[11px] text-emerald-400 font-mono">
                                {slot.startTime} – {slot.endTime} ({slot.durationMinutes || 45} mins)
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onBookSlot) {
                                onBookSlot({
                                  ...profile,
                                  selectedSlot: slot
                                });
                              }
                            }}
                            className="btn-red px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold shadow-red flex items-center gap-1.5 cursor-pointer"
                          >
                            <Video className="w-3 h-3" />
                            <span>Book This Slot</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
              <Link
                to={`/faculty/${profile.teacherId || profile.userId || profile._id}`}
                onClick={onClose}
                className="text-xs font-mono text-knw-muted hover:text-white flex items-center gap-1 underline"
              >
                <span>Open Full Page Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-knw-muted hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('slots');
                  }}
                  className="btn-red px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-red flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Book Guidance Session</span>
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default FacultyProfileModal;
