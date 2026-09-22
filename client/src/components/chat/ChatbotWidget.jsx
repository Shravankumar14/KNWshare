import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  MessageCircle,
  Bot,
  User,
  ChevronDown,
  Minimize2,
  RotateCcw,
  Compass,
  Calendar,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useGoal } from '../../context/GoalContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PRESET_PROMPTS = [
  'How should I start JEE Physics?',
  'Generate my study timetable',
  'How do I book a teacher slot?',
  'NCERT vs reference books for Chemistry?'
];

export const ChatbotWidget = () => {
  const { activeGoal } = useGoal();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am your **InfoNest Academic Assistant**. Ask me about JEE strategy, Physics starting topics, timetable generation, or booking verified educators!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const endpoint = isAuthenticated ? '/ai/chat' : '/chat';
      const res = await api.post(endpoint, {
        message: text,
        history: messages.slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        conversationId: 'student-assistant-session'
      });

      const botReply = res.data?.data?.reply || 'I am here to help you navigate KNWshare and master your learning goals!';

      setMessages(prev => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('Chat error:', err.message);
      setMessages(prev => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'bot',
          text: 'I can help you navigate the platform! Open **Roadmap** to explore topics, **Timetable** to generate a balanced schedule, or **1-on-1 Mentors** to book a session.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-red px-5 py-3 rounded-full shadow-red-lg flex items-center gap-2.5 text-xs sm:text-sm font-bold tracking-wide group transition-all duration-300 hover:scale-105 active:scale-95"
          title="Ask InfoNest Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <span>Ask InfoNest</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
        </button>
      )}

      {/* Expanded Modern Chat Panel */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] knw-glass rounded-3xl border border-knw-red/40 shadow-red-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="px-5 py-4 bg-black/60 border-b border-white/10 flex items-center justify-between relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-knw-redBright to-knw-redDark shadow-red" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-knw-red/20 border border-knw-red/40 flex items-center justify-center text-knw-red shadow-red">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>InfoNest Assistant</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-700/50">
                    Live
                  </span>
                </h3>
                <p className="text-[10px] text-knw-muted font-mono">Academic guidance & navigation</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([{
                  id: 'reset',
                  sender: 'bot',
                  text: 'Chat history cleared. What can I help you with?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }])}
                className="p-1.5 rounded-lg text-knw-muted hover:text-white hover:bg-white/5 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-knw-muted hover:text-white hover:bg-white/5 transition-colors"
                title="Close chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs leading-relaxed">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-knw-red/20 border border-knw-red/30 flex items-center justify-center text-knw-red shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-tr from-knw-red to-knw-redDark text-white rounded-tr-none shadow-red'
                      : 'bg-knw-surface border border-white/10 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="text-[9px] text-white/50 block text-right mt-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-knw-muted">
                <div className="w-7 h-7 rounded-lg bg-knw-red/20 flex items-center justify-center text-knw-red shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-knw-surface border border-white/10 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-knw-red animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-knw-red animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-knw-red animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full bg-knw-surface border border-white/10 text-[10px] text-knw-muted hover:text-white hover:border-knw-red/40 whitespace-nowrap font-mono transition-all shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-black/80 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about JEE, syllabus, timetable..."
              className="flex-1 bg-knw-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-red p-2.5 rounded-xl text-white shadow-red disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
