# Changelog

All notable changes to this project will be documented in this file.

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
