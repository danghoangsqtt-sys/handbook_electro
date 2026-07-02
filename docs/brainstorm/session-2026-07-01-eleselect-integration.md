# Brainstorm Session: Tích hợp tính năng từ EleSelect

**Date:** 2026-07-01
**Topic:** Phân tích và lên kế hoạch sao chép các tính năng xuất sắc từ `https://www.eleselect.com/` vào hệ thống Handbook Electro.
**Status:** In Progress

## Phân tích EleSelect.com (Research Findings)

Hệ thống Browser Subagent đã phân tích trang web và thu được các tính năng cốt lõi sau:

1. **Quản lý Linh kiện Trực quan & Bộ lọc nâng cao:**
   - Linh kiện được hiển thị dạng Grid Card trực quan (có hình ảnh mô tả).
   - Khả năng lọc chi tiết theo: Category (ví dụ MCU), Interface (ví dụ I2C), cùng các thông số kỹ thuật (VCC, IMAX, BUS, PKG, v.v.).
2. **Quản lý Danh sách vật tư (BOM - Bill of Materials):**
   - Tính năng thêm nhanh các linh kiện vào giỏ BOM.
   - Giao diện dạng Drawer (trượt từ phải sang) để quản lý, thay đổi số lượng linh kiện đã chọn.
3. **AI Project Studio (Tính năng "Đỉnh" nhất):**
   - Cho phép phân tích dự án dựa trên danh sách BOM đã chọn.
   - **Overview & Compatibility (Tổng quan & Khả năng tương thích):** AI đánh giá xem các linh kiện ghép với nhau có hợp lệ không (ví dụ ESP32 có phù hợp với DHT22 và LCD I2C không).
   - **Wiring Diagram (Sơ đồ đấu nối):** AI sinh sơ đồ chân chi tiết cách cắm dây.
   - **Sample Code (Code mẫu):** AI sinh code (ví dụ C/C++ cho Arduino/ESP-IDF) dựa trên danh sách linh kiện.
4. **Trợ lý "Hỏi AI" (Chatbot chuyên sâu):**
   - Nút Chat nổi (Floating Button) cho phép nhập ý tưởng dự án.
   - Trợ lý AI (Google Gemini) tư vấn các linh kiện cần thiết, hướng dẫn kết nối và code mẫu.

## Đề xuất Tích hợp vào Handbook Electro

Chúng ta có thể tích hợp các tính năng này thành **Phase 22** và các Phase tiếp theo. 

### 1. Nâng cấp Kho dữ liệu (Database)
- Bổ sung bảng `components` (hoặc mở rộng `terms`) để chứa các trường: `image_url`, `datasheet_url`, `specs` (VCC, Interface, v.v.).
- Tạo UI hiển thị Component Grid trực quan có hình ảnh.

### 2. Tính năng BOM (Danh sách linh kiện)
- Xây dựng Component `<BOMCart />` lưu state bằng Zustand hoặc LocalStorage.
- Cho phép người dùng thêm các Term/Component vào BOM.

### 3. Mở rộng Không gian AI Lab -> AI Project Studio
- Thêm tab **"Thiết kế Dự án" (Project Studio)** vào AI Lab.
- Người dùng truyền BOM vào Project Studio.
- Backend Next.js sẽ gọi Gemini API với System Prompt chuyên biệt để phân tích sự tương thích, sinh sơ đồ chân (có thể dùng bảng Markdown hoặc format đặc biệt) và code mẫu.

## Quyết định Kiến trúc (Architecture Decisions)

- [x] **Database Schema:** **Tạo bảng `components` mới độc lập**. (Lý do: Tách biệt rõ ràng giữa "Thuật ngữ lý thuyết" ở bảng `terms` và "Linh kiện thực tế" ở bảng `components`. Bảng linh kiện sẽ cần lưu nhiều trường dữ liệu phức tạp như specs, hình ảnh, datasheet mà bảng terms không cần).
- [x] **Hiển thị Wiring Diagram:** **Sử dụng thư viện vẽ sơ đồ (Mermaid.js)**. (Lý do: Tăng trải nghiệm thị giác (Wow factor). Cú pháp Markdown của AI có thể dễ dàng render các sơ đồ flowchart kết nối chân linh kiện một cách chuyên nghiệp. Ví dụ: `MCU[ESP32 GND] --- SENSOR[DHT22 GND]`).
- [x] **Lộ trình:** **Chia làm 2 Phase (22 & 23)**. (Lý do: Giảm rủi ro, Phase 22 làm nền tảng vững chắc cho BOM và UI linh kiện, Phase 23 tập trung toàn lực vào Prompt Engineering cho AI).

## Phases

### Phase 22: Thư viện Linh kiện & BOM
- Thiết kế giao diện Grid Card linh kiện trực quan.
- Xây dựng tính năng thêm linh kiện vào BOM.
- Quản lý BOM (Drawer / Sidebar).

### Phase 23: AI Project Studio
- Tích hợp System Prompt chuyên sâu về tư vấn linh kiện và sơ đồ cắm chân.
- Xây dựng giao diện hiển thị 3 Tab: Tổng quan, Sơ đồ cắm, Code mẫu.

## Action Items
- [x] Xin ý kiến người dùng về hướng thiết kế Database cho Linh kiện (Đã chốt: Bảng riêng).
- [x] Chốt phương án hiển thị sơ đồ đấu nối (Đã chốt: Mermaid.js).
