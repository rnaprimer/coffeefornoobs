import { z } from 'zod';

export const profileSchema = z.object({
  display_name: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name is too long'),
  avatar_media_id: z.string().uuid().nullable().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
