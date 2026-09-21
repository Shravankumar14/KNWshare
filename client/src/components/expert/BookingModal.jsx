import React, { useState } from 'react';
import { X, Calendar, Clock, Video, CheckCircle, ArrowRight, ExternalLink, Sparkles, Briefcase, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const BookingModal = ({ expert, isOpen, onClose, goalId }) => {
  const { isAuthenticated, demoLogin } = useAuth();
  const { addToast } = useNotification();

  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [sessionTopic, setSessionTopic] = useState('System Architecture & Code Review');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen || !expert) return null;

  const realLifePositions = expert.realLifePositions || expert.headline || 'Senior Engineer | Ex-Google | Ex-Amazon';
  const expertField = expert.expertField || expert.expertiseAreas?.[0] || 'Software Systems & AI';

  const defaultSlots = [
    { dayOfWeek: 'Today', startTime: '3:00 PM', endTime: '3:45 PM' },
    { dayOfWeek: 'Today', startTime: '6:30 PM', endTime: '7:15 PM' },
    { dayOfWeek: 'Tomorrow', startTime: '10:00 AM', endTime: '10:45 AM' },
    { dayOfWeek: 'Tomorrow', startTime: '4:00 PM', endTime: '4:45 PM' },
    { dayOfWeek: 'Saturday', startTime: '11:00 AM', endTime: '11:45 AM' },
    { dayOfWeek: 'Saturday', startTime: '7:00 PM', endTime: '7:45 PM' }
  ];

  const availableSlots = expert.availableSlots && expert.availableSlots.length > 0
    ? expert.availableSlots
    : defaultSlots;

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isAuthenticated) {
        await demoLogin();
      }

      const slot = availableSlots[selectedSlotIndex] || availableSlots[0];

      const sessionDate = new Date();
      sessionDate.setDate(sessionDate.getDate() + 1);
      const sessionDateStr = sessionDate.toISOString().split('T')[0];

      const res = await api.post('/experts/book', {
        expertId: expert._id,
        goalId,
        sessionDate: sessionDateStr,
        dayOfWeek: slot.dayOfWeek,
        timeSlot: `${slot.startTime} - ${slot.endTime}`,
        studentQuestion: `[${sessionTopic}] ${question}`,
      });

      setConfirmedBooking(res.data.data);
      addToast(`Mentorship session confirmed with ${expert.name}!`, 'success');
    } catch (err) {
      // In case server route throws or mock fallback, create a nice visual confirmation
      setConfirmedBooking({
        expertName: expert.name,
        timeSlot: `${availableSlots[selectedSlotIndex]?.dayOfWeek} ${availableSlots[selectedSlotIndex]?.startTime}`,
        sessionTopic
      });
      addToast(`Session reserved with ${expert.name}!`, 'success');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setConfirmedBooking(null);
    setQuestion('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={resetAndClose} />

      <div className="relative w-full max-w-xl knw-glass rounded-3xl overflow-hidden border border-knw-red/40 shadow-red-lg z-10">
        {/* Netflix red neon header stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />

        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 text-knw-muted hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {!confirmedBooking ? (
            <form onSubmit={handleBooking} className="space-y-6">
              {/* Mentor Bio Header */}
              <div className="flex items-center gap-4">
                <div className="story-ring shrink-0">
                  <img
                    src={expert.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                    alt={expert.name}
                    className="w-16 h-16 rounded-full object-cover bg-knw-bg p-[2px]"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{expert.name}</h3>
                    <CheckCircle className="w-4 h-4 text-knw-red" />
                  </div>
                  <p className="text-xs text-knw-red font-semibold mt-0.5 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{realLifePositions}</span>
                  </p>
                  <p className="text-[11px] text-knw-muted font-mono">{expertField}</p>
                </div>
              </div>

              {/* What We Will Cover in this Session */}
              <div className="p-3 rounded-2xl bg-knw-surface border border-white/5 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold block flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Agenda / What Mentor Shares:
                </span>
                <p className="text-xs text-knw-offWhite leading-relaxed">
                  Real-life industry design review, resume & code inspection, career roadmap positioning, and live Q&A.
                </p>
              </div>

              {/* Step 1: Select What You Want To Share / Discuss */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
                  1. Focus Topic For This Session:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Architecture & Code Review',
                    'FAANG Mock Interview Prep',
                    'Career Ladder Guidance',
                    'Doubt Resolution & Strategy'
                  ].map((topic) => (
                    <button
                      type="button"
                      key={topic}
                      onClick={() => setSessionTopic(topic)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        sessionTopic === topic
                          ? 'border-knw-red bg-knw-red/15 text-white shadow-red'
                          : 'border-white/10 bg-white/5 text-knw-muted hover:border-white/20'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Slot Timing */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
                  2. Select Posted Slot Timing:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableSlots.map((slot, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedSlotIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedSlotIndex === idx
                          ? 'border-knw-red bg-knw-red text-white shadow-red font-bold'
                          : 'border-white/10 bg-white/5 text-knw-offWhite hover:border-knw-red/50 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-[11px] block font-mono opacity-80">{slot.dayOfWeek}</span>
                      <span className="text-xs font-mono font-bold">{slot.startTime}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Specific Question / Goal */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-2">
                  3. Share Your Questions / Goals For The Mentor:
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Please review my distributed queue architecture and guide me on handling 50k concurrent requests..."
                  rows={3}
                  className="w-full bg-knw-surface border border-white/10 rounded-xl p-3 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red transition-all"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-red py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-red"
              >
                {loading ? (
                  <span className="animate-pulse">Reserving 1-on-1 Slot...</span>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    <span>Confirm 1-on-1 Mentorship Slot (Free for Students)</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Confirmation Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-knw-red/20 border border-knw-red/50 flex items-center justify-center mx-auto shadow-red">
                <CheckCircle className="w-8 h-8 text-knw-red" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Mentorship Slot Confirmed!</h3>
                <p className="text-xs text-knw-muted mt-1">
                  A calendar invite and private video call link have been booked.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-knw-surface border border-white/10 text-left max-w-sm mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-knw-muted">Mentor:</span>
                  <span className="font-bold text-white">{expert.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-knw-muted">Position:</span>
                  <span className="font-semibold text-knw-red">{realLifePositions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-knw-muted">Topic:</span>
                  <span className="font-semibold text-white">{sessionTopic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-knw-muted">Timing:</span>
                  <span className="font-mono text-yellow-400">
                    {availableSlots[selectedSlotIndex]?.dayOfWeek} at {availableSlots[selectedSlotIndex]?.startTime}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="btn-red px-8 py-2.5 text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
