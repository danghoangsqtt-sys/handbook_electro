-- Supabase Schema Update for Phase 25 (Admin Dashboard)

-- Add shopee_link and is_active columns to components table
ALTER TABLE public.components 
ADD COLUMN IF NOT EXISTS shopee_link TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing data
UPDATE public.components SET is_active = true WHERE is_active IS NULL;
