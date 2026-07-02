-- Supabase Schema for Terms (Thuật ngữ)

CREATE TABLE IF NOT EXISTS public.terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    category TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for searching
CREATE INDEX IF NOT EXISTS idx_terms_term ON public.terms(term);
CREATE INDEX IF NOT EXISTS idx_terms_category ON public.terms(category);
