import { z } from 'zod';

// Shared across the website (submission) and dashboard (display/validation)
// so both sides agree on what a valid submission looks like.

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name'),
  contact: z.string().trim().min(1, 'Tell us how to reach you'),
  message: z.string().trim().min(1, 'Enter a message'),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const agentApplicationSchema = z.object({
  name: z.string().trim().min(1, 'Enter your full name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(6, 'Enter a phone number'),
  location: z.string().trim().min(1, 'Tell us where you are based'),
  occupation: z.string().trim().min(1, 'Tell us your current occupation'),
  reason: z.string().trim().min(1, 'Tell us why you want to join'),
});
export type AgentApplicationValues = z.infer<typeof agentApplicationSchema>;

export const careerApplicationSchema = z.object({
  role: z.string().trim().min(1, 'Tell us the role you are applying for'),
  name: z.string().trim().min(1, 'Enter your full name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(6, 'Enter a phone number'),
  location: z.string().trim().min(1, 'Tell us where you are based'),
  about: z.string().trim().min(1, 'Tell us about your relevant experience'),
});
export type CareerApplicationValues = z.infer<typeof careerApplicationSchema>;

export const investorRequestSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim(),
  message: z.string().trim().min(1, 'Tell us what you are looking for'),
});
export type InvestorRequestValues = z.infer<typeof investorRequestSchema>;

export const assessmentContactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'),
  phone: z.string().trim().min(6, 'Enter a phone number'),
  email: z.string().trim().email('Enter a valid email address'),
});
export type AssessmentContactValues = z.infer<typeof assessmentContactSchema>;

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
