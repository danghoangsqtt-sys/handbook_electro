-- Phase 34: Personal Project Library — RLS Policies
-- Run this in Supabase SQL Editor

-- 1. Drop old social policies if they exist
DROP POLICY IF EXISTS "Public projects are viewable by everyone." ON public_projects;
DROP POLICY IF EXISTS "Users can insert their own projects." ON public_projects;
DROP POLICY IF EXISTS "Authenticated users can like projects." ON public_projects;

-- 2. Enable RLS (ensure it's on)
ALTER TABLE public_projects ENABLE ROW LEVEL SECURITY;

-- 3. SELECT: user only sees their own projects
CREATE POLICY "Users can view their own projects"
ON public_projects FOR SELECT
USING (auth.uid() = user_id);

-- 4. INSERT: user can create their own projects
CREATE POLICY "Users can create their own projects"
ON public_projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. UPDATE: user can edit their own projects
CREATE POLICY "Users can update their own projects"
ON public_projects FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. DELETE: user can delete their own projects
CREATE POLICY "Users can delete their own projects"
ON public_projects FOR DELETE
USING (auth.uid() = user_id);

-- 7. Ensure schematic_image_url and pin_connections columns exist
ALTER TABLE public_projects
ADD COLUMN IF NOT EXISTS schematic_image_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS pin_connections JSONB DEFAULT NULL;

-- 8. Storage bucket for schematics (run once)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('schematics', 'schematics', true)
-- ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to schematics bucket
-- CREATE POLICY "Auth users can upload schematics"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'schematics' AND auth.role() = 'authenticated');

-- CREATE POLICY "Schematics are publicly readable"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'schematics');
