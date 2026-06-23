# Project Roadmap

## Phase 1: Foundation & Mobile-First UI (Tái cấu trúc root.html)
- [x] Khởi tạo dự án Next.js, thiết lập Tailwind CSS.
- [x] Chuyển đổi giao diện `root.html` sang dạng Component (Mobile-First).
- [x] Cấu hình kết nối Supabase, thiết kế schema (`terms`, `modules`, `users_pin`, `chat_sessions`).

## Phase 2: Database AI Generation & Core Lookup
- [x] Viết NodeJS Script dùng Gemini API để sinh tự động thuật ngữ/module.
- [x] Chạy script nạp dữ liệu (seed) vào Supabase.
- [x] Xây dựng tính năng Tìm kiếm (Search), Lọc (Filter), Chi tiết (Detail).

## Phase 3: PIN Code Auth & "Phòng Lab AI"
- [x] Xây dựng logic đăng nhập bằng Mã PIN (Supabase).
- [x] Xây dựng giao diện Phòng Lab AI (Chat UI, Markdown, Code block).
- [x] Tích hợp API Gemini vào Next.js backend với System Prompt kỹ thuật.

## Phase 4: Polish, Testing & Deployment
- [x] Kiểm thử Mobile Responsive & UX.
- [x] Deploy lên Vercel.
- [x] Hoàn thiện tài liệu README.

## Phase 5: Domain Expansion
- [x] Viết công cụ Batch Seeding (seed-terms.mjs) sinh dữ liệu qua Gemini API.
- [x] Cập nhật giao diện (TermsList, QuizSystem, IntroStats).
- [x] Mở rộng System Prompt cho AI Lab.

## Phase 6: Data Enrichment & Full Categories
- [x] Bổ sung các chuyên ngành còn thiếu vào hệ thống sinh dữ liệu (Tự động hóa, Cơ điện tử, Khoa học máy tính, Điện tử số).
- [ ] Chạy tiến trình seeding toàn diện để làm giàu ngân hàng từ khóa.
