import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { metaApi } from '../api/client';
import {
  Mail,
  Lock,
  KeyRound,
  MapPin,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, register } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');

  // Dropdown data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Flow & status states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Load States
  useEffect(() => {
    metaApi.getStates().then((res) => setStates(res.data.data || [])).catch(() => {});
  }, []);

  // Load Cities when State changes
  useEffect(() => {
    if (stateId) {
      metaApi.getCities(stateId)
        .then((res) => setCities(res.data.data || []))
        .catch(() => setCities([]));
    } else {
      setCities([]);
      setCityId('');
    }
  }, [stateId]);

  // OTP Cooldown Timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOtp = async () => {
    setError(null);
    setMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSendingOtp(true);
    try {
      await sendOtp(email.trim(), 'REGISTRATION');
      setOtpSent(true);
      setCooldown(60);
      setMessage(`OTP sent to ${email.trim()}. Valid for 5 minutes.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setMessage(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setVerifyingOtp(true);
    try {
      await verifyOtp(email.trim(), otp.trim(), 'REGISTRATION');
      setOtpVerified(true);
      setMessage('OTP verified successfully! Now complete your password and location.');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!otpVerified) {
      setError('Please verify your email with OTP first.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!stateId || !cityId) {
      setError('Please select your State and City.');
      return;
    }

    setRegistering(true);
    try {
      await register({
        email: email.trim(),
        otp: otp.trim(),
        password,
        confirmPassword,
        stateId: Number(stateId),
        cityId: Number(cityId),
      });

      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF9933] via-white to-[#138808] p-0.5 shadow-sm">
            <div className="w-full h-full bg-slate-900 rounded-[9px] flex items-center justify-center">
              <span className="text-white font-black text-xl">M</span>
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            Mera<span className="text-[#FF9933]">Mahan</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Join India's citizen reporting community
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleRegister}>
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* Email + Send OTP button */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled={otpVerified}
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white disabled:opacity-60"
                  />
                </div>
                {!otpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || cooldown > 0}
                    className="px-3.5 py-2.5 bg-[#FF9933] hover:bg-[#e67e1a] text-white text-xs font-bold rounded-xl shrink-0 transition-colors disabled:opacity-50"
                  >
                    {sendingOtp ? 'Sending...' : cooldown > 0 ? `${cooldown}s` : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {/* OTP Verification Input */}
            {otpSent && !otpVerified && (
              <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Enter 6-digit OTP
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || otp.length !== 6}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 shrink-0"
                  >
                    {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </div>
            )}

            {/* Password Fields (Enabled once OTP verified or visible) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white"
                />
              </div>
            </div>

            {/* State & City (Manual selection as required) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <select
                  value={stateId}
                  onChange={(e) => setStateId(e.target.value)}
                  required
                  className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="">Select State ▼</option>
                  {states.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <select
                  value={cityId}
                  disabled={!stateId}
                  onChange={(e) => setCityId(e.target.value)}
                  required
                  className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50"
                >
                  <option value="">{stateId ? 'Select City ▼' : 'Select State'}</option>
                  {cities.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={registering || !otpVerified}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase shadow-sm transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {registering ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#FF9933] hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
