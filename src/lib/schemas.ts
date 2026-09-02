import { z } from 'zod';

// Bot honeypot: this field must remain empty on real submissions
const HONEYPOT_MAX = 0;

export const ContactSubmitSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  subject: z.string().trim().max(200).optional().default('General Inquiry'),
  message: z.string().trim().min(5, 'Message is too short').max(5000),
  hp: z.string().max(HONEYPOT_MAX, 'Bot detected').optional().default(''),
});

export const PlayerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required').max(100),
  email: z.string().trim().email('Invalid email address format').max(255),
  phone: z.string().trim().min(7, 'Valid phone number required').max(20),
  college: z.string().trim().min(2, 'College name is required').max(200),
  yearOfStudy: z.string().trim().min(1, 'Year of study is required').max(50),
  isCaptain: z.boolean().default(false),
});

export const RegistrationSaveSchema = z.object({
  orderId: z.string().trim().min(1, 'Order ID is required').max(100),
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address format').max(255),
  phone: z.string().trim().max(20).optional().default(''),
  college: z.string().trim().max(200).optional().default(''),
  mode: z.enum(['individual', 'team']).default('individual'),
  teamName: z.string().trim().max(100).optional().default(''),
  teamSize: z.string().trim().max(10).optional().default(''),
  eventSlug: z.string().trim().max(100).optional().default(''),
  paymentStatus: z.string().trim().max(50).default('completed'),
  players: z.array(PlayerSchema).optional().default([]),
  rawPayload: z.record(z.any()).optional(),
  hp: z.string().max(HONEYPOT_MAX, 'Bot detected').optional().default(''),
});

export const AdminLoginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required').max(100),
  password: z.string().min(1, 'Password is required').max(256),
});

export const AdminSignupSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().trim().email('Invalid email address format').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(256),
  fullName: z.string().trim().min(2).max(100).optional().default(''),
  role: z.enum(['admin', 'superadmin']).default('admin'),
});

export const EventSaveSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, 'Event name is required').max(100),
  slug: z.string().trim().max(100).optional().default(''),
  hook: z.string().trim().max(150).optional().default(''),
  description: z.string().trim().min(5, 'Description is required').max(2000),
  longDescription: z.string().trim().max(10000).optional().default(''),
  iconName: z.string().trim().max(50).optional().default('Code2'),
  prize: z.string().trim().max(100).optional().default('TBA'),
  prizePool: z.string().trim().max(100).optional().default('TBA'),
  difficulty: z.string().trim().max(50).optional().default('Intermediate'),
  category: z.string().trim().max(50).optional().default('TECH'),
  isTechnical: z.boolean().default(true),
  type: z.string().trim().max(50).optional().default('team'),
  teamSize: z.union([
    z.object({
      min: z.number().optional().default(1),
      max: z.number().optional().default(1),
    }),
    z.string(),
    z.number(),
    z.any()
  ]).optional().default({ min: 1, max: 1 }),
  rules: z.array(z.string().trim().max(500)).optional().default([]),
  eligibility: z.string().trim().max(300).optional().default('Open to all students'),
  duration: z.string().trim().max(100).optional().default('24h'),
  venue: z.string().trim().max(200).optional().default(''),
  location: z.string().trim().max(200).optional().default(''),
  date: z.string().trim().max(100).optional().default(''),
  time: z.string().trim().max(100).optional().default(''),
  registrationDeadline: z.string().trim().max(100).optional().default(''),
  entryFee: z.union([z.number(), z.string()]).optional().default('Free'),
  registrationFee: z.string().trim().max(50).optional().default('Free'),
  coordinatorContact: z.union([
    z.object({
      name: z.string().trim().optional().default(''),
      phone: z.string().trim().optional().default(''),
      email: z.string().trim().optional().default(''),
    }),
    z.string(),
    z.any()
  ]).optional().default({ name: '', phone: '', email: '' }),
  bannerImage: z.string().trim().max(1000).optional().default(''),
  imageUrl: z.string().trim().max(1000).optional().default(''),
  eventHead: z.string().trim().max(100).optional().default(''),
  organiserContact: z.string().trim().max(100).optional().default(''),
  startTime: z.string().trim().max(100).optional().default(''),
  endTime: z.string().trim().max(100).optional().default(''),
  festivalDayId: z.string().trim().max(100).optional().default(''),
});

export const AnnouncementSaveSchema = z.object({
  title: z.string().trim().min(2, 'Title is required').max(200),
  content: z.string().trim().min(5, 'Content is required').max(10000),
  category: z.enum(['Update', 'Deadline', 'General']).default('General'),
  isPinned: z.boolean().default(false),
  deadlineDate: z.string().trim().max(100).optional().default(''),
  author: z.string().trim().max(100).optional().default('Organizing Committee'),
});

export const SponsorSaveSchema = z.object({
  name: z.string().trim().min(2, 'Sponsor name is required').max(100),
  // 'tier' is what the Admin form sends; 'category' is the DB field name — accept both, tier wins
  tier: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional().default('Partner'),
  logoUrl: z.string().trim().max(1000).optional().default(''),
  websiteUrl: z.string().trim().max(1000).optional().default(''),
  order: z.number().int().min(0).default(0),
});

export const TeamMemberSaveSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  role: z.string().trim().min(2, 'Role is required').max(100),
  group: z.string().trim().max(100).optional().default('Organiser'),
  photoUrl: z.string().trim().max(1000).optional().default(''),
  linkedinUrl: z.string().trim().max(1000).optional().default(''),
  order: z.number().int().min(0).default(0),
});

export const TimelineSaveSchema = z.object({
  date: z.string().trim().min(2, 'Date is required').max(100),
  title: z.string().trim().min(2, 'Title is required').max(200),
  description: z.string().trim().min(5, 'Description is required').max(1000),
  status: z.enum(['Completed', 'Live', 'Upcoming']).default('Upcoming'),
  order: z.number().int().min(0).default(0),
});

export const UserSaveSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().trim().email('Invalid email address format').max(255),
  status: z.enum(['pending', 'approved', 'rejected']).default('approved'),
  role: z.enum(['admin', 'superadmin']).default('admin'),
});

export const FeedbackSubmitSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required').max(100),
  email: z.string().trim().email('Invalid email address format').max(255),
  phone: z.string().trim().max(20).optional().default(''),
  eventsAttended: z.array(z.string().trim()).min(1, 'Please select at least one event or General/Overall'),
  rating: z.number().int().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  likedMost: z.string().trim().max(2000).optional().default(''),
  improvements: z.string().trim().min(5, 'Please provide suggestions on what could be improved').max(2000),
  wouldRecommend: z.enum(['Yes', 'No', 'Maybe'], {
    errorMap: () => ({ message: 'Please select whether you would recommend Tech Kurukshetra' }),
  }),
  hp: z.string().max(HONEYPOT_MAX, 'Bot detected').optional().default(''),
});

