// Mock data for HospiHire Platform

export const initialJobs = [
  {
    id: 'job-1',
    title: 'Assistant Front Office Manager',
    company: 'The Ritz-Carlton',
    logo: 'RC',
    logoBg: 'bg-slate-900 text-amber-500',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    experience: 'Mid-level (2-4 years)',
    salary: '$58,000 - $65,000 / year',
    salaryMin: 58000,
    salaryMax: 65000,
    category: 'Front Office & Guest Relations',
    description: 'We are seeking a guest-centric Assistant Front Office Manager to lead our front desk operations, supervise guest relations agents, and ensure the highest standards of luxury hospitality.',
    requirements: [
      'Degree in Hospitality Management or equivalent experience.',
      'Minimum 2 years of supervisory experience in a luxury hotel.',
      'Proficiency in Opera PMS is highly preferred.',
      'Excellent communication and leadership skills.'
    ],
    postedAt: '2 days ago'
  },
  {
    id: 'job-2',
    title: 'Culinary Management Intern',
    company: 'Marriott International',
    logo: 'MI',
    logoBg: 'bg-red-700 text-white',
    location: 'Bengaluru, Karnataka',
    type: 'Internship',
    experience: 'Entry-level (0-1 year)',
    salary: '$18 - $22 / hour',
    salaryMin: 35000, // annualized equivalent approx
    salaryMax: 45000,
    category: 'Food & Beverage / Culinary',
    description: 'Kickstart your culinary career with our structured 6-month culinary internship. Work alongside Michelin-star chefs and learn kitchen management, menu prep, and banqueting.',
    requirements: [
      'Currently enrolled in or recently graduated from a Culinary Arts / Hotel Management program.',
      'Basic knife skills and knowledge of food safety standards (ServSafe certification is a plus).',
      'Positive attitude and willingness to work flexible kitchen shifts.',
      'Passion for fine dining and international cuisines.'
    ],
    postedAt: '1 day ago'
  },
  {
    id: 'job-3',
    title: 'F&B Operations Supervisor',
    company: 'Four Seasons Resorts',
    logo: 'FS',
    logoBg: 'bg-stone-800 text-stone-200',
    location: 'Panaji, Goa',
    type: 'Full-time',
    experience: 'Mid-level (2-4 years)',
    salary: '$60,000 - $70,000 / year',
    salaryMin: 60000,
    salaryMax: 70000,
    category: 'Food & Beverage / Culinary',
    description: 'Supervise daily restaurant operations, banquet events, and beachside dining. The F&B Supervisor is responsible for staff scheduling, inventory audits, and guest service standard checks.',
    requirements: [
      'Degree in Hospitality or Business Administration preferred.',
      '3+ years in upscale F&B outlets with at least 1 year in a lead/supervisor capacity.',
      'Knowledge of wine pairing, POS systems, and beverage costing.',
      'Active TIPs certification.'
    ],
    postedAt: 'Just now'
  },
  {
    id: 'job-4',
    title: 'Hospitality Management Trainee',
    company: 'Hilton Worldwide',
    logo: 'HW',
    logoBg: 'bg-blue-800 text-white',
    location: 'New Delhi, Delhi',
    type: 'Internship',
    experience: 'Entry-level (0-1 year)',
    salary: '$20 - $24 / hour',
    salaryMin: 40000,
    salaryMax: 50000,
    category: 'General Management',
    description: 'Our global management program rotates candidates through Front Office, Housekeeping, Revenue Management, and F&B over 12 months, preparing you for assistant manager roles.',
    requirements: [
      'Recent hospitality management graduates or final year students.',
      'Strong analytical capabilities and leadership potential.',
      'Mobility within the US is highly desirable.',
      'Fluent in English, bilingual capability is a strong asset.'
    ],
    postedAt: '4 days ago'
  },
  {
    id: 'job-5',
    title: 'Luxury Hotel Sommelier',
    company: 'Rosewood Hotels & Resorts',
    logo: 'RW',
    logoBg: 'bg-amber-950 text-amber-200',
    location: 'Pune, Maharashtra',
    type: 'Full-time',
    experience: 'Senior-level (5+ years)',
    salary: '$75,000 - $90,000 / year',
    salaryMin: 75000,
    salaryMax: 90000,
    category: 'Food & Beverage / Culinary',
    description: 'Manage our award-winning wine cellars and advise guests on custom pairings. This position requires curate cellar inventory, conducting staff wine tastings, and boosting beverage revenue.',
    requirements: [
      'CMS Certified Sommelier or WSET Level 3/4 certification required.',
      'Proven experience in a fine dining / Michelin-starred environment.',
      'Superb customer service skills and story-telling ability.',
      'Expertise in inventory control software.'
    ],
    postedAt: '3 days ago'
  },
  {
    id: 'job-6',
    title: 'Front Office Receptionist',
    company: 'Hyatt Regency',
    logo: 'HR',
    logoBg: 'bg-indigo-900 text-indigo-200',
    location: 'Kolkata, West Bengal',
    type: 'Full-time',
    experience: 'Entry-level (0-1 year)',
    salary: '$40,000 - $48,000 / year',
    salaryMin: 40000,
    salaryMax: 48000,
    category: 'Front Office & Guest Relations',
    description: 'Act as the face of Hyatt Regency. Welcome guests, coordinate seamless check-in and check-out, manage billing requests, and solve guest concerns with empathetic hospitality.',
    requirements: [
      'High school diploma; hospitality diploma is a major plus.',
      'Warm, friendly demeanor and natural passion for customer service.',
      'Excellent verbal and written communication skills.',
      'Familiarity with basic computer applications and phone systems.'
    ],
    postedAt: '5 days ago'
  },
  {
    id: 'job-7',
    title: 'Corporate Event Coordinator',
    company: 'InterContinental Hotels Group',
    logo: 'IH',
    logoBg: 'bg-orange-800 text-white',
    location: 'Chennai, Tamil Nadu',
    type: 'Full-time',
    experience: 'Mid-level (2-4 years)',
    salary: '$65,000 - $75,000 / year',
    salaryMin: 65000,
    salaryMax: 75000,
    category: 'Events & Banquets',
    description: 'Organize high-profile corporate conventions, gala dinners, and exhibitions. Coordinate with F&B, AV, and external decorators to execute seamless banquets and meetings.',
    requirements: [
      'Bachelor in Event Management, Hospitality, or Marketing.',
      '2+ years experience in hotel group event execution or meeting planning.',
      'Highly organized with the ability to handle multiple events simultaneously.',
      'Ability to negotiate service contracts and manage event budgets.'
    ],
    postedAt: '1 week ago'
  },
  {
    id: 'job-8',
    title: 'Executive Housekeeper',
    company: 'Aman Resorts',
    logo: 'AR',
    logoBg: 'bg-stone-900 text-yellow-600',
    location: 'Shimla, Himachal Pradesh',
    type: 'Full-time',
    experience: 'Senior-level (5+ years)',
    salary: '$80,000 - $95,000 / year',
    salaryMin: 80000,
    salaryMax: 95000,
    category: 'Housekeeping & Rooms Control',
    description: 'Direct the housekeeping department in our ultra-luxury mountain resort. Maintain pristine cleanliness guidelines, manage laundry contracts, and design room inspection audit logs.',
    requirements: [
      '5+ years executive housekeeping experience in a 5-star resort environment.',
      'Expertise in budgeting, laundry mechanics, and chemical safety.',
      'Strong leadership to manage a diverse team of 40+ room attendants.',
      'Meticulous eye for detail and luxury standards.'
    ],
    postedAt: '6 days ago'
  }
];

export const topEmployers = [
  {
    id: 'emp-1',
    name: 'Marriott International',
    type: 'Hotel Chain',
    location: 'Global (30 Brands)',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    jobsCount: 142
  },
  {
    id: 'emp-2',
    name: 'The Ritz-Carlton',
    type: 'Luxury Resorts',
    location: 'Global Luxury',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    jobsCount: 38
  },
  {
    id: 'emp-3',
    name: 'Four Seasons Resorts',
    type: 'Luxury Hotels & Resorts',
    location: 'Global Luxury',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    jobsCount: 54
  },
  {
    id: 'emp-4',
    name: 'Aman Resorts',
    type: 'Ultra-Luxury Boutique',
    location: 'Remote Luxury Havens',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    jobsCount: 12
  },
  {
    id: 'emp-5',
    name: 'Rosewood Hotels & Resorts',
    type: 'Premium Lifestyle Resorts',
    location: 'Key Metropolitan Cities',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    jobsCount: 29
  },
  {
    id: 'emp-6',
    name: 'Nobu Restaurants & Hotels',
    type: 'Fine Dining / Boutique',
    location: 'Global Hubs',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    jobsCount: 19
  }
];

export const testimonials = [
  {
    id: 't-1',
    name: 'Samantha Peterson',
    role: 'Front Office Receptionist at Hyatt',
    avatar: 'SP',
    avatarBg: 'bg-emerald-600',
    content: 'HospiHire helped me secure my dream receptionist position within weeks of graduating from my hotel management course. The resume builder and direct hotel contacts made all the difference!'
  },
  {
    id: 't-2',
    name: 'David Kim',
    role: 'Culinary Trainee at Marriott',
    avatar: 'DK',
    avatarBg: 'bg-purple-600',
    content: 'The platform is built specifically for our industry. Finding structural internship options that rotate through departments was incredibly easy. I highly recommend it to all students.'
  },
  {
    id: 't-3',
    name: 'Elena Rostova',
    role: 'Assistant F&B Director at Four Seasons',
    avatar: 'ER',
    avatarBg: 'bg-sky-600',
    content: 'As a mid-career professional, finding recruiters who understand luxury hospitality is rare. HospiHire connected me directly with resort hiring managers, saving me months of searching.'
  }
];
