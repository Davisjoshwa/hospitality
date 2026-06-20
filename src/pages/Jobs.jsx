import React, { useState, useMemo } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Bookmark, ArrowRight, X, CheckCircle, SlidersHorizontal, Trash2 } from 'lucide-react';

export default function Jobs({ jobs, applyToJob, appliedJobs, savedJobs, toggleSaveJob, user, setCurrentPage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSalary, setSelectedSalary] = useState(''); // max range filter
  
  // Apply Modal state
  const [activeApplyJob, setActiveApplyJob] = useState(null);
  const [submittingApply, setSubmittingApply] = useState(false);
  const [showApplySuccess, setShowApplySuccess] = useState(false);

  // Extract unique filters from mock jobs
  const locations = useMemo(() => [...new Set(jobs.map(j => j.location))], [jobs]);
  const experiences = ['Entry-level (0-1 year)', 'Mid-level (2-4 years)', 'Senior-level (5+ years)'];
  const types = ['Full-time', 'Part-time', 'Internship'];

  // Filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchLocation = selectedLocation ? job.location === selectedLocation : true;
      const matchExperience = selectedExperience ? job.experience === selectedExperience : true;
      const matchType = selectedType ? job.type === selectedType : true;
      
      let matchSalary = true;
      if (selectedSalary) {
        // e.g. "40000" means minimum salary matches or within range
        const maxVal = parseInt(selectedSalary);
        matchSalary = job.salaryMin <= maxVal;
      }

      return matchSearch && matchLocation && matchExperience && matchType && matchSalary;
    });
  }, [jobs, searchTerm, selectedLocation, selectedExperience, selectedType, selectedSalary]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedExperience('');
    setSelectedType('');
    setSelectedSalary('');
  };

  const handleApplyClick = (job) => {
    if (!user) {
      // Redirect to login if guest
      setCurrentPage('login');
      return;
    }
    setActiveApplyJob(job);
  };

  const handleConfirmApply = () => {
    setSubmittingApply(true);
    setTimeout(() => {
      applyToJob(activeApplyJob.id);
      setSubmittingApply(false);
      setShowApplySuccess(true);
      setTimeout(() => {
        setShowApplySuccess(false);
        setActiveApplyJob(null);
      }, 2000);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-slate-950 dark:text-white">Hospitality Vacancies</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Discover verified job listings across boutique hotels, global chains, and fine-dining restaurants.</p>
      </div>

      {/* SEARCH AND FILTERS PANEL */}
      <div className="glass-panel rounded-3xl p-5 border border-slate-100 dark:border-slate-850/80 shadow-sm flex flex-col gap-4 mb-8">
        
        {/* Search bar & Location bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="relative md:col-span-7">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, brand, or department..."
              className="w-full rounded-2xl border border-slate-200/80 bg-slate-50 pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-amber-500"
            />
          </div>
          
          <div className="relative md:col-span-5">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 bg-slate-50 pl-11 pr-4 py-3.5 text-sm text-slate-650 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-amber-500 appearance-none cursor-pointer"
            >
              <option value="">All Locations (USA)</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Detailed Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Job Type */}
          <div className="flex-grow sm:flex-grow-0">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-200/85 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-blue-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:focus:border-amber-500 cursor-pointer"
            >
              <option value="">Job Type: All</option>
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div className="flex-grow sm:flex-grow-0">
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-200/85 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-blue-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:focus:border-amber-500 cursor-pointer"
            >
              <option value="">Experience: All</option>
              {experiences.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Salary Ceiling */}
          <div className="flex-grow sm:flex-grow-0">
            <select
              value={selectedSalary}
              onChange={(e) => setSelectedSalary(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-200/85 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-blue-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350 dark:focus:border-amber-500 cursor-pointer"
            >
              <option value="">Max Salary Expectation</option>
              <option value="45000">Under $45k / year</option>
              <option value="60000">Under $60k / year</option>
              <option value="75000">Under $75k / year</option>
              <option value="95000">Under $95k / year</option>
            </select>
          </div>

          {/* Filter Stats & Reset */}
          {(searchTerm || selectedLocation || selectedExperience || selectedType || selectedSalary) && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-xs font-semibold text-red-650 hover:text-red-750 cursor-pointer p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          <div className="ml-auto text-xs text-slate-400 dark:text-slate-500">
            Showing <strong>{filteredJobs.length}</strong> matching positions
          </div>
        </div>

      </div>

      {/* JOBS GRID DISPLAY */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.includes(job.id);
            const isSaved = savedJobs.includes(job.id);
            return (
              <div key={job.id} className="relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:shadow-lg transition-all duration-300">
                
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      {/* Logo */}
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-sm flex-shrink-0 ${job.logoBg}`}>
                        {job.logo}
                      </div>
                      
                      {/* Job Title & Company */}
                      <div>
                        <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white leading-snug">{job.title}</h3>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">{job.company}</p>
                        
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action icons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-amber-50 border-amber-200 text-amber-500 dark:bg-slate-800 dark:border-amber-600/30'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-400 dark:border-slate-800 dark:hover:bg-slate-850'
                        }`}
                        title={isSaved ? 'Unsave Job' : 'Save Job'}
                      >
                        <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-350">
                      {job.type}
                    </span>
                    <span className="inline-flex rounded-full bg-blue-50 dark:bg-blue-950/20 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:text-blue-400">
                      {job.experience}
                    </span>
                    <span className="inline-flex rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-500">
                      {job.category}
                    </span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </div>

                {/* Apply Button Footer */}
                <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Posted {job.postedAt}</span>
                  <button
                    onClick={() => handleApplyClick(job)}
                    disabled={isApplied}
                    className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      isApplied 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 cursor-default border border-emerald-200/50 dark:border-emerald-900/30'
                        : 'bg-blue-800 text-white hover:bg-blue-700 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 shadow-md'
                    }`}
                  >
                    {isApplied ? 'Application Submitted' : 'Apply Instantly'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <Briefcase className="h-12 w-12 text-slate-400" />
          <h3 className="font-display font-bold text-slate-950 dark:text-white mt-4">No vacancies matched</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
            We couldn't find any job matching your active query. Try resetting your search filters or adjustments to location.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-6 rounded-xl bg-blue-800 text-white dark:bg-amber-600 dark:text-slate-900 px-4 py-2 text-xs font-semibold hover:bg-blue-700 dark:hover:bg-amber-500 cursor-pointer"
          >
            Clear Search Queries
          </button>
        </div>
      )}

      {/* QUICK APPLY MODAL BOX */}
      {activeApplyJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => {
                if (!submittingApply && !showApplySuccess) setActiveApplyJob(null);
              }}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {showApplySuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">Application Sent!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
                  Your HospiHire profile has been submitted to <strong>{activeApplyJob.company}</strong>. Check your student dashboard for updates.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-xs font-semibold text-amber-650 dark:text-amber-500">Apply Instantly</span>
                  <h3 className="font-display text-xl font-extrabold text-slate-950 dark:text-white mt-1">
                    {activeApplyJob.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">{activeApplyJob.company} • {activeApplyJob.location}</p>
                </div>

                {/* Profile Overview check */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-955 border border-slate-150 dark:border-slate-850 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-350 block uppercase tracking-wider mb-2">Profile Attachment Preview</span>
                  <div className="flex flex-col gap-1.5 text-slate-600 dark:text-slate-400">
                    <div><strong>Applicant:</strong> {user.name}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Education:</strong> {user.education || 'Hospitality Management Student'}</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <strong>Skills:</strong>
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{s}</span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">No skills listed yet</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form fields mockup */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-slate-550 dark:text-slate-400">Additional Cover Note (Optional)</span>
                  <textarea
                    rows={3}
                    placeholder="Briefly pitch yourself to the hiring manager..."
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-950 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-450 border-t border-slate-50 dark:border-slate-850 pt-4 mt-2">
                  <span>Pressing Submit shares your digital resume.</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveApplyJob(null)}
                      disabled={submittingApply}
                      className="rounded-xl px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850 cursor-pointer font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmApply}
                      disabled={submittingApply}
                      className="rounded-xl px-4 py-2 bg-blue-800 text-white hover:bg-blue-750 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {submittingApply ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
