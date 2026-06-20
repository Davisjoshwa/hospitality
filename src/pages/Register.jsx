import React, { useState } from 'react';
import { Lock, Mail, Hotel, Check, User, Building, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Register({ onAuthSuccess, setCurrentPage }) {
  const [role, setRole] = useState('student'); // 'student' | 'recruiter'
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Orlando, FL'); // default location
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || (role === 'student' && !name) || (role === 'recruiter' && !company)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    const body = {
      email,
      phone,
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
        // Register & Authenticate successfully
        await onAuthSuccess(data.token, data.user);
        if (data.user.role === 'recruiter') setCurrentPage('recruiter-dashboard');
        else setCurrentPage('student-dashboard');
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error registering your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white dark:bg-slate-950 transition-colors duration-300 relative">
      
      {/* 1. LEFT PANEL (Visual Branding) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury Hospitality"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-955 via-slate-900/90 to-blue-950/40"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-slate-900 font-bold">
              <Hotel className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Hospi<span className="text-amber-500">Hire</span>
            </span>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-md">
          <span className="text-amber-500 font-semibold text-xs uppercase tracking-widest">Join HospiHire</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight mt-3">
            Accelerate Your Hospitality Recruitment Journey
          </h2>
          <p className="text-slate-300 mt-4 text-sm leading-relaxed">
            Create an account today. Whether you are a student launching your hotel career or a recruiter hiring for luxury brands, HospiHire is built for you.
          </p>

          <div className="flex flex-col gap-3.5 mt-8 text-sm">
            {[
              'Direct pipeline from academic institutes to hiring managers',
              'Structured profile formats showing training, certificates, and languages',
              'Real-time application alerts and interview organizer'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className="h-5 w-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-slate-350">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} HospiHire. All rights reserved.
        </div>
      </div>

      {/* 2. RIGHT PANEL (Register Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 pt-24 lg:pt-16">
        <div className="w-full max-w-md flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-2xl font-extrabold text-slate-950 dark:text-white">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-450 text-xs">
              Select your role and enter your details to launch your custom dashboard portal.
            </p>
          </div>

          {/* Role Selection Toggle */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setRole('student');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-white text-blue-800 shadow dark:bg-slate-850 dark:text-amber-500'
                  : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Student / Candidate</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setRole('recruiter');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                role === 'recruiter'
                  ? 'bg-white text-blue-800 shadow dark:bg-slate-850 dark:text-amber-500'
                  : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Hotel / Recruiter</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 text-xs rounded-xl bg-red-50 text-red-750 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50">
                {error}
              </div>
            )}
            
            {/* Dynamic fields based on role */}
            {role === 'student' ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullname" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    id="fullname"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      id="company"
                      required
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g. Marriott International / Hilton"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="location" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">HQ Location</label>
                  <input
                    type="text"
                    id="location"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Orlando, FL"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="name@hotel.edu"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Phone (Optional)</label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-955 dark:text-white dark:focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-800 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 transition-all shadow-md mt-2 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="font-semibold text-blue-800 hover:text-blue-700 dark:text-amber-500 dark:hover:text-amber-400 cursor-pointer"
            >
              Log In
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
