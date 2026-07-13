-- Phase 13 Part 1 - User Accounts & Personalization MVP Schema

-- 1. Modify existing `profiles` table to add new columns if they do not exist
-- Using a PL/pgSQL block to safely add columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='display_name') THEN
        ALTER TABLE public.profiles ADD COLUMN display_name text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='provider') THEN
        ALTER TABLE public.profiles ADD COLUMN provider text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='last_login_at') THEN
        ALTER TABLE public.profiles ADD COLUMN last_login_at timestamp with time zone;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='avatar_media_id') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_media_id uuid;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url text;
    END IF;
END $$;

-- Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DO $$
BEGIN
    -- Select policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile" ON public.profiles
            FOR SELECT USING (auth.uid() = id);
    END IF;

    -- Update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" ON public.profiles
            FOR UPDATE USING (auth.uid() = id);
    END IF;
    
    -- Insert policy (needed for application layer creation)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" ON public.profiles
            FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;


-- 2. Create `user_preferences` table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    experience_level text DEFAULT 'Beginner',
    preferred_brew_method text DEFAULT 'Espresso',
    budget_range text DEFAULT 'Under ₹5k',
    preferred_roast_level text DEFAULT 'Medium',
    preferred_currency text DEFAULT 'INR',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- User Preferences Policies
DO $$
BEGIN
    -- Select policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_preferences' AND policyname = 'Users can view their own preferences'
    ) THEN
        CREATE POLICY "Users can view their own preferences" ON public.user_preferences
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_preferences' AND policyname = 'Users can update their own preferences'
    ) THEN
        CREATE POLICY "Users can update their own preferences" ON public.user_preferences
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    -- Insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_preferences' AND policyname = 'Users can insert their own preferences'
    ) THEN
        CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
