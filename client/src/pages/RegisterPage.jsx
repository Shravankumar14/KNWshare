import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Mail, Lock, ArrowRight, AlertCircle, Zap, Sparkles, GraduationCap, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [role, setRole] = useState('student'); // 'student' | 'teacher'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [selectedSubjects, setSelectedSubjects] = useState(['Physics']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSubject = (sub) => {
    setSelectedSubjects(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const extra = role === 'teacher' ? {
        role: 'teacher',
        qualification,
        experienceYears,
        subjects: selectedSubjects,
      } : { role: 'student' };

      await register(name, email, password, extra);
      if (role === 'teacher') {
        addToast('Teacher account created! Welcome to your Faculty Workspace.', 'success');
        navigate('/teacher/dashboard');
      } else {
        addToast('Welcome to InfoNest! Select your goal to begin.', 'success');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <div className="knw-card rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-knw-red/30 shadow-red-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-knw-redBright to-knw-redDark shadow-red" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-knw-red text-white flex items-center justify-center mx-auto shadow-red">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create Your Account</h1>
          <p className="text-xs text-knw-muted">Join InfoNest as an ambitious student or academic faculty mentor</p>
        </div>

        {/* Account Role Selector */}
        <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'student'
                ? 'bg-knw-red text-white shadow-red'
                : 'text-knw-muted hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>I am a Student</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'teacher'
                ? 'bg-knw-red text-white shadow-red'
                : 'text-knw-muted hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>I am a Teacher / Mentor</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-700/50 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-knw-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'teacher' ? 'Dr. Priya Sharma' : 'John Doe'}
                className="w-full bg-knw-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-knw-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'teacher' ? 'mentor@infonest.dev' : 'student@university.edu'}
                className="w-full bg-knw-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-knw-muted mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-knw-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-knw-surface border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
              />
            </div>
          </div>

          {/* Conditional Teacher Fields */}
          {role === 'teacher' && (
            <div className="p-4 rounded-2xl bg-white/5 border border-knw-red/20 space-y-3.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-knw-red font-bold block flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Faculty Mentor Profile Details
              </span>

              <div>
                <label className="block text-[11px] font-mono text-zinc-300 mb-1">
                  Highest Qualification / Institute
                </label>
                <input
                  type="text"
                  required={role === 'teacher'}
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="M.Tech (IIT Kanpur), Ph.D, B.Tech"
                  className="w-full bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-knw-subtle focus:outline-none focus:border-knw-red"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-300 mb-1">
                  Mentoring Experience (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  required={role === 'teacher'}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full bg-knw-surface border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-knw-red"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-300 mb-1.5">
                  Subjects Taught:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Physics', 'Chemistry', 'Mathematics', 'Computer Science'].map((sub) => {
                    const active = selectedSubjects.includes(sub);
                    return (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => toggleSubject(sub)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-knw-red border-knw-red text-white'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                        }`}
                      >
                        {sub} {active && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-red py-3 rounded-xl text-xs font-bold shadow-red flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Creating Account...' : `Get Started as ${role === 'teacher' ? 'Faculty Mentor' : 'Student'}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-knw-muted pt-2 border-t border-white/5">
          <span>Already have an account? </span>
          <Link to="/" className="font-bold text-knw-red hover:text-knw-redBright">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
