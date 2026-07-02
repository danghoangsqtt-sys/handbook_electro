-- Cho phép service_role (script seed) INSERT vào bảng terms
-- Chạy lệnh này trên Supabase SQL Editor

-- Cấp quyền INSERT cho authenticated users (dùng cho Admin)
CREATE POLICY IF NOT EXISTS "Service role có thể insert thuật ngữ"
ON public.terms
FOR INSERT
WITH CHECK (true);

-- Cấp quyền UPDATE cho authenticated users (dùng cho Admin)
CREATE POLICY IF NOT EXISTS "Service role có thể update thuật ngữ"
ON public.terms
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Cấp quyền DELETE cho authenticated users (dùng cho Admin)
CREATE POLICY IF NOT EXISTS "Service role có thể delete thuật ngữ"
ON public.terms
FOR DELETE
USING (true);

-- HOẶC: Nếu muốn bypass RLS hoàn toàn khi dùng service_role key (không cần tạo policy)
-- Service role key mặc định bypass tất cả RLS policies trên Supabase.
-- Hãy kiểm tra lại file .env.local của bạn có key SUPABASE_SERVICE_ROLE_KEY chưa?
