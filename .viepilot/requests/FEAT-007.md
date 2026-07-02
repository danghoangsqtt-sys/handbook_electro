---
id: FEAT-007
type: Feature
title: Admin: Thêm tính năng Search và cải thiện UI Sort cho bảng dữ liệu
status: Closed
priority: Medium
created_at: 2026-07-02
---

# Lỗi / Yêu cầu
Thêm tính năng tìm kiếm (Search) và sắp xếp (Sort) trong trang quản lý Linh kiện (`admin/components/page.tsx`) và Thuật ngữ (`admin/terms/page.tsx`) của phần ADMIN. 
(Lưu ý: Tính năng click vào Header để Sort đã được bổ sung ở `ENH-003` nhưng người dùng có thể cần một UI rõ ràng hơn hoặc kết hợp tìm kiếm text).

# Đề xuất giải pháp
1. **Tìm kiếm (Search)**:
   - Thêm một ô input tìm kiếm (Search box) ở phía trên các bảng dữ liệu (ngang hàng với nút Thêm mới/Import).
   - Khi người dùng gõ text, tự động lọc danh sách `components` hoặc `terms` theo trường `name`/`term` hoặc `category`.
2. **Cải thiện Sort**:
   - (Tuỳ chọn) Nếu sort bằng click header chưa đủ trực quan, có thể thêm một Dropdown "Sắp xếp theo" kế bên ô tìm kiếm để dễ thao tác hơn.
3. **Phạm vi áp dụng**:
   - `src/app/(admin)/admin/components/page.tsx`
   - `src/app/(admin)/admin/terms/page.tsx`
   - Có thể áp dụng luôn cho `admin/users/page.tsx` để đồng bộ trải nghiệm.
