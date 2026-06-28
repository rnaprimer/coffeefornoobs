import { z } from 'zod'

export const baseContentSchema = z.object({
  status: z.enum(['published', 'draft']).default('draft'),
  featured: z.boolean().default(false),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
})

export const categorySchema = baseContentSchema.extend({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().nullable(),
  icon_name: z.string().optional().nullable(),
  icon_media_id: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
  display_order: z.number().int().default(0),
})

export const brandSchema = baseContentSchema.extend({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().nullable(),
  logo_media_id: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
})

export const productSchema = baseContentSchema.extend({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().nullable(),
  category_id: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
  brand_id: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  reviews: z.number().int().min(0).optional().nullable(),
  badge: z.string().optional().nullable(),
  featured_media_id: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
  image_url: z.string().optional().nullable(),
  image_text: z.string().optional().nullable(),
  specifications: z.record(z.string(), z.string()).optional().nullable(),
  pros: z.array(z.string()).optional().nullable(),
  cons: z.array(z.string()).optional().nullable(),
  display_order: z.number().int().default(0),
})

export const roasterSchema = baseContentSchema.extend({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

export const beanSchema = baseContentSchema.extend({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  roaster_id: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
  description: z.string().optional().nullable(),
  roast_level: z.string().optional().nullable(),
  origin: z.string().optional().nullable(),
  process: z.string().optional().nullable(),
  flavor_profile: z.array(z.string()).optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  reviews: z.number().int().min(0).optional().nullable(),
  featured_media_id: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
  image_url: z.string().optional().nullable(),
  image_text: z.string().optional().nullable(),
  display_order: z.number().int().default(0),
})

export const guideSchema = baseContentSchema.extend({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().optional().nullable(),
  content_json: z.any().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  cover_media_id: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
  cover_image: z.string().optional().nullable(),
  cover_image_text: z.string().optional().nullable(),
  display_order: z.number().int().default(0),
})

export const comparisonSchema = baseContentSchema.extend({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  product_id_1: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
  product_id_2: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
  content: z.string().optional().nullable(),
  content_json: z.any().optional().nullable(),
  winner_id: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
})

export * from './tag'
export * from './affiliate'
