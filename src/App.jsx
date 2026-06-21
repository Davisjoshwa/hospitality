import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // Router state
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null); // Central user state
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync dark mode configuration with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load jobs and check user session on mount
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        // 1. Fetch public jobs
        const jobsRes = await fetch('/api/jobs');
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);
        }

        // 2. Restore JWT session if token exists
        const token = localStorage.getItem('token');
        if (token) {
          const profileRes = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const userData = await profileRes.json();
            setUser(userData);
            
            // If student, load bookmarks and applications IDs
            if (userData.role === 'student') {
              const studentDataRes = await fetch('/api/jobs/student-data', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (studentDataRes.ok) {
                const studentData = await studentDataRes.json();
                setAppliedJobs(studentData.appliedJobs || []);
                setSavedJobs(studentData.savedJobs || []);
              }
            }
            
            // Redirect logged-in users to their respective dashboards on reload
            if (userData.role === 'admin') setCurrentPage('admin-dashboard');
            else if (userData.role === 'recruiter') setCurrentPage('recruiter-dashboard');
            else setCurrentPage('student-dashboard');

          } else {
            // Bad token
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initializeApp();
  }, []);

  // Auth helper: sets local storage and state
  const handleAuthSuccess = async (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    
    if (userData.role === 'student') {
      try {
        const studentDataRes = await fetch('/api/jobs/student-data', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (studentDataRes.ok) {
          const studentData = await studentDataRes.json();
          setAppliedJobs(studentData.appliedJobs || []);
          setSavedJobs(studentData.savedJobs || []);
        }
      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAppliedJobs([]);
    setSavedJobs([]);
    setCurrentPage('login');
  };

  // Profile modifications
  const updateUser = async (updatedFields) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
      }
    } catch (err) {
      console.error('Error updating profile in db:', err);
    }
  };

  // Job applying
  const applyToJob = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId })
      });
      if (res.ok) {
        setAppliedJobs((prev) => [...prev, jobId]);
      }
    } catch (err) {
      console.error('Error applying to job in db:', err);
    }
  };

  // Saved Jobs Bookmarking
  const toggleSaveJob = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/jobs/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.saved) {
          setSavedJobs((prev) => [...prev, jobId]);
        } else {
          setSavedJobs((prev) => prev.filter((id) => id !== jobId));
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark in db:', err);
    }
  };

  // Publisher callback for recruiters
  const postJob = async (newJobData) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newJobData)
      });
      if (res.ok) {
        const createdJob = await res.json();
        setJobs((prev) => [createdJob, ...prev]);
      }
    } catch (err) {
      console.error('Error posting new job in db:', err);
    }
  };

  // Helper for scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Helper: get the dashboard page for the current user
  const getDashboardPage = () => {
    if (!user) return 'home';
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'recruiter') return 'recruiter-dashboard';
    return 'student-dashboard';
  };

  // Page Routing resolver
  const renderPage = () => {
    // --- Route guards: redirect logged-in users away from public-only pages ---
    if (user && ['login', 'register'].includes(currentPage)) {
      // Use setTimeout to avoid state update during render
      setTimeout(() => setCurrentPage(getDashboardPage()), 0);
      return null;
    }

    // --- Route guards: redirect non-logged-in users away from dashboards ---
    if (!user && ['student-dashboard', 'recruiter-dashboard', 'admin-dashboard', 'profile', 'applications', 'saved-jobs', 'notifications', 'post-job', 'manage-jobs', 'applicants', 'manage-users', 'audit-jobs', 'settings'].includes(currentPage)) {
      setTimeout(() => setCurrentPage('login'), 0);
      return null;
    }

    switch (currentPage) {
      case 'home':
        return (
          <Home
            setCurrentPage={setCurrentPage}
            jobs={jobs}
            applyToJob={applyToJob}
            appliedJobs={appliedJobs}
            user={user}
          />
        );
      case 'jobs':
        return (
          <Jobs
            jobs={jobs}
            applyToJob={applyToJob}
            appliedJobs={appliedJobs}
            savedJobs={savedJobs}
            toggleSaveJob={toggleSaveJob}
            user={user}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'login':
        return (
          <Login
            onAuthSuccess={handleAuthSuccess}
            setCurrentPage={setCurrentPage}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
      case 'register':
      case 'register-recruiter':
        return (
          <Register
            onAuthSuccess={handleAuthSuccess}
            setCurrentPage={setCurrentPage}
            defaultRole={currentPage === 'register-recruiter' ? 'recruiter' : 'student'}
          />
        );
      case 'student-dashboard':
      case 'applications':
      case 'saved-jobs':
      case 'notifications':
        if (!user || user.role !== 'student') {
          setTimeout(() => setCurrentPage('login'), 0);
          return null;
        }
        return (
          <StudentDashboard
            user={user}
            jobs={jobs}
            appliedJobs={appliedJobs}
            savedJobs={savedJobs}
            applyToJob={applyToJob}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        );
      case 'recruiter-dashboard':
      case 'post-job':
      case 'manage-jobs':
      case 'applicants':
        if (!user || user.role !== 'recruiter') {
          if (currentPage === 'settings') {
            // Pass through if they are another role trying to access settings
          } else {
            setTimeout(() => setCurrentPage('login'), 0);
            return null;
          }
        } else {
          return (
            <RecruiterDashboard
              user={user}
              jobs={jobs}
              postJob={postJob}
              appliedJobs={appliedJobs}
              savedJobs={savedJobs}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          );
        }
      case 'admin-dashboard':
      case 'manage-users':
      case 'audit-jobs':
      case 'settings':
        if (!user) {
          setTimeout(() => setCurrentPage('login'), 0);
          return null;
        }
        return (
          <AdminDashboard
            user={user}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        );
      case 'profile':
        if (!user || user.role !== 'student') {
          setTimeout(() => setCurrentPage('login'), 0);
          return null;
        }
        return (
          <Profile
            user={user}
            updateUser={updateUser}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'settings': // This should ideally be caught by the above blocks if role checks pass
        return null;
      default:
        // Logged-in users go to their dashboard, others go to home
        if (user) {
          setTimeout(() => setCurrentPage(getDashboardPage()), 0);
          return null;
        }
        return (
          <Home
            setCurrentPage={setCurrentPage}
            jobs={jobs}
            applyToJob={applyToJob}
            appliedJobs={appliedJobs}
            user={user}
          />
        );
    }
  };

  const isAuthPage = currentPage === 'login' || currentPage === 'register';
  const isDashboardPage = ['student-dashboard', 'recruiter-dashboard', 'admin-dashboard', 'profile', 'applications', 'saved-jobs', 'notifications'].includes(currentPage);
  const isLoggedIn = !!user;

  // Show footer only on public pages when NOT logged in
  const showFooter = !isAuthPage && !isLoggedIn;

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-slate-950 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-amber-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="font-display text-sm font-semibold tracking-wide">Initializing HospiHire...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {!isAuthPage && (
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          user={user}
          logout={logout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      <div className="flex-grow">{renderPage()}</div>
      {showFooter && <Footer setCurrentPage={setCurrentPage} />}
    </div>
  );
}

