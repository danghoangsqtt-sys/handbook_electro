# FEAT: AI phân tích hình ảnh sơ đồ mạch

## Meta
- **ID**: FEAT-005
- **Type**: Feature
- **Status**: new
- **Priority**: high
- **Created**: 2026-07-02
- **Reporter**: User
- **Assignee**: AI

## Summary
Cho phép người dùng tải lên sơ đồ mạch (ảnh) và yêu cầu AI Gemini phân tích linh kiện.

## Details
- Cập nhật giao diện AI Lab (phần chat) để có nút Upload ảnh/sơ đồ mạch.
- Bổ sung cấu hình để model Gemini (Gemini 2.5 Flash / Vision) có thể tiếp nhận và xử lý file ảnh định dạng base64 hoặc qua storage URL.
- AI sẽ đọc ảnh sơ đồ mạch và bóc tách danh sách linh kiện cần thiết, sau đó giải thích nguyên lý hoặc gợi ý thêm cho kỹ sư.

## Acceptance Criteria
- [ ] UI có nút cho phép chọn và upload ảnh (jpg, png).
- [ ] Gửi ảnh kèm theo prompt qua API backend (NextJS).
- [ ] Backend truyền tải ảnh an toàn sang API của Google Gemini SDK.
- [ ] AI trả về kết quả phân tích và render chính xác trên giao diện chat.

## Related
- Phase: TBD
- Files: `src/components/AILab.tsx`, `src/app/api/chat/route.ts`
- Dependencies: None
