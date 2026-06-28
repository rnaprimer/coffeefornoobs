-- Phase 6: Homepage CMS Schema

-- 1. Homepage Settings Table (Singleton)
CREATE TABLE public.homepage_settings (
    id integer PRIMARY KEY DEFAULT 1,
    meta_title text,
    meta_description text,
    canonical_url text,
    og_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
    announcement_enabled boolean DEFAULT false,
    announcement_text text,
    announcement_button text,
    announcement_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Ensure only one row can exist
ALTER TABLE public.homepage_settings ADD CONSTRAINT homepage_settings_id_check CHECK (id = 1);

-- 2. Homepage Sections Table
CREATE TABLE public.homepage_sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key text UNIQUE NOT NULL,
    title text,
    subtitle text,
    description text,
    button_text text,
    button_url text,
    media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
    enabled boolean DEFAULT true,
    display_order integer NOT NULL,
    status text DEFAULT 'draft',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. Homepage Section Items Table
CREATE TABLE public.homepage_section_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    homepage_section_id uuid REFERENCES public.homepage_sections(id) ON DELETE CASCADE,
    entity_type text NOT NULL, -- 'product', 'guide', 'bean', 'category'
    entity_id uuid NOT NULL,
    display_order integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_section_items ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Public can view homepage settings" ON public.homepage_settings
    FOR SELECT USING (true);

CREATE POLICY "Public can view published homepage sections" ON public.homepage_sections
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published homepage section items" ON public.homepage_section_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.homepage_sections
            WHERE homepage_sections.id = homepage_section_items.homepage_section_id AND status = 'published'
        )
    );

-- Policies for admin writing
CREATE POLICY "Authenticated users can manage homepage settings" ON public.homepage_settings
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage homepage sections" ON public.homepage_sections
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage homepage section items" ON public.homepage_section_items
    FOR ALL USING (auth.role() = 'authenticated');
