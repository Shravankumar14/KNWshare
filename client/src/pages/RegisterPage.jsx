import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Mail, Lock, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const RegisterPage = () => {
  const { register, demoLogin } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      addToast('Welcome to InfoNest! Select your goal to begin.', 'success');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="knw-card rounded-3xl p-8 space-y-6 relative overflow-hidden border border-knw-red/30 shadow-red-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-knw-red via-red-500 to-knw-redDark shadow-red" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-knw-red text-white flex items-center justify-center mx-auto shadow-red">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create Your Account</h1>
          <p className="text-xs text-knw-muted">Embark on your personalized learning journey</p>
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
                placeholder="Alex Rivera"
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
                placeholder="alex@university.edu"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-red py-3 rounded-xl text-xs font-bold shadow-red flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-knw-muted pt-2 border-t border-white/5">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-knw-red hover:text-red-400">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
