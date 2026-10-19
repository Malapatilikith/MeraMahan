import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, KeyRound, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sendOtp, verifyOtp } = useAuth();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'REGISTRATION');
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendOtp = async () => {
    if (!email) {
      setError('Please provide your email address first.');
      return;
    }
    setError(null);
    setSending(true);
    try {
      await sendOtp(email, purpose);
      setSuccess('A new 6-digit verification code has been dispatched to your email.');
      setCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch verification code. Please retry.');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      setError('Please enter both your email address and the 6-digit OTP.');
      return;
    }
    if (otp.length !== 6) {
      setError('Verification code must be exactly 6 digits.');
      return;
    }

    setError(null);
    setVerifying(true);
    try {
      await verifyOtp(email, otp, purpose);
      setSuccess('Verification successful! Proceeding...');
      setTimeout(() => {
        if (purpose === 'PASSWORD_RESET') {
          navigate(`/forgot-password?verified=true&email=${encodeURIComponent(email)}&otp=${otp}`);
        } else {
          navigate(`/register?verified=true&email=${encodeURIComponent(email)}`);
        }
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please request a new code.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-[#138808] border border-emerald-100 mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Verify Email OTP
          </h2>
          <p className="text-xs text-slate-500">
            Enter the 6-digit verification code dispatched to your registered email
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#138808]" />
            <p className="leading-relaxed font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.in"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#138808] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                6-Digit Verification Code
              </label>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={sending || cooldown > 0 || !email}
                className="text-xs font-medium text-[#138808] hover:underline disabled:text-slate-400 disabled:no-underline"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : sending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full pl-9 pr-3 py-2 text-sm tracking-widest font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#138808] focus:border-transparent text-center text-base"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Check your inbox and spam folder. Code expires in 5 minutes.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Verification Purpose
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#138808]"
            >
              <option value="REGISTRATION">Citizen Registration</option>
              <option value="PASSWORD_RESET">Password Recovery</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={verifying || otp.length !== 6}
            className="w-full py-2.5 px-4 rounded-lg bg-[#138808] text-white text-sm font-semibold hover:bg-[#0f6b06] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#138808] disabled:opacity-50 disabled:cursor-not-allowed shadow transition flex items-center justify-center gap-2"
          >
            {verifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Confirm Verification</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link to="/login" className="hover:text-slate-800 transition">
            Back to Login
          </Link>
          <Link to="/register" className="hover:text-slate-800 transition">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
