-- Tùy chỉnh bảng terms cho đầy đủ các trường dữ liệu
ALTER TABLE public.terms 
ADD COLUMN IF NOT EXISTS fullName TEXT,
ADD COLUMN IF NOT EXISTS youtubeUrl TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS applications JSONB DEFAULT '[]'::jsonb;
