import { z } from 'zod';

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
