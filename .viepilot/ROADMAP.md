# Project Roadmap

## Phase 1: Foundation & Mobile-First UI (Tái cấu trúc root.html)
- [ ] Khởi tạo dự án Next.js, thiết lập Tailwind CSS.
- [ ] Chuyển đổi giao diện `root.html` sang dạng Component (Mobile-First).
- [ ] Cấu hình kết nối Supabase, thiết kế schema (`terms`, `modules`, `users_pin`, `chat_sessions`).

## Phase 2: Database AI Generation & Core Lookup
- [ ] Viết NodeJS Script dùng Gemini API để sinh tự động thuật ngữ/module.
- [ ] Chạy script nạp dữ liệu (seed) vào Supabase.
- [ ] Xây dựng tính năng Tìm kiếm (Search), Lọc (Filter), Chi tiết (Detail).

## Phase 3: PIN Code Auth & "Phòng Lab AI"
- [ ] Xây dựng logic đăng nhập bằng Mã PIN (Supabase).
- [ ] Xây dựng giao diện Phòng Lab AI (Chat UI, Markdown, Code block).
- [ ] Tích hợp API Gemini vào Next.js backend với System Prompt kỹ thuật.

## Phase 4: Polish, Testing & Deployment
- [ ] Kiểm thử Mobile Responsive & UX.
- [ ] Deploy lên Vercel.
- [ ] Hoàn thiện tài liệu README.
