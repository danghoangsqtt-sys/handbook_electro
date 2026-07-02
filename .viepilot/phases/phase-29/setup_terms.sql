-- 1. Xóa bảng cũ nếu có (cẩn thận nếu có dữ liệu)
DROP TABLE IF EXISTS public.terms;

-- 2. Tạo bảng terms mới nhất
CREATE TABLE public.terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term TEXT NOT NULL,
    fullName TEXT,
    definition TEXT NOT NULL,
    category TEXT NOT NULL,
    applications JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    youtubeUrl TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tạo index để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_terms_term ON public.terms(term);
CREATE INDEX IF NOT EXISTS idx_terms_category ON public.terms(category);

-- 4. Bật RLS và cấp quyền truy cập công khai
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép tất cả mọi người đọc thuật ngữ"
ON public.terms
FOR SELECT
USING (true);

-- Cho phép Service Role toàn quyền (bỏ qua RLS) được thiết lập mặc định trên Supabase.
