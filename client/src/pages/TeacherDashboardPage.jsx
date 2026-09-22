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
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const TeacherDashboardPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'slots' | 'bookings' | 'profile'
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // New slot form state
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'Monday',
    startTime: '10:00 AM',
    endTime: '10:45 AM',
    durationMinutes: 45,
    isRecurring: true,
  });
  const [slotSaving, setSlotSaving] = useState(false);

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    headline: '',
    bio: '',
    subjects: ['Physics'],
    qualification: '',
    experienceYears: 5,
    expertise: 'JEE Main, JEE Advanced',
  });
  const [profileSaving, setProfileSaving] = useState(false);

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
      // 1. Fetch Teacher Profile
      try {
        const pRes = await api.get('/teachers/profile/me');
        if (pRes.data?.data) {
          setProfile(pRes.data.data);
          setProfileForm({
            headline: pRes.data.data.headline || '',
            bio: pRes.data.data.bio || '',
            subjects: pRes.data.data.subjects || ['Physics'],
            qualification: pRes.data.data.qualification || '',
            experienceYears: pRes.data.data.experienceYears || 5,
            expertise: (pRes.data.data.expertise || []).join(', '),
          });
        }
      } catch (err) {
        console.warn('Could not fetch teacher profile:', err.message);
      }

      // 2. Fetch Teacher Slots
      try {
        const sRes = await api.get('/teachers/slots');
        if (sRes.data?.data) {
          setSlots(sRes.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch slots:', err.message);
      }

      // 3. Fetch Teacher Bookings
      try {
        const bRes = await api.get('/teachers/bookings');
        if (bRes.data?.data) {
          setBookings(bRes.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch bookings:', err.message);
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setSlotSaving(true);
    try {
      const res = await api.post('/teachers/slots', newSlot);
      addToast('Availability slot added successfully!', 'success');
      setSlots(prev => [...prev, res.data.data]);
      setShowAddSlotModal(false);
    } catch (err) {
      addToast(err.response?.data?.message || err.message || 'Failed to add slot', 'error');
    } finally {
      setSlotSaving(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to remove this availability slot?')) return;
    try {
      await api.delete(`/teachers/slots/${slotId}`);
      setSlots(prev => prev.filter(s => s._id !== slotId));
      addToast('Slot removed.', 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete slot', 'error');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status, meetingUrl) => {
    try {
      const res = await api.patch(`/teachers/bookings/${bookingId}`, { status, meetingUrl });
      setBookings(prev => prev.map(b => b._id === bookingId ? res.data.data : b));
      addToast(`Booking marked as ${status}!`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update booking', 'error');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const payload = {
        ...profileForm,
        expertise: profileForm.expertise.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await api.post('/teachers/profile', payload);
      setProfile(res.data.data);
      addToast('Teacher profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save profile', 'error');
    } finally {
      setProfileSaving(false);
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
        <p className="text-sm font-semibold text-knw-muted">Loading Teacher Workspace…</p>
      </div>
    );
  }

  const bookedSlotsCount = slots.filter(s => s.isBooked).length;
  const activeSlotsCount = slots.filter(s => !s.isBooked).length;
  const confirmedBookingsCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookingsCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Top Header Banner ── */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#141414] via-[#1c0e0e] to-[#120808] border border-knw-red/30 shadow-red-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-knw-red/20 border-2 border-knw-red/50 flex items-center justify-center text-knw-red font-black text-2xl shadow-red uppercase shrink-0">
              {user?.name?.[0] || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-knw-red/20 text-knw-red border border-knw-red/40 uppercase tracking-wider">
                  Verified Faculty Mentor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-knw-muted mt-1">
                {profile?.headline || 'JEE Expert Faculty & Academic Mentor'}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {(profile?.subjects || ['Physics', 'Chemistry', 'Mathematics']).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddSlotModal(true)}
              className="btn-red px-4 py-2.5 rounded-xl text-xs font-bold shadow-red flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Availability Slot</span>
            </button>
            <button
              onClick={loadTeacherData}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-knw-muted hover:text-white hover:bg-white/10 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: Sparkles },
          { id: 'slots', label: `My Availability Slots (${slots.length})`, icon: Calendar },
          { id: 'bookings', label: `Student Sessions (${bookings.length})`, icon: Users },
          { id: 'profile', label: 'Teacher Profile Settings', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* ── TAB 1: OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
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
                  onClick={() => setActiveTab('bookings')}
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

            {/* Quick Slot Preview & Add Widget */}
            <div className="knw-card p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Slot Status
                </h3>
                <button
                  onClick={() => setShowAddSlotModal(true)}
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

      {/* ── TAB 2: AVAILABILITY SLOTS MANAGER ── */}
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
              onClick={() => setShowAddSlotModal(true)}
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
                    <button
                      onClick={() => handleDeleteSlot(slot._id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remove Slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                onClick={() => setShowAddSlotModal(true)}
                className="btn-red px-4 py-2 rounded-xl text-xs font-bold shadow-red"
              >
                + Add First Slot
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: STUDENT BOOKINGS & SESSIONS ── */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Student Bookings & Sessions</h2>
              <p className="text-xs text-knw-muted">
                Manage upcoming calls, launch Jitsi video meetings, and track student doubt clearance sessions.
              </p>
            </div>
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
                  When students book 1-on-1 sessions with you from the Curriculum or Mentors tab, they will appear here with private Jitsi video rooms.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: PROFILE SETTINGS ── */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl knw-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Faculty Profile Settings</h2>
            <p className="text-xs text-knw-muted">
              Customize how students view your credentials, subjects, and academic coaching background.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                Headline / Designation
              </label>
              <input
                type="text"
                required
                value={profileForm.headline}
                onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                placeholder="Senior JEE Physics Faculty · Ex-FIITJEE / Allen"
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
                placeholder="Specializing in Rotational Mechanics, Electromagnetism, and Advanced Calculus problem solving with over 10 years of mentoring..."
                className="w-full bg-knw-surface border border-white/10 rounded-xl p-3 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
              />
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
                  className="w-full bg-knw-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={profileForm.experienceYears}
                  onChange={(e) => setProfileForm({ ...profileForm, experienceYears: Number(e.target.value) })}
                  className="w-full bg-knw-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-knw-muted mb-2">
                Subjects Coached (Click to toggle)
              </label>
              <div className="flex flex-wrap gap-2">
                {['Physics', 'Chemistry', 'Mathematics', 'Full Stack Development', 'Data Structures'].map((sub) => {
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

            <div>
              <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                Key Exam Expertise (Comma separated)
              </label>
              <input
                type="text"
                value={profileForm.expertise}
                onChange={(e) => setProfileForm({ ...profileForm, expertise: e.target.value })}
                placeholder="JEE Main, JEE Advanced, IPhO, KVPY"
                className="w-full bg-knw-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
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

      {/* ── CREATE SLOT MODAL ── */}
      {showAddSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-knw-surface border border-knw-red/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-red-lg relative">
            <h3 className="text-lg font-bold text-white">Add Availability Slot</h3>
            <p className="text-xs text-knw-muted">
              Define a recurring or specific session window. Overlaps are automatically validated.
            </p>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-knw-muted mb-1.5">
                  Day of Week
                </label>
                <select
                  value={newSlot.dayOfWeek}
                  onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
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
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
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
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
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
                  value={newSlot.durationMinutes}
                  onChange={(e) => setNewSlot({ ...newSlot, durationMinutes: Number(e.target.value) })}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
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
                  checked={newSlot.isRecurring}
                  onChange={(e) => setNewSlot({ ...newSlot, isRecurring: e.target.checked })}
                  className="accent-knw-red w-4 h-4 rounded"
                />
                <label htmlFor="recurring" className="text-xs text-zinc-300">
                  Recurring slot (Repeats every {newSlot.dayOfWeek})
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
                  {slotSaving ? 'Validating…' : 'Publish Slot'}
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
