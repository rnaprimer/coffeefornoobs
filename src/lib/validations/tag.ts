import * as z from "zod"

export const tagSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(100, {
    message: "Name must not exceed 100 characters."
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }).max(100, {
    message: "Slug must not exceed 100 characters."
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens."
  }),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  icon_media_id: z.string().uuid().optional().nullable(),
  seo_title: z.string().max(60).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
  featured: z.boolean().default(false),
  display_order: z.coerce.number().default(0),
  status: z.enum(["draft", "published", "archived"]).default("published"),
})
