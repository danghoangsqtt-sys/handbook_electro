---
id: FEAT-008
type: Feature
title: Admin: Thêm bộ lọc phân loại (Category Filter)
status: Closed
priority: Medium
created_at: 2026-07-02
---

# Lỗi / Yêu cầu
Thêm tính năng lọc dữ liệu theo Danh mục (Category Filter) trong trang quản lý Linh kiện và Thuật ngữ của khu vực Admin, giúp người dùng dễ dàng thu hẹp phạm vi hiển thị bên cạnh ô Tìm kiếm (Search) đã có.

# Đề xuất giải pháp
1. **Lấy danh sách Danh mục (Categories)**:
   - Trong quá trình load dữ liệu (components/terms), trích xuất danh sách các `category` duy nhất (unique) để làm tuỳ chọn lọc.
2. **Giao diện bộ lọc (UI Dropdown)**:
   - Thêm một thẻ `<select>` (hoặc Dropdown tuỳ chỉnh) đặt cạnh ô Tìm kiếm.
   - Khi chọn một danh mục cụ thể (ví dụ: `SENSOR`, `DISPLAY`, `MCU`), bảng dữ liệu chỉ hiển thị các mục thuộc danh mục đó.
3. **Phạm vi áp dụng**:
   - `src/app/(admin)/admin/components/page.tsx`
   - `src/app/(admin)/admin/terms/page.tsx`
