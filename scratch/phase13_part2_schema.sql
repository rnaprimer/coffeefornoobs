-- Phase 13 Part 2 Schema Updates
-- Run this in the Supabase SQL Editor

-- 1. Create user_wishlist table
CREATE TABLE public.user_wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('product', 'bean', 'guide', 'comparison', 'learn_article')),
    entity_id UUID NOT NULL, -- references whatever entity_type is, but no foreign key to allow generic relations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure a user can only save an entity once
CREATE UNIQUE INDEX idx_user_wishlist_unique ON public.user_wishlist (user_id, entity_type, entity_id);

-- Enable RLS for user_wishlist
ALTER TABLE public.user_wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlist" 
    ON public.user_wishlist FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own wishlist" 
    ON public.user_wishlist FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlist" 
    ON public.user_wishlist FOR DELETE 
    USING (auth.uid() = user_id);

-- 2. Create saved_setups table
CREATE TABLE public.saved_setups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    budget NUMERIC,
    setup_configuration JSONB NOT NULL,
    notes TEXT,
    thumbnail_media_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
    favorite BOOLEAN DEFAULT false,
    last_opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.saved_setups
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Enable RLS for saved_setups
ALTER TABLE public.saved_setups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved setups" 
    ON public.saved_setups FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved setups" 
    ON public.saved_setups FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved setups" 
    ON public.saved_setups FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved setups" 
    ON public.saved_setups FOR DELETE 
    USING (auth.uid() = user_id);
