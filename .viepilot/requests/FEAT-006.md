# FEAT: Chuyển đổi mã PIN thành hệ thống Account thực (Email/OAuth)

## Meta
- **ID**: FEAT-006
- **Type**: Feature
- **Status**: new
- **Priority**: high
- **Created**: 2026-07-02
- **Reporter**: User
- **Assignee**: AI

## Summary
Chuyển đổi mã PIN hiện tại thành hệ thống đăng nhập tài khoản thực sự (Email/Password hoặc Google OAuth qua Supabase).

## Details
- Loại bỏ logic dùng mã PIN (6 số) cũ vốn kém bảo mật và khó khôi phục.
- Thiết lập Supabase Auth (Email & Password, Google OAuth).
- Tạo trang Sign Up / Sign In chuyên nghiệp hơn.
- Migrate (chuyển đổi) hoặc cập nhật logic kết nối dữ liệu cũ (chat sessions, bookmarks) từ mã PIN sang user UUID chuẩn của Supabase Auth.

## Acceptance Criteria
- [ ] Người dùng có thể đăng ký/đăng nhập bằng Email/Password.
- [ ] Người dùng có thể đăng nhập nhanh bằng Google (OAuth).
- [ ] Middleware bảo vệ các trang yêu cầu quyền đăng nhập (VD: AI Lab, User Profile).
- [ ] Lịch sử Chat và Bookmark được liên kết với User ID mới thay vì chuỗi PIN.

## Related
- Phase: TBD
- Files: `src/components/auth/*`, `src/lib/supabase.ts`, `middleware.ts`
- Dependencies: Supabase Auth setup
