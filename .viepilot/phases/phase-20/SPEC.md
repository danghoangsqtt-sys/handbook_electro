# Phase 20: Core Vocabulary Enrichment
**Status**: Planned
**Version**: 0.16.0

## Context & Objectives
Ứng dụng thiếu hụt nhiều từ khoá cơ bản (vd: BIOS, RAM, Sensor, Mechatronics...).
Mục tiêu là chèn thêm 350 từ vựng cốt lõi vào 7 chuyên mục.

## Execution Plan
1. Viết một kịch bản Node.js (`src/scripts/seed-core-keywords.mjs`).
2. Script này chứa dữ liệu 350 từ khoá đã được soạn sẵn với cấu trúc:
   ```json
   {
     "id": "...",
     "term": "...",
     "fullName": "...",
     "definition": "...",
     "category": "...",
     "applications": ["..."]
   }
   ```
3. Script sẽ đọc các tệp JSON hiện tại trong `public/data/categories/`, nối dữ liệu mới vào mảng, sau đó ghi lại file.
4. Chạy `node src/scripts/seed-core-keywords.mjs`.
5. Đóng gói hệ thống.
