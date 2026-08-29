import { z } from 'zod';

// The dashboard's Past Projects CRUD form validates against this — same
// shape the website's Projects page renders.
//
// `size` is a free-form string rather than an enum of the current system
// tiers: the tier list is admin-editable (Calculator Settings), so a static
// enum captured at import time would reject valid, newly added tier names.
// The size <select> options come from the live tier list instead.
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, 'Enter a title'),
  location: z.string().trim().min(1, 'Enter a location'),
  size: z.string().trim().min(1, 'Select a system size'),
  category: z.enum(['home', 'business']),
  caseStudy: z.boolean(),
  images: z.number().int().min(0),
  body: z.string().trim().min(1, 'Enter a short description'),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

// New-project drafts don't have an id assigned yet.
export const projectDraftSchema = projectSchema.omit({ id: true });
export type ProjectDraftValues = z.infer<typeof projectDraftSchema>;
