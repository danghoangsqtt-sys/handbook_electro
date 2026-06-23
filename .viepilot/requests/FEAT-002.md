# Feature: Danh sách lịch sử đoạn chat & Lưu trữ Supabase cho AI Lab

## Meta
- **ID**: FEAT-002
- **Type**: Feature
- **Status**: new
- **Priority**: high
- **Created**: 2026-06-23T16:58:00+07:00
- **Reporter**: User
- **Assignee**: AI

## Summary
Bổ sung tính năng quản lý lịch sử đoạn chat trong phòng thí nghiệm AI (AI Lab) tương tự giao diện Gemini. Cho phép hiển thị hình ảnh đính kèm, sử dụng backend Supabase để lưu trữ toàn bộ nội dung, hỗ trợ các thao tác ghim, đọc, và xóa đoạn chat.

## Details
1. **Title/Summary?** Danh sách lịch sử đoạn chat & Lưu trữ Supabase cho AI Lab.
2. **What problem does it solve?** Hiện tại, AI Lab không lưu trữ lại lịch sử chat giữa các phiên bản. Người dùng mất đi ngữ cảnh và tài liệu (đặc biệt là hình ảnh đính kèm) sau khi tải lại trang.
3. **Describe the feature**: 
   - Có sidebar danh sách lịch sử chat tương tự layout của Gemini.
   - Các đoạn chat có tính năng: ghim (pin) lên đầu, xem chi tiết (đọc), và xóa (delete).
   - Nội dung câu hỏi có hình ảnh đính kèm phải được lưu trữ và hiển thị ra UI.
   - Tích hợp backend database Supabase để lưu trữ dữ liệu (users, chats, messages, attachments).
4. **Who benefits from this?** Người dùng thường xuyên làm việc với AI Lab, cần tra cứu lại lịch sử trao đổi.
5. **Priority?** High.
6. **Any specific requirements?** 
   - Đảm bảo UI/UX sidebar mượt mà (có thể ẩn/hiện sidebar trên mobile).
   - Cần cấu hình kết nối Supabase (chỉ dùng cho lịch sử chat AI Lab).

## Acceptance Criteria
- [ ] Giao diện có Sidebar bên trái hiển thị danh sách các phiên chat gần đây.
- [ ] Tính năng Ghim, Xóa, Xem lại chat hoạt động ổn định.
- [ ] Tin nhắn (câu hỏi/câu trả lời) hiển thị rõ hình ảnh đính kèm.
- [ ] Database Schema Supabase được thiết lập và gọi API thông suốt.

## Related
- Phase: TBD
- Files: `src/app/ai-lab/*`, `src/components/ai-lab/*`, Supabase API routes.
- Dependencies: Supabase Client.

## Discussion
Đây là yêu cầu lớn liên quan đến việc chuyển đổi AI Lab từ dạng stateless sang stateful. Sẽ cần thiết kế DB Schema trên Supabase (ví dụ: `conversations` và `messages`).

## Resolution
Chưa xử lý.
