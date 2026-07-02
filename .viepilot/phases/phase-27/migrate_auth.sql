-- Migration for FEAT-006: Convert PIN to Supabase Auth

-- 1. Add user_id column to chat_sessions
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Make user_pin optional (since we are moving away from it)
ALTER TABLE public.chat_sessions ALTER COLUMN user_pin DROP NOT NULL;

-- 3. Create index for new user_id
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
