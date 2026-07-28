// ─────────────────────────────────────────────────────────────────────────────
// TECH KURUKSHETRA — Static Dummy Data (no database required)
// ─────────────────────────────────────────────────────────────────────────────

export const EVENTS: any[] = [
  {
    id: '1', slug: 'hackathon', name: 'Hackathon', tagline: 'Code. Create. Conquer.',
    description: '24-hour non-stop coding battle. Build an innovative solution to a real-world problem and compete for the grand prize pool.',
    category: 'Technical', icon: 'Code2', difficulty: 'Advanced',
    prizePool: 'Rs.50,000', firstPrize: 'Rs.30,000', secondPrize: 'Rs.15,000', thirdPrize: 'Rs.5,000',
    teamSize: '2-4', duration: '24 Hours', venue: 'Block-C Computer Lab', date: '2026-09-15', registrationOpen: true, maxParticipants: 200,
    rules: ['Teams of 2-4 members.', 'Participants must bring their own laptops.', 'No pre-built projects allowed.', 'Internet and AI tools allowed with disclosure.', 'Final submission must be a working prototype with source code.'],
    judges: ['Dr. Amit Shah', 'Ms. Priya Menon', 'Mr. Rohan Das'],
    schedule: [{ time: '09:00 AM', event: 'Registration and Briefing' }, { time: '10:00 AM', event: 'Hacking Begins' }, { time: '10:00 AM Next Day', event: 'Submission Deadline' }, { time: '02:00 PM Next Day', event: 'Results and Prize Distribution' }],
  },
  {
    id: '2', slug: 'robotics', name: 'Robotics Arena', tagline: 'Steel Meets Strategy.',
    description: 'Design, build and battle your robot in themed obstacle courses. Precision engineering meets battlefield tactics.',
    category: 'Technical', icon: 'Cpu', difficulty: 'Expert',
    prizePool: 'Rs.40,000', firstPrize: 'Rs.25,000', secondPrize: 'Rs.10,000', thirdPrize: 'Rs.5,000',
    teamSize: '2-5', duration: '2 Days', venue: 'Block-D Workshop', date: '2026-09-15', registrationOpen: true, maxParticipants: 100,
    rules: ['Robot weight limit 5 kg.', 'Power supply 12V DC max.', 'No wireless jamming devices.', 'Teams must submit design documentation before the event.'],
    judges: ['Prof. K. Narang', 'Dr. Savita Joshi'],
    schedule: [{ time: 'Day 1 10:00 AM', event: 'Robot Scrutineering' }, { time: 'Day 1 02:00 PM', event: 'Qualifier Rounds' }, { time: 'Day 2 10:00 AM', event: 'Semi-Finals' }, { time: 'Day 2 04:00 PM', event: 'Grand Final and Awards' }],
  },
  {
    id: '3', slug: 'esports', name: 'Esports Championship', tagline: 'Kill Lag. Not Time.',
    description: 'BGMI and Valorant tournaments running simultaneously. Show your aim, your strategy, and your clutch instincts.',
    category: 'Gaming', icon: 'Gamepad2', difficulty: 'Intermediate',
    prizePool: 'Rs.25,000', firstPrize: 'Rs.15,000', secondPrize: 'Rs.7,000', thirdPrize: 'Rs.3,000',
    teamSize: '1-5', duration: '1 Day', venue: 'Block-A Seminar Hall', date: '2026-09-16', registrationOpen: true, maxParticipants: 300,
    rules: ['Separate brackets for BGMI and Valorant.', 'Own devices allowed.', 'No hacks or cheats.', 'Referee decisions are final.'],
    judges: ['Gaming Community Refs'],
    schedule: [{ time: '09:00 AM', event: 'Warm-up and Seeding' }, { time: '10:00 AM', event: 'Group Stage' }, { time: '03:00 PM', event: 'Quarter-Finals' }, { time: '06:00 PM', event: 'Finals and Prize Distribution' }],
  },
  {
    id: '4', slug: 'logic-quiz', name: 'Logic Quiz', tagline: 'Sharpen Your Mind Blade.',
    description: 'Multi-round rapid-fire quiz spanning Computer Science, General Tech, Aptitude, and Current Affairs in Tech.',
    category: 'Academic', icon: 'Brain', difficulty: 'Beginner',
    prizePool: 'Rs.10,000', firstPrize: 'Rs.6,000', secondPrize: 'Rs.3,000', thirdPrize: 'Rs.1,000',
    teamSize: '2', duration: '3 Hours', venue: 'Block-B Lecture Hall', date: '2026-09-16', registrationOpen: true, maxParticipants: 150,
    rules: ['Teams of exactly 2 members.', 'No mobile phones during rounds.', 'Quiz-master decision is final.', 'Negative marking applies in final round.'],
    judges: ['Faculty Panel'],
    schedule: [{ time: '10:00 AM', event: 'Prelims' }, { time: '12:00 PM', event: 'Semi-Finals' }, { time: '02:00 PM', event: 'Grand Final' }],
  },
  {
    id: '5', slug: 'paper-presentation', name: 'Paper Presentation', tagline: 'Ideas That Change Battlefields.',
    description: 'Present your research paper or innovative idea to a panel of faculty and industry experts.',
    category: 'Academic', icon: 'FileText', difficulty: 'Advanced',
    prizePool: 'Rs.8,000', firstPrize: 'Rs.5,000', secondPrize: 'Rs.2,000', thirdPrize: 'Rs.1,000',
    teamSize: '1-2', duration: '1 Day', venue: 'Block-C Conference Room', date: '2026-09-15', registrationOpen: true, maxParticipants: 80,
    rules: ['Paper must be original — plagiarism leads to disqualification.', 'Presentation time: 8 minutes plus 2 minutes Q&A.', 'Soft copy must be submitted 3 days before the event.'],
    judges: ['Dr. M. Patel', 'Prof. R. Sharma'],
    schedule: [{ time: '10:00 AM', event: 'Presentations Begin' }, { time: '04:00 PM', event: 'Results Announced' }],
  },
  {
    id: '6', slug: 'web-design', name: 'Web Design Clash', tagline: 'Pixels Are Your Weapons.',
    description: 'Design and build a complete website in 90 minutes based on a surprise theme revealed at the start.',
    category: 'Technical', icon: 'Layout', difficulty: 'Intermediate',
    prizePool: 'Rs.12,000', firstPrize: 'Rs.7,000', secondPrize: 'Rs.3,500', thirdPrize: 'Rs.1,500',
    teamSize: '1-2', duration: '90 Minutes', venue: 'Block-C Computer Lab', date: '2026-09-16', registrationOpen: true, maxParticipants: 100,
    rules: ['Only HTML, CSS, and vanilla JS allowed.', 'No frameworks permitted.', 'Internet allowed for reference only.', 'No pre-written code snippets.'],
    judges: ['Tech Team Faculty'],
    schedule: [{ time: '11:00 AM', event: 'Theme Reveal and Start' }, { time: '12:30 PM', event: 'Submission Deadline' }, { time: '02:00 PM', event: 'Judging and Results' }],
  },
];

export const TIMELINE: any[] = [
  { id: '1', order: 1, phase: 'Phase I', title: 'Registrations Open', date: 'August 1, 2026', description: 'Online registrations begin for all events. Early-bird slots fill fast.', status: 'completed', icon: 'UserPlus' },
  { id: '2', order: 2, phase: 'Phase II', title: 'Team Formation Deadline', date: 'August 25, 2026', description: 'Finalize your team rosters and submit team details through the portal.', status: 'current', icon: 'Users' },
  { id: '3', order: 3, phase: 'Phase III', title: 'Paper Submission Deadline', date: 'September 1, 2026', description: 'Last date to submit research papers and project proposals for review.', status: 'upcoming', icon: 'FileText' },
  { id: '4', order: 4, phase: 'Phase IV', title: 'Confirmation and Briefing', date: 'September 10, 2026', description: 'Participant confirmation emails sent. Venue and schedule details released.', status: 'upcoming', icon: 'Mail' },
  { id: '5', order: 5, phase: 'Phase V', title: 'Day 1 — The Battle Begins', date: 'September 15, 2026', description: 'Hackathon, Robotics, Paper Presentation commence. Opening Ceremony at 9 AM.', status: 'upcoming', icon: 'Flame' },
  { id: '6', order: 6, phase: 'Phase VI', title: 'Day 2 — Finals and Closing', date: 'September 16, 2026', description: 'Esports, Logic Quiz, Web Design Clash finals. Grand prize distribution and closing ceremony.', status: 'upcoming', icon: 'Trophy' },
];

export const TEAM_MEMBERS: any[] = [
  { id: '1', name: 'Dr. Rajesh Kumar', role: 'Faculty Coordinator', category: 'Organiser', department: 'Computer Science', bio: 'Department Head and chief academic coordinator for Tech Kurukshetra since its inception.', photoUrl: '', linkedinUrl: '', githubUrl: '', displayOrder: 1 },
  { id: '2', name: 'Arjun Mehta', role: 'Event Director', category: 'Organiser', department: 'CSE Final Year', bio: 'Leads the core organizing team and oversees all event logistics end-to-end.', photoUrl: '', linkedinUrl: '', githubUrl: '', displayOrder: 2 },
  { id: '3', name: 'Priya Sharma', role: 'Tech Lead', category: 'Tech Team', department: 'CSE Third Year', bio: 'Built the entire registration platform and participant portal for this edition.', photoUrl: '', linkedinUrl: '', githubUrl: '', displayOrder: 3 },
  { id: '4', name: 'Kavya Patel', role: 'Design Lead', category: 'Tech Team', department: 'IT Third Year', bio: 'Creative director responsible for the battlefield visual identity and all digital assets.', photoUrl: '', linkedinUrl: '', githubUrl: '', displayOrder: 4 },
  { id: '5', name: 'Rohan Verma', role: 'Finance Head', category: 'Finance', department: 'CSE Final Year', bio: 'Manages sponsorship budgets, prize pool allocations, and vendor payments.', photoUrl: '', linkedinUrl: '', githubUrl: '', displayOrder: 5 },
  { id: '6', name: 'Sneha Joshi', role: 'Social Media Manager', category: 'Social Media', department: 'IT Second Year', bio: 'Drives all social media campaigns, outreach and participant engagement.', photoUrl: '', linkedinUrl: '', githubUrl: '', displayOrder: 6 },
  { id: '7', name: 'Vikram Singh', role: 'Logistics Head', category: 'Management planing and operational Team', department: 'ECE Final Year', bio: 'Handles venue setup, resource allocation, and day-of-event operations.', photoUrl: '', linkedinUrl: '', githubUrl: '', displayOrder: 7 },
  { id: '8', name: 'Anisha Gupta', role: 'Promotions Lead', category: 'Promotion', department: 'IT Third Year', bio: 'Manages outreach to colleges across Gujarat and coordinates campus ambassadors.', photoUrl: '', linkedinUrl: '', githubUrl: '', displayOrder: 8 },
];

export const ANNOUNCEMENTS: any[] = [
  { id: '1', title: 'Registrations Are Now Open!', content: 'We are thrilled to announce that registrations for Tech Kurukshetra 2026 are officially open. Head over to the Register page and secure your spot in the arena. Limited seats available.', category: 'General', isPublished: true, createdAt: '2026-08-01T09:00:00Z' },
  { id: '2', title: 'Hackathon Problem Statements Released', content: 'The 5 problem statement domains for the 24-hour Hackathon have been published. Review them on the Arenas page under the Hackathon section. Start forming your teams and strategizing now.', category: 'Technical', isPublished: true, createdAt: '2026-08-10T11:00:00Z' },
  { id: '3', title: 'Robotics Arena: Bot Weight Limit Update', content: 'After team feedback, we have revised the robot weight limit from 3 kg to 5 kg for the Robotics Arena event. All other specifications remain unchanged.', category: 'Technical', isPublished: true, createdAt: '2026-08-15T14:30:00Z' },
  { id: '4', title: 'Sponsorship Opportunities Available', content: 'We are actively seeking sponsors for Tech Kurukshetra 2026. Platinum, Gold and Silver tiers are available. Contact us at btech_events@svgu.ac.in for the sponsorship brochure.', category: 'General', isPublished: true, createdAt: '2026-08-20T10:00:00Z' },
];

export const SPONSORS: any[] = [
  { id: '1', name: 'TechCorp Solutions', logoUrl: '', tier: 'Platinum', websiteUrl: 'https://example.com', order: 1 },
  { id: '2', name: 'CloudBridge Systems', logoUrl: '', tier: 'Gold', websiteUrl: 'https://example.com', order: 2 },
  { id: '3', name: 'ByteForge Labs', logoUrl: '', tier: 'Gold', websiteUrl: 'https://example.com', order: 3 },
  { id: '4', name: 'DataStream Analytics', logoUrl: '', tier: 'Silver', websiteUrl: 'https://example.com', order: 4 },
  { id: '5', name: 'NexGen Robotics', logoUrl: '', tier: 'Silver', websiteUrl: 'https://example.com', order: 5 },
];
