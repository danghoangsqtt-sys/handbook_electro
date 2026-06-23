# Phase 21: AI Lab Chat History & Supabase Integration

## Objective
Nâng cấp trang AI Lab từ việc chỉ lưu `localStorage` cục bộ sang mô hình lưu trữ Database (Supabase) hoàn chỉnh, đi kèm Sidebar quản lý lịch sử trò chuyện giống giao diện Gemini.

## Scope
- Thiết lập Database schema (`chat_sessions`, `chat_messages`) trên Supabase.
- Tích hợp package `@supabase/supabase-js`.
- Bổ sung `<AILabSidebar />` để hiển thị danh sách các phiên chat.
- API lấy danh sách chat, lưu tin nhắn, đính kèm hình ảnh.
- Refactor `<AILab />` để load và gửi dữ liệu thông qua Supabase.

## Requirements
- Dữ liệu chat phải được lưu theo mã PIN.
- Có khả năng ghim đoạn chat quan trọng.
- Hiển thị ảnh đính kèm trong nội dung chat.

## Constraints
- Sử dụng Stack: Next.js App Router, Tailwind CSS, Supabase JS Client.
- Giao diện Sidebar cần đáp ứng Responsive (có thể ẩn ở Mobile, hoặc trượt ra).
