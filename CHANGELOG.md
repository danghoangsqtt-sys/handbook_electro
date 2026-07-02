# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- [Phase 27] Thiết lập Supabase Auth (Email/OAuth) thay thế mã PIN.
- [Phase 27] AI Lab tích hợp tính năng phân tích hình ảnh sơ đồ mạch sử dụng Gemini Vision.
- [Phase 27] Thay thế tính năng Trắc nghiệm cũ bằng Quiz Flashcard lật thẻ (5 từ ngẫu nhiên).

## [0.21.0] - 2026-07-02

### Added
- Khởi chạy Phase 26 (Hoàn thiện Admin CMS & Cấu trúc lại Dữ liệu Thuật ngữ).
- Tạo bảng `terms` trên Supabase với cấu trúc đầy đủ.
- Phát triển giao diện `admin/terms` hỗ trợ CRUD thuật ngữ.
- Viết công cụ Import JSON (đẩy toàn bộ JSON cũ lên Supabase).
- Cập nhật API lấy thuật ngữ sang kết nối với Supabase, tích hợp In-memory Caching để đảm bảo tốc độ.

## [0.20.0] - 2026-07-02

### Added
- Khởi chạy Phase 25 (Admin Dashboard & Quản trị Dữ liệu).
- Nâng cấp Database Schema bổ sung `shopee_link`, `is_active`.
- Xây dựng trang đăng nhập Admin bằng Supabase Auth.
- Thiết kế layout độc lập và trang Dashboard thống kê cho `/admin`.
- Phát triển form CRUD quản lý linh kiện, tích hợp convert ảnh Google Drive.
- Cập nhật UI thư viện bổ sung tính năng Mua trên Shopee và Tải Datasheet.

## [0.19.0] - 2026-07-02

### Added
- Khởi chạy Phase 24 (Component Filtering & Seeding).
- Bổ sung logic lọc đa điều kiện (Theo danh mục, Theo giao tiếp I2C/SPI, Theo từ khóa tìm kiếm).
- Tạo kịch bản Node.js tự động nạp dữ liệu linh kiện (Seed script `seed-components.mjs`).
- Xử lý trạng thái Empty UI khi không tìm thấy kết quả.

## [0.18.0] - 2026-07-02

### Added
- Khởi chạy Phase 23 (AI Project Studio).
- Tích hợp tính năng truyền danh sách BOM vào prompt AI.
- Xây dựng System Prompt chuyên sâu tư vấn linh kiện và sinh sơ đồ cắm chân.
- Xây dựng giao diện AI Project Studio (3 Tab: Tổng quan tương thích, Sơ đồ cắm chân, Code mẫu).
- Tích hợp bộ render Mermaid.js an toàn trong Markdown của AI Lab.

## [0.17.0] - 2026-07-02

### Added
- Khởi chạy Phase 22 (Thư viện Linh kiện & Quản lý BOM).
- Thiết kế bảng `components` trên Supabase (chứa specs, datasheet_url, image_url).
- Xây dựng giao diện Grid Card hiển thị danh sách linh kiện.
- Xây dựng tính năng "Thêm vào BOM" (Lưu giỏ hàng bằng Zustand hoặc LocalStorage).
- Thiết kế giao diện Drawer/Sidebar để quản lý BOM.

## [0.16.1] - 2026-07-02

### Added
- Khởi chạy Phase 21 (AI Lab Chat History & Supabase Integration).
- Tạo bảng `chat_sessions` và `chat_messages` trên Supabase.
- Bổ sung Storage Bucket lưu trữ file ảnh upload từ User.
- Xây dựng các tính năng CRUD API và đồng bộ Sidebar.

## [0.16.0] - 2026-06-23

### Added
- Khởi chạy Phase 20 (Core Vocabulary Enrichment).
- Nạp tự động 350 từ khoá cơ bản vào 7 chuyên mục.

## [0.15.0] - 2026-06-23

### Added
- Bổ sung Phase 19 (Extended Lookups) dựa trên FEAT-001.
- Khởi tạo tài liệu SPEC cho tính năng tra cứu Google, Datasheet và Video ứng dụng.

## [0.14.0] - 2026-06-23

### Added
- Bổ sung Phase 18 (Search Optimization & Caching).
- Triển khai ENH-001 để tối ưu thuật toán tìm kiếm tiếng Việt không dấu.
- Cập nhật đồng bộ hệ thống lên 0.14.0.

## [0.10.0] - 2026-06-23

### Changed
- Refactor AI Lab (`AILab.tsx`): Bổ sung tính năng lưu giữ Lịch sử trò chuyện thông qua `localStorage` và thêm nút xóa hội thoại.
- Refactor Chat API (`route.ts`): Cải tiến gọi API Github bằng biến môi trường `GITHUB_TOKEN` để ngăn chặn lỗi Rate Limit.
- Cập nhật Project Phase lên Phase 14.

## [0.9.0] - 2026-06-23

### Added
- Sinh trực tiếp 100 từ khóa chuyên ngành Cơ điện tử (Mechatronics) bằng AI.
- Cập nhật Project Phase lên Phase 13 (Mechatronics Data Expansion).

## [0.8.0] - 2026-06-23

### Added
- Sinh trực tiếp 100 từ khóa chuyên ngành Khoa học Máy tính bằng AI.
- Cập nhật Project Phase lên Phase 12 (Computer Science Data Expansion).

## [0.7.0] - 2026-06-23

### Added
- Sinh trực tiếp 100 từ khóa chuyên ngành IoT bằng AI, không dùng cấu hình npm run seed cũ.
- Cập nhật Project Phase lên Phase 11 (IoT Data Expansion).

## [0.6.0] - 2026-06-23

### Added
- Cấu hình seeding và kế hoạch cập nhật 100 từ khóa chuyên ngành Vô tuyến & Viễn thông.
- Cập nhật Project Phase lên Phase 10 (Telecommunications Data Expansion).

## [0.5.0] - 2026-06-23

### Added
- Thêm 100 thuật ngữ chuyên gia cho chuyên ngành Vi xử lý (Kiến trúc CPU, Bus hệ thống, Pipeline, RTOS).
- Cập nhật Project Phase lên Phase 9 (Microprocessor Data Expansion).

## [0.4.0] - 2026-06-23

### Added
- Thêm 100 thuật ngữ chuyên sâu cho chuyên ngành Điện tử số (Kỹ thuật số, Mạch tổ hợp/tuần tự, FPGA).
- Cập nhật Project Phase lên Phase 8 (Digital Electronics Data Expansion).

## [0.3.0] - 2026-06-23

### Added
- Thêm 100 từ khóa thuật ngữ chuyên ngành Tự động hóa mới và làm sạch dữ liệu toàn hệ thống.
- Cập nhật Project Phase lên Phase 7 (Automation Data Expansion).

### Fixed
- Lỗi AI sinh rác "(Bản X)" trong dữ liệu được phát hiện và dọn dẹp triệt để 2.816 bản ghi.

## [0.2.1] - 2026-06-23

### Added
- Created `dedup-terms.mjs` to detect and remove duplicate terms across category JSON files.
- Refactored `seed-terms.mjs` to target individual JSON files per category and prevent duplication via global word exclusion logic.
- Evolved keyword generation to support new categories (IoT, Vi xử lý, Vô tuyến & Viễn thông).
