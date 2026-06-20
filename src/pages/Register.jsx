import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Lock, Mail, Hotel, Check, User, Building, Eye, EyeOff, Loader2, X, ShieldCheck, RotateCcw, ArrowLeft } from 'lucide-react';

// Password rules
const PASSWORD_RULES = [
  { id: 'length',    label: 'At least 8 characters',         test: (p) => p.length >= 8 },
  { id: 'upper',     label: 'One uppercase letter (A–Z)',     test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',     label: 'One lowercase letter (a–z)',     test: (p) => /[a-z]/.test(p) },
  { id: 'number',    label: 'One number (0–9)',               test: (p) => /[0-9]/.test(p) },
  { id: 'special',   label: 'One special character (!@#$…)',  test: (p) => /[!@#$%^&*(),.?":{}|<>_\-\[\]\\;'\/`~+=]/.test(p) },
];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

function usePasswordStrength(password) {
  return useMemo(() => {
    const passed = PASSWORD_RULES.filter(r => r.test(password)).length;
    const score = password.length === 0 ? 0 : passed;
    const label = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][score] || 'Weak';
    const color = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-600', 'bg-green-500'][score] || 'bg-red-500';
    const textColor = ['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-blue-600', 'text-green-500'][score] || 'text-red-500';
    return { score, label, color, textColor, rules: PASSWORD_RULES.map(r => ({ ...r, passed: r.test(password) })) };
  }, [password]);
}

export default function Register({ onAuthSuccess, setCurrentPage }) {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Orlando, FL');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // OTP state
  const [otpStep, setOtpStep] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(600);
  const otpRefs = useRef([]);
  const resendTimerRef = useRef(null);
  const expiryTimerRef = useRef(null);

  const strength = usePasswordStrength(password);
  const isEmailValid = EMAIL_REGEX.test(email);
  const emailError = emailTouched && email && !isEmailValid ? 'Please enter a valid email address.' : '';
  const allRulesPassed = strength.score === 5;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  useEffect(() => {
    return () => {
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
      if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);
    };
  }, []);

  const startOtpTimers = () => {
    setResendCooldown(60);
    if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    resendTimerRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(resendTimerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);

    setOtpExpiry(600);
    if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);
    expiryTimerRef.current = setInterval(() => {
      setOtpExpiry(prev => {
        if (prev <= 1) { clearInterval(expiryTimerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const maskEmail = (em) => {
    if (!em) return '';
    const [user, domain] = em.split('@');
    if (!domain) return em;
    const masked = user.length > 2
      ? user[0] + '•'.repeat(user.length - 2) + user[user.length - 1]
      : user[0] + '•';
    return `${masked}@${domain}`;
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // OTP digit handlers
  const handleOtpChange = (idx, val) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[idx] = digit;
    setOtpDigits(next);
    setOtpError('');
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  // Verify OTP
  const handleOtpVerify = async () => {
    const code = otpDigits.join('');
    if (code.length < 6) { setOtpError('Please enter all 6 digits.'); return; }
    if (otpExpiry === 0) { setOtpError('OTP has expired. Please try again.'); return; }

    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp_token: otpToken, otp_code: code })
      });
      const data = await res.json();
      if (res.ok) {
        await onAuthSuccess(data.token, data.user);
        if (data.user.role === 'recruiter') setCurrentPage('recruiter-dashboard');
        else setCurrentPage('student-dashboard');
      } else {
        setOtpError(data.detail || 'Invalid OTP. Please try again.');
        setOtpDigits(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch {
      setOtpError('Connection error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP — re-login with the same credentials to trigger new OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: email, password })
      });
      const data = await res.json();
      if (res.ok && data.requires_otp) {
        setOtpToken(data.otp_token);
        setOtpDigits(['', '', '', '', '', '']);
        startOtpTimers();
        otpRefs.current[0]?.focus();
      } else {
        setOtpError('Could not resend OTP. Please go back and try again.');
      }
    } catch {
      setOtpError('Connection error.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!email || !password || !confirmPassword || (role === 'student' && !name) || (role === 'recruiter' && !company)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isEmailValid) { setError('Please enter a valid Gmail address ending in @gmail.com.'); return; }
    if (phone && phone.length !== 10) { setError('Please enter a valid 10-digit phone number.'); return; }
    if (!allRulesPassed) { setError('Your password does not meet all security requirements.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');

    const body = {
      email,
      phone: phone ? '91' + phone : undefined,
      password,
      role,
      name: role === 'student' ? name : undefined,
      companyName: role === 'recruiter' ? company : undefined,
      location: role === 'recruiter' ? location : undefined
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (res.ok) {
        if (data.requires_otp) {
          // Show OTP screen — OTP was sent to the user's email
          setOtpToken(data.otp_token);
          setOtpEmail(data.email || email);
          setOtpStep(true);
          startOtpTimers();
          setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } else if (data.token) {
          // Fallback: direct login (shouldn't happen now)
          await onAuthSuccess(data.token, data.user);
          if (data.user.role === 'recruiter') setCurrentPage('recruiter-dashboard');
          else setCurrentPage('student-dashboard');
        }
      } else {
        setError(data.detail || data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error registering your account.');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP SCREEN ──────────────────────────────────────────────────────────────
  if (otpStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/10">
            <div className="h-1.5 w-full bg-gradient-to-r from-green-500 via-blue-600 to-amber-500" />
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-16 w-16 rounded-2xl bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/50 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Verify Your Email</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Account created! We sent a 6-digit code to
                  </p>
                  <p className="text-sm font-semibold text-blue-700 dark:text-amber-400 mt-0.5">
                    {maskEmail(otpEmail)}
                  </p>
                </div>
              </div>

              {otpError && (
                <div className="p-3 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50 text-center">
                  {otpError}
                </div>
              )}

              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => (otpRefs.current[idx] = el)}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                      ${digit
                        ? 'border-blue-600 bg-blue-50 text-blue-800 dark:border-amber-500 dark:bg-amber-950/20 dark:text-amber-300'
                        : 'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                      }
                      focus:border-blue-700 focus:ring-2 focus:ring-blue-200 dark:focus:border-amber-500 dark:focus:ring-amber-900/30`}
                  />
                ))}
              </div>

              <div className="text-center text-xs">
                {otpExpiry > 0 ? (
                  <span className="text-slate-500 dark:text-slate-400">
                    Code expires in{' '}
                    <span className={`font-bold ${otpExpiry < 60 ? 'text-red-500' : 'text-blue-700 dark:text-amber-400'}`}>
                      {formatTime(otpExpiry)}
                    </span>
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">Code has expired. Please resend.</span>
                )}
              </div>

              <button
                onClick={handleOtpVerify}
                disabled={otpLoading || otpDigits.join('').length < 6 || otpExpiry === 0}
                className="w-full rounded-xl bg-blue-800 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {otpLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /><span>Verifying...</span></>
                ) : (
                  <><ShieldCheck className="h-4 w-4" /><span>Verify & Continue</span></>
                )}
              </button>

              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => { setOtpStep(false); setOtpDigits(['', '', '', '', '', '']); setOtpError(''); }}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /><span>Back</span>
                </button>
                <button
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || otpLoading}
                  className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                    resendCooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-blue-700 hover:text-blue-600 dark:text-amber-400 dark:hover:text-amber-300'
                  }`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-800 text-amber-500">
              <Hotel className="h-4 w-4" />
            </div>
            <span className="font-bold text-white text-sm">Hospi<span className="text-amber-500">Hire</span></span>
          </div>
        </div>
      </div>
    );
  }

  // ── REGISTER FORM ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-stretch bg-white dark:bg-slate-950 transition-colors duration-300 relative">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" alt="Luxury Hospitality" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-blue-950/40"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-slate-900 font-bold"><Hotel className="h-5 w-5" /></div>
            <span className="font-display text-lg font-bold tracking-tight text-white">Hospi<span className="text-amber-500">Hire</span></span>
          </div>
        </div>
        <div className="relative z-10 my-auto max-w-md">
          <span className="text-amber-500 font-semibold text-xs uppercase tracking-widest">Join HospiHire</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight mt-3">Accelerate Your Hospitality Recruitment Journey</h2>
          <p className="text-slate-300 mt-4 text-sm leading-relaxed">Create an account today. Whether you are a student launching your hotel career or a recruiter hiring for luxury brands, HospiHire is built for you.</p>
          <div className="flex flex-col gap-3.5 mt-8 text-sm">
            {['Direct pipeline from academic institutes to hiring managers', 'Structured profile formats showing training, certificates, and languages', 'Real-time application alerts and interview organizer'].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className="h-5 w-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 flex-shrink-0"><Check className="h-3.5 w-3.5" /></div>
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-slate-500">&copy; {new Date().getFullYear()} HospiHire. All rights reserved.</div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 pt-20 lg:pt-12 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col gap-5">

          <div className="flex lg:hidden items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-800 text-amber-500"><Hotel className="h-4 w-4" /></div>
            <span className="font-bold text-slate-900 dark:text-white">Hospi<span className="text-amber-500">Hire</span></span>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-extrabold text-slate-950 dark:text-white">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Select your role and enter your details to launch your custom dashboard portal.</p>
          </div>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800">
            {[
              { value: 'student', icon: User, label: 'Student / Candidate' },
              { value: 'recruiter', icon: Building, label: 'Hotel / Recruiter' }
            ].map(({ value, icon: Icon, label }) => (
              <button key={value} type="button" disabled={loading}
                onClick={() => { setRole(value); setError(''); }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  role === value ? 'bg-white text-blue-800 shadow dark:bg-slate-850 dark:text-amber-500' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}>
                <Icon className="h-4 w-4" /><span>{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50">{error}</div>
            )}

            {role === 'student' ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullname" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" id="fullname" required value={name}
                    onChange={e => { setName(e.target.value); setError(''); }}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" id="company" required value={company}
                      onChange={e => { setCompany(e.target.value); setError(''); }}
                      placeholder="e.g. Marriott International / Hilton"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="location" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">HQ Location</label>
                  <input type="text" id="location" required value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Orlando, FL"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="email" id="email" required value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="name@hotel.edu"
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white dark:bg-slate-950 dark:text-white transition-colors ${
                      emailError ? 'border-red-400 focus:border-red-500 dark:border-red-700'
                      : emailTouched && email && isEmailValid ? 'border-green-500 focus:border-green-500 dark:border-green-600'
                      : 'border-slate-200 focus:border-blue-800 dark:border-slate-800 dark:focus:border-amber-500'
                    }`} />
                  {emailTouched && email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isEmailValid ? <Check className="h-3.5 w-3.5 text-green-500" /> : <X className="h-3.5 w-3.5 text-red-500" />}
                    </div>
                  )}
                </div>
                {emailError && <p className="text-[10px] text-red-500 mt-0.5">{emailError}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Phone (Optional)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-500 dark:text-slate-400 select-none">+91</span>
                  <input type="text" id="phone" value={phone}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(val);
                      setError('');
                    }}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} id="password" required value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordTouched(true); setError(''); }}
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordTouched && password && (
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                  <div className={`text-[10px] font-semibold ${strength.textColor}`}>{strength.label}</div>
                  <div className="grid grid-cols-1 gap-1">
                    {strength.rules.map(rule => (
                      <div key={rule.id} className={`flex items-center gap-1.5 text-[10px] transition-colors ${rule.passed ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        {rule.passed ? <Check className="h-3 w-3 flex-shrink-0" /> : <div className="h-3 w-3 flex-shrink-0 rounded-full border border-slate-300 dark:border-slate-600" />}
                        <span>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" required value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Re-enter your password"
                  className={`w-full rounded-xl border bg-slate-50 pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white dark:bg-slate-950 dark:text-white transition-colors ${
                    confirmPassword && password !== confirmPassword ? 'border-red-400 focus:border-red-500 dark:border-red-700'
                    : confirmPassword && passwordsMatch ? 'border-green-500 focus:border-green-500 dark:border-green-600'
                    : 'border-slate-200 focus:border-blue-800 dark:border-slate-800 dark:focus:border-amber-500'
                  }`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && <p className="text-[10px] text-red-500 mt-0.5">Passwords do not match.</p>}
              {passwordsMatch && <p className="text-[10px] text-green-500 mt-0.5 flex items-center gap-1"><Check className="h-3 w-3" /> Passwords match</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-blue-800 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 transition-all shadow-md mt-1 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50">
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /><span>Registering...</span></>) : (<span>Sign Up</span>)}
            </button>
          </form>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <button onClick={() => setCurrentPage('login')} className="font-semibold text-blue-800 hover:text-blue-700 dark:text-amber-500 dark:hover:text-amber-400 cursor-pointer">Log In</button>
          </div>
        </div>
      </div>
    </div>
  );
}
