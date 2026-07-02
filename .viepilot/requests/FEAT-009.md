---
id: FEAT-009
type: Feature
title: Tối ưu hoá giao diện Admin cho thiết bị di động (Mobile UI)
status: Closed
priority: High
created_at: 2026-07-02
---

# Lỗi / Yêu cầu
Giao diện khu vực Admin (`admin/components`, `admin/terms`, `admin/users`) đang bị vỡ layout trên các thiết bị di động do thanh Sidebar cố định chiếm quá nhiều diện tích và Bảng dữ liệu tràn viền ngang.

# Quyết định thiết kế (Từ Brainstorm session-2026-07-02-admin-mobile-ui.md)
1. **Sidebar Navigation**: Chuyển thành Bottom Navigation Bar cố định ở dưới đáy màn hình trên giao diện Mobile (`md:hidden fixed bottom-0 w-full z-50`).
2. **Data Presentation**: Chuyển đổi bảng `<table>` thành dạng Card layout xếp chồng dọc trên giao diện Mobile. 
   - Table sẽ bị ẩn (`hidden md:table`).
   - Khối Div chứa Cards sẽ hiện trên mobile (`grid grid-cols-1 gap-4 md:hidden`).
3. **Search & Filter**: Gom Input Search và Dropdown Filter vào một nút bấm (Icon Filter/Kính lúp). Khi bấm sẽ hiển thị Popup/Modal nhập liệu.

# Phạm vi áp dụng
- `src/app/(admin)/admin/layout.tsx` (Xử lý Bottom Nav)
- `src/app/(admin)/admin/components/page.tsx`
- `src/app/(admin)/admin/terms/page.tsx`
- `src/app/(admin)/admin/users/page.tsx`
