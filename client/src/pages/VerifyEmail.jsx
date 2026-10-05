import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { verifyEmailApi } from '../services/api';

export const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      if (!token) {
        if (isMounted) {
          setStatus('error');
          setMessage('No verification token provided.');
        }
        return;
      }

      try {
        const res = await verifyEmailApi(token);
        if (isMounted) {
          setStatus('success');
          setMessage(res.data?.message || 'Email verified successfully. You can now log in.');
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          const errMsg =
            err.response?.data?.message ||
            err.data?.message ||
            err.message ||
            'Invalid or expired verification token.';
          setMessage(errMsg);
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 bg-[#050505]">
      <div className="max-w-md w-full knw-card rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-white/10 shadow-2xl text-center">
        {/* Wordmark */}
        <div className="text-center">
          <div className="text-[26px] font-bold text-[#D4AF37] tracking-tight inline-flex items-center gap-2">
            <span className="text-[22px]">❖</span>
            <span>InfoNest</span>
          </div>
        </div>

        {status === 'loading' && (
          <div className="py-8 space-y-4">
            <div className="w-12 h-12 border-3 border-[#2A2A2A] border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-white">Verifying your email...</h2>
            <p className="text-xs text-[#888888]">Please wait while we confirm your account credentials.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Email Verified Successfully!</h2>
              <p className="text-sm text-zinc-300">
                {message || 'Your email address has been verified. Your InfoNest account is now active.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E8C84A] text-[#050505] text-[14px] font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-950/40 text-red-400 border border-red-700/50 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Verification Failed</h2>
              <p className="text-sm text-red-300">
                {message || 'This verification link is invalid or has expired.'}
              </p>
              <p className="text-xs text-[#888888] pt-1">
                You can request a new verification link from the Sign In page.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="w-full min-h-[46px] px-4 py-3 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#2A2A2A] hover:border-[#D4AF37] text-white text-[14px] font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
