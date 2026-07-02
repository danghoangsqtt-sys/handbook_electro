---
id: FEAT-011
type: Feature
title: Tái thiết kế Giao diện Admin (UI/UX Refinement - vp-frontend-design)
status: Open
priority: High
created_at: 2026-07-02
---

# Lỗi / Yêu cầu
Giao diện Admin hiện tại đang sử dụng quá nhiều Font Monospace (`Fira Code`), kết hợp với chữ in hoa (`uppercase`) và góc cạnh vuông vức, tạo cảm giác rất thô cứng, nặng nề (giống công cụ Terminal của Developer) thay vì một trang quản trị hiện đại, chuyên nghiệp. Người dùng yêu cầu thiết kế lại theo hướng tinh tế, hiện đại, và chuyên nghiệp hơn trên cả PC và Mobile.

# Aesthetic Direction (vp-frontend-design)
**Concept: Refined Modern Elegance (Sự thanh lịch hiện đại)**
Lấy cảm hứng từ các Dashboard hàng đầu như Linear, Vercel, Stripe. 
- Mềm mại hoá các đường nét nhưng vẫn giữ sự sắc sảo chuyên nghiệp.
- Gỡ bỏ hoàn toàn sự thô cứng của `font-mono` ở những nơi không cần thiết.

# Quyết định thiết kế
1. **Typography**:
   - Chuyển toàn bộ Text giao diện (Tiêu đề, Bảng, Input, Button) sang sử dụng `font-sans` (Plus Jakarta Sans - đã có sẵn trong project) để nét chữ mềm mại, dễ đọc và sang trọng hơn.
   - Loại bỏ các class `uppercase`, `tracking-widest` thừa thãi.
   - Chỉ giữ `font-mono` cho các mã Code, ID, hoặc Badge kỹ thuật.
2. **Hình khối (Shapes) & Chiều sâu (Depth)**:
   - Áp dụng góc bo tròn tinh tế: `rounded-xl` hoặc `rounded-2xl` cho các thẻ Card, Input, Button. Không dùng góc vuông `rounded-none`.
   - Sử dụng hiệu ứng bóng đổ mượt mà (`shadow-sm`, `shadow-md`) thay vì viền border quá dày (`border-2`). Border sẽ giảm xuống `border` mỏng với màu nhạt hơn.
3. **Màu sắc & Contrast**:
   - Sử dụng các tone màu mềm mại hơn: nền `bg-white`, border `border-slate-200`, chữ chính `text-slate-800`.
   - Màu nhấn chủ đạo (Primary) vẫn là `#0066FF` nhưng sẽ phối màu nhẹ nhàng hơn ở trạng thái hover.

# Phạm vi áp dụng
- `src/app/(admin)/admin/layout.tsx`
- `src/app/(admin)/admin/components/page.tsx`
- `src/app/(admin)/admin/terms/page.tsx`
- `src/app/(admin)/admin/users/page.tsx`
