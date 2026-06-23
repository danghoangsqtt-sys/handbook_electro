# FEAT: Tích hợp tính năng Tra cứu Mở rộng (Google, Datasheet, Ứng dụng)

## Meta
- **ID**: FEAT-001
- **Type**: Feature
- **Status**: new
- **Priority**: medium
- **Created**: 2026-06-23T15:46:13+07:00
- **Reporter**: User
- **Assignee**: AI

## Summary
Bổ sung các nút tra cứu nhanh (Quick Links) vào trang Chi tiết thuật ngữ, giúp người dùng truy cập Google Search, tìm Datasheet linh kiện điện tử và xem các video/hình ảnh ứng dụng thực tế chỉ với một cú nhấp chuột.

## Details
**1. Title/Summary**: Tích hợp tra cứu Google, Datasheet và Ứng dụng thực tế cho mỗi từ khóa.
**2. What problem does it solve?**: Người dùng hiện chỉ đọc được định nghĩa tĩnh trong từ điển, nếu muốn tìm hiểu sâu hơn (đặc biệt là linh kiện điện tử cần Datasheet, hoặc cần xem ứng dụng thực tế) họ phải copy-paste ra ngoài tab mới rất mất thời gian.
**3. Describe the feature**: 
  - Trong giao diện TermDetail (Chi tiết thuật ngữ), bổ sung cụm nút "Tra cứu Mở rộng".
  - Nút 1: "Tìm kiếm Google" (Mở Google Search `q={term} {category}`).
  - Nút 2: "Tra cứu Datasheet" (Mở Google Search `q={term} datasheet pdf` hoặc trang tra cứu AllDatasheet).
  - Nút 3: "Xem Ứng dụng" (Mở Google Images / YouTube tìm kiếm ứng dụng của thuật ngữ).
**4. Who benefits from this?**: Kỹ sư, sinh viên Điện tử / Tự động hóa cần tìm nhanh tài liệu linh kiện để thiết kế mạch.
**5. Priority**: Medium
**6. Any specific requirements**: Các link sẽ dùng thuộc tính `target="_blank" rel="noopener noreferrer"`.

## Acceptance Criteria
- [ ] Giao diện TermDetail xuất hiện 3 nút chức năng tra cứu mở rộng.
- [ ] Bấm "Tìm kiếm Google" mở đúng link tìm kiếm từ khóa hiện tại.
- [ ] Bấm "Tra cứu Datasheet" cấu trúc được URL ưu tiên tìm file PDF hoặc trang datasheet.
- [ ] Bấm "Xem Ứng dụng" ưu tiên tìm kiếm Hình ảnh/Video ứng dụng.
- [ ] Các tính năng hoạt động tương thích Responsive (Mobile-first).

## Related
- Phase: Chưa phân bổ
- Files: `src/components/dictionary/TermDetail.tsx`

## Discussion
Đây là một tính năng UX nhỏ nhưng mang lại giá trị thực tiễn khổng lồ cho những ai chuyên học phần cứng / module điện tử.

## Resolution
Chưa xử lý.
