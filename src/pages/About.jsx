import React from 'react';
import { Target, Compass, Eye, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export default function About() {
  const values = [
    { title: 'Hospitality First', desc: 'We understand the heart of service. Our platform is built by hospitality veterans specifically for hospitality needs.', icon: HeartHandshake, color: 'text-amber-600 dark:text-amber-500' },
    { title: 'Equal Opportunity', desc: 'Connecting students and entry-level talent with major global chains, levelling the recruitment playing field.', icon: Compass, color: 'text-blue-600 dark:text-blue-400' },
    { title: 'Absolute Trust', desc: 'Every employer and job posting is carefully verified to maintain high standards of safety and employment terms.', icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'Pursuit of Excellence', desc: 'Promoting vocational education, internship rotations, and standard-setting careers in luxury services.', icon: Award, color: 'text-indigo-600 dark:text-indigo-450' }
  ];

  const team = [
    { name: 'Alexander Sterling', role: 'Founder & CEO', desc: 'Former Ritz-Carlton General Manager with 20+ years of luxury hotel operations experience.', initials: 'AS', bg: 'bg-slate-900 text-amber-500' },
    { name: 'Meera Patel', role: 'Head of Recruiter Relations', desc: 'Ex-Marriott Talent Acquisition Lead passionate about building sustainable hospitality teams.', initials: 'MP', bg: 'bg-blue-800 text-white' },
    { name: 'Marcus Dubois', role: 'Academic Liaison Director', desc: 'Former Culinary Dean dedicated to placing hospitality students in structured rotation programs.', initials: 'MD', bg: 'bg-amber-600 text-slate-900' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Our Story</span>
        <h1 className="font-display text-4xl font-extrabold text-slate-950 dark:text-white mt-3">About HospiHire</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">
          We are redefining hospitality recruitment by bridging the gap between talent, vocational institutes, and world-class brands.
        </p>
      </div>

      {/* 2. Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 bg-slate-50 dark:bg-slate-900/30 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400 mb-6">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">Our Mission</h2>
          <p className="text-slate-650 dark:text-slate-350 mt-4 leading-relaxed">
            To become the leading hospitality recruitment platform connecting hospitality talent with hospitality employers. We strive to empower students and professionals by giving them structured tools to highlight their unique skill sets, languages, and internship experiences.
          </p>
        </div>
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-500 mb-6">
            <Eye className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">Our Vision</h2>
          <p className="text-slate-650 dark:text-slate-350 mt-4 leading-relaxed">
            To create a global, frictionless hospitality ecosystem where talent matches perfectly with hotel management standards. We envision a future where hotel groups, luxury resorts, and high-end restaurants recruit their leaders directly through verifiable portfolios.
          </p>
        </div>
      </div>

      {/* 3. Core Values */}
      <div className="mb-20">
        <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 hover:shadow-md transition-all">
                <div className={`h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-955 flex items-center justify-center ${v.color} mb-4`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-slate-950 dark:text-white">{v.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Leadership Team */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white text-center mb-12">Meet the Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((t, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850/80 rounded-2xl">
              <div className={`h-20 w-20 rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-sm ${t.bg}`}>
                {t.initials}
              </div>
              <h3 className="font-display font-bold text-slate-950 dark:text-white">{t.name}</h3>
              <span className="text-xs text-amber-600 dark:text-amber-500 font-semibold uppercase tracking-wider mt-0.5">{t.role}</span>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
