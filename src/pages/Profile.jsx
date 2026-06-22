import React, { useState, useRef, useEffect } from 'react';
import { User, GraduationCap, Briefcase, Award, FileText, Plus, Trash2, CheckCircle, Upload, Save, Globe, X } from 'lucide-react';
import { WORLD_LANGUAGES } from '../data/languages';
import { INDIAN_LOCATIONS } from '../data/locations';
import { HM_COLLEGES_INDIA } from '../data/hmColleges';

const YEAR_OPTIONS = Array.from({ length: 2040 - 1935 + 1 }, (_, i) => 2040 - i);

export default function Profile({ user, updateUser, setCurrentPage }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-2834');
  const [bio, setBio] = useState(user?.bio || 'Passionate hotel management student focused on guest hospitality, luxury services, and front-desk software systems.');
  const [languages, setLanguages] = useState(user?.languages || 'English (Native), French (Conversational)');
  
  const [education, setEducation] = useState(user?.education || '');
  const [eduGradYear, setEduGradYear] = useState(user?.eduGradYear || '');
  const [school, setSchool] = useState(user?.school || '');
  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [showSchoolSuggestions, setShowSchoolSuggestions] = useState(false);
  const [startYear, setStartYear] = useState(user?.startYear || '');
  const [endYear, setEndYear] = useState(user?.endYear || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');
  const [location, setLocation] = useState(user?.location || '');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);

  const [langSearch, setLangSearch] = useState('');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const currentLanguages = languages.split(',').map(l => l.trim()).filter(l => l);

  useEffect(() => {
    if (location.length < 1) {
      setLocationSuggestions([]);
      return;
    }
    const q = location.toLowerCase();
    const localMatches = INDIAN_LOCATIONS.filter(l => l.toLowerCase().includes(q)).slice(0, 15);
    setLocationSuggestions(localMatches);
  }, [location]);

  useEffect(() => {
    if (school.length < 1) {
      setSchoolSuggestions([]);
      return;
    }
    const q = school.toLowerCase();
    const localMatches = HM_COLLEGES_INDIA.filter(c => c.toLowerCase().includes(q)).slice(0, 15);
    setSchoolSuggestions(localMatches);
  }, [school]);

  const handleAddLanguage = (lang) => {
    if (!currentLanguages.includes(lang)) {
      setLanguages([...currentLanguages, lang].join(', '));
    }
    setLangSearch('');
    setShowLangDropdown(false);
  };

  const handleRemoveLanguage = (langToRemove) => {
    setLanguages(currentLanguages.filter(l => l !== langToRemove).join(', '));
  };

  // Skills state
  const [skills, setSkills] = useState(user?.skills || ['Front Office Operations', 'Opera PMS', 'Guest Relations', 'Bilingual']);
  const [newSkill, setNewSkill] = useState('');

  // Internships state
  const [internships, setInternships] = useState(user?.internships || []);
  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCertificateName, setNewCertificateName] = useState('');
  const [internshipError, setInternshipError] = useState('');
  const [showAddInternship, setShowAddInternship] = useState(false);

  // Certificates state
  const [certificates, setCertificates] = useState(user?.certificates || ['ServSafe Manager', 'AHLEI Certified Front Desk Representative']);
  const [newCert, setNewCert] = useState('');

  // Resume state
  const [resumeName, setResumeName] = useState(user?.resumeName || 'Alex_Mercer_Resume.pdf');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (newCert.trim() && !certificates.includes(newCert.trim())) {
      setCertificates([...certificates, newCert.trim()]);
      setNewCert('');
    }
  };

  const handleRemoveCert = (certToRemove) => {
    setCertificates(certificates.filter(c => c !== certToRemove));
  };

  const handleAddInternshipSubmit = (e) => {
    e.preventDefault();
    
    // Scenario 1: Certificate is uploaded -> Fields are optional
    if (newCertificateName) {
      setInternshipError('');
      setInternships([
        ...internships,
        {
          role: newRole.trim() || 'Internship (Attached Certificate)',
          company: newCompany.trim() || 'Certificate Uploaded',
          duration: newDuration.trim() || 'Attached Document',
          desc: newDesc.trim(),
          certificate: newCertificateName
        }
      ]);
      setNewRole('');
      setNewCompany('');
      setNewDuration('');
      setNewDesc('');
      setNewCertificateName('');
      return;
    }
    
    // Scenario 2: Certificate is NOT uploaded -> Role, Company, Duration are mandatory
    if (!newRole.trim() || !newCompany.trim() || !newDuration.trim()) {
      setInternshipError('Please upload an internship certificate OR fill in the Role, Company, and Duration fields.');
      return;
    }
    
    setInternshipError('');
    setInternships([
      ...internships,
      {
        role: newRole.trim(),
        company: newCompany.trim(),
        duration: newDuration.trim(),
        desc: newDesc.trim(),
        certificate: ''
      }
    ]);
    setNewRole('');
    setNewCompany('');
    setNewDuration('');
    setNewDesc('');
    setNewCertificateName('');
  };

  const handleInternshipCertificateChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewCertificateName(e.target.files[0].name);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveInternship = (index) => {
    setInternships(internships.filter((_, idx) => idx !== index));
  };

  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileError('');
    
    if (startYear && endYear && parseInt(startYear) > parseInt(endYear)) {
      setProfileError('Start year cannot be greater than graduation year.');
      return;
    }

    updateUser({
      name,
      email,
      phone,
      bio,
      languages,
      education,
      eduGradYear,
      school,
      startYear,
      endYear,
      jobTitle,
      location,
      avatar,
      skills,
      internships,
      certificates,
      resumeName
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setCurrentPage('student-dashboard');
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-950 dark:text-white">Profile Builder</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your digital resume, credentials, and internship details.</p>
        </div>
        
        <button
          onClick={handleSaveProfile}
          className="rounded-xl bg-blue-800 hover:bg-blue-755 text-white dark:bg-amber-600 dark:text-slate-900 dark:hover:bg-amber-500 px-5 py-3 text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
        >
          <Save className="h-4.5 w-4.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {profileError && (
        <div className="p-4 mb-6 rounded-2xl bg-red-50 text-red-800 border border-red-200 flex items-center gap-3 text-sm dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/40">
          <span>{profileError}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 mb-6 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-250 flex items-center gap-3 text-sm dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40 animate-pulse-slow">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>Profile synced successfully! Returning to dashboard...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Personal Info Card & Resume & Skills */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Avatar details */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col items-center text-center">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-blue-800 dark:bg-amber-600 text-amber-500 dark:text-slate-900 flex items-center justify-center text-3xl font-bold shadow-md overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  name ? name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white shadow-inner"
              >
                <Upload className="h-6 w-6" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-955 dark:text-white mt-4">{name || 'Your Name'}</h3>
            <span className="text-xs text-slate-400 mt-1">{email}</span>
            <div className="w-full border-t border-slate-200/50 dark:border-slate-850 my-4 pt-4 flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400 text-left">
              <div><strong>Phone:</strong> {phone}</div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-slate-450" />
                <span>{languages}</span>
              </div>
            </div>
          </div>

          {/* Resume Upload Container */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
            <h3 className="font-display text-sm font-bold text-slate-950 dark:text-white mb-4 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-800 dark:text-amber-500" />
              <span>Resume Attachment</span>
            </h3>
            
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <span className="block text-xs font-semibold text-slate-655 dark:text-slate-350">Upload Digital Resume</span>
              <span className="block text-[10px] text-slate-400 mt-1">Accepts PDF, DOCX up to 5MB</span>
            </div>

            {resumeName && (
              <div className="mt-4 p-3.5 rounded-xl bg-blue-50/50 dark:bg-slate-950 border border-blue-150/40 dark:border-slate-850 flex items-center justify-between text-xs text-slate-655 dark:text-slate-350">
                <span className="truncate max-w-[200px]">{resumeName}</span>
                <span className="font-bold text-blue-800 dark:text-amber-500">Selected</span>
              </div>
            )}
          </div>

          {/* Skills Management */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col">
            <h3 className="font-display text-sm font-bold text-slate-950 dark:text-white mb-3">Skills Tags</h3>
            <div className="flex flex-nowrap overflow-x-auto no-scrollbar items-center gap-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 h-[46px] focus-within:border-blue-800 focus-within:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-amber-500 transition-colors cursor-text" onClick={() => document.getElementById('skill-input')?.focus()}>
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="shrink-0 inline-flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-1 pl-2.5 pr-1.5 rounded-lg text-xs font-semibold text-slate-750 dark:text-slate-300 shadow-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveSkill(skill); }}
                    className="p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                id="skill-input"
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
                placeholder={skills.length === 0 ? "e.g. Opera PMS" : ""}
                className="flex-1 bg-transparent min-w-[120px] text-xs text-slate-900 focus:outline-none dark:text-white"
              />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Form Fields, Education, Internships, Certificates */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Personal Info Form */}
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col gap-6">
            <h3 className="font-display text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-3">
              <User className="h-4.5 w-4.5 text-blue-800 dark:text-amber-500" />
              <span>Bio & Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-slate-205 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-455 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="rounded-xl border border-slate-205 bg-slate-100 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wide">Phone Number</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-205 bg-slate-50 focus-within:border-blue-800 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-amber-500 transition-colors">
                  <div className="flex items-center justify-center px-3 bg-slate-100 dark:bg-slate-900 border-r border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    +91
                  </div>
                  <input
                    type="text"
                    value={phone.replace(/^\+?91\s*/, '')}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').substring(0, 10);
                      setPhone('+91 ' + val);
                    }}
                    placeholder="xxxxxxxxx"
                    className="flex-1 bg-transparent px-3 py-2.5 text-xs text-slate-900 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wide">Languages Spoken</label>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <div className="flex flex-nowrap overflow-x-auto no-scrollbar items-center gap-1.5 w-full rounded-xl border border-slate-205 bg-slate-50 px-3 py-2 h-[46px] focus-within:border-blue-800 focus-within:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-amber-500 transition-colors cursor-text" onClick={() => document.getElementById('lang-search-input')?.focus()}>
                      {currentLanguages.map(lang => (
                        <span key={lang} className="shrink-0 inline-flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-1 pl-2.5 pr-1.5 rounded-lg text-xs font-semibold text-slate-750 dark:text-slate-300 shadow-sm">
                          <span>{lang}</span>
                          <button type="button" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveLanguage(lang); }} className="p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 cursor-pointer">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        id="lang-search-input"
                        type="text"
                        value={langSearch}
                        onChange={(e) => { setLangSearch(e.target.value); setShowLangDropdown(true); }}
                        onFocus={() => setShowLangDropdown(true)}
                        onBlur={() => setTimeout(() => setShowLangDropdown(false), 200)}
                        placeholder={currentLanguages.length === 0 ? "Search and add a language..." : ""}
                        className="flex-1 bg-transparent min-w-[120px] text-xs text-slate-900 focus:outline-none dark:text-white"
                      />
                    </div>
                    {showLangDropdown && (
                      <ul className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg">
                        {WORLD_LANGUAGES.filter(l => l.toLowerCase().includes(langSearch.toLowerCase())).map(lang => (
                          <li
                            key={lang}
                            onMouseDown={(e) => { e.preventDefault(); handleAddLanguage(lang); }}
                            className="px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            {lang}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-455 uppercase tracking-wide">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setShowLocationSuggestions(true); }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full rounded-xl border border-slate-205 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                  />
                  {showLocationSuggestions && location && (
                    <ul className="absolute z-10 w-full top-[100%] mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg">
                      {locationSuggestions.map((place, idx) => (
                        <li key={idx} 
                            onMouseDown={(e) => { e.preventDefault(); setLocation(place); setShowLocationSuggestions(false); }}
                            className="px-4 py-2 text-[11px] leading-tight text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                          {place}
                        </li>
                      ))}
                      {locationSuggestions.length === 0 && location.length >= 1 && (
                          <li className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 italic text-center">No matching places found.</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-455 uppercase tracking-wide">Job Title (Optional)</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Front Office Manager"
                  className="rounded-xl border border-slate-205 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wide">Brief Biography</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-xl border border-slate-205 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Education Form */}
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col gap-5">
            <h3 className="font-display text-base font-bold text-slate-955 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-3">
              <GraduationCap className="h-5 w-5 text-blue-805 dark:text-amber-550" />
              <span>Academic Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div className="sm:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wide">School / University / Institute</label>
                <div className="relative">
                  <input
                    type="text"
                    value={school || education}
                    onChange={(e) => { setSchool(e.target.value); setEducation(e.target.value); setShowSchoolSuggestions(true); }}
                    onFocus={() => setShowSchoolSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSchoolSuggestions(false), 200)}
                    placeholder="e.g. IHM Pusa"
                    className="w-full rounded-xl border border-slate-205 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                  />
                  {showSchoolSuggestions && (school || education) && (
                    <ul className="absolute z-10 w-full top-[100%] mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg">
                      {schoolSuggestions.map((place, idx) => (
                        <li key={idx} 
                            onMouseDown={(e) => { e.preventDefault(); setSchool(place); setEducation(place); setShowSchoolSuggestions(false); }}
                            className="px-4 py-2 text-[11px] leading-tight text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                          {place}
                        </li>
                      ))}
                      {schoolSuggestions.length === 0 && (school || education).length >= 1 && (
                          <li className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 italic text-center">No matching colleges found.</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-455 uppercase tracking-wide">Start Year</label>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className="rounded-xl border border-slate-205 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 cursor-pointer"
                >
                  <option value="" disabled>Select Year</option>
                  {YEAR_OPTIONS.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-455 uppercase tracking-wide">Graduation Year</label>
                <select
                  value={endYear || eduGradYear}
                  onChange={(e) => { setEndYear(e.target.value); setEduGradYear(e.target.value); }}
                  className="rounded-xl border border-slate-205 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500 cursor-pointer"
                >
                  <option value="" disabled>Select Year</option>
                  {YEAR_OPTIONS.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Internships List */}
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-850 pb-3">
              <h3 className="font-display text-base font-bold text-slate-955 dark:text-white flex items-center gap-2">
                <Briefcase className="h-4.5 w-4.5 text-blue-805 dark:text-amber-550" />
                <span>Internship Experience</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddInternship(!showAddInternship)}
                className="text-xs font-bold text-blue-800 dark:text-amber-500 hover:underline flex items-center gap-0.5"
              >
                {showAddInternship ? 'Cancel' : '+ Add Internship'}
              </button>
            </div>

            {showAddInternship && (
              <form onSubmit={handleAddInternshipSubmit} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase">Role / Job Title</label>
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="e.g. F&B Rotation Intern"
                      className="rounded-xl border border-slate-205 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase">Hotel / Company</label>
                    <input
                      type="text"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="e.g. Ritz-Carlton Miami"
                      className="rounded-xl border border-slate-205 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase">Duration</label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="e.g. 6 Months (2025)"
                      className="rounded-xl border border-slate-205 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-455 uppercase">Description of Duties</label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Assisted guests with orders, performed nightly inventory audits..."
                    className="rounded-xl border border-slate-205 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-455 uppercase">Internship Certificate</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-200 dark:bg-slate-850 hover:bg-slate-300 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-colors max-w-max">
                      <Upload className="h-3.5 w-3.5 text-slate-500" />
                      <span>{newCertificateName || "Upload Certificate (PDF / Image)"}</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          handleInternshipCertificateChange(e);
                          setInternshipError('');
                        }}
                        className="hidden"
                      />
                    </label>
                    {newCertificateName && (
                      <button
                        type="button"
                        onClick={() => setNewCertificateName('')}
                        className="text-slate-450 hover:text-red-500 cursor-pointer"
                        title="Remove uploaded file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {internshipError && (
                    <p className="text-[11px] font-semibold text-red-500 dark:text-red-400 mt-1">{internshipError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-800 text-white dark:bg-amber-600 dark:text-slate-900 py-2 text-xs font-bold hover:bg-blue-755 cursor-pointer"
                >
                  Save Internship Detail
                </button>
              </form>
            )}

            {/* List Display */}
            {internships.length > 0 ? (
              <div className="flex flex-col gap-4">
                {internships.map((intern, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl relative flex justify-between items-start gap-4">
                    <div>
                      {intern.role && (
                        <h4 className="font-bold text-sm text-slate-955 dark:text-white">{intern.role}</h4>
                      )}
                      {(intern.company || intern.duration) && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                          {intern.company}{intern.company && intern.duration ? ' • ' : ''}{intern.duration}
                        </p>
                      )}
                      {intern.desc && (
                        <p className="text-xs text-slate-450 mt-2.5 leading-relaxed">{intern.desc}</p>
                      )}
                      {intern.certificate && (
                        <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-blue-800 dark:text-amber-500 font-bold bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 px-2.5 py-1 rounded-lg max-w-max">
                          <FileText className="h-3.5 w-3.5" />
                          <span>{intern.certificate}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveInternship(idx)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 flex-shrink-0 cursor-pointer"
                      title="Remove experience"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic text-center py-4">No internship experience logged.</span>
            )}
          </div>

          {/* Certifications Form */}
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl flex flex-col gap-6">
            <h3 className="font-display text-base font-bold text-slate-955 dark:text-white flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-3">
              <Award className="h-5 w-5 text-blue-805 dark:text-amber-550" />
              <span>Professional Licenses & Certificates</span>
            </h3>

            <form onSubmit={handleAddCert} className="flex gap-2">
              <input
                type="text"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="e.g. ServSafe Food Protection Manager"
                className="flex-grow rounded-xl border border-slate-205 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-800 focus:bg-white dark:border-slate-800 dark:bg-slate-955 dark:text-white dark:focus:border-amber-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-800 text-white dark:bg-amber-600 dark:text-slate-900 px-4 py-2.5 text-xs font-bold hover:bg-blue-755 cursor-pointer flex items-center justify-center"
              >
                Add
              </button>
            </form>

            {/* List */}
            {certificates.length > 0 ? (
              <div className="flex flex-col gap-3">
                {certificates.map((cert) => (
                  <div key={cert} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-850 dark:text-slate-300">{cert}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(cert)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic text-center">No certifications added yet.</span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
