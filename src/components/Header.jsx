import React, { useState, useRef, useEffect } from 'react';
import { Hotel, Sun, Moon, Menu, X, LogOut, LayoutDashboard, User, Briefcase, Search, Settings, ChevronDown, Home, Bell, Bookmark, FileText, PlusCircle, Users, AlertCircle } from 'lucide-react';

export default function Header({ currentPage, setCurrentPage, user, logout, darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Nav links: LinkedIn style for logged-in users ---
  const getNavLinks = () => {
    if (!user || ['home', 'about', 'contact'].includes(currentPage)) {
      return [
        { name: 'Home', value: 'home' },
        { name: 'About', value: 'about' },
        { name: 'Contact', value: 'contact' },
      ];
    }
    // Logged-in: Student navigation in Header (Pill Style)
    if (user.role === 'student') {
      return [
        { name: 'Dashboard', value: 'student-dashboard', icon: LayoutDashboard },
        { name: 'Jobs', value: 'jobs', icon: Search },
        { name: 'Applications', value: 'applications', icon: Briefcase },
        { name: 'Saved Jobs', value: 'saved-jobs', icon: Bookmark },
        { name: 'Notifications', value: 'notifications', icon: Bell }
      ];
    }
    if (user.role === 'recruiter') {
      return [
        { name: 'Dashboard', value: 'recruiter-dashboard', icon: LayoutDashboard },
        { name: 'Jobs', value: 'jobs', icon: Search },
        { name: 'Post a Job', value: 'post-job', icon: PlusCircle },
        { name: 'Manage Jobs', value: 'manage-jobs', icon: Briefcase },
        { name: 'Applicants', value: 'applicants', icon: Users },
        { name: 'Notifications', value: 'notifications', icon: Bell },
      ];
    }
    if (user.role === 'admin') {
      return [
        { name: 'Overview', value: 'admin-dashboard', icon: LayoutDashboard },
        { name: 'Manage Users', value: 'manage-users', icon: Users },
        { name: 'Audit Jobs', value: 'audit-jobs', icon: Briefcase },
        { name: 'Notifications', value: 'notifications', icon: Bell },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  const handleNavClick = (page) => {
    if (page === 'post-job-student') {
      setShowPostJobModal(true);
      setProfileOpen(false);
      setMobileMenuOpen(false);
      return;
    }
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  // Where should the logo click go?
  const logoTarget = 'home';

  // User initial for avatar
  const userInitial = user ? (user.name || user.company || user.email || 'U').charAt(0).toUpperCase() : '';
  const userName = user ? (user.name || user.company || user.email || 'User') : '';

  // Profile dropdown menu items
  const getProfileMenuItems = () => {
    const items = [];
    
    if (user?.role === 'student') {
      if (['home', 'about', 'contact'].includes(currentPage)) {
        items.push({ name: 'Dashboard', value: 'student-dashboard' });
      }
      items.push({ name: 'Post a Job', value: 'post-job-student' });
      items.push({ name: 'Contact Us', value: 'contact' });
    }
    
    if (user?.role === 'recruiter') {
      items.push({ name: 'Dashboard', value: 'recruiter-dashboard' });
    }
    
    if (user?.role === 'admin') {
      items.push({ name: 'Dashboard', value: 'admin-dashboard' });
    }
    
    return items;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 transition-all duration-150 transform-gpu dark:bg-slate-950 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left Side: Logo + Navigation */}
          <div className="flex items-center gap-8 h-full">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150 transform-gpu" onClick={() => handleNavClick(logoTarget)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800 dark:bg-amber-600 text-amber-500 dark:text-slate-900 transition-all duration-150 transform-gpu">
                <Hotel className="h-6 w-6" />
              </div>
            </div>

            {/* Desktop Navigation for Logged-In Users */}
            {navLinks.length > 0 && user && (
              <nav className="hidden md:flex items-center gap-1.5 h-full">
                {navLinks.map((link) => (
                  <button
                    key={link.value}
                    onClick={() => handleNavClick(link.value)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 transform-gpu hover:scale-[1.05] active:scale-[0.95] cursor-pointer whitespace-nowrap ${
                      currentPage === link.value
                        ? 'bg-blue-800 text-white dark:bg-amber-600 dark:text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 hover:text-slate-900'
                    }`}
                  >
                    {link.icon && <link.icon className="h-4.5 w-4.5 flex-shrink-0" />}
                    <span>{link.name}</span>
                  </button>
                ))}
              </nav>
            )}

            {/* Desktop Navigation for NOT logged in */}
            {navLinks.length > 0 && !user && (
              <nav className="hidden md:flex items-center gap-6 h-full">
                {navLinks.map((link) => (
                  <button
                    key={link.value}
                    onClick={() => handleNavClick(link.value)}
                    className={`text-sm font-medium transition-all duration-150 transform-gpu hover:scale-[1.1] active:scale-[0.95] cursor-pointer ${
                      currentPage === link.value
                        ? 'text-blue-800 dark:text-amber-500 font-semibold'
                        : 'text-slate-600 hover:text-blue-800 dark:text-slate-300 dark:hover:text-amber-500'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
              </nav>
            )}
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-2 h-full">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-150 transform-gpu hover:scale-110 active:scale-90 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              /* ── PROFILE AVATAR + DROPDOWN (LinkedIn "Me" style) ── */
              <div className="relative h-full" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex flex-col items-center justify-center w-16 h-full border-b-2 transition-all duration-150 transform-gpu hover:scale-[1.05] active:scale-[0.95] cursor-pointer ${
                      profileOpen
                        ? 'border-blue-800 dark:border-amber-500 text-blue-800 dark:text-amber-500'
                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 dark:from-amber-500 dark:to-amber-700 text-white dark:text-slate-900 flex items-center justify-center text-[10px] font-bold uppercase shadow-sm">
                    {userInitial}
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <span className="text-[11px] font-medium hidden sm:block">Me</span>
                    <ChevronDown className="h-3 w-3 hidden sm:block" />
                  </div>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-16 w-64 rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in-0 zoom-in-95 z-50">
                    {/* User info header */}
                    <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 dark:from-amber-500 dark:to-amber-700 text-white dark:text-slate-900 flex items-center justify-center text-lg font-bold uppercase flex-shrink-0">
                          {userInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{userName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleNavClick('profile')}
                        className="mt-3 w-full rounded-full border border-blue-800 dark:border-amber-600 text-blue-800 dark:text-amber-500 py-1 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-amber-900/20 transition-all duration-150 transform-gpu hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>

                    {/* Menu items */}
                    {getProfileMenuItems().length > 0 && (
                      <div className="py-2">
                        <div className="px-4 py-1 text-xs font-semibold text-slate-800 dark:text-slate-300">
                          Account
                        </div>
                        {getProfileMenuItems().map((item) => (
                          <button
                            key={item.value}
                            onClick={() => handleNavClick(item.value)}
                            className="w-full flex items-center px-4 py-1.5 text-sm transition-colors cursor-pointer text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-amber-500 hover:underline text-left"
                          >
                            <span>{item.name}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Settings & Sign out */}
                    <div className="border-t border-slate-100 dark:border-slate-800 py-2">
                      <button
                        onClick={() => handleNavClick('settings')}
                        className="w-full flex items-center px-4 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-amber-500 hover:underline transition-colors cursor-pointer text-left"
                      >
                        Settings
                      </button>
                      {user?.role !== 'student' && (
                        <button
                          onClick={() => handleNavClick('post-job')}
                          className="w-full flex items-center px-4 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-amber-500 hover:underline transition-colors cursor-pointer text-left"
                        >
                          Post a Job
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center px-4 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 hover:underline transition-colors cursor-pointer text-left"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── NOT LOGGED IN ── */
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-sm font-medium text-slate-700 hover:text-blue-800 dark:text-slate-300 dark:hover:text-amber-500 transition-all duration-150 transform-gpu hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 px-4 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 transform-gpu shadow-md hover:shadow-lg shadow-blue-800/10 dark:from-amber-600 dark:to-amber-500 dark:text-slate-900 dark:hover:from-amber-500 dark:hover:to-amber-400 dark:shadow-amber-600/10 cursor-pointer"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Profile avatar on mobile (logged in) */}
            {user && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 dark:from-amber-500 dark:to-amber-700 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold uppercase cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {userInitial}
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-150 transform-gpu hover:scale-110 active:scale-90 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 absolute w-full left-0 shadow-lg z-50">
          <div className="flex flex-col gap-2">
            {/* Nav links */}
            {!user && navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => handleNavClick(link.value)}
                className={`flex w-full py-2.5 px-3 rounded-lg text-left text-base font-medium transition-all ${
                  currentPage === link.value
                    ? 'bg-blue-50 text-blue-800 dark:bg-slate-900 dark:text-amber-500'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                {link.name}
              </button>
            ))}

            {user && (
              <div className="flex flex-col gap-1">
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 dark:from-amber-500 dark:to-amber-700 text-white dark:text-slate-900 flex items-center justify-center text-sm font-bold uppercase flex-shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{userName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">View Profile</p>
                  </div>
                </div>

                <div className="px-3 py-1 text-xs font-semibold text-slate-800 dark:text-slate-300">
                  Navigation
                </div>
                {navLinks.map((link) => (
                  <button
                    key={link.value}
                    onClick={() => handleNavClick(link.value)}
                    className={`flex w-full items-center gap-3 py-2 px-3 rounded-lg text-sm transition-all ${
                      currentPage === link.value
                        ? 'bg-blue-50 text-blue-800 dark:bg-slate-900 dark:text-amber-500 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`}
                  >
                    {link.icon && <link.icon className="h-5 w-5" />}
                    {link.name}
                  </button>
                ))}

                <div className="px-3 mt-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-300">
                  Account
                </div>
                {getProfileMenuItems().map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleNavClick(item.value)}
                    className={`flex w-full items-center gap-3 py-2 px-3 rounded-lg text-sm transition-all ${
                      currentPage === item.value
                        ? 'bg-blue-50 text-blue-800 dark:bg-slate-900 dark:text-amber-500 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}

                <button
                  onClick={() => handleNavClick('settings')}
                  className="flex w-full items-center gap-3 mt-2 py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 text-sm font-semibold transition-colors"
                >
                  <Settings className="h-5 w-5 opacity-70" />
                  Settings
                </button>

                {user?.role !== 'student' && (
                  <button
                    onClick={() => handleNavClick('post-job')}
                    className="flex w-full items-center gap-3 py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 text-sm font-semibold transition-colors"
                  >
                    <Briefcase className="h-5 w-5 opacity-70" />
                    Post a Job
                  </button>
                )}

                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex w-full items-center gap-3 py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-semibold transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            )}

            {!user && (
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex w-full justify-center py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-150 transform-gpu hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="flex w-full justify-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 dark:from-amber-600 dark:to-amber-500 text-center text-sm font-semibold text-white dark:text-slate-900 hover:from-blue-700 hover:to-blue-500 dark:hover:from-amber-500 dark:hover:to-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 transform-gpu shadow-md hover:shadow-lg"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post Job Modal for Students */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-800 dark:bg-amber-500/20 dark:text-amber-500">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Employer Account Required</h3>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                To post a job, you must sign out of your student account and register or sign in as an employer.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowPostJobModal(false)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPostJobModal(false);
                    logout();
                  }}
                  className="flex-1 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 shadow-md cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
