import React, { useState } from 'react';
import { Hotel, Sun, Moon, Menu, X, LogOut, LayoutDashboard, User, Briefcase } from 'lucide-react';

export default function Header({ currentPage, setCurrentPage, user, logout, darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', value: 'home' },
    { name: 'Jobs', value: 'jobs' },
    { name: 'About', value: 'about' },
    { name: 'Contact', value: 'contact' }
  ];

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel shadow-sm transition-all duration-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800 dark:bg-amber-600 text-amber-500 dark:text-slate-900 transition-all duration-300">
              <Hotel className="h-6 w-6" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hospi<span className="text-amber-600 dark:text-amber-500">Hire</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => handleNavClick(link.value)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === link.value
                    ? 'text-blue-800 dark:text-amber-500 font-semibold'
                    : 'text-slate-600 hover:text-blue-800 dark:text-slate-300 dark:hover:text-amber-500'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* User Controls & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick(user.role === 'recruiter' ? 'recruiter-dashboard' : 'student-dashboard')}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                
                {user.role === 'student' && (
                  <button
                    onClick={() => handleNavClick('profile')}
                    className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    handleNavClick('home');
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-slate-800 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-sm font-medium text-slate-700 hover:text-blue-800 dark:text-slate-300 dark:hover:text-amber-500 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="rounded-xl bg-blue-800 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 transition-all shadow-md shadow-blue-800/10 dark:shadow-amber-600/10 cursor-pointer"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 transition-all duration-300 absolute w-full left-0 shadow-lg">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => handleNavClick(link.value)}
                className={`flex w-full py-2 px-3 rounded-lg text-left text-base font-medium transition-all ${
                  currentPage === link.value
                    ? 'bg-blue-50 text-blue-800 dark:bg-slate-900 dark:text-amber-500'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                {link.name}
              </button>
            ))}
            
            <hr className="border-slate-100 dark:border-slate-800 my-1" />

            {user ? (
              <div className="flex flex-col gap-2 pt-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Logged in as {user.role === 'recruiter' ? 'Recruiter' : 'Student'}
                </div>
                <button
                  onClick={() => handleNavClick(user.role === 'recruiter' ? 'recruiter-dashboard' : 'student-dashboard')}
                  className="flex w-full items-center gap-3 py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>

                {user.role === 'student' && (
                  <button
                    onClick={() => handleNavClick('profile')}
                    className="flex w-full items-center gap-3 py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    handleNavClick('home');
                  }}
                  className="flex w-full items-center gap-3 py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex w-full justify-center py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="flex w-full justify-center py-2 px-4 rounded-xl bg-blue-800 dark:bg-amber-600 text-center text-sm font-semibold text-white dark:text-slate-900 hover:bg-blue-700 dark:hover:bg-amber-500 shadow-md"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
