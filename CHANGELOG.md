# Changelog

All notable changes to this project will be documented in this file.

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
