# Phase 19: Extended Lookups (Google, Datasheet, Applications)
**Status**: Planned
**Version**: 0.15.0

## Context & Objectives
Ứng dụng từ điển hiện tại chỉ cung cấp định nghĩa tĩnh nội bộ. Thiếu sự kết nối đến tài liệu bên ngoài như Datasheet cho linh kiện điện tử hoặc hình ảnh thực tế của thuật ngữ (Google/Youtube).
Mục tiêu của Phase này là thêm 3 liên kết tra cứu nhanh (Quick Links) vào Component `TermDetail`.

## Requirements
1. **Thêm UI 3 Nút Bấm**: Nằm gọn trong `TermDetail.tsx` bên dưới phần mô tả hoặc vị trí thuận tiện. Giao diện dạng outline button hoặc chip, có icon (Google, PDF, YouTube).
2. **Logic URL**:
   - `Tra Google`: `https://www.google.com/search?q={term} {category}`
   - `Tra Datasheet`: `https://www.google.com/search?q={term} datasheet pdf`
   - `Xem Video Ứng Dụng`: `https://www.youtube.com/results?search_query={term} applications in engineering`
3. Mở ở tab mới `target="_blank" rel="noopener noreferrer"`.
4. Giao diện tương thích Responsive (Mobile-first).

## Execution Plan (for /vp-auto)
1. Cập nhật `src/components/dictionary/TermDetail.tsx`.
2. Bố trí `<div className="flex gap-2 flex-wrap">` để chứa 3 thẻ `<a>`.
3. Kiểm tra hiển thị icon (FontAwesome đã cài sẵn).
4. Đẩy code lên Github.
