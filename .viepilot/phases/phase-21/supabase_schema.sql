-- Supabase Schema for AI Lab Chat History

-- 1. Create chat_sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_pin TEXT NOT NULL,
    title TEXT DEFAULT 'Cuộc trò chuyện mới',
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_pin ON public.chat_sessions(user_pin);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);

-- 4. Set up Row Level Security (RLS) - Optional but recommended
-- ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
-- For now, we will allow anonymous access for development (Make sure to setup proper RLS in production)

-- 5. Storage Bucket setup
-- IMPORTANT: You must manually create a storage bucket named 'chat_attachments' in the Supabase Dashboard
-- and set it to 'Public' if you want images to be accessible.
