-- ============================================================
-- Phase 31: Tạo bảng project_comments cho hệ thống bình luận
-- Chạy trong Supabase SQL Editor
-- ============================================================

-- Bảng project_comments
CREATE TABLE IF NOT EXISTS public.project_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.public_projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 1000),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index để query nhanh theo project_id
CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_created_at ON public.project_comments(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

-- Mọi người đều xem được comments
CREATE POLICY "Comments are viewable by everyone."
  ON public.project_comments FOR SELECT USING (true);

-- Chỉ user đăng nhập mới được insert comment của mình
CREATE POLICY "Users can insert own comments."
  ON public.project_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User chỉ xoá được comment của chính mình
CREATE POLICY "Users can delete own comments."
  ON public.project_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Thêm cột comments_count vào public_projects (cache đếm nhanh)
ALTER TABLE public.public_projects
  ADD COLUMN IF NOT EXISTS comments_count integer DEFAULT 0;

-- Hàm tự động cập nhật comments_count khi có comment mới / xoá
CREATE OR REPLACE FUNCTION public.update_comments_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.public_projects
    SET comments_count = comments_count + 1
    WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.public_projects
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_change ON public.project_comments;
CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.project_comments
  FOR EACH ROW EXECUTE PROCEDURE public.update_comments_count();

-- Xác nhận
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'project_comments';
