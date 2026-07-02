-- ============================================================
-- Phase 33: Nâng cấp hệ thống Sơ đồ — 3-in-1 Diagram System
-- Chạy trong Supabase SQL Editor
-- ============================================================

-- 1. Thêm cột schematic_image_url (URL ảnh sơ đồ nguyên lý)
ALTER TABLE public.public_projects
  ADD COLUMN IF NOT EXISTS schematic_image_url TEXT DEFAULT NULL;

-- 2. Thêm cột pin_connections (JSONB bảng kết nối chân)
ALTER TABLE public.public_projects
  ADD COLUMN IF NOT EXISTS pin_connections JSONB DEFAULT '[]'::jsonb;

-- 3. Tạo Storage Bucket "schematics" để lưu ảnh sơ đồ
-- Chạy lệnh này hoặc tạo thủ công trong Supabase Dashboard > Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('schematics', 'schematics', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage RLS: Mọi người đọc được, chỉ user auth upload được
CREATE POLICY "Public schematics are viewable by everyone."
  ON storage.objects FOR SELECT
  USING (bucket_id = 'schematics');

CREATE POLICY "Authenticated users can upload schematics."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'schematics'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own schematics."
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'schematics' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own schematics."
  ON storage.objects FOR DELETE
  USING (bucket_id = 'schematics' AND auth.uid() = owner);

-- ============================================================
-- Ví dụ cấu trúc pin_connections JSONB:
-- [
--   {
--     "component": "BME280",
--     "component_pin": "SDA",
--     "mcu": "ESP32",
--     "mcu_pin": "GPIO 21",
--     "protocol": "I2C",
--     "voltage": "3.3V",
--     "note": "Share với OLED"
--   }
-- ]
-- ============================================================
