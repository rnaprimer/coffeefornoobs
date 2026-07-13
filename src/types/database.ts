export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string | null
          icon_media_id: string | null
          seo_title: string | null
          seo_description: string | null
          featured: boolean
          display_order: number
          usage_count: number
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: any
        Update: any
      }
      tag_assignments: {
        Row: {
          id: string
          tag_id: string
          entity_type: string
          entity_id: string
          created_at: string
        }
        Insert: any
        Update: any
      }
      search_index: {
        Row: {
          id: string
          entity_type: string
          entity_id: string
          title: string | null
          excerpt: string | null
          plain_text: string | null
          headings: string[] | null
          tags: string[] | null
          category: string | null
          thumbnail_media_id: string | null
          featured: boolean
          status: string
          published_at: string | null
          search_weight: number
          schema_version: number
          index_status: 'pending' | 'indexed' | 'failed'
          updated_at: string
        }
        Insert: any
        Update: any
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon_name?: string | null
          created_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          brand_id: string | null
          category_id: string | null
          name: string
          slug: string
          short_description: string | null
          description: string | null
          price: number | null
          image_url: string | null
          image_text: string | null
          rating: number | null
          reviews: number
          badge: string | null
          pros: string[] | null
          cons: string[] | null
          specifications: Json | null
          status: string
          featured: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id?: string | null
          category_id?: string | null
          name: string
          slug: string
          short_description?: string | null
          description?: string | null
          price?: number | null
          image_url?: string | null
          image_text?: string | null
          rating?: number | null
          reviews?: number
          badge?: string | null
          pros?: string[] | null
          cons?: string[] | null
          specifications?: Json | null
          status?: string
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string | null
          category_id?: string | null
          name?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          price?: number | null
          image_url?: string | null
          image_text?: string | null
          rating?: number | null
          reviews?: number
          badge?: string | null
          pros?: string[] | null
          cons?: string[] | null
          specifications?: Json | null
          status?: string
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      affiliate_links: {
        Row: {
          id: string
          product_id: string | null
          store_name: string
          affiliate_url: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          store_name: string
          affiliate_url: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          store_name?: string
          affiliate_url?: string
          created_at?: string
        }
      }
      learn_articles: {
        Row: {
          id: string
          title: string
          slug: string
          content_json: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content_json?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content_json?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      guides: {
        Row: {
          id: string
          category_id: string | null
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          cover_image: string | null
          cover_image_text: string | null
          author: string
          reading_time: number | null
          status: string
          featured: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          cover_image?: string | null
          cover_image_text?: string | null
          author?: string
          reading_time?: number | null
          status?: string
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          cover_image?: string | null
          cover_image_text?: string | null
          author?: string
          reading_time?: number | null
          status?: string
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
        }
      }
      guide_products: {
        Row: {
          guide_id: string
          product_id: string
        }
        Insert: {
          guide_id: string
          product_id: string
        }
        Update: {
          guide_id?: string
          product_id?: string
        }
      }
      roasters: {
        Row: {
          id: string
          name: string
          slug: string
          location: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          location?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          location?: string | null
          description?: string | null
          created_at?: string
        }
      }
      beans: {
        Row: {
          id: string
          roaster_id: string | null
          name: string
          slug: string
          price: number | null
          origin: string | null
          process: string | null
          roast_level: string | null
          tasting_notes: string[] | null
          brewing_recommendations: string[] | null
          image_url: string | null
          image_text: string | null
          status: string
          featured: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          roaster_id?: string | null
          name: string
          slug: string
          price?: number | null
          origin?: string | null
          process?: string | null
          roast_level?: string | null
          tasting_notes?: string[] | null
          brewing_recommendations?: string[] | null
          image_url?: string | null
          image_text?: string | null
          status?: string
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          roaster_id?: string | null
          name?: string
          slug?: string
          price?: number | null
          origin?: string | null
          process?: string | null
          roast_level?: string | null
          tasting_notes?: string[] | null
          brewing_recommendations?: string[] | null
          image_url?: string | null
          image_text?: string | null
          status?: string
          featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
        }
      }
      comparisons: {
        Row: {
          id: string
          title: string
          slug: string
          product_a_id: string
          product_b_id: string
          description: string | null
          content: string | null
          winner: string | null
          recommendation: string | null
          status: string
          seo_title: string | null
          seo_description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          product_a_id: string
          product_b_id: string
          description?: string | null
          content?: string | null
          winner?: string | null
          recommendation?: string | null
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          product_a_id?: string
          product_b_id?: string
          description?: string | null
          content?: string | null
          winner?: string | null
          recommendation?: string | null
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          display_name: string | null
          avatar_url: string | null
          avatar_media_id: string | null
          provider: string | null
          role: string | null
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          avatar_media_id?: string | null
          provider?: string | null
          role?: string | null
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          avatar_media_id?: string | null
          provider?: string | null
          role?: string | null
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          experience_level: string | null
          preferred_brew_method: string | null
          budget_range: string | null
          preferred_roast_level: string | null
          preferred_currency: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          experience_level?: string | null
          preferred_brew_method?: string | null
          budget_range?: string | null
          preferred_roast_level?: string | null
          preferred_currency?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          experience_level?: string | null
          preferred_brew_method?: string | null
          budget_range?: string | null
          preferred_roast_level?: string | null
          preferred_currency?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
