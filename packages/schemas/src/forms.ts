import { z } from "zod";

const isEmail = (val: string) => z.email().safeParse(val).success;

const phoneRegex = /^\+?[0-9\s\-()]{6,20}$/;
const isPhone = (val: string) => phoneRegex.test(val);
const phoneSchema = z
	.string()
	.trim()
	.regex(phoneRegex, "Enter a valid phone number");

export const contactFormSchema = z.object({
	name: z.string().trim().min(1, "Enter your name"),
	contact: z
		.string()
		.trim()
		.min(1, "Tell us how to reach you")
		.refine((val) => isEmail(val) || isPhone(val), {
			error: "Enter a valid email or phone number",
		}),
	message: z.string().trim().min(1, "Enter a message"),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const agentApplicationSchema = z.object({
	name: z.string().trim().min(1, "Enter your full name"),
	email: z.email("Enter a valid email address").trim(),
	phone: phoneSchema,
	location: z.string().trim().min(1, "Tell us where you are based"),
	occupation: z.string().trim().min(1, "Tell us your current occupation"),
	reason: z.string().trim().min(1, "Tell us why you want to join"),
});
export type AgentApplicationValues = z.infer<typeof agentApplicationSchema>;

export const careerApplicationSchema = z.object({
	role: z.string().trim().min(1, "Tell us the role you are applying for"),
	name: z.string().trim().min(1, "Enter your full name"),
	email: z.email("Enter a valid email address").trim(),
	phone: phoneSchema,
	location: z.string().trim().min(1, "Tell us where you are based"),
	about: z.string().trim().min(1, "Tell us about your relevant experience"),
	cvName: z.string().optional(),
});
export type CareerApplicationValues = z.infer<typeof careerApplicationSchema>;

export const investorRequestSchema = z.object({
	name: z.string().trim().min(1, "Enter your name"),
	email: z.email("Enter a valid email address").trim(),
	phone: phoneSchema,
	investmentInterest: z
		.string()
		.trim()
		.min(10, "Tell us about your investment interest"),
});
export type InvestorRequestValues = z.infer<typeof investorRequestSchema>;

export const assessmentContactSchema = z.object({
	name: z.string().trim().min(2, "Enter your full name"),
	phone: phoneSchema,
	email: z.email("Enter a valid email address").trim(),
});
export type AssessmentContactValues = z.infer<typeof assessmentContactSchema>;

export const adminLoginSchema = z.object({
	email: z.email("Enter a valid email address").trim(),
	password: z.string().min(6, "Password must be at least 6 characters"),
});
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
