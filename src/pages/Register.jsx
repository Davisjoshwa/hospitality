import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Lock, Mail, Hotel, Check, User, Building, Eye, EyeOff, Loader2, X, ShieldCheck, RotateCcw, ArrowLeft, MapPin, Briefcase, Plus } from 'lucide-react';
import { HM_COLLEGES_INDIA } from '../data/hmColleges';
import { INDIAN_LOCATIONS } from '../data/locations';

const INTERESTS_OPTIONS = [
  'Cooking',
  'Baking',
  'Traveling',
  'Photography',
  'Event Planning',
  'Coffee & Beverages',
  'Mixology / Bartending',
  'Customer Service',
  'Tourism & Culture',
  'Content Creation',
  'Team Leadership',
  'Hotel & Resort Management'
];

// Password rules
const PASSWORD_RULES = [
  { id: 'length',    label: 'At least 6 characters',         test: (p) => p.length >= 6 },
  { id: 'upper',     label: 'One uppercase letter (A–Z)',     test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',     label: 'One lowercase letter (a–z)',     test: (p) => /[a-z]/.test(p) },
  { id: 'number',    label: 'One number (0–9)',               test: (p) => /[0-9]/.test(p) },
  { id: 'special',   label: 'One special character (!@#$…)',  test: (p) => /[!@#$%^&*(),.?":{}|<>_\-\[\]\\;'\/`~+=]/.test(p) },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const YEAR_OPTIONS = Array.from({ length: 2040 - 1935 + 1 }, (_, i) => 2040 - i);

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

export default function Register({ onAuthSuccess, setCurrentPage, defaultRole = 'student' }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(defaultRole);
  const [isStudentCandidate, setIsStudentCandidate] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [showSchoolSuggestions, setShowSchoolSuggestions] = useState(false);
  const [isFetchingSchool, setIsFetchingSchool] = useState(false);
  const [school, setSchool] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [ageOver16, setAgeOver16] = useState(false);
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
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [otherInterest, setOtherInterest] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

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

  // Local filter for locations
  useEffect(() => {
    if (location.length < 1) {
      setLocationSuggestions([]);
      return;
    }
    const q = location.toLowerCase();
    const localMatches = INDIAN_LOCATIONS.filter(l => l.toLowerCase().includes(q)).slice(0, 15);
    setLocationSuggestions(localMatches);
  }, [location]);

  // Local filter for schools/colleges
  useEffect(() => {
    if (school.length < 1) {
      setSchoolSuggestions([]);
      return;
    }
    const q = school.toLowerCase();
    const localMatches = HM_COLLEGES_INDIA.filter(c => c.toLowerCase().includes(q)).slice(0, 15);
    setSchoolSuggestions(localMatches);
  }, [school]);

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
        await onAuthSuccess(data.token, data.user, 'profile');
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

  const handleQuickSimulation = (simRole) => {
    setLoading(true);
    let mockUser;
    if (simRole === 'student') {
      mockUser = {
        id: 'mock-student-id',
        name: 'Alex Mercer',
        email: 'student@cornell.edu',
        phone: '+1 (555) 019-2834',
        role: 'student',
        education: 'B.Sc. in Hotel Management, Cornell University',
        eduGradYear: '2026',
        skills: ['Front Office Operations', 'Opera PMS', 'Guest Relations', 'Fluent in French'],
        internships: [
          { role: 'Front Desk Intern', company: 'Hilton Orlando', duration: '6 Months (2025)', desc: 'Assisted with guest registration, managed keycard distribution, resolved billing inquiries via Opera PMS, and maintained guest service logs.' }
        ],
        certificates: ['ServSafe Manager', 'AHLEI Certified Front Desk Representative'],
        resumeName: 'Alex_Mercer_Resume.pdf'
      };
    } else if (simRole === 'recruiter') {
      mockUser = {
        id: 'mock-recruiter-id',
        name: 'Marriott Recruiter',
        email: 'recruiter@marriott.com',
        phone: '+1 (555) 048-9321',
        role: 'recruiter',
        company: 'Marriott International',
        location: 'Orlando, FL'
      };
    } else {
      mockUser = {
        id: 'mock-admin-id',
        name: 'System Admin',
        email: 'admin@hospihire.com',
        role: 'admin'
      };
    }
    const mockToken = 'mock-jwt-token-hospihire-simulation';
    localStorage.setItem('hospihire_token', mockToken);
    localStorage.setItem('hospihire_user', JSON.stringify(mockUser));
    setTimeout(() => {
      onAuthSuccess(mockToken, mockUser, 'profile');
    }, 600);
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

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      setEmailTouched(true);
      setPasswordTouched(true);
      if (!email || !password || !confirmPassword) {
        setError('Please fill in all required fields.');
        return;
      }
      if (!isEmailValid) { setError('Please enter a valid email address.'); return; }
      if (phone && phone.length !== 10) { setError('Please enter a valid 10-digit phone number.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
      setStep(2);
    } else if (step === 2) {
      if (!firstName || !lastName) {
        setError('First Name and Last Name are required.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!location) {
        setError('Please add your location.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (role === 'student') {
        if (isStudentCandidate) {
          if (!school || !startYear || !endYear) {
            setError('Please fill in all school details.');
            return;
          }
          if (parseInt(startYear) > parseInt(endYear)) {
            setError('Start year cannot be greater than passout year.');
            return;
          }
          if (!ageOver16) {
            setError('You must be over 16 years old to register.');
            return;
          }
        } else {
          if (!jobTitle) {
            setError('Job Title is required.');
            return;
          }
        }
      } else if (role === 'recruiter') {
        if (!company || !jobTitle) {
          setError('Company Name and Job Title are required.');
          return;
        }
      }
      setStep(5);
    }
  };

  const handleAddCustomInterest = () => {
    if (selectedInterests.length >= 3) {
      setError('You can select a maximum of 3 interests.');
      return;
    }
    const val = otherInterest.trim();
    if (!val) return;
    if (selectedInterests.includes(val)) {
      setOtherInterest('');
      return;
    }
    setError('');
    setSelectedInterests([...selectedInterests, val]);
    setOtherInterest('');
  };

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
      setError('');
    } else {
      if (selectedInterests.length >= 3) {
        setError('You can select a maximum of 3 interests.');
        return;
      }
      setError('');
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  // Submit registration form on final step
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 5) {
      if (selectedInterests.length === 0) {
        setError('Please select at least 1 interest.');
        return;
      }
      if (selectedInterests.length > 3) {
        setError('You can select a maximum of 3 interests.');
        return;
      }
    }

    const combinedName = [firstName, middleName, lastName].filter(Boolean).join(' ');

    if (role === 'student') {
      if (isStudentCandidate) {
        if (!school || !startYear || !endYear) {
          setError('Please fill in all school details.');
          return;
        }
        if (parseInt(startYear) > parseInt(endYear)) {
          setError('Start year cannot be greater than passout year.');
          return;
        }
        if (!ageOver16) {
          setError('You must be over 16 years old to register.');
          return;
        }
      } else {
        if (!jobTitle) {
          setError('Job Title is required.');
          return;
        }
      }
    } else if (role === 'recruiter') {
      if (!company || !jobTitle) {
        setError('Company Name and Job Title are required.');
        return;
      }
    }

    setLoading(true);

    const body = {
      email,
      phone: phone ? '91' + phone : undefined,
      password,
      role,
      name: role === 'student' ? combinedName : undefined,
      companyName: role === 'recruiter' ? company : undefined,
      location,
      school: role === 'student' && isStudentCandidate ? school : undefined,
      start_year: role === 'student' && isStudentCandidate ? parseInt(startYear) : undefined,
      end_year: role === 'student' && isStudentCandidate ? parseInt(endYear) : undefined,
      age_over_16: role === 'student' && isStudentCandidate ? ageOver16 : undefined,
      job_title: role === 'recruiter' ? jobTitle : (role === 'student' && !isStudentCandidate ? jobTitle : undefined),
      interests: selectedInterests.join(', ')
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

          {step === 1 && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800">
              {[
                { value: 'student', icon: User, label: 'Candidate' },
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
          )}

          {/* Stepper Indicator */}
          {step > 1 && (
            <div className="flex items-center justify-between gap-2 mb-2">
               {[1,2,3,4,5].map(s => (
                  <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-blue-800 dark:bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
               ))}
            </div>
          )}

          <form onSubmit={step === 5 ? handleFinalSubmit : handleNextStep} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50">{error}</div>
            )}

            {/* STEP 1: Account Details */}
            {step === 1 && (
              <>
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
                  <label htmlFor="phone" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Phone Number (Optional)</label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 focus-within:border-blue-800 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-amber-500 transition-colors">
                    <div className="flex items-center justify-center px-3 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                      +91
                    </div>
                    <input type="text" id="phone" value={phone.replace(/^\+?91\s*/, '')}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').substring(0, 10);
                        setPhone(val);
                        setError('');
                      }}
                      placeholder="xxxxxxxxx"
                      className="flex-1 bg-transparent px-3 py-2.5 text-xs text-slate-900 focus:outline-none dark:text-white" />
                  </div>
                </div>

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
                    </div>
                  )}
                </div>

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
              </>
            )}

            {/* STEP 2: Name */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="firstName" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" id="firstName" required value={firstName}
                      onChange={e => { setFirstName(e.target.value); setError(''); }}
                      placeholder="John"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="middleName" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Middle Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" id="middleName" value={middleName}
                      onChange={e => { setMiddleName(e.target.value); setError(''); }}
                      placeholder="M."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="lastName" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" id="lastName" required value={lastName}
                      onChange={e => { setLastName(e.target.value); setError(''); }}
                      placeholder="Doe"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Location */}
            {step === 3 && (
              <div className="flex flex-col gap-2 relative">
                <label htmlFor="location" className="text-sm font-semibold text-slate-800 dark:text-slate-200">Add your location</label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">This helps us recommend people, jobs in your area.</p>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" id="location" required value={location}
                    onChange={e => { setLocation(e.target.value); setError(''); setShowLocationSuggestions(true); }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors" />
                  {isFetchingLocation && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    </div>
                  )}
                </div>
                {showLocationSuggestions && location && (
                  <ul className="absolute z-10 w-full top-[100%] mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg">
                    {locationSuggestions.map((place, idx) => (
                      <li key={idx} 
                          onMouseDown={(e) => { e.preventDefault(); setLocation(place); setShowLocationSuggestions(false); }}
                          className="px-4 py-2 text-[11px] leading-tight text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                        {place}
                      </li>
                    ))}
                    {!isFetchingLocation && locationSuggestions.length === 0 && location.length >= 1 && (
                        <li className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 italic text-center">No matching places found.</li>
                    )}
                  </ul>
                )}
              </div>
            )}

            {/* STEP 4: Role Specific */}
            {step === 4 && role === 'student' && (
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 pb-2 -mr-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">I'm a student</span>
                  <button type="button" onClick={() => setIsStudentCandidate(!isStudentCandidate)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isStudentCandidate ? 'bg-blue-800 dark:bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isStudentCandidate ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                {isStudentCandidate ? (
                  <>
                    <div className="flex flex-col gap-1.5 relative">
                      <label htmlFor="school" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">School, college or university*</label>
                      <input type="text" id="school" required value={school}
                        onChange={e => { setSchool(e.target.value); setError(''); setShowSchoolSuggestions(true); }}
                        onFocus={() => setShowSchoolSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSchoolSuggestions(false), 200)}
                        placeholder="Ex: IHM Mumbai"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors" />
                      
                      {isFetchingSchool && (
                        <div className="absolute right-3 top-9">
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        </div>
                      )}
                      {showSchoolSuggestions && school && (
                        <ul className="absolute z-10 w-full top-[100%] mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg">
                          {schoolSuggestions.map((place, idx) => (
                            <li key={idx} 
                                onMouseDown={(e) => { e.preventDefault(); setSchool(place); setShowSchoolSuggestions(false); }}
                                className="px-4 py-2 text-[11px] leading-tight text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                              {place}
                            </li>
                          ))}
                          {!isFetchingSchool && schoolSuggestions.length === 0 && school.length >= 1 && (
                              <li className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 italic text-center">No matching colleges found.</li>
                          )}
                        </ul>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <label htmlFor="startYear" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Start Year*</label>
                        <select id="startYear" required value={startYear}
                          onChange={e => { setStartYear(e.target.value); setError(''); }}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors cursor-pointer appearance-none">
                          <option value="" disabled>Select Year</option>
                          {YEAR_OPTIONS.map(yr => (
                            <option key={yr} value={yr}>{yr}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 flex-1">
                        <label htmlFor="endYear" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Passout Year*</label>
                        <select id="endYear" required value={endYear}
                          onChange={e => { setEndYear(e.target.value); setError(''); }}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors cursor-pointer appearance-none">
                          <option value="" disabled>Select Year</option>
                          {YEAR_OPTIONS.map(yr => (
                            <option key={yr} value={yr}>{yr}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <input type="checkbox" id="ageOver16" required checked={ageOver16}
                        onChange={e => { setAgeOver16(e.target.checked); setError(''); }}
                        className="h-4 w-4 rounded border-slate-300 text-blue-800 focus:ring-blue-800 cursor-pointer" />
                      <label htmlFor="ageOver16" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">I'm over 16 years old*</label>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1.5 mt-2">
                    <label htmlFor="studentJobTitle" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Job Title*</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type="text" id="studentJobTitle" required value={jobTitle}
                        onChange={e => { setJobTitle(e.target.value); setError(''); }}
                        placeholder="Ex: Front Desk Manager"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && role === 'recruiter' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Company Name*</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" id="company" required value={company}
                      onChange={e => { setCompany(e.target.value); setError(''); }}
                      placeholder="e.g. Marriott International / Hilton"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="jobTitle" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Job Title*</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" id="jobTitle" required value={jobTitle}
                      onChange={e => { setJobTitle(e.target.value); setError(''); }}
                      placeholder="e.g. HR Manager, Front Desk Supervisor"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Onboarding / Interests */}
            {step === 5 && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">What do you enjoy most?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Select up to 3 options to help us personalize your experience.</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Both Predefined and Custom Interests are rendered together so custom ones can be unselected */}
                  {[...new Set([...INTERESTS_OPTIONS, ...selectedInterests])].map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    // Only show unselected custom interests if they somehow got in the array, but set removes duplicates.
                    const isCustom = !INTERESTS_OPTIONS.includes(interest);
                    if (isCustom && !isSelected) return null; // Shouldn't happen
                    
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-800 border-blue-800 text-white shadow-md dark:bg-amber-500 dark:border-amber-500 dark:text-slate-950'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800'
                        }`}
                      >
                        {interest} {isSelected && isCustom && <X className="inline h-3 w-3 ml-1" />}
                      </button>
                    );
                  })}
                  
                  {/* Unique "Other" Button */}
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className={`px-3 py-1.5 rounded-full border border-dashed text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      showCustomInput
                        ? 'bg-blue-50 border-blue-800 text-blue-800 dark:bg-amber-950/30 dark:border-amber-500 dark:text-amber-500'
                        : 'bg-transparent border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-300'
                    }`}
                  >
                    <Plus className="h-3 w-3" /> Other
                  </button>
                </div>

                {showCustomInput && selectedInterests.length < 3 && (
                  <div className="flex gap-2 mt-2 animate-fadeIn">
                    <input
                      type="text"
                      id="otherInterest"
                      value={otherInterest}
                      onChange={e => { setOtherInterest(e.target.value); setError(''); }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomInterest(); } }}
                      placeholder="Type your hobby/skill..."
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomInterest}
                      disabled={!otherInterest.trim()}
                      className="rounded-xl bg-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                )}
                {showCustomInput && selectedInterests.length >= 3 && (
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">You have reached the maximum of 3 interests. Unselect one to add more.</p>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              {step > 1 && (
                <button type="button" disabled={loading} onClick={handleBack} 
                  className="w-1/3 rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5">
                  <ArrowLeft className="h-4 w-4" /> <span>Back</span>
                </button>
              )}
              <button type="submit" disabled={loading}
                className={`${step > 1 ? 'w-2/3' : 'w-full'} rounded-xl bg-blue-800 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50`}>
                {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /><span>Processing...</span></>) : (<span>{step === 5 ? 'Submit & Verify' : 'Next Step'}</span>)}
              </button>
            </div>
          </form>

          {/* Quick Simulation Help */}
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/50 dark:bg-slate-900/60 dark:border-amber-600/20 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider">Quick Simulation Signup (Skips Form)</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => handleQuickSimulation('student')} disabled={loading}
                className="flex-1 rounded-xl bg-blue-800 text-white dark:bg-slate-800 dark:text-amber-500 dark:hover:bg-slate-700 py-1.5 text-xs font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-sm text-center disabled:opacity-50">
                Student
              </button>
              <button type="button" onClick={() => handleQuickSimulation('recruiter')} disabled={loading}
                className="flex-1 rounded-xl bg-amber-600 text-slate-900 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 py-1.5 text-xs font-semibold hover:bg-amber-500 transition-all cursor-pointer shadow-sm text-center disabled:opacity-50">
                Hotel
              </button>
              <button type="button" onClick={() => handleQuickSimulation('admin')} disabled={loading}
                className="flex-1 rounded-xl bg-red-800 text-white dark:bg-slate-800 dark:text-red-400 dark:hover:bg-slate-700 py-1.5 text-xs font-semibold hover:bg-red-700 transition-all cursor-pointer shadow-sm text-center disabled:opacity-50">
                Admin
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <button onClick={() => setCurrentPage('login')} className="font-semibold text-blue-800 hover:text-blue-700 dark:text-amber-500 dark:hover:text-amber-400 cursor-pointer">Log In</button>
          </div>
        </div>
      </div>
    </div>
  );
}
