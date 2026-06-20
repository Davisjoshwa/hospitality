import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Send, Loader2 } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const details = [
    { label: 'Email Support', info: 'support@hospihire.com', icon: Mail, subtitle: '24/7 client response desk' },
    { label: 'Call Us', info: '+1 (800) 555-HOSP', icon: Phone, subtitle: 'Mon-Fri, 9am - 6pm EST' },
    { label: 'Corporate Office', info: '100 Hospitality Way, Orlando, FL', icon: MapPin, subtitle: 'Visitor passes by appointment' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Get In Touch</span>
        <h1 className="font-display text-4xl font-extrabold text-slate-950 dark:text-white mt-3">Contact Our Team</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg">
          Have questions about job postings, partner school integrations, or enterprise hiring options? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
        
        {/* Contact Info Cards */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {details.map((d, i) => {
            const Icon = d.icon;
            return (
              <div key={i} className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-slate-950 dark:text-white text-sm">{d.label}</h3>
                  <p className="text-base font-bold text-slate-900 dark:text-amber-500 mt-1">{d.info}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d.subtitle}</p>
                </div>
              </div>
            );
          })}

          {/* Map Mockup */}
          <div className="relative flex-grow min-h-[220px] rounded-2xl border border-slate-100 dark:border-slate-850 overflow-hidden bg-slate-100 dark:bg-slate-900 flex flex-col justify-end p-4">
            {/* Design Mock for a Map */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]"></div>
            {/* Custom Mock Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-float">
              <div className="h-6 w-6 rounded-full bg-blue-800 dark:bg-amber-600 flex items-center justify-center text-white text-xs border border-white dark:border-slate-900 shadow-md">
                H
              </div>
              <div className="h-2 w-0.5 bg-blue-850 dark:bg-amber-700"></div>
            </div>
            
            <div className="relative z-10 glass-panel p-3.5 rounded-xl border border-white/20">
              <span className="font-display text-xs font-bold text-slate-900 dark:text-white">Orlando HQ Campus</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Orange Ave & Sand Lake Road</span>
            </div>
          </div>
        </div>

        {/* Contact Form Panel */}
        <div className="lg:col-span-2 p-8 sm:p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white mb-6">Send Us a Message</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Subject</label>
              <input
                type="text"
                id="subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Partnership inquiries, account support..."
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Message</label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Detail your request here. Our staff will respond within 24 business hours..."
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending Request...</span>
                </>
              ) : submitted ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-900" />
                  <span>Message Sent Successfully</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </form>

          {submitted && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-3 text-sm dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 animate-float">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>Thank you! Your message has been received. Our hospitality team will be in touch with you shortly.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
