# Phase 18: Search Optimization & Caching
**Status**: Planned
**Version**: 0.14.0

## Context & Objectives
Tính năng tìm kiếm (Search) hiện tại đang có các điểm yếu:
1. So sánh chuỗi exact-match `toLowerCase().includes()`, không tìm được tiếng Việt có dấu khi gõ không dấu.
2. Không tìm kiếm nội dung trong mảng `applications`.
3. Server liên tục gọi `fs.readFileSync` để đọc nội dung file JSON mỗi khi có API request -> bottleneck I/O.

Mục tiêu là xử lý cả 3 vấn đề trên bằng cách viết thêm helper xoá dấu, bổ sung điều kiện tìm kiếm, và sử dụng memory cache ở Next.js API Route.

## Requirements
1. **Tiện ích Xoá Dấu Tiếng Việt**: Viết hàm `removeAccents(str: string): string` bằng cách dùng `.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')`.
2. **Nâng cấp Logic Lọc**:
   - Chuyển `query` sang không dấu và in thường.
   - Quét qua `t.term`, `t.fullName`, `t.definition`, và stringify `t.applications`.
3. **Cơ chế Cache Dữ liệu JSON**:
   - Tạo biến `cachedTerms` lưu ngoài scope của hàm `GET`.
   - Kiểm tra nếu `cachedTerms` tồn tại thì return kết quả lập tức, nếu không mới chạy `fs.readFileSync` đọc ổ cứng.

## Execution Plan (for /vp-auto)
1. Mở file `src/app/api/terms/route.ts`.
2. Chèn hàm `removeAccents`.
3. Khai báo `let cachedTerms: any = null;` ở global/module scope.
4. Cập nhật logic `getAllTerms` để đọc lưu vào `cachedTerms`.
5. Cập nhật logic filter ở `GET` API để gọi `removeAccents`.
