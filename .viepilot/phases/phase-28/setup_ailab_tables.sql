-- 0. Xóa các bảng cũ (đang dùng user_pin) để tạo lại cấu trúc chuẩn
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.project_sessions CASCADE;

-- 1. Bảng chat_sessions (Lưu trữ các phiên chat AI)
CREATE TABLE public.chat_sessions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null default 'Cuộc trò chuyện mới',
    is_pinned boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Bảng chat_messages (Lưu trữ nội dung chat)
CREATE TABLE public.chat_messages (
    id uuid default gen_random_uuid() primary key,
    session_id uuid references public.chat_sessions(id) on delete cascade not null,
    role text not null, -- 'user' hoặc 'assistant'
    content text,
    images jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Bảng project_sessions (Lưu trữ các dự án tự động)
CREATE TABLE public.project_sessions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null default 'Dự án mới',
    is_pinned boolean default false,
    items jsonb default '[]'::jsonb,
    idea text,
    result jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) - Bảo mật dữ liệu
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Mỗi user chỉ được xem/sửa dữ liệu của chính mình
CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own chat messages" ON public.chat_messages FOR ALL USING (auth.uid() = (SELECT user_id FROM public.chat_sessions WHERE id = session_id));
CREATE POLICY "Users can manage own project sessions" ON public.project_sessions FOR ALL USING (auth.uid() = user_id);
