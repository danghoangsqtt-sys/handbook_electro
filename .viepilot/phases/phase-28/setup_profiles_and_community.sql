-- Bảng Profiles lưu trữ thông tin người dùng
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  email text,
  avatar_url text,
  streak_days integer default 0,
  total_flashcards_viewed integer default 0,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) cho bảng profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Hàm tự động tạo profile khi có user mới
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, avatar_url, is_approved)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger chạy hàm trên mỗi khi auth.users có dòng mới
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Bảng public_projects (Community Showcase)
CREATE TABLE IF NOT EXISTS public.public_projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  bom_data jsonb default '[]'::jsonb,
  diagram_code text,
  code_snippets jsonb default '[]'::jsonb,
  likes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) cho bảng public_projects
ALTER TABLE public.public_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are viewable by everyone." ON public.public_projects FOR SELECT USING (true);
CREATE POLICY "Users can insert own projects." ON public.public_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects." ON public.public_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects." ON public.public_projects FOR DELETE USING (auth.uid() = user_id);
