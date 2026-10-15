import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Star, BookOpen, Video, Share2, Award, Briefcase,
  ExternalLink, Calendar, Clock, ChevronRight, Download, Sparkles, FileText,
  Mail, Shield, User, ExternalLink as ExtIcon
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const FacultyProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' | 'posts' | 'slots' | 'background'
  const [bookingSlot, setBookingSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/teachers/profile/${id}`)
      .then((res) => {
        setProfile(res.data?.data || null);
      })
      .catch((err) => {
        console.warn('Profile fetch error:', err.message);
        // Fallback
        api.get('/teachers/available')
          .then((availRes) => {
            const list = availRes.data?.data || [];
            const found = list.find(m => m.teacherId === id || m._id === id);
            if (found) setProfile(found);
          })
          .catch(() => null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookSession = async (slot) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBookingSlot(slot);
    setBookingLoading(true);
    setBookingSuccess('');
    setBookingError('');

    try {
      await api.post('/bookings', {
        slotId: slot._id,
        teacherId: profile.teacherId || profile.userId || profile._id,
        sessionType: '1-on-1 Concept Review',
        studentNotes: 'Booked via public faculty profile.'
      });
      setBookingSuccess(`Session booked successfully for ${slot.dayOfWeek} at ${slot.startTime}!`);
    } catch (err) {
      setBookingError(err.response?.data?.message || err.message || 'Failed to book slot.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-knw-bg flex items-center justify-center p-6 text-center space-y-3 font-mono">
        <div>
          <div className="w-10 h-10 border-2 border-knw-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-knw-muted">Loading Faculty Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-knw-bg flex items-center justify-center p-6">
        <div className="knw-card rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-white/10">
          <User className="w-12 h-12 text-knw-muted mx-auto" />
          <h2 className="text-lg font-bold text-white">Faculty Profile Not Found</h2>
          <p className="text-xs text-knw-muted">
            The faculty mentor profile you are looking for does not exist or may have been unlisted.
          </p>
          <Link to="/dashboard" className="btn-red inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const teacherName = profile.name || 'Verified Faculty Mentor';
  const teacherAvatar = profile.photo || profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=2d0000&color=ff4444`;
  const teacherHeadline = profile.headline || 'Academic Mentor & Coach';
  const currentPos = profile.currentPosition?.company
    ? `${profile.currentPosition.jobTitle || 'Faculty'} · ${profile.currentPosition.company}`
    : (profile.currentPosition?.jobTitle || null);
  const materials = profile.materials || [];
  const posts = profile.posts || [];
  const slots = profile.availableSlots || [];

  return (
    <div className="min-h-screen bg-knw-bg text-knw-offWhite py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-slide-in">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-knw-red" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-knw-muted">
            <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5 text-knw-subtle" />
            <Link to="/goals" className="hover:text-white">Mentors</Link>
            <ChevronRight className="w-3.5 h-3.5 text-knw-subtle" />
            <span className="text-knw-red font-semibold">{teacherName}</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="knw-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-knw-red/30 shadow-red-lg">
          <div className="hero-radial absolute inset-0 opacity-20 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <div className="story-ring-live">
                  <img
                    src={teacherAvatar}
                    alt={teacherName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-black p-[2px]"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=2d0000&color=ff4444`;
                    }}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" title="Verified Available" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{teacherName}</h1>
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-700/50 uppercase">
                    VERIFIED FACULTY MENTOR
                  </span>
                </div>

                {currentPos && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-200">
                    <Briefcase className="w-3.5 h-3.5 text-knw-red" />
                    <span>{currentPos}</span>
                  </div>
                )}

                <p className="text-sm text-knw-red font-semibold">
                  {teacherHeadline}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-knw-muted">
                  {profile.rating && (
                    <span className="text-yellow-400 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400" />
                      <span>{profile.rating} Rating</span>
                    </span>
                  )}
                  {profile.qualification && (
                    <span className="text-gray-300">· {profile.qualification}</span>
                  )}
                  {profile.experienceYears && (
                    <span className="text-gray-300">· {profile.experienceYears} Years Experience</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="flex items-center gap-5 bg-white/5 border border-white/10 p-4 rounded-2xl shrink-0 font-mono self-start md:self-center">
              <div>
                <span className="text-xl font-black text-knw-red">{materials.length}</span>
                <span className="text-[10px] text-knw-muted block">Notes & PDFs</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-xl font-black text-white">{posts.length}</span>
                <span className="text-[10px] text-knw-muted block">Knowledge Posts</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-xl font-black text-emerald-400">{slots.length}</span>
                <span className="text-[10px] text-knw-muted block">Open Slots</span>
              </div>
            </div>
          </div>

          {/* Bio Quote */}
          {profile.bio && (
            <div className="mt-6 pt-5 border-t border-white/10 text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
              &quot;{profile.bio}&quot;
            </div>
          )}

          {/* Subjects Pills */}
          {profile.subjects?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.subjects.map((sub, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-knw-red/15 text-knw-red border border-knw-red/40"
                >
                  ✦ {sub}
                </span>
              ))}
              {profile.expertise?.map((exp, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-mono bg-white/5 text-gray-300 border border-white/10"
                >
                  {exp}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status Alerts for Bookings */}
        {bookingSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            {bookingSuccess}
          </div>
        )}
        {bookingError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
            {bookingError}
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'materials'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Educational Materials & PDFs ({materials.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'posts'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Knowledge Posts ({posts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'slots'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>1-on-1 Guidance Slots ({slots.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'background'
                ? 'bg-knw-red text-white shadow-red'
                : 'bg-white/5 text-knw-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Experience & Achievements</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {/* TAB 1: MATERIALS */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Educational Resources by {teacherName}</h3>
                <span className="text-xs font-mono text-knw-muted">{materials.length} Items Available</span>
              </div>

              {materials.length === 0 ? (
                <div className="knw-card rounded-3xl p-12 text-center space-y-3 border border-white/10">
                  <BookOpen className="w-10 h-10 text-knw-muted mx-auto opacity-40" />
                  <h4 className="text-sm font-bold text-white">No materials published yet</h4>
                  <p className="text-xs text-knw-muted">This faculty member has not posted study notes or practice PDFs yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materials.map((m) => (
                    <div
                      key={m._id}
                      className="knw-card rounded-2xl p-5 border border-white/10 hover:border-knw-red/40 transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-knw-red/15 text-knw-red border border-knw-red/40 uppercase">
                            ✦ {m.contentType?.toUpperCase() || 'PDF'}
                          </span>
                          {m.subject && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-950/40 text-blue-300 border border-blue-700/40">
                              {m.subject}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-white group-hover:text-knw-red transition-colors">
                          {m.title}
                        </h4>

                        {m.description && (
                          <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                            {m.description}
                          </p>
                        )}

                        {m.topic && (
                          <div className="pt-1">
                            <span className="text-[11px] font-mono text-knw-muted">Topic: <strong className="text-gray-300">{m.topic}</strong></span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-knw-muted">
                          Published: {new Date(m.createdAt).toLocaleDateString()}
                        </span>

                        {m.mediaUrl && (
                          <a
                            href={m.mediaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-red px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-red cursor-pointer"
                          >
                            <span>Open / Download</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: POSTS */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Knowledge Feed Posts by {teacherName}</h3>
                <span className="text-xs font-mono text-knw-muted">{posts.length} Posts</span>
              </div>

              {posts.length === 0 ? (
                <div className="knw-card rounded-3xl p-12 text-center space-y-3 border border-white/10">
                  <Share2 className="w-10 h-10 text-knw-muted mx-auto opacity-40" />
                  <h4 className="text-sm font-bold text-white">No posts published yet</h4>
                  <p className="text-xs text-knw-muted">This faculty member has not posted to the knowledge feed yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((p) => (
                    <article
                      key={p._id}
                      className="knw-card rounded-3xl p-6 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-knw-muted">
                        <span className="px-2.5 py-0.5 rounded-full bg-knw-red/15 text-knw-red border border-knw-red/40 font-bold">
                          ● {p.goalSlug || 'General Post'}
                        </span>
                        <span>{new Date(p.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      <h4 className="text-lg font-bold text-white">{p.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">{p.text}</p>

                      {p.imageUrl && (
                        <div className="rounded-2xl overflow-hidden max-h-80">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      {p.externalLink?.url && (
                        <div className="pt-1">
                          <a
                            href={p.externalLink.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-knw-red hover:underline font-mono"
                          >
                            <span>{p.externalLink.title || 'Open Reference Link'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {p.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {p.tags.map((t, idx) => (
                            <span key={idx} className="text-xs font-mono text-knw-red/80">#{t}</span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SLOTS */}
          {activeTab === 'slots' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">1-on-1 Guidance & Mentorship Slots</h3>
                  <p className="text-xs text-knw-muted mt-0.5">Book dedicated 1-on-1 video sessions with {teacherName}.</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">{slots.length} Open Slots</span>
              </div>

              {slots.length === 0 ? (
                <div className="knw-card rounded-3xl p-12 text-center space-y-3 border border-white/10">
                  <Calendar className="w-10 h-10 text-knw-muted mx-auto opacity-40" />
                  <h4 className="text-sm font-bold text-white">No available slots right now</h4>
                  <p className="text-xs text-knw-muted">All slots are currently booked or unlisted. Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slots.map((s) => (
                    <div
                      key={s._id}
                      className="knw-card rounded-2xl p-5 border border-white/10 hover:border-knw-red/40 flex flex-col justify-between space-y-4 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <h4 className="text-sm font-bold text-white">{s.dayOfWeek}</h4>
                        </div>
                        <p className="text-xs font-mono text-emerald-300">
                          {s.startTime} – {s.endTime}
                        </p>
                        <span className="inline-block text-[10px] font-mono text-knw-muted">
                          Duration: {s.durationMinutes || 45} mins
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBookSession(s)}
                        disabled={bookingLoading}
                        className="btn-red w-full py-2 rounded-xl text-xs font-mono font-bold shadow-red flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Book This Slot</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BACKGROUND */}
          {activeTab === 'background' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Work Experience */}
              <div className="knw-card rounded-3xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-knw-red" />
                  <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Work Experience
                  </h4>
                </div>

                {profile.workExperiences?.length === 0 ? (
                  <p className="text-xs text-knw-muted">No explicit work experience entries recorded.</p>
                ) : (
                  <div className="space-y-3">
                    {profile.workExperiences.map((we, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white">{we.jobTitle}</h5>
                          <span className="text-[10px] font-mono text-knw-muted">{we.startDate} – {we.current ? 'Present' : we.endDate}</span>
                        </div>
                        <p className="text-[11px] text-knw-red font-mono">{we.company}</p>
                        {we.description && (
                          <p className="text-xs text-gray-300 pt-1">{we.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className="knw-card rounded-3xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-knw-red" />
                  <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Achievements & Honors
                  </h4>
                </div>

                {profile.achievements?.length === 0 ? (
                  <p className="text-xs text-knw-muted">No achievements recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {profile.achievements.map((ach, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white">{ach.title}</h5>
                          {ach.date && <span className="text-[10px] font-mono text-knw-muted">{ach.date}</span>}
                        </div>
                        {ach.organization && (
                          <p className="text-[11px] text-knw-red font-mono">{ach.organization}</p>
                        )}
                        {ach.description && (
                          <p className="text-xs text-gray-300 pt-1">{ach.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FacultyProfilePage;
