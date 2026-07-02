-- Chạy script này trên Supabase SQL Editor để tạo bảng project_sessions

CREATE TABLE IF NOT EXISTS project_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_pin TEXT NOT NULL,
    title TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    idea TEXT,
    result JSONB,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật RLS nếu cần (Tuỳ chọn bảo mật)
ALTER TABLE project_sessions ENABLE ROW LEVEL SECURITY;

-- Tạo Policy cho RLS (cho phép tất cả thao tác vì dùng user_pin để filter trên API, nhưng nếu setup public thì...)
CREATE POLICY "Enable all for project_sessions" ON project_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);
