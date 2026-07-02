-- Supabase Schema for Component Library
-- Hợp nhất Phase 22 và Phase 25

-- 1. Create components table
CREATE TABLE IF NOT EXISTS public.components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    interface TEXT,
    specs JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    datasheet_url TEXT,
    description TEXT,
    shopee_link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create index for searching/filtering
CREATE INDEX IF NOT EXISTS idx_components_category ON public.components(category);
CREATE INDEX IF NOT EXISTS idx_components_name ON public.components(name);

-- 3. Setup Row Level Security (RLS)
-- ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
-- For now, allow anonymous read access
-- CREATE POLICY "Allow public read access" ON public.components FOR SELECT USING (true);
