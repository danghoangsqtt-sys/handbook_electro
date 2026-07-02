-- Bật RLS (Nếu chưa bật)
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ nếu có để tránh lỗi trùng lặp
DROP POLICY IF EXISTS "Allow public read access" ON public.components;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.components;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.components;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.components;

-- 1. Cho phép TẤT CẢ mọi người (kể cả chưa đăng nhập) có thể XEM (SELECT) danh sách linh kiện
CREATE POLICY "Allow public read access" ON public.components FOR SELECT USING (true);

-- 2. Cho phép người dùng ĐÃ ĐĂNG NHẬP (Admin) được phép THÊM (INSERT)
CREATE POLICY "Allow authenticated insert" ON public.components FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Cho phép người dùng ĐÃ ĐĂNG NHẬP (Admin) được phép SỬA (UPDATE)
CREATE POLICY "Allow authenticated update" ON public.components FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Cho phép người dùng ĐÃ ĐĂNG NHẬP (Admin) được phép XÓA (DELETE)
CREATE POLICY "Allow authenticated delete" ON public.components FOR DELETE USING (auth.role() = 'authenticated');
