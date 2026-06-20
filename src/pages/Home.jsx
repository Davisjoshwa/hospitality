import React, { useState } from 'react';
import { ArrowRight, Users, Building, Briefcase, UserCheck, CheckCircle2, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { topEmployers, testimonials } from '../mockData';

export default function Home({ setCurrentPage, jobs, applyToJob, appliedJobs }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const stats = [
    { label: 'Job Seekers', value: '10,000+', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Hotels & Resorts', value: '500+', icon: Building, color: 'text-amber-600 dark:text-amber-500' },
    { label: 'Jobs Posted', value: '2,000+', icon: Briefcase, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Recruiters Active', value: '100+', icon: UserCheck, color: 'text-indigo-600 dark:text-indigo-400' }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Show first 3 jobs as featured
  const featuredJobs = jobs.slice(0, 3);

  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 bg-slate-50 dark:bg-slate-900/40">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl dark:bg-blue-500/5"></div>
        <div className="absolute bottom-10 left-1/4 -z-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/5"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 mb-6 animate-pulse-slow">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            The #1 Hospitality Career Portal
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white leading-tight max-w-4xl mx-auto">
            Connecting <span className="bg-gradient-to-r from-blue-800 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">Hospitality Talent</span> with Hospitality Opportunities
          </h1>
          
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed">
            Find hospitality jobs, internships, and career opportunities across hotels, resorts, restaurants, and cruise companies.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setCurrentPage('jobs')}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-6 py-3.5 text-base font-semibold text-white hover:bg-blue-700 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 transition-all shadow-lg shadow-blue-800/10 dark:shadow-amber-600/10 cursor-pointer"
            >
              <span>Find Jobs</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <span>Post a Job</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATISTICS SECTION */}
      <section className="py-12 border-y border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center p-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 ${stat.color} mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">{stat.value}</span>
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED JOBS SECTION */}
      <section className="py-20 sm:py-24 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-950 dark:text-white">Featured Opportunities</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Explore active positions in top global hotels and dining establishments.</p>
            </div>
            <button
              onClick={() => setCurrentPage('jobs')}
              className="mt-4 md:mt-0 flex items-center gap-1 text-sm font-semibold text-blue-800 hover:text-blue-700 dark:text-amber-500 dark:hover:text-amber-400 cursor-pointer"
            >
              <span>View All Jobs</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => {
              const isApplied = appliedJobs.includes(job.id);
              return (
                <div key={job.id} className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-100/50 dark:hover:shadow-none transition-all duration-300">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-sm ${job.logoBg}`}>
                        {job.logo}
                      </div>
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                        {job.type}
                      </span>
                    </div>

                    {/* Title & Company */}
                    <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white group-hover:text-blue-800 dark:group-hover:text-amber-500 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{job.company}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{job.location}</p>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  {/* Salary & CTA */}
                  <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400">Compensation</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{job.salary.split(' ')[0]} {job.salary.split(' ')[1]}</span>
                    </div>
                    
                    <button
                      onClick={() => applyToJob(job.id)}
                      disabled={isApplied}
                      className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                        isApplied 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 cursor-default border border-emerald-200/50 dark:border-emerald-900/30'
                          : 'bg-blue-800 text-white hover:bg-blue-700 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500'
                      }`}
                    >
                      {isApplied ? 'Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TOP EMPLOYERS SECTION */}
      <section className="py-20 sm:py-24 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold text-slate-950 dark:text-white">Hire by Top Hospitality Brands</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Connecting candidates directly with verified world-class recruiters, luxury chains, and boutique resorts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topEmployers.map((emp) => (
              <div key={emp.id} className="group relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:shadow-lg transition-all duration-300">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={emp.image}
                    alt={emp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <span className="absolute bottom-4 left-4 inline-flex items-center rounded-lg bg-amber-500 px-2 py-0.5 text-xs font-bold text-slate-900">
                    {emp.type}
                  </span>
                </div>
                <div className="p-5 bg-white dark:bg-slate-900">
                  <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">{emp.name}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span>{emp.location}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{emp.rating}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Active Openings</span>
                    <span className="text-sm font-semibold text-blue-800 dark:text-amber-500">{emp.jobsCount} Jobs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold text-slate-950 dark:text-white">Seamless Career Pathway</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">How HospiHire fast-tracks your recruitment experience in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400 text-xl font-bold mb-6">
                1
              </div>
              <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">Create Profile</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                Build a tailored hospitality profile showcasing your education, language skills, internships, certifications, and upload your resume.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-500 text-xl font-bold mb-6">
                2
              </div>
              <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">Apply for Jobs</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                Filter jobs by role type, location, experience levels, and salary ranges. Apply instantly with your saved HospiHire profile credentials.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 text-xl font-bold mb-6">
                3
              </div>
              <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">Get Hired</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                Connect directly with luxury hotel and restaurant recruiters, schedule video interviews, and secure your next career milestone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SUCCESS STORIES SECTION */}
      <section className="py-20 sm:py-24 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold text-slate-950 dark:text-white">Success Stories</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Hear from hotel management students and professionals who advanced their careers using HospiHire.</p>
          </div>

          <div className="max-w-4xl mx-auto relative px-8 py-10 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row gap-8 items-center">
            <Quote className="absolute top-6 left-6 h-12 w-12 text-slate-200 dark:text-slate-800/60 -z-10" />
            
            <div className="flex-shrink-0">
              <div className={`flex h-20 w-20 items-center justify-center rounded-full text-white text-2xl font-bold shadow-md ${testimonials[activeTestimonial].avatarBg}`}>
                {testimonials[activeTestimonial].avatar}
              </div>
            </div>
            
            <div className="flex-grow">
              <p className="text-lg italic text-slate-700 dark:text-slate-300 leading-relaxed">
                "{testimonials[activeTestimonial].content}"
              </p>
              <div className="mt-4">
                <h4 className="font-display font-bold text-slate-950 dark:text-white">{testimonials[activeTestimonial].name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{testimonials[activeTestimonial].role}</p>
              </div>
            </div>

            {/* Slider Buttons */}
            <div className="absolute right-4 bottom-4 flex gap-2">
              <button
                onClick={prevTestimonial}
                className="h-8 w-8 rounded-lg bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextTestimonial}
                className="h-8 w-8 rounded-lg bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
