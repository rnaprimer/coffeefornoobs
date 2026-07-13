import { z } from 'zod';

export const wishlistSchema = z.object({
  entity_type: z.enum(['product', 'bean', 'guide', 'comparison', 'learn_article']),
  entity_id: z.string().uuid(),
});

export type WishlistSchema = z.infer<typeof wishlistSchema>;
