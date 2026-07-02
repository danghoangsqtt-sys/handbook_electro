# Phase 27: User Accounts, AI Image Analysis & Flashcard Quiz

## 1. Mục tiêu (Goals)
- Chuyển đổi toàn bộ hệ thống auth bằng mã PIN sang hệ thống Authentication thực (Supabase Auth: Email/Password, OAuth). Migrate an toàn data sang ID mới.
- Bổ sung khả năng Upload ảnh Sơ đồ mạch vào khung chat AI Lab, và sử dụng model Gemini Vision (2.5 Flash) để phân tích hình ảnh và trả về danh sách linh kiện.
- Loại bỏ hệ thống bài trắc nghiệm (Quiz) 4 đáp án hiện tại, thay thế bằng giao diện Flashcard (Thẻ lật) sinh động hơn, giúp người dùng học ngẫu nhiên 5 từ mỗi lần.

## 2. Thông số kỹ thuật (Specifications)
### Supabase Auth
- Thay đổi `users_pin` thành account Supabase Auth. Dùng bảng public profile hoặc tự trích xuất email.
- `chat_sessions` và dữ liệu local bookmarks cần được gắn với `user_id` thay vì PIN `varchar`.

### AI Image Analysis
- Bổ sung nút [Upload/Đính kèm ảnh] bên cạnh input chat trong `/ailab`.
- Hỗ trợ preview ảnh trước khi gửi.
- Tại API `/api/chat/route.ts`, nhận base64 image (hoặc File URL upload lên bucket). Truyền vào message cho Gemini phân tích bằng `userContent: [{ type: 'image', image: ... }]`.

### Flashcard Quiz
- Xóa `/src/components/quiz`.
- Tạo `/src/components/flashcard/FlashcardDeck.tsx`.
- Giao diện: lật thẻ có hiệu ứng xoay 3D (CSS 3D transforms). Random 5 term ID mỗi lượt.

## 3. Tasks
- [ ] TBD thông qua implementation plan.
