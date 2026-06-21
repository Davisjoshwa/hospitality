import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, Briefcase, Users, UserCheck, Settings, Eye, Check, X, Calendar, Plus, FileText } from 'lucide-react';

export default function RecruiterDashboard({ user, jobs, postJob, appliedJobs, savedJobs, setCurrentPage, currentPage }) {
  // Map global routes to local tab identifiers
  const activeTab = 
    currentPage === 'recruiter-dashboard' ? 'dashboard' :
    currentPage === 'manage-jobs' ? 'jobs' :
    currentPage;
    
  const [recruiterApplicants, setRecruiterApplicants] = useState([]);
  
  // Job Post State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Front Office & Guest Relations');
  const [location, setLocation] = useState('New York, NY');
  const [type, setType] = useState('Full-time');
  const [experience, setExperience] = useState('Mid-level (2-4 years)');
  const [salary, setSalary] = useState('$65,000 - $75,000 / year');
  const [description, setDescription] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [postedSuccess, setPostedSuccess] = useState(false);

  // Recruiter's company
  const company = user?.company || 'Marriott International';

  // Filter recruiter's posted jobs
  const recruiterJobs = jobs.filter(j => j.company === company);

  // Fetch applicants pool from backend database
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/jobs/recruiter-applicants', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRecruiterApplicants(data);
        }
      } catch (err) {
        console.error('Error fetching applicants:', err);
      }
    };
    
    fetchApplicants();
  }, [jobs]); // Re-run if a new job is added to trigger updates


  const handlePostJobSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const requirements = requirementsText
      ? requirementsText.split('\n').filter(line => line.trim())
      : ['Degree/Diploma in hospitality management.', 'Excellent communication skills.', 'Friendly demeanor.'];

    // Generate matching logo values based on company name
    const companyLogo = company.split(' ').map(w => w[0]).join('').substring(0, 2);
    
    // Add job to global state
    postJob({
      title,
      company,
      logo: companyLogo,
      logoBg: 'bg-indigo-900 text-amber-500',
      location,
      type,
      experience,
      salary,
      salaryMin: 50000, // mock range representation
      salaryMax: 80000,
      category,
      description,
      requirements,
      postedAt: 'Just now'
    });

    setPostedSuccess(true);
    setTitle('');
    setDescription('');
    setRequirementsText('');

    setTimeout(() => {
      setPostedSuccess(false);
      setCurrentPage('recruiter-dashboard');
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="flex flex-col gap-6">
        {/* MAIN PANEL CONTENT */}
        <main className="flex-grow w-full">
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6">
              
              {/* Recruiter Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">{company} Portal</span>
                  <h1 className="font-display text-2xl font-extrabold text-slate-950 dark:text-white mt-1">Recruitment Workspace</h1>
                </div>
                <button
                  onClick={() => setCurrentPage('post-job')}
                  className="rounded-xl bg-blue-800 hover:bg-blue-755 text-white dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-505 px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Plus className="h-4 w-4" />
                  <span>Post New Vacancy</span>
                </button>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Jobs Posted', value: recruiterJobs.length, icon: Briefcase, color: 'text-blue-850 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400' },
                  { label: 'Total Applicants', value: recruiterApplicants.length, icon: Users, color: 'text-amber-650 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-550' },
                  { label: 'Active Positions', value: recruiterJobs.length, icon: UserCheck, color: 'text-emerald-650 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-450' },
                  { label: 'Interview Rate', value: recruiterApplicants.length > 0 ? '50%' : '0%', icon: Calendar, color: 'text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center gap-4">
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-2xl font-bold text-slate-955 dark:text-white leading-none">{stat.value}</span>
                        <span className="text-[11px] text-slate-400 mt-1 block font-semibold uppercase tracking-wider">{stat.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Split Content: Recent Applicants & Active Listings */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Applicants */}
                <div className="lg:col-span-7 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">Active Applicants</h3>
                    <button onClick={() => setCurrentPage('applicants')} className="text-xs font-semibold text-blue-800 dark:text-amber-500 hover:underline">View All</button>
                  </div>

                  {recruiterApplicants.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {recruiterApplicants.slice(0, 3).map((app) => (
                        <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="block text-xs font-bold text-slate-950 dark:text-white">{app.candidateName}</span>
                              <span className="block text-[10px] text-slate-500 mt-0.5">{app.candidateEducation}</span>
                            </div>
                            <span className="inline-flex rounded-full bg-blue-50 text-blue-850 dark:bg-blue-950/20 dark:text-blue-400 px-2 py-0.5 text-[9px] font-semibold">
                              {app.jobTitle}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {app.candidateSkills.map((s, idx) => (
                              <span key={idx} className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px] text-slate-650 dark:text-slate-350">{s}</span>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center border-t border-slate-200/50 dark:border-slate-850 pt-2.5 mt-1 text-[10px]">
                            <span className="text-slate-400">Email: {app.candidateEmail}</span>
                            <button
                              onClick={() => setCurrentPage('applicants')}
                              className="font-bold text-blue-850 dark:text-amber-500 hover:underline"
                            >
                              Review Portfolio
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center">
                      <Users className="h-8 w-8 text-slate-300 mb-2" />
                      <span>No active applicants for your positions yet.</span>
                    </div>
                  )}
                </div>

                {/* Active Jobs Grid */}
                <div className="lg:col-span-5 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">Active Positions</h3>
                    <button onClick={() => setCurrentPage('manage-jobs')} className="text-xs font-semibold text-blue-850 dark:text-amber-550 hover:underline">Manage</button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {recruiterJobs.length > 0 ? (
                      recruiterJobs.slice(0, 3).map((job) => (
                        <div key={job.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="block text-xs font-bold text-slate-950 dark:text-white leading-tight">{job.title}</span>
                            <span className="block text-[10px] text-slate-400 mt-0.5">{job.location} • {job.type}</span>
                          </div>
                          <span className="text-xs font-bold text-blue-805 dark:text-amber-500">{job.salary.split(' ')[0]}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic text-center py-4">No jobs posted.</span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'post-job' && (
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl shadow-sm">
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white mb-2">Post a New Vacancy</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Create a job card. It will immediately show up on the main jobs search board.</p>

              {postedSuccess ? (
                <div className="py-8 text-center text-emerald-800 dark:text-emerald-400 flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold">Position Posted Successfully!</h3>
                  <p className="text-xs text-slate-500">Updating active directories and dashboard stats...</p>
                </div>
              ) : (
                <form onSubmit={handlePostJobSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="title" className="text-xs font-bold text-slate-400 uppercase tracking-wide">Job Title</label>
                      <input
                        type="text"
                        id="title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Front Desk Supervisor"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="category" className="text-xs font-bold text-slate-400 uppercase tracking-wide">Department / Category</label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-650 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 cursor-pointer"
                      >
                        <option>Front Office & Guest Relations</option>
                        <option>Food & Beverage / Culinary</option>
                        <option>Housekeeping & Rooms Control</option>
                        <option>Events & Banquets</option>
                        <option>General Management</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="location" className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location</label>
                      <input
                        type="text"
                        id="location"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Miami, FL"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="type" className="text-xs font-bold text-slate-400 uppercase tracking-wide">Job Type</label>
                      <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-650 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 cursor-pointer"
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Internship</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="experience" className="text-xs font-bold text-slate-400 uppercase tracking-wide">Experience Level</label>
                      <select
                        id="experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-650 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 cursor-pointer"
                      >
                        <option>Entry-level (0-1 year)</option>
                        <option>Mid-level (2-4 years)</option>
                        <option>Senior-level (5+ years)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="salary" className="text-xs font-bold text-slate-400 uppercase tracking-wide">Salary / Compensation</label>
                    <input
                      type="text"
                      id="salary"
                      required
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. $55,000 - $65,000 / year or $20 - $22 / hour"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="description" className="text-xs font-bold text-slate-400 uppercase tracking-wide">Role Description</label>
                    <textarea
                      id="description"
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the job duties, working shifts, and company environment..."
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="requirements" className="text-xs font-bold text-slate-400 uppercase tracking-wide">Job Requirements (One per line)</label>
                    <textarea
                      id="requirements"
                      rows={3}
                      value={requirementsText}
                      onChange={(e) => setRequirementsText(e.target.value)}
                      placeholder="e.g. Cornell B.Sc. or equivalent degree&#10;Opera PMS proficiency&#10;Fluency in French is a plus"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-blue-800 hover:bg-blue-755 text-white dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 py-3 text-xs font-semibold transition-all cursor-pointer shadow-md mt-2 flex items-center justify-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Publish Vacancy</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">Manage Vacancies</h2>
                <button
                  onClick={() => setCurrentPage('post-job')}
                  className="rounded-xl border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-350 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  Post New
                </button>
              </div>

              {recruiterJobs.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recruiterJobs.map((job) => (
                    <div key={job.id} className="p-4 bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-sm text-slate-955 dark:text-white">{job.title}</h3>
                        <p className="text-xs text-slate-450 mt-0.5">{job.location} • {job.type} • {job.salary}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage('jobs')}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 text-xs font-semibold"
                        >
                          View Board
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-slate-400 border border-dashed border-slate-200 dark:border-slate-805 rounded-3xl">
                  <span>No vacancies posted yet. Click 'Post a Job' to add one.</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'applicants' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white mb-6">Applicants Pool</h2>
              
              {recruiterApplicants.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {recruiterApplicants.map((app) => (
                    <div key={app.id} className="p-5 bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wide">Applicant Profile</span>
                          <h3 className="font-display text-lg font-bold text-slate-955 dark:text-white mt-1">{app.candidateName}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{app.candidateEducation}</p>
                        </div>
                        <span className="inline-flex rounded-full bg-blue-50 text-blue-805 dark:bg-blue-950/20 dark:text-blue-400 px-3 py-1 text-xs font-bold">
                          Applied for: {app.jobTitle}
                        </span>
                      </div>

                      {/* Details Box */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Skills</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {app.candidateSkills.map((s, idx) => (
                              <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-655 dark:text-slate-350">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Contact</span>
                          <span className="text-xs text-slate-600 dark:text-slate-350 mt-1">Email: {app.candidateEmail}</span>
                          <span className="text-xs text-slate-400 mt-0.5">Resume: Attached (HospiHire Portfolio)</span>
                        </div>
                      </div>

                      {/* Recruiter Actions */}
                      <div className="flex justify-between items-center border-t border-slate-200/50 dark:border-slate-850 pt-4 mt-2">
                        <span className="text-xs text-slate-400">Current Status: <strong className="text-amber-650 dark:text-amber-500">{app.status}</strong></span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => alert(`Virtual interview request scheduled for ${app.candidateName}`)}
                            className="rounded-xl bg-blue-800 hover:bg-blue-755 text-white dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 px-4 py-2 text-xs font-bold cursor-pointer"
                          >
                            Schedule Interview
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-slate-400 border border-dashed border-slate-200 dark:border-slate-805 rounded-3xl flex flex-col items-center justify-center">
                  <Users className="h-10 w-10 text-slate-350 mb-3" />
                  <span>No students have applied to your job listings yet.</span>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Try posting a new vacancy or verify your current active positions.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white mb-6">Recruiter Settings</h2>
              <div className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-slate-450">Active Brand</span>
                      <span className="text-sm text-slate-805 dark:text-white font-semibold mt-1 block">{company}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-450">Portal Authority</span>
                      <span className="text-sm text-slate-805 dark:text-white font-semibold mt-1 block">Enterprise Recruiter Portal</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Notification Rules</h3>
                  <label className="flex items-center gap-3 text-sm text-slate-655 dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-300 text-blue-800 focus:ring-blue-800 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-amber-500 accent-blue-800 dark:accent-amber-500"
                    />
                    <span>Email alert immediately upon a student application submission</span>
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
