# Brainstorm Session: Admin Mobile UI Optimization
**Date:** 2026-07-02
**Topic:** Thiết kế tối ưu giao diện web app của trang Admin trên điện thoại thông minh (Responsive Mobile UI).

## 1. Vấn đề hiện tại
- Thanh điều hướng bên trái (Sidebar) chiếm quá nhiều diện tích, đẩy nội dung chính ra khỏi màn hình gây vỡ layout và scroll ngang.
- Bảng dữ liệu (Data Table) không co giãn tốt trên màn hình nhỏ.
- Ô tìm kiếm và bộ lọc làm chiếm nhiều không gian phía trên, gây rối mắt.

## 2. Các Quyết định Kiến trúc & Thiết kế (Decisions)

### 2.1. Điều hướng (Navigation) - Chọn phương án 1B
- **Quyết định:** Trên giao diện Mobile, Sidebar sẽ bị ẩn đi và chuyển thành thanh điều hướng dưới đáy màn hình (Bottom Navigation Bar).
- **Lý do:** Giống trải nghiệm Native App trên mobile, người dùng dễ dàng chạm bằng ngón cái, giải phóng hoàn toàn không gian bên trên cho nội dung.
- **Thực thi:** Sử dụng Media Query (`md:block hidden` cho Sidebar cũ và `md:hidden fixed bottom-0` cho Bottom Nav).

### 2.2. Hiển thị Dữ liệu (Data Presentation) - Chọn phương án 2B
- **Quyết định:** Chuyển đổi Bảng (Table) thành dạng Thẻ (Card-based Layout) trên mobile. Mỗi phần tử (Linh kiện, Thuật ngữ, User) sẽ là một Card.
- **Lý do:** Tối ưu không gian đọc chữ, hình ảnh to rõ ràng hơn, các nút Action (Edit/Delete) có thể đặt gọn vào góc Card.
- **Thực thi:** 
  - Khối `<table>` sẽ có class `hidden md:table`.
  - Khối `<div className="grid grid-cols-1 gap-4 md:hidden">` sẽ render từng mục dưới dạng Card.

### 2.3. Khu vực Lọc và Tìm kiếm (Filter & Search) - Chọn phương án 3B
- **Quyết định:** Gom nút Lọc & Tìm kiếm vào một nút (Icon Kính lúp / Bộ lọc). Khi bấm sẽ bật lên một Modal/Popup hoặc Drawer chứa ô input Search và select Filter.
- **Lý do:** Tiết kiệm diện tích màn hình quý giá ở phía trên cùng, tập trung hiển thị dữ liệu chính.
- **Thực thi:** Thêm state `isSearchMobileOpen` và tạo Modal/Overlay riêng cho giao diện Mobile.

## 3. Câu hỏi mở (Open Questions)
- Khi cuộn trang trên mobile, Bottom Navigation có nên mờ đi (transparent) hoặc ẩn đi để tối đa không gian màn hình không, hay cố định 100%? (Tạm thời: Cố định 100%).

## 4. Hành động tiếp theo (Action Items)
- Chuyển tiếp các quyết định này thành Implementation Plan cụ thể.
- Triển khai code cho `layout.tsx` (Bottom Nav).
- Triển khai code Mobile UI cho `components/page.tsx`, `terms/page.tsx`, và `users/page.tsx`.

## Phases
- **Phase 3.5 (UI Polish & Mobile Responsiveness):**
  - Refactor Admin Layout for Bottom Navigation on Mobile.
  - Convert Tables to Cards on Mobile.
  - Refactor Search/Filter into mobile-friendly popup.
