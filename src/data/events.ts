export interface TeamSize {
  min: number;
  max: number;
}

export interface CoordinatorContact {
  name: string;
  phone: string;
  email: string;
}

export interface EventItem {
  id: string; // slug, e.g. "hackathon"
  slug: string; // matches id
  name: string;
  category: 'TECH' | 'NON-TECH';
  type: 'solo' | 'team';
  teamSize: TeamSize;
  description: string;
  rules: string[];
  venue: string;
  date: string; // ISO date string
  time: string;
  duration: string;
  entryFee: number | 'Free';
  prizePool: string;
  coordinatorContact: CoordinatorContact;
  bannerImage: string;
  registrationDeadline: string; // ISO date string
  iconName?: string;
  hook?: string;
  difficulty?: string;
  isTechnical?: boolean;
}

export const EVENTS_DATA: EventItem[] = [
  // ─── TECH EVENTS (5) ────────────────────────────────────────────────────────
  {
    id: 'hackathon',
    slug: 'hackathon',
    name: 'Hackathon',
    category: 'TECH',
    type: 'team',
    teamSize: { min: 5, max: 5 },
    description:
      'A 24-hour high-intensity software and hardware hackathon. Build innovative solutions for real-world challenges, prototype under pressure, and pitch to industry judges.',
    rules: [
      '[PLACEHOLDER: Add official Hackathon rules list]',
      '[PLACEHOLDER: Submissions must be original work created during the hackathon]',
      '[PLACEHOLDER: Team code repositories must be submitted before final deadline]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., Lab 3 & Main Auditorium]',
    date: '2027-01-20T09:00:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 09:00 AM]',
    duration: '24 Hours',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹50,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Tech Coordinator Name]',
      phone: '[PLACEHOLDER: +91 9876543210]',
      email: '[PLACEHOLDER: hackathon@svgu.ac.in]',
    },
    bannerImage: '/images/events/hackathon-banner.jpg',
    registrationDeadline: '2027-01-18T23:59:59.000Z',
    iconName: 'Terminal',
    hook: '24H BUILD SPRINT',
    difficulty: 'Pro',
    isTechnical: true,
  },
  {
    id: 'project-showcase',
    slug: 'project-showcase',
    name: 'Project Showcase',
    category: 'TECH',
    type: 'team',
    teamSize: { min: 1, max: 2 },
    description:
      'Exhibit your working prototypes, research projects, and hardware/software innovations. Present live working demos to visiting experts and technical panels.',
    rules: [
      '[PLACEHOLDER: Add Project Showcase rules list]',
      '[PLACEHOLDER: Working hardware or live demo is mandatory]',
      '[PLACEHOLDER: Poster and slide deck required for evaluation]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., Exhibition Hall A]',
    date: '2027-01-20T10:00:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 10:00 AM]',
    duration: '6 Hours',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹25,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Showcase Coordinator Name]',
      phone: '[PLACEHOLDER: +91 9876543211]',
      email: '[PLACEHOLDER: showcase@svgu.ac.in]',
    },
    bannerImage: '/images/events/project-showcase-banner.jpg',
    registrationDeadline: '2027-01-18T23:59:59.000Z',
    iconName: 'Cpu',
    hook: 'LIVE EXPOSITION',
    difficulty: 'Intermediate',
    isTechnical: true,
  },
  {
    id: 'workshop',
    slug: 'workshop',
    name: 'Hands-on Tech Workshop',
    category: 'TECH',
    type: 'solo',
    teamSize: { min: 1, max: 1 },
    description:
      'An immersive masterclass led by industry professionals covering cutting-edge frameworks, AI/ML tools, and cloud architecture hands-on.',
    rules: [
      '[PLACEHOLDER: Add Workshop guidelines list]',
      '[PLACEHOLDER: Laptops with required prerequisites installed must be brought by participants]',
      '[PLACEHOLDER: Certificate awarded upon 100% session completion]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., Seminar Hall B]',
    date: '2027-01-21T09:30:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 09:30 AM]',
    duration: '4 Hours',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: N/A - Certification & Kits Provided]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Workshop Lead Name]',
      phone: '[PLACEHOLDER: +91 9876543212]',
      email: '[PLACEHOLDER: workshop@svgu.ac.in]',
    },
    bannerImage: '/images/events/workshop-banner.jpg',
    registrationDeadline: '2027-01-19T23:59:59.000Z',
    iconName: 'BookOpen',
    hook: 'MASTERCLASS',
    difficulty: 'Beginner',
    isTechnical: true,
  },
  {
    id: 'code-sprint',
    slug: 'code-sprint',
    name: 'Code Sprint',
    category: 'TECH',
    type: 'solo',
    teamSize: { min: 1, max: 1 },
    description:
      'Fast-paced algorithmic competitive programming battle. Solve complex data structures and algorithmic challenges under tight time limits on custom test servers.',
    rules: [
      '[PLACEHOLDER: Add Code Sprint rules list]',
      '[PLACEHOLDER: Plagiarism or external code assistance will trigger instant DQ]',
      '[PLACEHOLDER: Leaderboard determined by score and submission speed]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., Computer Lab 1 & 2]',
    date: '2027-01-21T14:00:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 02:00 PM]',
    duration: '3 Hours',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹20,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Code Sprint Lead Name]',
      phone: '[PLACEHOLDER: +91 9876543213]',
      email: '[PLACEHOLDER: codesprint@svgu.ac.in]',
    },
    bannerImage: '/images/events/code-sprint-banner.jpg',
    registrationDeadline: '2027-01-19T23:59:59.000Z',
    iconName: 'Code2',
    hook: 'SPEED CODING',
    difficulty: 'Advanced',
    isTechnical: true,
  },
  {
    id: 'digital-forensics-hunt',
    slug: 'digital-forensics-hunt',
    name: 'Digital Forensics Hunt',
    category: 'TECH',
    type: 'solo',
    teamSize: { min: 1, max: 1 },
    description:
      'A cybersecurity and CTF forensic investigation challenge. Analyze network dumps, reverse-engineer binaries, and uncover hidden flags across encrypted artifacts.',
    rules: [
      '[PLACEHOLDER: Add Digital Forensics rules list]',
      '[PLACEHOLDER: Attacking contest infrastructure or sharing flags is strictly prohibited]',
      '[PLACEHOLDER: Write-ups required for top-tier challenges to claim points]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., Cyber Security Lab]',
    date: '2027-01-20T11:00:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 11:00 AM]',
    duration: '5 Hours',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹15,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: CTF Lead Name]',
      phone: '[PLACEHOLDER: +91 9876543214]',
      email: '[PLACEHOLDER: ctf@svgu.ac.in]',
    },
    bannerImage: '/images/events/forensics-banner.jpg',
    registrationDeadline: '2027-01-18T23:59:59.000Z',
    iconName: 'ShieldAlert',
    hook: 'CYBER CTF',
    difficulty: 'Expert',
    isTechnical: true,
  },

  // ─── NON-TECH EVENTS (7) ─────────────────────────────────────────────────────
  {
    id: 'bgmi',
    slug: 'bgmi',
    name: 'BGMI Esports Arena',
    category: 'NON-TECH',
    type: 'team',
    teamSize: { min: 4, max: 4 },
    description:
      'National Battlegrounds Mobile India esports tournament. Battle in custom rooms across Erangel and Miramar for the championship title.',
    rules: [
      '[PLACEHOLDER: Add BGMI tournament rules list]',
      '[PLACEHOLDER: Emulators and third-party tools prohibited; mobile devices only]',
      '[PLACEHOLDER: All 4 squad members must be registered under the same team name]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., Gaming Zone - Student Center]',
    date: '2027-01-20T13:00:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 01:00 PM]',
    duration: '6 Hours',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹30,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Esports Coordinator Name]',
      phone: '[PLACEHOLDER: +91 9876543215]',
      email: '[PLACEHOLDER: bgmi@svgu.ac.in]',
    },
    bannerImage: '/images/events/bgmi-banner.jpg',
    registrationDeadline: '2027-01-18T23:59:59.000Z',
    iconName: 'Gamepad2',
    hook: 'ESPORTS SQUAD',
    difficulty: 'Pro',
    isTechnical: false,
  },
  {
    id: 'free-fire',
    slug: 'free-fire',
    name: 'Free Fire',
    category: 'NON-TECH',
    type: 'team',
    teamSize: { min: 4, max: 4 },
    description:
      'High-octane mobile showdown. Squad up, drop in, and outplay rival teams to secure the Booyah!',
    rules: [
      '[PLACEHOLDER: Add Free Fire rules list]',
      '[PLACEHOLDER: Only official mobile clients permitted]',
      '[PLACEHOLDER: Point distribution based on placement and kill count]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., Gaming Zone - Arena 2]',
    date: '2027-01-21T10:00:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 10:00 AM]',
    duration: '5 Hours',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹20,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Gaming Coordinator Name]',
      phone: '[PLACEHOLDER: +91 9876543216]',
      email: '[PLACEHOLDER: freefire@svgu.ac.in]',
    },
    bannerImage: '/images/events/freefire-banner.jpg',
    registrationDeadline: '2027-01-19T23:59:59.000Z',
    iconName: 'Swords',
    hook: 'BATTLE ROYALE',
    difficulty: 'Intermediate',
    isTechnical: false,
  },
  {
    id: 'night-life-performances',
    slug: 'night-life-performances',
    name: 'Night Life Cultural Stage',
    category: 'NON-TECH',
    type: 'team',
    teamSize: { min: 1, max: 10 },
    description:
      'The flagship evening cultural showcase. Solo and group performances featuring live music, dance crews, beatboxing, and theatrical acts.',
    rules: [
      '[PLACEHOLDER: Add Performance rules list]',
      '[PLACEHOLDER: Performance duration capped at 8 minutes per act]',
      '[PLACEHOLDER: Audio tracks must be submitted to stage manager 2 hours prior]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., SVGU Open Air Amphitheatre]',
    date: '2027-01-20T18:00:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 06:00 PM]',
    duration: '4 Hours',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹25,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Cultural Head Name]',
      phone: '[PLACEHOLDER: +91 9876543217]',
      email: '[PLACEHOLDER: cultural@svgu.ac.in]',
    },
    bannerImage: '/images/events/night-life-banner.jpg',
    registrationDeadline: '2027-01-18T23:59:59.000Z',
    iconName: 'Music',
    hook: 'CULTURAL SHOWCASE',
    difficulty: 'Open',
    isTechnical: false,
  },
  {
    id: 'treasure-hunt',
    slug: 'treasure-hunt',
    name: 'Campus Treasure Hunt',
    category: 'NON-TECH',
    type: 'team',
    teamSize: { min: 1, max: 5 },
    description:
      'An exhilarating campus-wide mystery hunt. Solve cryptic clues, crack riddles, and race across checkpoints to find the hidden artifact.',
    rules: [
      '[PLACEHOLDER: Add Treasure Hunt rules list]',
      '[PLACEHOLDER: Clues must be solved in chronological order without skipping checkpoints]',
      '[PLACEHOLDER: Any damage to campus property results in disqualification]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., Central Campus Quadrangle]',
    date: '2027-01-21T11:00:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 11:00 AM]',
    duration: '3 Hours',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹15,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Hunt Coordinator Name]',
      phone: '[PLACEHOLDER: +91 9876543218]',
      email: '[PLACEHOLDER: treasurehunt@svgu.ac.in]',
    },
    bannerImage: '/images/events/treasure-hunt-banner.jpg',
    registrationDeadline: '2027-01-19T23:59:59.000Z',
    iconName: 'MapPin',
    hook: 'CAMPUS MYSTERY',
    difficulty: 'Intermediate',
    isTechnical: false,
  },
  {
    id: 'quiz',
    slug: 'quiz',
    name: 'Tech & Pop-Culture Quiz',
    category: 'NON-TECH',
    type: 'team',
    teamSize: { min: 1, max: 2 },
    description:
      'A battle of wits testing tech trivia, sci-fi lore, current affairs, and general knowledge across multiple fast-fire rounds.',
    rules: [
      '[PLACEHOLDER: Add Quiz rules list]',
      '[PLACEHOLDER: Mobile phones strictly prohibited during quiz rounds]',
      '[PLACEHOLDER: Top 6 teams from prelims advance to stage finals]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., Hall 102]',
    date: '2027-01-20T14:30:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 02:30 PM]',
    duration: '2.5 Hours',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹10,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Quizmaster Name]',
      phone: '[PLACEHOLDER: +91 9876543219]',
      email: '[PLACEHOLDER: quiz@svgu.ac.in]',
    },
    bannerImage: '/images/events/quiz-banner.jpg',
    registrationDeadline: '2027-01-18T23:59:59.000Z',
    iconName: 'HelpCircle',
    hook: 'TRIVIA BATTLE',
    difficulty: 'Beginner',
    isTechnical: false,
  },
  {
    id: 'cricket',
    slug: 'cricket',
    name: 'Box Cricket Tournament',
    category: 'NON-TECH',
    type: 'team',
    teamSize: { min: 8, max: 10 },
    description:
      'Fast-paced box cricket league matches. High-intensity 6-over games with custom arena boundaries and knockout brackets.',
    rules: [
      '[PLACEHOLDER: Add Cricket rules list]',
      '[PLACEHOLDER: Playing 8 + 2 substitutes allowed per team squad]',
      '[PLACEHOLDER: Umpires decision is final and binding]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., SVGU Sports Turf Ground]',
    date: '2027-01-20T08:00:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 08:00 AM]',
    duration: 'Full Day',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹20,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Sports Head Name]',
      phone: '[PLACEHOLDER: +91 9876543220]',
      email: '[PLACEHOLDER: cricket@svgu.ac.in]',
    },
    bannerImage: '/images/events/cricket-banner.jpg',
    registrationDeadline: '2027-01-18T23:59:59.000Z',
    iconName: 'Trophy',
    hook: 'BOX CRICKET',
    difficulty: 'Open',
    isTechnical: false,
  },
  {
    id: 'volleyball',
    slug: 'volleyball',
    name: 'Smash Volleyball Championship',
    category: 'NON-TECH',
    type: 'team',
    teamSize: { min: 6, max: 8 },
    description:
      'Spike your way to victory in the inter-college volleyball tournament. Best of 3 sets knockout format on outdoor courts.',
    rules: [
      '[PLACEHOLDER: Add Volleyball rules list]',
      '[PLACEHOLDER: Playing 6 + 2 substitutes allowed per team squad]',
      '[PLACEHOLDER: Standard FIVB rally point system applies]',
    ],
    venue: '[PLACEHOLDER: Add venue name, e.g., Outdoor Volleyball Court]',
    date: '2027-01-21T08:30:00.000Z',
    time: '[PLACEHOLDER: Add event start time, e.g., 08:30 AM]',
    duration: 'Full Day',
    entryFee: 'Free',
    prizePool: '[PLACEHOLDER: Add prize pool amount, e.g., ₹15,000]',
    coordinatorContact: {
      name: '[PLACEHOLDER: Volleyball Coordinator Name]',
      phone: '[PLACEHOLDER: +91 9876543221]',
      email: '[PLACEHOLDER: volleyball@svgu.ac.in]',
    },
    bannerImage: '/images/events/volleyball-banner.jpg',
    registrationDeadline: '2027-01-19T23:59:59.000Z',
    iconName: 'Activity',
    hook: 'VOLLEYBALL LEAGUE',
    difficulty: 'Open',
    isTechnical: false,
  },
];
