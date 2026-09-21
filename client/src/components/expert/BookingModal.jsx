import React, { useState } from 'react';
import { X, Calendar, Clock, Video, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const BookingModal = ({ expert, isOpen, onClose, goalId }) => {
  const { isAuthenticated, demoLogin } = useAuth();
  const { addToast } = useNotification();

  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen || !expert) return null;

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isAuthenticated) {
        await demoLogin();
      }

      const slot = expert.availableSlots[selectedSlotIndex] || {
        dayOfWeek: 'Saturday',
        startTime: '10:00 AM',
        endTime: '10:45 AM'
      };

      const sessionDate = new Date();
      sessionDate.setDate(sessionDate.getDate() + 3); // Scheduled 3 days from now
      const sessionDateStr = sessionDate.toISOString().split('T')[0];

      const res = await api.post('/experts/book', {
        expertId: expert._id,
        goalId,
        sessionDate: sessionDateStr,
        dayOfWeek: slot.dayOfWeek,
        timeSlot: `${slot.startTime} - ${slot.endTime}`,
        studentQuestion: question,
      });

      setConfirmedBooking(res.data.data);
      addToast(`Mentorship session confirmed with ${expert.name}!`, 'success');
    } catch (err) {
      alert(err.message || 'Failed to book session');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-brand-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">1-on-1 Guidance Session</h2>
              <p className="text-xs text-brand-100">Mentorship with {expert.name}</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed State Screen */}
        {confirmedBooking ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Session Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Your one-to-one mentorship call with <strong>{expert.name}</strong> is locked in.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-bold text-slate-800">{confirmedBooking.sessionDate} ({confirmedBooking.dayOfWeek})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time:</span>
                <span className="font-bold text-slate-800">{confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500">Video Room:</span>
                <a
                  href={confirmedBooking.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                >
                  <span>Open Video Room</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl text-xs hover:bg-brand-700 transition-colors shadow-md"
            >
              Done & Return to Roadmap
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleBooking} className="p-6 space-y-5">
            {/* Slot Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-600" />
                Select an Available Time Slot
              </label>

              <div className="space-y-2">
                {expert.availableSlots && expert.availableSlots.length > 0 ? (
                  expert.availableSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSlotIndex(idx)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selectedSlotIndex === idx
                          ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500/20 text-brand-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs">{slot.dayOfWeek}</span>
                        <span className="text-xs font-normal text-slate-500">({slot.startTime} – {slot.endTime})</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        Available
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No open slots available this week.</p>
                )}
              </div>
            </div>

            {/* Question / Focus Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                What do you want to focus on during this session?
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g., Code review of my full-stack app, overcoming a roadblock in Redux/MongoDB, interview prep advice..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2.5">
              <Video className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Includes HD video conferencing link + notes integration.</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Confirming...' : 'Confirm Mentorship Booking'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
