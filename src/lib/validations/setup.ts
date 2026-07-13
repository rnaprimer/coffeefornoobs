import { z } from 'zod';

export const saveSetupSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  favorite: z.boolean().default(false),
  setup_configuration: z.any(), // JSON from the setup builder
  budget: z.number().nullable().optional(),
});

export type SaveSetupFormValues = z.infer<typeof saveSetupSchema>;

export const updateSetupSchema = saveSetupSchema.partial();

export type UpdateSetupFormValues = z.infer<typeof updateSetupSchema>;
