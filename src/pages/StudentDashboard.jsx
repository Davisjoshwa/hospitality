import React from 'react';
import { LayoutDashboard, User, Briefcase, Bookmark, Bell, Settings, FileText, CheckCircle, Clock, Calendar, ArrowRight, ShieldCheck, ChevronRight, Search } from 'lucide-react';

export default function StudentDashboard({ user, jobs, appliedJobs, savedJobs, setCurrentPage, currentPage }) {
  // Map App.jsx routes to local tab identifiers
  const activeTab = 
    currentPage === 'student-dashboard' ? 'dashboard' :
    currentPage === 'saved-jobs' ? 'saved' : 
    currentPage;

  // Filter user's applied jobs
  const appliedJobsList = jobs.filter(j => appliedJobs.includes(j.id));
  
  // Filter user's saved jobs
  const savedJobsList = jobs.filter(j => savedJobs.includes(j.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="flex flex-col gap-6">
        {/* MAIN CONTAINER */}
        <main className="flex-grow">
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6">
              
              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Applications Sent', value: appliedJobs.length, icon: Briefcase, color: 'text-blue-800 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400' },
                  { label: 'Saved Jobs', value: savedJobs.length, icon: Bookmark, color: 'text-amber-650 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-500' },
                  { label: 'New Notifications', value: 3, icon: Bell, color: 'text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400' },
                  { label: 'Profile Views', value: 24, icon: User, color: 'text-emerald-650 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' }
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

              {/* Split Content: Recent Applications & Recommended Jobs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Recent Applications table */}
                <div className="lg:col-span-8 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">Recent Applications</h3>
                    <button onClick={() => setActiveTab('applications')} className="text-xs font-semibold text-blue-800 dark:text-amber-500 hover:underline">View All</button>
                  </div>

                  {appliedJobsList.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-350">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <th className="pb-3">Job & Hotel</th>
                            <th className="pb-3">Applied</th>
                            <th className="pb-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                          {appliedJobsList.slice(0, 3).map((job) => (
                            <tr key={job.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                              <td className="py-3.5 pr-2">
                                <div className="flex items-center gap-3">
                                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${job.logoBg}`}>
                                    {job.logo}
                                  </div>
                                  <div>
                                    <span className="block font-semibold text-slate-900 dark:text-white text-xs">{job.title}</span>
                                    <span className="block text-[10px] text-slate-400">{job.company}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 text-xs text-slate-400">June 19, 2026</td>
                              <td className="py-3.5 text-right">
                                <span className="inline-flex rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 text-[10px] font-semibold">
                                  Pending Review
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      <Briefcase className="h-8 w-8 text-slate-300 mb-2" />
                      <span>No active applications. Discover jobs on the Jobs Page.</span>
                      <button
                        onClick={() => setCurrentPage('jobs')}
                        className="mt-3 text-blue-800 dark:text-amber-500 font-bold hover:underline"
                      >
                        Find Jobs &rarr;
                      </button>
                    </div>
                  )}
                </div>

                {/* Recommended Jobs suggestions */}
                <div className="lg:col-span-4 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col gap-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">Recommended for You</h3>
                    <p className="text-[11px] text-slate-450">Based on your Front Office & Guest Relations skills.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {jobs.slice(3, 5).map((job) => (
                      <div
                        key={job.id}
                        onClick={() => setCurrentPage('jobs')}
                        className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 hover:border-blue-200 dark:hover:border-slate-800 rounded-2xl cursor-pointer transition-all flex flex-col justify-between"
                      >
                        <div className="flex gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${job.logoBg}`}>
                            {job.logo}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-950 dark:text-white leading-tight line-clamp-1">{job.title}</span>
                            <span className="block text-[10px] text-slate-500 mt-0.5">{job.company}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 border-t border-slate-100/50 dark:border-slate-900/50 pt-2">
                          <span>{job.location}</span>
                          <span className="font-bold text-blue-800 dark:text-amber-500">Apply &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'applications' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white mb-6">All Applications</h2>
              
              {appliedJobsList.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {appliedJobsList.map((job) => (
                    <div key={job.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${job.logoBg}`}>
                          {job.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-slate-955 dark:text-white">{job.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{job.company} • {job.location}</p>
                          <span className="text-[10px] text-slate-400 block mt-1.5">Submitted: June 19, 2026</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="inline-flex rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 px-3 py-1 text-xs font-semibold">
                          Under Review
                        </span>
                        <button
                          onClick={() => setCurrentPage('jobs')}
                          className="text-xs font-bold text-slate-400 hover:text-slate-650 dark:hover:text-white p-2"
                        >
                          View Vacancy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-slate-400 border border-dashed border-slate-200 dark:border-slate-805 rounded-3xl flex flex-col items-center">
                  <Briefcase className="h-10 w-10 text-slate-350 mb-3" />
                  <span>You haven't submitted any job applications yet.</span>
                  <button
                    onClick={() => setCurrentPage('jobs')}
                    className="mt-4 rounded-xl bg-blue-800 text-white dark:bg-amber-600 dark:text-slate-900 px-5 py-2.5 text-xs font-bold hover:bg-blue-750 transition-all cursor-pointer shadow"
                  >
                    Explore Active Jobs
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white mb-6">Saved Jobs</h2>
              
              {savedJobsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedJobsList.map((job) => (
                    <div key={job.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col justify-between hover:border-amber-500/30 transition-all">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${job.logoBg}`}>
                            {job.logo}
                          </div>
                          <span className="inline-flex rounded-full bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-350">
                            {job.type}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-slate-955 dark:text-white mt-3">{job.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{job.company} • {job.location}</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-amber-500 mt-2">{job.salary}</p>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setCurrentPage('jobs');
                          }}
                          className="text-xs font-bold text-blue-800 dark:text-amber-500 hover:underline"
                        >
                          View & Apply &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-slate-400 border border-dashed border-slate-200 dark:border-slate-805 rounded-3xl flex flex-col items-center">
                  <Bookmark className="h-10 w-10 text-slate-350 mb-3" />
                  <span>You haven't bookmarked any jobs yet.</span>
                  <button
                    onClick={() => setCurrentPage('jobs')}
                    className="mt-4 rounded-xl bg-blue-800 text-white dark:bg-amber-600 dark:text-slate-900 px-5 py-2.5 text-xs font-bold hover:bg-blue-755 transition-all cursor-pointer shadow"
                  >
                    Browse Jobs Board
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white mb-6">Notifications</h2>
              <div className="flex flex-col gap-4">
                {[
                  { title: 'Welcome to HospiHire', desc: 'Complete your profiles to make yourself discoverable by Marriott, Ritz-Carlton and Aman Resorts recruiters.', time: '2 hours ago', icon: ShieldCheck, color: 'text-blue-800 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400' },
                  { title: 'New Culinary Internship Posted', desc: 'Marriott International Orlando just listed a new Culinary Management Internship.', time: '1 day ago', icon: Briefcase, color: 'text-amber-650 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-500' },
                  { title: 'Profile Approved for Placement', desc: 'Your Cornell University academic email was verified successfully.', time: '2 days ago', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' }
                ].map((n, idx) => {
                  const Icon = n.icon;
                  return (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-slate-950 dark:text-white">{n.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-2 block">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
