import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  Award,
  Sparkles,
  RefreshCw,
  Edit3,
  Users,
  Check,
  Briefcase,
  FileText,
  UploadCloud,
  Eye,
  Globe,
  Share2,
  Lock,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export const TeacherDashboardPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab synced with search params or default to 'overview'
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'overview');

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contents, setContents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // ── Slot Modals State ──
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotForm, setSlotForm] = useState({
    dayOfWeek: 'Monday',
    startTime: '10:00 AM',
    endTime: '10:45 AM',
    durationMinutes: 45,
    isRecurring: true,
  });
  const [slotSaving, setSlotSaving] = useState(false);

  // ── Profile Form State ──
  const [profileForm, setProfileForm] = useState({
    headline: '',
    bio: '',
    qualification: '',
    experienceYears: 5,
    subjects: ['Physics'],
    expertise: 'JEE Main, JEE Advanced',
    languages: 'English, Hindi',
    currentCompany: '',
    currentJobTitle: '',
    currentStartDate: '',
    previousPositions: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // ── Content Upload Form State ──
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [contentForm, setContentForm] = useState({
    title: '',
    description: '',
    goalSlug: 'jee-mains-advanced',
    subject: 'Physics',
    topic: '',
    contentType: 'pdf',
    mediaUrl: '',
    visibility: 'published',
    fileSize: ''
  });
  const [contentSaving, setContentSaving] = useState(false);

  // ── Achievement Modal State ──
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
    credentialUrl: '',
    imageUrl: ''
  });
  const [achievementSaving, setAchievementSaving] = useState(false);

  // ── Work Experience Modal State ──
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [experienceForm, setExperienceForm] = useState({
    company: '',
    jobTitle: '',
    employmentType: 'Full-time',
    startDate: '',
    endDate: '',
    current: true,
    description: '',
    skills: '',
    achievements: ''
  });
  const [experienceSaving, setExperienceSaving] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      if (user && user.role !== 'teacher' && user.role !== 'admin') {
        addToast('Teacher access required. Please sign in as a teacher/mentor.', 'warning');
        navigate('/');
        return;
      }
      loadTeacherData();
    }
  }, [isAuthenticated, authLoading, user]);

  const loadTeacherData = async () => {
    setLoadingData(true);
    try {
      // 1. Teacher Profile
      try {
        const pRes = await api.get('/teachers/profile');
        if (pRes.data?.data) {
          const p = pRes.data.data;
          setProfile(p);
          setProfileForm({
            headline: p.headline || '',
            bio: p.bio || '',
            qualification: p.qualification || '',
            experienceYears: p.experienceYears || 5,
            subjects: p.subjects || ['Physics'],
            expertise: (p.expertise || []).join(', '),
            languages: (p.languages || ['English', 'Hindi']).join(', '),
            currentCompany: p.currentPosition?.company || '',
            currentJobTitle: p.currentPosition?.jobTitle || '',
            currentStartDate: p.currentPosition?.startDate || '',
            previousPositions: (p.previousPositions || []).join(', ')
          });
        }
      } catch (err) {
        console.warn('Profile fetch:', err.message);
      }

      // 2. Availability Slots
      try {
        const sRes = await api.get('/teachers/slots');
        if (sRes.data?.data) {
          setSlots(sRes.data.data);
        }
      } catch (err) {
        console.warn('Slots fetch:', err.message);
      }

      // 3. Bookings
      try {
        const bRes = await api.get('/teachers/bookings');
        if (bRes.data?.data) {
          setBookings(bRes.data.data);
        }
      } catch (err) {
        console.warn('Bookings fetch:', err.message);
      }

      // 4. Educational Content
      try {
        const cRes = await api.get('/teachers/content/my');
        if (cRes.data?.data) {
          setContents(cRes.data.data);
        }
      } catch (err) {
        console.warn('Content fetch:', err.message);
      }
    } finally {
      setLoadingData(false);
    }
  };

  // ── Slot Actions ──
  const handleSaveSlot = async (e) => {
    e.preventDefault();
    setSlotSaving(true);
    try {
      if (editingSlot) {
        const res = await api.put(`/teachers/slots/${editingSlot._id}`, slotForm);
        setSlots(prev => prev.map(s => s._id === editingSlot._id ? res.data.data : s));
        addToast('Availability slot updated successfully!', 'success');
      } else {
        const res = await api.post('/teachers/slots', slotForm);
        setSlots(prev => [...prev, res.data.data]);
        addToast('Availability slot created successfully!', 'success');
      }
      setShowAddSlotModal(false);
      setEditingSlot(null);
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to save slot', 'error');
    } finally {
      setSlotSaving(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to remove this availability slot?')) return;
    try {
      await api.delete(`/teachers/slots/${slotId}`);
      setSlots(prev => prev.filter(s => s._id !== slotId));
      addToast('Availability slot removed.', 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete slot', 'error');
    }
  };

  const openEditSlotModal = (slot) => {
    setEditingSlot(slot);
    setSlotForm({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      durationMinutes: slot.durationMinutes || 45,
      isRecurring: slot.isRecurring !== false
    });
    setShowAddSlotModal(true);
  };

  // ── Booking Status Actions ──
  const handleUpdateBookingStatus = async (bookingId, status, meetingUrl) => {
    try {
      const res = await api.patch(`/teachers/bookings/${bookingId}/status`, { status, meetingUrl });
      setBookings(prev => prev.map(b => b._id === bookingId ? res.data.data : b));
      addToast(`Session marked as ${status}!`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update booking', 'error');
    }
  };

  // ── Profile Save ──
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const payload = {
        headline: profileForm.headline,
        bio: profileForm.bio,
        qualification: profileForm.qualification,
        experienceYears: Number(profileForm.experienceYears) || 5,
        subjects: profileForm.subjects,
        expertise: profileForm.expertise.split(',').map(s => s.trim()).filter(Boolean),
        languages: profileForm.languages.split(',').map(s => s.trim()).filter(Boolean),
        currentPosition: {
          company: profileForm.currentCompany,
          jobTitle: profileForm.currentJobTitle,
          startDate: profileForm.currentStartDate
        },
        previousPositions: profileForm.previousPositions.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await api.put('/teachers/profile', payload);
      setProfile(res.data.data);
      addToast('Teacher profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Educational Content Actions ──
  const handleSaveContent = async (e) => {
    e.preventDefault();
    setContentSaving(true);
    try {
      if (editingContent) {
        const res = await api.put(`/teachers/content/${editingContent._id}`, contentForm);
        setContents(prev => prev.map(c => c._id === editingContent._id ? res.data.data : c));
        addToast('Educational content updated!', 'success');
      } else {
        const res = await api.post('/teachers/content', contentForm);
        setContents(prev => [res.data.data, ...prev]);
        addToast('Content published for students!', 'success');
      }
      setShowContentModal(false);
      setEditingContent(null);
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to save content', 'error');
    } finally {
      setContentSaving(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Delete this study material?')) return;
    try {
      await api.delete(`/teachers/content/${contentId}`);
      setContents(prev => prev.filter(c => c._id !== contentId));
      addToast('Material deleted.', 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete content', 'error');
    }
  };

  const handleToggleContentVisibility = async (item) => {
    const nextVis = item.visibility === 'published' ? 'draft' : 'published';
    try {
      const res = await api.put(`/teachers/content/${item._id}`, { visibility: nextVis });
      setContents(prev => prev.map(c => c._id === item._id ? res.data.data : c));
      addToast(`Content marked as ${nextVis}!`, 'info');
    } catch (err) {
      addToast('Failed to toggle visibility', 'error');
    }
  };

  // ── Achievements Actions ──
  const handleSaveAchievement = async (e) => {
    e.preventDefault();
    setAchievementSaving(true);
    try {
      if (editingAchievement) {
        const res = await api.put(`/teachers/achievements/${editingAchievement._id}`, achievementForm);
        setProfile(prev => ({ ...prev, achievements: res.data.data }));
        addToast('Achievement updated!', 'success');
      } else {
        const res = await api.post('/teachers/achievements', achievementForm);
        setProfile(prev => ({ ...prev, achievements: res.data.data }));
        addToast('Achievement added!', 'success');
      }
      setShowAchievementModal(false);
      setEditingAchievement(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save achievement', 'error');
    } finally {
      setAchievementSaving(false);
    }
  };

  const handleDeleteAchievement = async (achId) => {
    if (!window.confirm('Remove this achievement?')) return;
    try {
      const res = await api.delete(`/teachers/achievements/${achId}`);
      setProfile(prev => ({ ...prev, achievements: res.data.data }));
      addToast('Achievement removed.', 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete achievement', 'error');
    }
  };

  // ── Work Experience Actions ──
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    setExperienceSaving(true);
    try {
      if (editingExperience) {
        const res = await api.put(`/teachers/experience/${editingExperience._id}`, experienceForm);
        setProfile(prev => ({ ...prev, workExperiences: res.data.data }));
        addToast('Work experience updated!', 'success');
      } else {
        const res = await api.post('/teachers/experience', experienceForm);
        setProfile(prev => ({ ...prev, workExperiences: res.data.data }));
        addToast('Work experience added!', 'success');
      }
      setShowExperienceModal(false);
      setEditingExperience(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save experience', 'error');
    } finally {
      setExperienceSaving(false);
    }
  };

  const handleDeleteExperience = async (expId) => {
    if (!window.confirm('Remove this work experience entry?')) return;
    try {
      const res = await api.delete(`/teachers/experience/${expId}`);
      setProfile(prev => ({ ...prev, workExperiences: res.data.data }));
      addToast('Work experience removed.', 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete experience', 'error');
    }
  };

  const toggleSubject = (sub) => {
    setProfileForm(prev => {
      const exists = prev.subjects.includes(sub);
      return {
        ...prev,
        subjects: exists
          ? prev.subjects.filter(s => s !== sub)
          : [...prev.subjects, sub]
      };
    });
  };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <RefreshCw className="w-8 h-8 text-knw-red animate-spin" />
        <p className="text-sm font-semibold text-knw-muted">Loading Faculty Workspace…</p>
      </div>
    );
  }

  const bookedSlotsCount = slots.filter(s => s.isBooked).length;
  const activeSlotsCount = slots.filter(s => !s.isBooked).length;
  const confirmedBookingsCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookingsCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── TEACHER HEADER BANNER ── */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#141414] via-[#1c0e0e] to-[#120808] border border-knw-red/30 shadow-red-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {profile?.photo ? (
              <img
                src={profile.photo}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-knw-red/60 shadow-red shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-knw-red/20 border-2 border-knw-red/50 flex items-center justify-center text-knw-red font-black text-2xl shadow-red uppercase shrink-0">
                {user?.name?.[0] || 'T'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-knw-red/20 text-knw-red border border-knw-red/40 uppercase tracking-wider">
                  Verified Faculty Mentor
                </span>
                {profile?.currentPosition?.company && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-zinc-300 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-knw-red" />
                    {profile.currentPosition.jobTitle ? `${profile.currentPosition.jobTitle} · ` : ''}{profile.currentPosition.company}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-knw-muted mt-1">
                {profile?.headline || 'Academic Coach & Educator'}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {(profile?.subjects || ['Physics']).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingSlot(null);
                setSlotForm({
                  dayOfWeek: 'Monday',
                  startTime: '10:00 AM',
                  endTime: '10:45 AM',
                  durationMinutes: 45,
                  isRecurring: true,
                });
                setShowAddSlotModal(true);
              }}
              className="btn-red px-4 py-2.5 rounded-xl text-xs font-bold shadow-red flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Availability Slot</span>
            </button>
            <button
              onClick={loadTeacherData}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-knw-muted hover:text-white hover:bg-white/10 transition-colors"
              title="Refresh Workspace Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── TEACHER DASHBOARD TABS ── */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: Sparkles },
          { id: 'slots', label: `My Availability Slots (${slots.length})`, icon: Calendar },
          { id: 'bookings', label: `Student Sessions (${bookings.length})`, icon: Users },
          { id: 'content', label: `My Content (${contents.length})`, icon: FileText },
          { id: 'achievements', label: `Achievements (${profile?.achievements?.length || 0})`, icon: Award },
          { id: 'experience', label: `Work Experience (${profile?.workExperiences?.length || 0})`, icon: Briefcase },
          { id: 'profile', label: 'Teacher Profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-knw-red text-white shadow-red'
                  : 'text-knw-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: OVERVIEW & STATS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="knw-card p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-knw-muted">Open Slots</span>
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white mt-2">{activeSlotsCount}</p>
              <span className="text-[11px] text-emerald-400 mt-1 inline-block">Available for booking</span>
            </div>

            <div className="knw-card p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-knw-muted">Booked Slots</span>
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-black text-white mt-2">{bookedSlotsCount}</p>
              <span className="text-[11px] text-yellow-400 mt-1 inline-block">Awaiting student call</span>
            </div>

            <div className="knw-card p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-knw-muted">Upcoming Sessions</span>
                <Video className="w-5 h-5 text-knw-red" />
              </div>
              <p className="text-3xl font-black text-white mt-2">{confirmedBookingsCount}</p>
              <span className="text-[11px] text-knw-red mt-1 inline-block">Confirmed & active</span>
            </div>

            <div className="knw-card p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-knw-muted">Sessions Completed</span>
                <Award className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-black text-white mt-2">{completedBookingsCount}</p>
              <span className="text-[11px] text-blue-400 mt-1 inline-block">High student satisfaction</span>
            </div>
          </div>

          {/* Quick Actions & Next Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming confirmed sessions */}
            <div className="lg:col-span-2 knw-card p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-knw-red" />
                  Upcoming Mentoring Calls
                </h3>
                <button
                  onClick={() => handleTabChange('bookings')}
                  className="text-xs text-knw-red hover:underline font-semibold"
                >
                  View All ({bookings.length})
                </button>
              </div>

              {bookings.filter(b => b.status === 'confirmed').length === 0 ? (
                <div className="p-8 text-center bg-white/5 rounded-xl border border-white/5 space-y-2">
                  <Calendar className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-knw-muted">No confirmed bookings currently waiting.</p>
                  <p className="text-[11px] text-zinc-500">Ensure your availability slots are up to date so students can book sessions.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings
                    .filter(b => b.status === 'confirmed')
                    .slice(0, 4)
                    .map((booking) => (
                      <div
                        key={booking._id}
                        className="p-4 rounded-xl bg-knw-surface border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {booking.studentId?.name || 'Student'}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-knw-red/20 text-knw-red font-mono">
                              {booking.subject}
                            </span>
                          </div>
                          <p className="text-xs text-knw-muted">
                            📅 {booking.dayOfWeek}, {booking.sessionDate} · ⏰ {booking.timeSlot}
                          </p>
                          {booking.studentQuestion && (
                            <p className="text-[11px] text-zinc-300 italic">
                              "{booking.studentQuestion}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {booking.meetingUrl && (
                            <a
                              href={booking.meetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-red px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-red"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Room</span>
                            </a>
                          )}
                          <button
                            onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 border border-emerald-600/40 text-emerald-400 hover:bg-emerald-900/50 transition-colors"
                          >
                            Mark Done
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Slot Status Widget */}
            <div className="knw-card p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Slot Status
                </h3>
                <button
                  onClick={() => {
                    setEditingSlot(null);
                    setShowAddSlotModal(true);
                  }}
                  className="text-xs text-knw-red hover:underline font-semibold"
                >
                  + Add Slot
                </button>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {slots.slice(0, 5).map((slot) => (
                  <div
                    key={slot._id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{slot.dayOfWeek}</span>
                      <span className="text-[11px] text-knw-muted font-mono">{slot.startTime} - {slot.endTime}</span>
                    </div>
                    <div>
                      {slot.isBooked ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-950/50 text-yellow-400 border border-yellow-700/40">
                          Booked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-700/40">
                          Open
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {slots.length === 0 && (
                  <p className="text-xs text-knw-muted text-center py-4">No slots created yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: AVAILABILITY SLOTS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'slots' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Availability Slots Manager</h2>
              <p className="text-xs text-knw-muted">
                Publish slots so students can schedule 1-on-1 doubt clearance & concept coaching.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingSlot(null);
                setSlotForm({
                  dayOfWeek: 'Monday',
                  startTime: '10:00 AM',
                  endTime: '10:45 AM',
                  durationMinutes: 45,
                  isRecurring: true,
                });
                setShowAddSlotModal(true);
              }}
              className="btn-red px-4 py-2.5 rounded-xl text-xs font-bold shadow-red flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Slot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className={`p-5 rounded-2xl border transition-all ${
                  slot.isBooked
                    ? 'bg-[#181108] border-yellow-800/40'
                    : 'bg-knw-surface border-white/10 hover:border-knw-red/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {slot.dayOfWeek}
                  </span>
                  {slot.isBooked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
                      Booked by Student
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Available
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-mono font-bold text-white">
                    <Clock className="w-4 h-4 text-knw-red" />
                    <span>{slot.startTime} – {slot.endTime}</span>
                  </div>
                  <p className="text-[11px] text-knw-muted">
                    Duration: {slot.durationMinutes} mins · {slot.isRecurring ? 'Repeats Weekly' : 'One-time'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500">
                    {slot.isBooked ? 'Locked until session completes' : 'Ready for bookings'}
                  </span>
                  {!slot.isBooked && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditSlotModal(slot)}
                        className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                        title="Edit Slot"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slot._id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Remove Slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {slots.length === 0 && (
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10 space-y-3">
              <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Slots Created</h3>
              <p className="text-xs text-knw-muted max-w-md mx-auto">
                Set up your weekly recurring availability slots to begin receiving 1-on-1 mentorship bookings from students.
              </p>
              <button
                onClick={() => {
                  setEditingSlot(null);
                  setShowAddSlotModal(true);
                }}
                className="btn-red px-4 py-2 rounded-xl text-xs font-bold shadow-red"
              >
                + Add First Slot
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: STUDENT SESSIONS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Student Bookings & Sessions</h2>
            <p className="text-xs text-knw-muted">
              Manage upcoming calls, launch Jitsi video meetings, and track student doubt clearance sessions.
            </p>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="knw-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-white">
                      {booking.studentId?.name || 'Student'}
                    </span>
                    <span className="text-xs text-knw-muted">
                      ({booking.studentId?.email || 'No email'})
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed'
                        ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-700/50'
                        : booking.status === 'completed'
                        ? 'bg-blue-950/50 text-blue-400 border border-blue-700/50'
                        : 'bg-red-950/50 text-red-400 border border-red-700/50'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-knw-offWhite">
                    <span className="flex items-center gap-1.5 font-mono text-yellow-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {booking.dayOfWeek}, {booking.sessionDate}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-zinc-300">
                      <Clock className="w-3.5 h-3.5" />
                      {booking.timeSlot} ({booking.durationMinutes || 45} mins)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-mono text-[11px]">
                      Subject: {booking.subject || 'General Guidance'}
                    </span>
                  </div>

                  {booking.studentQuestion && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300">
                      <span className="text-[10px] uppercase font-mono text-knw-muted block mb-1">
                        Student Question / Discussion Goal:
                      </span>
                      {booking.studentQuestion}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  {booking.meetingUrl && booking.status !== 'cancelled' && (
                    <a
                      href={booking.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-red px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-red"
                    >
                      <Video className="w-4 h-4" />
                      <span>Open Meeting Room</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-900/40 border border-emerald-600/40 text-emerald-400 hover:bg-emerald-800/50 transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/40 border border-red-700/40 text-red-400 hover:bg-red-900/50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}

            {bookings.length === 0 && (
              <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10 space-y-2">
                <Users className="w-12 h-12 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Student Bookings Yet</h3>
                <p className="text-xs text-knw-muted">
                  When students book 1-on-1 sessions with you, they will appear here with private Jitsi video rooms.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: MY CONTENT (Notes, PDFs, Videos, Documents)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">My Educational Content</h2>
              <p className="text-xs text-knw-muted">
                Publish study notes, formula sheets, YouTube walkthroughs, and practice PDFs associated with specific curriculum goals and topics.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingContent(null);
                setContentForm({
                  title: '',
                  description: '',
                  goalSlug: 'jee-mains-advanced',
                  subject: 'Physics',
                  topic: '',
                  contentType: 'pdf',
                  mediaUrl: '',
                  visibility: 'published',
                  fileSize: ''
                });
                setShowContentModal(true);
              }}
              className="btn-red px-4 py-2.5 rounded-xl text-xs font-bold shadow-red flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Publish New Material</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contents.map((item) => (
              <div
                key={item._id}
                className="knw-card p-5 rounded-2xl border border-white/10 hover:border-knw-red/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-knw-red/20 text-knw-red border border-knw-red/30 uppercase">
                      {item.contentType}
                    </span>
                    <button
                      onClick={() => handleToggleContentVisibility(item)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                        item.visibility === 'published'
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-700/50'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                      title="Click to toggle visibility"
                    >
                      {item.visibility === 'published' ? '● Published' : '○ Draft'}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-knw-muted line-clamp-2 mt-1">{item.description}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-white/5">{item.subject}</span>
                    {item.topic && <span className="px-2 py-0.5 rounded bg-white/5">{item.topic}</span>}
                    <span className="px-2 py-0.5 rounded bg-white/5">{item.goalSlug}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={item.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-knw-red hover:underline flex items-center gap-1"
                  >
                    <span>View Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingContent(item);
                        setContentForm({
                          title: item.title,
                          description: item.description,
                          goalSlug: item.goalSlug,
                          subject: item.subject,
                          topic: item.topic,
                          contentType: item.contentType,
                          mediaUrl: item.mediaUrl,
                          visibility: item.visibility,
                          fileSize: item.fileSize || ''
                        });
                        setShowContentModal(true);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-white"
                      title="Edit Material"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(item._id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400"
                      title="Delete Material"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {contents.length === 0 && (
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10 space-y-3">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Materials Uploaded Yet</h3>
              <p className="text-xs text-knw-muted max-w-md mx-auto">
                Share PDFs, YouTube lectures, handwritten formula sheets, or Google Drive problem sets with students enrolled in this curriculum.
              </p>
              <button
                onClick={() => {
                  setEditingContent(null);
                  setShowContentModal(true);
                }}
                className="btn-red px-4 py-2 rounded-xl text-xs font-bold shadow-red"
              >
                + Publish First Material
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: ACHIEVEMENTS & RECOGNITION
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Achievements & Recognition</h2>
              <p className="text-xs text-knw-muted">
                Highlight awards, educator certifications, competitive exam ranks, academic publications, and career milestones.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingAchievement(null);
                setAchievementForm({
                  title: '',
                  organization: '',
                  date: '',
                  description: '',
                  credentialUrl: '',
                  imageUrl: ''
                });
                setShowAchievementModal(true);
              }}
              className="btn-red px-4 py-2.5 rounded-xl text-xs font-bold shadow-red flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Achievement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(profile?.achievements || []).map((ach) => (
              <div
                key={ach._id}
                className="knw-card p-5 rounded-2xl border border-white/10 hover:border-knw-red/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-knw-red" />
                      {ach.title}
                    </span>
                    {ach.date && (
                      <span className="text-[11px] font-mono text-zinc-400">{ach.date}</span>
                    )}
                  </div>
                  {ach.organization && (
                    <p className="text-xs text-knw-red font-semibold">{ach.organization}</p>
                  )}
                  {ach.description && (
                    <p className="text-xs text-zinc-300 leading-relaxed">{ach.description}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  {ach.credentialUrl ? (
                    <a
                      href={ach.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-knw-red hover:underline flex items-center gap-1"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <span />}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingAchievement(ach);
                        setAchievementForm({
                          title: ach.title,
                          organization: ach.organization || '',
                          date: ach.date || '',
                          description: ach.description || '',
                          credentialUrl: ach.credentialUrl || '',
                          imageUrl: ach.imageUrl || ''
                        });
                        setShowAchievementModal(true);
                      }}
                      className="p-1.5 text-zinc-400 hover:text-white"
                      title="Edit Achievement"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(ach._id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400"
                      title="Delete Achievement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(profile?.achievements || []).length === 0 && (
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10 space-y-3">
              <Award className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Achievements Listed</h3>
              <p className="text-xs text-knw-muted max-w-md mx-auto">
                Add your awards, academic recognitions, certifications, or publications to establish authority with students.
              </p>
              <button
                onClick={() => {
                  setEditingAchievement(null);
                  setShowAchievementModal(true);
                }}
                className="btn-red px-4 py-2 rounded-xl text-xs font-bold shadow-red"
              >
                + Add First Achievement
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 6: PROFESSIONAL WORK EXPERIENCE
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Professional Work Experience</h2>
              <p className="text-xs text-knw-muted">
                Display industry engineering roles, faculty positions, coaching institutes, and research appointments.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingExperience(null);
                setExperienceForm({
                  company: '',
                  jobTitle: '',
                  employmentType: 'Full-time',
                  startDate: '',
                  endDate: '',
                  current: true,
                  description: '',
                  skills: '',
                  achievements: ''
                });
                setShowExperienceModal(true);
              }}
              className="btn-red px-4 py-2.5 rounded-xl text-xs font-bold shadow-red flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Work Experience</span>
            </button>
          </div>

          <div className="space-y-4">
            {(profile?.workExperiences || []).map((exp) => (
              <div
                key={exp._id}
                className="knw-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-bold text-white">{exp.jobTitle}</h3>
                    <span className="text-xs text-knw-red font-semibold">@ {exp.company}</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-zinc-300">
                      {exp.employmentType}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 font-mono">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </p>

                  {exp.description && (
                    <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">{exp.description}</p>
                  )}

                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-mono text-zinc-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start">
                  <button
                    onClick={() => {
                      setEditingExperience(exp);
                      setExperienceForm({
                        company: exp.company,
                        jobTitle: exp.jobTitle,
                        employmentType: exp.employmentType,
                        startDate: exp.startDate || '',
                        endDate: exp.endDate || '',
                        current: !!exp.current,
                        description: exp.description || '',
                        skills: (exp.skills || []).join(', '),
                        achievements: (exp.achievements || []).join(', ')
                      });
                      setShowExperienceModal(true);
                    }}
                    className="p-2 text-zinc-400 hover:text-white"
                    title="Edit Experience"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(exp._id)}
                    className="p-2 text-zinc-500 hover:text-red-400"
                    title="Delete Experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {(profile?.workExperiences || []).length === 0 && (
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10 space-y-3">
              <Briefcase className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Work Experience Listed</h3>
              <p className="text-xs text-knw-muted max-w-md mx-auto">
                Add your current and previous professional faculty or industry roles to give students real-world context.
              </p>
              <button
                onClick={() => {
                  setEditingExperience(null);
                  setShowExperienceModal(true);
                }}
                className="btn-red px-4 py-2 rounded-xl text-xs font-bold shadow-red"
              >
                + Add Experience
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 7: TEACHER PROFILE
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl knw-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Faculty Profile Settings</h2>
            <p className="text-xs text-knw-muted">
              Customize how students view your credentials, subjects, experience, and academic coaching background.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                Professional Title / Headline
              </label>
              <input
                type="text"
                required
                value={profileForm.headline}
                onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                placeholder="Senior JEE Physics Faculty · Ex-Allen / FIITJEE"
                className="w-full bg-knw-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                Teaching Bio & Methodology
              </label>
              <textarea
                rows={3}
                required
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Specializing in Mechanics, Electromagnetism, and Advanced problem-solving techniques..."
                className="w-full bg-knw-surface border border-white/10 rounded-xl p-3 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
              />
            </div>

            {/* Current Position */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-knw-red font-bold block flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Current Professional Position
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Company / Academy</label>
                  <input
                    type="text"
                    value={profileForm.currentCompany}
                    onChange={(e) => setProfileForm({ ...profileForm, currentCompany: e.target.value })}
                    placeholder="Microsoft, Allen, FIITJEE..."
                    className="w-full bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={profileForm.currentJobTitle}
                    onChange={(e) => setProfileForm({ ...profileForm, currentJobTitle: e.target.value })}
                    placeholder="Senior Faculty / Principal Engineer"
                    className="w-full bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                  Qualification
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.qualification}
                  onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })}
                  placeholder="M.Tech (IIT Delhi)"
                  className="w-full bg-knw-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                  Mentoring Experience (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={profileForm.experienceYears}
                  onChange={(e) => setProfileForm({ ...profileForm, experienceYears: Number(e.target.value) })}
                  className="w-full bg-knw-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-knw-muted mb-2">
                Subjects Coached (Click to toggle)
              </label>
              <div className="flex flex-wrap gap-2">
                {['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'AI & Machine Learning', 'Data Structures & Algorithms'].map((sub) => {
                  const active = profileForm.subjects.includes(sub);
                  return (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => toggleSubject(sub)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? 'bg-knw-red border-knw-red text-white shadow-red'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      {sub} {active && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                  Exam Expertise (Comma separated)
                </label>
                <input
                  type="text"
                  value={profileForm.expertise}
                  onChange={(e) => setProfileForm({ ...profileForm, expertise: e.target.value })}
                  placeholder="JEE Main, JEE Advanced, IPhO"
                  className="w-full bg-knw-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                  Languages Spoken
                </label>
                <input
                  type="text"
                  value={profileForm.languages}
                  onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })}
                  placeholder="English, Hindi"
                  className="w-full bg-knw-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                Previous Roles / Institutes (Comma separated)
              </label>
              <input
                type="text"
                value={profileForm.previousPositions}
                onChange={(e) => setProfileForm({ ...profileForm, previousPositions: e.target.value })}
                placeholder="Ex-Allen Senior Faculty, Ex-FIITJEE HOD..."
                className="w-full bg-knw-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-knw-red"
              />
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="btn-red px-6 py-2.5 rounded-xl text-xs font-bold shadow-red"
            >
              {profileSaving ? 'Saving Profile…' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT AVAILABILITY SLOT
      ───────────────────────────────────────────────────────────── */}
      {showAddSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-knw-surface border border-knw-red/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-red-lg relative">
            <h3 className="text-lg font-bold text-white">
              {editingSlot ? 'Edit Availability Slot' : 'Add Availability Slot'}
            </h3>
            <p className="text-xs text-knw-muted">
              Define a recurring session window. Overlaps with other slots are automatically validated.
            </p>

            <form onSubmit={handleSaveSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                  Day of Week
                </label>
                <select
                  value={slotForm.dayOfWeek}
                  onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: e.target.value })}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-knw-red"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="text"
                    required
                    value={slotForm.startTime}
                    onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                    placeholder="10:00 AM"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                    End Time
                  </label>
                  <input
                    type="text"
                    required
                    value={slotForm.endTime}
                    onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                    placeholder="10:45 AM"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                  Duration (Minutes)
                </label>
                <select
                  value={slotForm.durationMinutes}
                  onChange={(e) => setSlotForm({ ...slotForm, durationMinutes: Number(e.target.value) })}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-knw-red"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes (Recommended)</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={slotForm.isRecurring}
                  onChange={(e) => setSlotForm({ ...slotForm, isRecurring: e.target.checked })}
                  className="accent-knw-red w-4 h-4 rounded"
                />
                <label htmlFor="recurring" className="text-xs text-zinc-300">
                  Recurring slot (Repeats weekly on {slotForm.dayOfWeek})
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddSlotModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-knw-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={slotSaving}
                  className="btn-red px-5 py-2 rounded-xl text-xs font-bold shadow-red"
                >
                  {slotSaving ? 'Validating…' : (editingSlot ? 'Update Slot' : 'Publish Slot')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: UPLOAD / EDIT EDUCATIONAL CONTENT
      ───────────────────────────────────────────────────────────── */}
      {showContentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-knw-surface border border-knw-red/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-red-lg relative">
            <h3 className="text-lg font-bold text-white">
              {editingContent ? 'Edit Educational Material' : 'Publish Study Material'}
            </h3>
            <p className="text-xs text-knw-muted">
              Add verified PDFs, YouTube video lessons, formula sheets, or problem sets for students.
            </p>

            <form onSubmit={handleSaveContent} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={contentForm.title}
                  onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                  placeholder="e.g. Kinematics & Relative Motion Advanced PYQ Notes"
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Description</label>
                <textarea
                  rows={2}
                  value={contentForm.description}
                  onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                  placeholder="Comprehensive theory breakdown, derivation shortcuts, and 15 multi-concept problem illustrations..."
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Content Type</label>
                  <select
                    value={contentForm.contentType}
                    onChange={(e) => setContentForm({ ...contentForm, contentType: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="notes">Lecture Notes</option>
                    <option value="video">Video Walkthrough (YouTube / URL)</option>
                    <option value="assignment">Assignment / Problem Pack</option>
                    <option value="practice">Practice Drill</option>
                    <option value="link">External Link / Tool</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Subject</label>
                  <select
                    value={contentForm.subject}
                    onChange={(e) => setContentForm({ ...contentForm, subject: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Topic</label>
                  <input
                    type="text"
                    value={contentForm.topic}
                    onChange={(e) => setContentForm({ ...contentForm, topic: e.target.value })}
                    placeholder="e.g. Rotational Dynamics"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Target Curriculum Goal</label>
                  <select
                    value={contentForm.goalSlug}
                    onChange={(e) => setContentForm({ ...contentForm, goalSlug: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  >
                    <option value="jee-mains-advanced">JEE Mains & Advanced</option>
                    <option value="full-stack-development">Full Stack Web Development</option>
                    <option value="machine-learning-ai">Machine Learning & AI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1">
                  Media / Resource URL (YouTube, Google Drive, Cloud link)
                </label>
                <input
                  type="url"
                  required
                  value={contentForm.mediaUrl}
                  onChange={(e) => setContentForm({ ...contentForm, mediaUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="vis"
                    checked={contentForm.visibility === 'published'}
                    onChange={(e) => setContentForm({ ...contentForm, visibility: e.target.checked ? 'published' : 'draft' })}
                    className="accent-knw-red w-4 h-4 rounded"
                  />
                  <label htmlFor="vis" className="text-xs text-zinc-300">
                    Publish immediately (visible to students in resources)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowContentModal(false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs text-knw-muted hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={contentSaving}
                    className="btn-red px-4 py-2 rounded-xl text-xs font-bold shadow-red"
                  >
                    {contentSaving ? 'Saving…' : 'Save Material'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT ACHIEVEMENT
      ───────────────────────────────────────────────────────────── */}
      {showAchievementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-knw-surface border border-knw-red/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-red-lg relative">
            <h3 className="text-lg font-bold text-white">
              {editingAchievement ? 'Edit Achievement' : 'Add Achievement & Recognition'}
            </h3>

            <form onSubmit={handleSaveAchievement} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={achievementForm.title}
                  onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                  placeholder="e.g. Best National Physics Mentor Award"
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Organization</label>
                  <input
                    type="text"
                    value={achievementForm.organization}
                    onChange={(e) => setAchievementForm({ ...achievementForm, organization: e.target.value })}
                    placeholder="IIT Delhi / XYZ Academy"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Year / Date</label>
                  <input
                    type="text"
                    value={achievementForm.date}
                    onChange={(e) => setAchievementForm({ ...achievementForm, date: e.target.value })}
                    placeholder="2025"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Description</label>
                <textarea
                  rows={2}
                  value={achievementForm.description}
                  onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                  placeholder="Recognized for mentoring 50+ students into Top 500 AIR in JEE Advanced..."
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Credential / Verification URL</label>
                <input
                  type="url"
                  value={achievementForm.credentialUrl}
                  onChange={(e) => setAchievementForm({ ...achievementForm, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAchievementModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-knw-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={achievementSaving}
                  className="btn-red px-4 py-2 rounded-xl text-xs font-bold shadow-red"
                >
                  {achievementSaving ? 'Saving…' : 'Save Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT WORK EXPERIENCE
      ───────────────────────────────────────────────────────────── */}
      {showExperienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-knw-surface border border-knw-red/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-red-lg relative">
            <h3 className="text-lg font-bold text-white">
              {editingExperience ? 'Edit Work Experience' : 'Add Professional Experience'}
            </h3>

            <form onSubmit={handleSaveExperience} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                    placeholder="Microsoft / Allen Career Institute"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={experienceForm.jobTitle}
                    onChange={(e) => setExperienceForm({ ...experienceForm, jobTitle: e.target.value })}
                    placeholder="Senior Faculty / Software Architect"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Employment Type</label>
                  <select
                    value={experienceForm.employmentType}
                    onChange={(e) => setExperienceForm({ ...experienceForm, employmentType: e.target.value })}
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Faculty Mentor">Faculty Mentor</option>
                    <option value="Consultant">Consultant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Start Date</label>
                  <input
                    type="text"
                    value={experienceForm.startDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                    placeholder="2021"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-knw-muted mb-1">End Date</label>
                  <input
                    type="text"
                    disabled={experienceForm.current}
                    value={experienceForm.current ? 'Present' : experienceForm.endDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                    placeholder="2024"
                    className="w-full bg-[#161616] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="curr"
                  checked={experienceForm.current}
                  onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked })}
                  className="accent-knw-red w-4 h-4 rounded"
                />
                <label htmlFor="curr" className="text-xs text-zinc-300">
                  I currently work in this position
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Description & Scope</label>
                <textarea
                  rows={2}
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                  placeholder="Led Physics curriculum development for top batches, authored 200+ multi-concept problems..."
                  className="w-full bg-[#161616] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1">Key Skills (Comma separated)</label>
                <input
                  type="text"
                  value={experienceForm.skills}
                  onChange={(e) => setExperienceForm({ ...experienceForm, skills: e.target.value })}
                  placeholder="Rotational Mechanics, Electrodynamics, System Architecture"
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExperienceModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-knw-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={experienceSaving}
                  className="btn-red px-4 py-2 rounded-xl text-xs font-bold shadow-red"
                >
                  {experienceSaving ? 'Saving…' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboardPage;
