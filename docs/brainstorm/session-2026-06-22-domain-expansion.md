# Brainstorm Session: Domain Expansion (Viễn thông, Anten & Tăng cường Vi xử lý/IoT)

## 1. Mục tiêu (Goals)
- Mở rộng kiến thức của TechDict v5.0 sang mảng Vô tuyến, Viễn thông và Anten.
- Làm đầy dữ liệu cho các mảng "Vi xử lý" và "IoT" (hiện tại đang trống).
- Đạt mục tiêu: 500 thuật ngữ mới cho mỗi chuyên mục để nâng cấp quy mô dữ liệu.

## 2. Quyết định đã chốt (Decisions)
1. **Phương pháp Nạp dữ liệu (Data Seeding)**:
   - Do số lượng lớn (500 terms/mục), cần tạo cấu trúc file chuẩn (JSON template) để nạp số lượng lớn (chạy script chia lô hoặc nhập liệu thủ công) thay vì sinh tự động một lần qua API để tránh nghẽn Token.
2. **Giao diện (UI Categories)**:
   - Gộp chung các mảng liên quan thành một nhóm lớn: **"Vô tuyến & Viễn thông"** (đã bao hàm Anten) để tối ưu không gian hiển thị của thanh bộ lọc.
3. **Cập nhật Hệ thống (System Integration)**:
   - Cập nhật `TermsList.tsx`: Bổ sung "Vô tuyến & Viễn thông" vào hệ thống Filter UI.
   - Cập nhật `QuizSystem.tsx`: Thêm danh mục mới vào cấu hình câu hỏi trắc nghiệm.
   - Cập nhật `IntroStats.tsx`: Cập nhật nội dung mô tả quy mô và chuyên ngành của từ điển.
   - Cập nhật `route.ts` (AI Lab): Mở rộng System Prompt để AI trở thành chuyên gia về "Vô tuyến, Viễn thông & Anten".

## 3. Câu hỏi mở (Open Questions)
- Kế hoạch sinh 500 thuật ngữ: Chúng ta sẽ tạo script chạy ngầm lặp 10-20 lần (mỗi lần 20-50 thuật ngữ) qua Gemini API để tự động tích luỹ, hay bạn có nguồn file CSV/Excel sẵn để tôi viết tool import?

## 4. Hành động tiếp theo (Action Items)
- Dùng lệnh `/vp-crystallize` để biên dịch biên bản này thành Task chi tiết.

## Phases
- Phase 5: Domain Expansion (Assigned features: UI Filter Update, Quiz System Update, System Prompt Update, Bulk Data Generator Tool).
