import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useGoogleLogin } from '@react-oauth/google';

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export const LoginPage = () => {
  const { login, googleLogin, user, isAuthenticated } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Helper to redirect to role-appropriate dashboard
  const handleRoleRedirect = (authenticatedUser) => {
    const role = authenticatedUser?.role;
    const requestedPath = location.state?.from?.pathname || location.state?.from;

    if (requestedPath && typeof requestedPath === 'string') {
      if (role === 'teacher' && (requestedPath.startsWith('/student') || requestedPath === '/dashboard')) {
        navigate('/teacher/dashboard', { replace: true });
        return;
      }
      if (role !== 'teacher' && requestedPath.startsWith('/teacher')) {
        navigate('/dashboard', { replace: true });
        return;
      }
      navigate(requestedPath, { replace: true });
      return;
    }

    if (role === 'teacher') {
      navigate('/teacher/dashboard', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated && user) {
      handleRoleRedirect(user);
    }
  }, [isAuthenticated, user]);

  // Validation on blur
  const handleEmailBlur = () => {
    if (!email) {
      setEmailError('Please enter a valid Gmail address.');
    } else if (!GMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid Gmail address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError('Password is required.');
    } else {
      setPasswordError('');
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    let hasError = false;

    if (!email || !GMAIL_REGEX.test(email)) {
      setEmailError('Please enter a valid Gmail address.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      addToast('Signed in successfully!', 'success');
      handleRoleRedirect(loggedInUser);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth flow
  let triggerGoogleLogin = null;
  try {
    triggerGoogleLogin = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        setGoogleLoading(true);
        setServerError('');
        try {
          // Token response provides access_token or credential
          const loggedInUser = await googleLogin(tokenResponse.credential || tokenResponse.access_token);
          addToast('Signed in with Google!', 'success');
          handleRoleRedirect(loggedInUser);
        } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Google authentication failed.';
          setServerError(msg);
        } finally {
          setGoogleLoading(false);
        }
      },
      onError: () => {
        setServerError('Google Sign-In was cancelled or failed.');
        setGoogleLoading(false);
      },
    });
  } catch (err) {
    // If not within GoogleOAuthProvider in edge cases
    triggerGoogleLogin = () => {
      setServerError('Google OAuth is not configured yet. Please configure VITE_GOOGLE_CLIENT_ID.');
    };
  }

  const handleGoogleClick = () => {
    if (googleLoading || loading) return;
    setServerError('');
    if (triggerGoogleLogin) {
      try {
        triggerGoogleLogin();
      } catch (err) {
        setServerError('Unable to initialize Google Sign-In.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-0 sm:p-4 bg-[#050505]">
      <div className="login-card w-full flex flex-col justify-center">

        {/* Wordmark */}
        <div className="text-center">
          <div className="text-[28px] font-bold text-[#D4AF37] tracking-tight inline-flex items-center gap-2">
            <span className="text-[24px]">❖</span>
            <span>InfoNest</span>
          </div>
          <h1 className="text-white text-[22px] font-semibold mt-3">Welcome back</h1>
          <p className="text-[#888888] text-[14px] mt-1">Sign in to continue your learning journey</p>
        </div>

        {/* Google OAuth Button */}
        <div className="mt-7">
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={googleLoading || loading}
            className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#111111] border border-[#2A2A2A] hover:border-[#D4AF37] hover:bg-[#161616] text-white text-[14px] font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-[#2A2A2A] border-t-[#D4AF37] rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-[#222222]" />
          <span className="absolute bg-[#0D0D0D] px-3 text-[14px] text-[#888888]">or</span>
        </div>

        {/* Server Error Message */}
        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-[#111111] border border-[#E05252]/40 text-[#E05252] text-[14px]">
            {serverError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-white text-[14px] font-medium mb-1.5" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                if (serverError) setServerError('');
              }}
              onBlur={handleEmailBlur}
              placeholder="your@gmail.com"
              className={`w-full min-h-[48px] px-3.5 rounded-xl bg-[#111111] text-white text-[14px] placeholder-[#555555] transition-colors focus:outline-none focus:ring-1 ${
                emailError
                  ? 'border border-[#E05252] focus:border-[#E05252] focus:ring-[#E05252]/30'
                  : 'border border-[#2A2A2A] focus:border-[#D4AF37] focus:ring-[#D4AF37]/30'
              }`}
            />
            {emailError && (
              <p className="text-[#E05252] text-[14px] mt-1.5">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-white text-[14px] font-medium mb-1.5" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                  if (serverError) setServerError('');
                }}
                onBlur={handlePasswordBlur}
                placeholder="••••••••••••"
                className={`w-full min-h-[48px] pl-3.5 pr-12 rounded-xl bg-[#111111] text-white text-[14px] placeholder-[#555555] transition-colors focus:outline-none focus:ring-1 ${
                  passwordError
                    ? 'border border-[#E05252] focus:border-[#E05252] focus:ring-[#E05252]/30'
                    : 'border border-[#2A2A2A] focus:border-[#D4AF37] focus:ring-[#D4AF37]/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-[#888888] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && (
              <p className="text-[#E05252] text-[14px] mt-1.5">{passwordError}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E8C84A] text-[#050505] text-[15px] font-bold flex items-center justify-center transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#050505]/30 border-t-[#050505] rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-right pt-1">
            <button
              type="button"
              onClick={() => alert('Password reset instructions will be sent to your Gmail address.')}
              className="text-[14px] text-[#D4AF37] underline hover:text-[#E8C84A] transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </form>

        {/* Card Footer Divider & Register Link */}
        <div className="border-t border-[#222222] my-6" />

        <div className="text-center text-[14px] text-[#888888]">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-[#D4AF37] hover:text-[#E8C84A] font-semibold transition-colors">
            Create account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
