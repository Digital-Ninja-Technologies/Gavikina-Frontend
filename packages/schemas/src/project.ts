import { z } from 'zod';
import { SIZE_TIERS } from '@gavikina/engine';

// The dashboard's Past Projects CRUD form validates against this — same
// shape the website's Projects page renders.
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, 'Enter a title'),
  location: z.string().trim().min(1, 'Enter a location'),
  size: z.enum(SIZE_TIERS as [string, ...string[]]),
  category: z.enum(['home', 'business']),
  caseStudy: z.boolean(),
  images: z.number().int().min(0),
  body: z.string().trim().min(1, 'Enter a short description'),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

// New-project drafts don't have an id assigned yet.
export const projectDraftSchema = projectSchema.omit({ id: true });
export type ProjectDraftValues = z.infer<typeof projectDraftSchema>;
