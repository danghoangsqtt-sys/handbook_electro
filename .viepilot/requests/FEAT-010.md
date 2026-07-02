---
id: FEAT-010
type: Feature
title: Tối ưu hoá Typography và Density trên Mobile UI (theo chuẩn vp-frontend-design)
status: Closed
priority: High
created_at: 2026-07-02
---

# Lỗi / Yêu cầu
Kích thước chữ và khoảng cách (Padding/Margin) của giao diện Admin trên thiết bị di động đang quá lớn, gây lãng phí không gian. Người dùng yêu cầu tối ưu lại theo chuẩn của ứng dụng Facebook (chữ vừa phải, density cao) kết hợp với kỹ năng `vp-frontend-design`.

# Quyết định thiết kế (Từ Brainstorm session-2026-07-02-mobile-typography.md)
1. **Typography**: Giảm size chữ của các Heading (từ `text-2xl` xuống `text-lg`), Component Name (từ `text-lg` xuống `text-base`), và các thành phần phụ.
2. **Density**: Thu gọn padding của các nút bấm, input field (từ `py-3` xuống `py-2` hoặc `py-1.5`), thu nhỏ padding của Card.
3. **Thẩm mỹ (vp-frontend-design)**: Thay vì thiết kế to thô kệch, sẽ dùng thiết kế tinh tế (Refined Minimalism): font chữ sắc nét, khoảng trống có chủ đích, và các viền/border mảnh hơn để tạo cảm giác sang trọng nhưng vẫn chứa nhiều thông tin.
4. Nút "Thêm mới" trên mobile có thể thu gọn thành một nút mỏng gọn hoặc icon.

# Phạm vi áp dụng
- `src/app/(admin)/admin/components/page.tsx`
- `src/app/(admin)/admin/terms/page.tsx`
- `src/app/(admin)/admin/users/page.tsx`
