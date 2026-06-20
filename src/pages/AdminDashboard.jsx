import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Briefcase, Settings, CheckCircle2, XCircle, Trash2, Calendar, ShieldAlert, Award, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function AdminDashboard({ user, setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'users', 'jobs', 'settings'
  const [stats, setStats] = useState({ totalUsers: 0, totalStudents: 0, totalRecruiters: 0, totalJobs: 0, totalApplications: 0 });
  const [usersList, setUsersList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch admin stats & tables
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // 1. Fetch stats
      const statsRes = await fetch('/api/admin/stats', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch users
      const usersRes = await fetch('/api/admin/users', { headers });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsersList(usersData);
      }

      // 3. Fetch jobs
      const jobsRes = await fetch('/api/jobs', { headers });
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobsList(jobsData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Handle user verification toggle
  const handleToggleVerify = async (userId, currentVerified) => {
    setActionLoading(userId);
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, isVerified: !currentVerified })
      });
      if (res.ok) {
        // Update local state
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !currentVerified } : u));
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to update user status.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job vacancy from the platform?')) return;
    
    setActionLoading(`job-${jobId}`);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setJobsList(prev => prev.filter(j => j.id !== jobId));
        setStats(prev => ({ ...prev, totalJobs: prev.totalJobs - 1 }));
      } else {
        alert('Failed to delete job.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Manage Users', icon: Users, badge: usersList.length },
    { id: 'jobs', label: 'Audit Jobs', icon: Briefcase, badge: jobsList.length },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mr-3 text-amber-500" />
        <span>Loading Admin Workspace...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="glass-panel p-4 rounded-3xl border border-slate-100 dark:border-slate-850 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap lg:w-full ${
                    isSelected
                      ? 'bg-blue-800 text-white dark:bg-amber-600 dark:text-slate-900'
                      : 'text-slate-655 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                      isSelected ? 'bg-white text-blue-800 dark:bg-slate-900 dark:text-amber-500' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="flex-grow">
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6">
              
              {/* Header */}
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Platform Admin Panel</span>
                <h1 className="font-display text-2xl font-extrabold text-slate-955 dark:text-white mt-1">Operational Metrics</h1>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Registered Accounts', value: stats.totalUsers, icon: Users, color: 'text-blue-800 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400' },
                  { label: 'Hotel Employers', value: stats.totalRecruiters, icon: Award, color: 'text-amber-655 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-550' },
                  { label: 'Active Jobs Board', value: stats.totalJobs, icon: Briefcase, color: 'text-emerald-650 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-450' },
                  { label: 'Applications Sent', value: stats.totalApplications, icon: FileSpreadsheet, color: 'text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center gap-4">
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-2xl font-bold text-slate-950 dark:text-white leading-none">{stat.value}</span>
                        <span className="text-[11px] text-slate-400 mt-1 block font-semibold uppercase tracking-wider">{stat.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Summary Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Users preview */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-sm font-bold text-slate-950 dark:text-white">Recent Registrations</h3>
                    <button onClick={() => setActiveTab('users')} className="text-xs font-semibold text-blue-800 dark:text-amber-500 hover:underline">View All</button>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {usersList.slice(0, 4).map(u => (
                      <div key={u.id} className="p-3 bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white">{u.name || u.email}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5 capitalize">{u.role} • Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          u.isVerified ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                        }`}>
                          {u.isVerified ? 'Active' : 'Deactivated'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Jobs preview */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-sm font-bold text-slate-950 dark:text-white">Recent Vacancies</h3>
                    <button onClick={() => setActiveTab('jobs')} className="text-xs font-semibold text-blue-800 dark:text-amber-500 hover:underline">Manage</button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {jobsList.slice(0, 4).map(j => (
                      <div key={j.id} className="p-3 bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white">{j.title}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{j.company} • {j.location}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">{j.type}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
              <h2 className="font-display text-xl font-bold text-slate-955 dark:text-white mb-6">User Database Directory</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-350">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pr-2">ID</th>
                      <th className="pb-3">User & Contact</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Verification</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {usersList.map((userRow) => (
                      <tr key={userRow.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                        <td className="py-3.5 pr-2 text-slate-400 font-semibold">#{userRow.id}</td>
                        <td className="py-3.5">
                          <span className="block font-semibold text-slate-900 dark:text-white">{userRow.name || 'Unnamed'}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{userRow.email}</span>
                        </td>
                        <td className="py-3.5 capitalize">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            userRow.role === 'admin' ? 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400' :
                            (userRow.role === 'recruiter' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-500' : 'bg-blue-50 text-blue-805 dark:bg-blue-950/20 dark:text-blue-400')
                          }`}>
                            {userRow.role}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            userRow.isVerified ? 'text-emerald-600 dark:text-emerald-450' : 'text-slate-400'
                          }`}>
                            {userRow.isVerified ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            <span>{userRow.isVerified ? 'Active' : 'Deactivated'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleToggleVerify(userRow.id, userRow.isVerified)}
                            disabled={actionLoading === userRow.id}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                              userRow.isVerified
                                ? 'border-red-200 text-red-650 hover:bg-red-50 dark:border-red-950/20 dark:hover:bg-red-950/20'
                                : 'border-emerald-200 text-emerald-650 hover:bg-emerald-50 dark:border-emerald-950/20 dark:hover:bg-emerald-950/20'
                            }`}
                          >
                            {actionLoading === userRow.id ? 'Saving...' : (userRow.isVerified ? 'Deactivate' : 'Activate')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
              <h2 className="font-display text-xl font-bold text-slate-955 dark:text-white mb-6">Auditing Job Board Listings</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-650 dark:text-slate-350">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pr-2">ID</th>
                      <th className="pb-3">Title & Hotel</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3 text-right">Audit Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {jobsList.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20">
                        <td className="py-3.5 pr-2 text-slate-400 font-semibold">#{job.id}</td>
                        <td className="py-3.5">
                          <span className="block font-semibold text-slate-900 dark:text-white">{job.title}</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">{job.company}</span>
                        </td>
                        <td className="py-3.5">{job.location}</td>
                        <td className="py-3.5">
                          <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            {job.type}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={actionLoading === `job-${job.id}`}
                            className="p-2 text-slate-400 hover:text-red-650 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Delete vacancy listing"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col gap-6">
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white mb-2">Platform Control Configurations</h2>
              
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Moderation Settings</h3>
                  <label className="flex items-center gap-3 text-sm text-slate-650 dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-300 text-blue-800 focus:ring-blue-800 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-amber-500 accent-blue-800 dark:accent-amber-500"
                    />
                    <span>Require explicit admin approval for newly posted hotel company profiles</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
