# Brainstorm Session: Xây dựng Admin Dashboard & Chiến lược Quản lý Dữ liệu
**Date:** 2026-07-01
**Topic:** Phát triển hệ thống quản trị (Admin Dashboard) để thêm mới thủ công linh kiện, thuật ngữ; đánh giá khả năng cào dữ liệu từ EleSelect; và chiến lược lưu trữ (Google Drive, Shopee Affiliate).
**Status:** In Progress

---

## 1. Phân tích các ý tưởng của bạn

### 1.1. Cào dữ liệu (Scraping) từ EleSelect
- **Khả thi kỹ thuật:** Việc cào dữ liệu (hình ảnh, datasheet) từ EleSelect hoàn toàn khả thi bằng các công cụ như `Puppeteer` hoặc `Cheerio` (thông qua Node.js scripts). 
- **Rủi ro & Hạn chế:** Các trang web thường có cơ chế chống bot (Cloudflare). Hơn nữa, chất lượng dữ liệu cào về có thể không đồng nhất, hình ảnh có thể chứa logo bản quyền.
- **Kết luận:** Có thể tạo một script nhỏ để cào dữ liệu thô (tên, specs cơ bản), nhưng **nhập thủ công qua Admin Dashboard** kết hợp hình ảnh/datasheet tự tìm (lưu trên Google Drive) là phương án tối ưu, an toàn và lâu dài hơn nhất.

### 1.2. Chiến lược lưu trữ trên Google Drive
- Ý tưởng dùng Google Drive để lưu file PDF (Datasheet) và Hình ảnh là **rất xuất sắc**.
- **Ưu điểm:** Hoàn toàn miễn phí, tiết kiệm 100% dung lượng lưu trữ của Supabase/Server, băng thông tải file rất cao.
- **Kỹ thuật:** Admin chỉ cần dán link chia sẻ (Share Link) của Google Drive. Backend hoặc Frontend của chúng ta có thể tự động convert link đó thành định dạng `Direct Download Link` để hiển thị ảnh (`<img>`) hoặc xem PDF trực tiếp trên web mà không cần chuyển hướng sang trang của Google.

### 1.3. Kiếm tiền với Shopee Affiliate Link
- Đây là mô hình kinh doanh rất hay của các website tra cứu điện tử.
- Chúng ta sẽ bổ sung thêm cột `shopee_link` (link tiếp thị liên kết) vào bảng `components`.
- Trên giao diện `ComponentLibrary.tsx`, thay vì chỉ có nút "Thêm vào BOM", chúng ta sẽ có thêm nút **"Mua linh kiện này (Shopee)"** với màu cam đặc trưng.

### 1.4. Nền tảng Admin (Admin Dashboard)
Vì dữ liệu sẽ do Admin tự cập nhật, website cần chia làm 2 phần rõ rệt:
- **Client/Public (Người dùng thường):** Chỉ xem, tra cứu, dùng AI Lab và BOM.
- **Admin Panel (Hệ thống Quản trị):** Dành riêng cho Admin để thêm/sửa/xóa Thuật ngữ, Linh kiện, cấu hình hệ thống. Cần có cơ chế bảo mật (Mã PIN Admin hoặc Đăng nhập bằng tài khoản).

---

## 2. Đề xuất Kiến trúc cho Admin Dashboard (Phase 25)

### 2.1. Cập nhật Database (Bảng `components`)
Cần thêm 1 số cột mới vào Supabase:
```sql
ALTER TABLE public.components 
ADD COLUMN shopee_link TEXT,
ADD COLUMN is_active BOOLEAN DEFAULT true;
```

### 2.2. Giao diện Admin (Next.js Routes)
Chúng ta sẽ tạo một phân hệ mới ngay trong source code hiện tại để dễ quản lý:
- `/admin`: Trang đăng nhập Admin (Dùng một `ADMIN_PIN` thiết lập trong file `.env` để bảo mật, hoặc dùng Auth của Supabase).
- `/admin/dashboard`: Thống kê tổng quan (Có bao nhiêu linh kiện, thuật ngữ, người dùng).
- `/admin/components`: Giao diện CRUD (Create, Read, Update, Delete) dạng bảng để quản lý linh kiện. Tại đây có form dán link Google Drive và Shopee.
- `/admin/terms`: Giao diện CRUD quản lý thuật ngữ (dictionary).

### 2.3. Logic chuyển đổi Link Google Drive
Hệ thống sẽ tự động bắt link Drive của Admin nhập vào và convert:
- Link gốc: `https://drive.google.com/file/d/[FILE_ID]/view?usp=sharing`
- Link hiển thị ảnh: `https://drive.google.com/uc?export=view&id=[FILE_ID]`

---

## 3. Quyết định Kiến trúc & Triển khai (Đã chốt)

Dựa trên phản hồi của bạn, chúng ta đã thống nhất các phương án sau:

- **Hệ thống Xác thực (Auth):** Sử dụng **Tài khoản Admin (Email/Password)** thông qua Supabase Auth để đăng nhập an toàn vào khu vực quản trị. Điều này tạo nền tảng vững chắc nếu sau này dự án có nhiều người quản trị (Phân quyền Role-based).
- **Giao diện Quản lý (Admin Dashboard):** Xây dựng một trang web quản trị độc lập (VD: `/admin/dashboard`) với UI/UX hiện đại. Admin có thể thêm, sửa, xóa linh kiện và thuật ngữ trực quan thông qua các Form nhập liệu thân thiện mà không cần chạm vào Database gốc.
- **Tích hợp Google Drive & Shopee Affiliate:** Form thêm mới Component trên Admin Dashboard sẽ có trường để dán link Google Drive (cho Ảnh/Datasheet) và link Shopee Affiliate. Hệ thống sẽ tự xử lý chuyển đổi link Drive để hiển thị trực tiếp.

---

**Brainstorm Session Hoàn Tất!**
Hướng đi đã cực kỳ rõ ràng. Bước tiếp theo là lập bản kế hoạch thực thi chi tiết (Implementation Plan).
