-- 1. Modify Guides
ALTER TABLE guides ADD COLUMN IF NOT EXISTS content_json JSONB;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;
ALTER TABLE guides ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Basic migration of existing content to Tiptap JSON format
UPDATE guides 
SET content_json = jsonb_build_object(
  'type', 'doc',
  'content', jsonb_build_array(
    jsonb_build_object(
      'type', 'paragraph',
      'content', jsonb_build_array(
        jsonb_build_object(
          'type', 'text',
          'text', COALESCE(content, '')
        )
      )
    )
  )
)
WHERE content IS NOT NULL AND content_json IS NULL;

-- 2. Modify Comparisons
ALTER TABLE comparisons ADD COLUMN IF NOT EXISTS content_json JSONB;
ALTER TABLE comparisons ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;
ALTER TABLE comparisons ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE comparisons ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 0;

UPDATE comparisons 
SET content_json = jsonb_build_object(
  'type', 'doc',
  'content', jsonb_build_array(
    jsonb_build_object(
      'type', 'paragraph',
      'content', jsonb_build_array(
        jsonb_build_object(
          'type', 'text',
          'text', COALESCE(content, '')
        )
      )
    )
  )
)
WHERE content IS NOT NULL AND content_json IS NULL;


-- 3. Create learn_articles table
CREATE TABLE IF NOT EXISTS learn_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT, -- Keep for consistency, though we'll use content_json
  content_json JSONB,
  cover_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  author TEXT DEFAULT 'CoffeeForNoobs Team',
  reading_time INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  
  -- Content CMS Fields
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,

  -- Audit & Soft Delete
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_learn_articles_slug ON learn_articles(slug);
CREATE INDEX IF NOT EXISTS idx_learn_articles_status ON learn_articles(status);
CREATE INDEX IF NOT EXISTS idx_learn_articles_featured ON learn_articles(featured);

-- Enable RLS for learn_articles
ALTER TABLE learn_articles ENABLE ROW LEVEL SECURITY;

-- Policies for learn_articles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'learn_articles' AND policyname = 'Public can view published learn_articles'
    ) THEN
        CREATE POLICY "Public can view published learn_articles" ON learn_articles
        FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'learn_articles' AND policyname = 'Editors and Admins can view all learn_articles'
    ) THEN
        CREATE POLICY "Editors and Admins can view all learn_articles" ON learn_articles
        FOR SELECT USING (get_user_role() IN ('editor', 'admin'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'learn_articles' AND policyname = 'Editors and Admins can insert learn_articles'
    ) THEN
        CREATE POLICY "Editors and Admins can insert learn_articles" ON learn_articles
        FOR INSERT WITH CHECK (get_user_role() IN ('editor', 'admin'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'learn_articles' AND policyname = 'Editors and Admins can update learn_articles'
    ) THEN
        CREATE POLICY "Editors and Admins can update learn_articles" ON learn_articles
        FOR UPDATE USING (get_user_role() IN ('editor', 'admin'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'learn_articles' AND policyname = 'Admins can delete learn_articles'
    ) THEN
        CREATE POLICY "Admins can delete learn_articles" ON learn_articles
        FOR DELETE USING (get_user_role() = 'admin');
    END IF;
END $$;
