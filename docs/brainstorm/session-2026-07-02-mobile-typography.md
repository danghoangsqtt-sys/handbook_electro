# Brainstorm Session: Mobile UI Typography & Density Optimization
**Date:** 2026-07-02
**Topic:** Tối ưu kích thước chữ (Typography) và mật độ hiển thị (Density) trên giao diện Mobile lấy cảm hứng từ Facebook.

## 1. Vấn đề hiện tại
- Kích thước chữ (Font size) của các tiêu đề (`h1`, `h2`) và các thành phần UI (Input, Button) đang quá lớn so với chuẩn màn hình điện thoại.
- Padding/Margin của các thẻ Card và nút bấm quá rộng, làm giảm lượng thông tin có thể hiển thị trên một màn hình (Low density).
- Nút "Thêm Linh Kiện" to và chiếm nhiều diện tích.

## 2. Phân tích tham chiếu (Facebook Mobile UI)
- **Cỡ chữ (Typography):** Facebook sử dụng cỡ chữ vừa phải. Tiêu đề thường là `16px - 18px` (tương đương `text-base` hoặc `text-lg` trong Tailwind), văn bản phụ thường là `12px - 14px` (`text-xs` hoặc `text-sm`).
- **Mật độ (Density):** Khoảng cách (Padding/Margin) giữa các phần tử nhỏ gọn hơn, giúp hiển thị được nhiều nội dung (như một bài post) trên cùng một màn hình.
- **Nút bấm (Buttons):** Nút bấm thường có chiều cao khoảng `36px - 40px` (thay vì `48px+` như hiện tại), chữ trong nút ở mức `14px`.

## 3. Các Quyết định Đề xuất (Decisions)

### 3.1. Typography (Kích thước chữ)
- **Tiêu đề trang (Page Title):** Giảm từ `text-2xl` xuống `text-lg` hoặc `text-xl` trên mobile.
- **Tên Linh kiện/Thuật ngữ trong Card:** Giảm từ `text-lg` xuống `text-base`.
- **Text Input & Button:** Giảm từ `text-sm` (với padding to) xuống `text-sm` với padding nhỏ hơn, hoặc `text-xs`.

### 3.2. Spacing & Density (Khoảng cách & Mật độ)
- **Padding của Header/Card:** Giảm padding `p-6` xuống `p-3` hoặc `p-4` trên mobile.
- **Chiều cao Input/Button:** Giảm `py-3` xuống `py-2` hoặc `py-1.5` trên mobile. Nút "Thêm mới" chuyển thành dạng icon nổi (FAB - Floating Action Button) hoặc một nút gọn gàng góc phải trên cùng.

### 3.3. Tối ưu Header Mobile
- Trên mobile, thay vì để dòng chữ "LINH KIỆN" chình ình chiếm 1/4 màn hình, ta thu nhỏ nó lại ngang hàng với thanh tìm kiếm hoặc ẩn text phụ đi. Nút "Thêm" chỉ hiện icon dấu `+`.

## 4. Hành động tiếp theo (Action Items)
- Chuyển quyết định thành `FEAT-010`.
- Sửa lại các class Tailwind (thêm prefix `md:` cho các class kích thước lớn hiện tại và dùng class nhỏ hơn làm mặc định cho mobile).
