import React, { useState } from 'react';
import { Hotel, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-slate-900 font-bold">
                <Hotel className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Hospi<span className="text-amber-500">Hire</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Connecting hospitality talent with premium career opportunities across global hotels, luxury resorts, restaurants, and cruise lines.
            </p>
            {/* Socials */}
            <div className="flex gap-4 mt-2">
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-600 hover:text-slate-900 transition-all" aria-label="LinkedIn">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-600 hover:text-slate-900 transition-all" aria-label="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-600 hover:text-slate-900 transition-all" aria-label="Instagram">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Cols */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Candidates
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><button onClick={() => setCurrentPage('jobs')} className="hover:text-amber-500 transition-colors text-left cursor-pointer">Find Hospitality Jobs</button></li>
              <li><button onClick={() => setCurrentPage('profile')} className="hover:text-amber-500 transition-colors text-left cursor-pointer">Build Student Profile</button></li>
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-amber-500 transition-colors text-left cursor-pointer">Hospitality Internships</button></li>
              <li><button onClick={() => setCurrentPage('jobs')} className="hover:text-amber-500 transition-colors text-left cursor-pointer">Luxury Hotel Vacancies</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Employers & Info
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><button onClick={() => setCurrentPage('register')} className="hover:text-amber-500 transition-colors text-left cursor-pointer">Post a Job Listing</button></li>
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-amber-500 transition-colors text-left cursor-pointer">About HospiHire</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-amber-500 transition-colors text-left cursor-pointer">Contact Support</button></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors text-left">Terms of Service & Privacy</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-sm text-slate-400">
              Subscribe to get the latest hospitality job alerts and internship openings.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-amber-600 text-slate-900 p-2 hover:bg-amber-500 transition-all flex items-center justify-center cursor-pointer"
                title="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            {subscribed && (
              <span className="text-xs text-amber-500 font-medium animate-pulse-slow">
                Subscription successful! Check your inbox.
              </span>
            )}
            
            {/* Quick Contact Details */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-500 mt-2 border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> 100 Hospitality Way, Orlando, FL</div>
              <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> support@hospihire.com</div>
              <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> +1 (800) 555-HOSP</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-600 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <span>&copy; {new Date().getFullYear()} HospiHire. All rights reserved. Made for the hospitality industry.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
