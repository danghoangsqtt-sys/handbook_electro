# Brainstorm Session: Component Image Sources

**Date:** 2026-07-02
**Topic:** Finding and updating direct image links for electronic components (SSD1306 OLED).

## Vấn đề hiện tại
User đang gặp khó khăn khi sử dụng link ảnh trực tiếp từ LCDWiki (`https://www.lcdwiki.com/File:MC096-22.jpg`) vì trang web này chặn **Hotlinking** (ngăn không cho các trang web khác hiển thị trực tiếp ảnh của họ để tiết kiệm băng thông). Do đó, khi đưa link này vào cơ sở dữ liệu hệ thống, ảnh sẽ bị lỗi (Broken Image) hoặc trả về mã lỗi 403 Forbidden.

## Giải pháp & Nguồn ảnh cập nhật nhanh

1. **Sử dụng dịch vụ Upload Ảnh miễn phí (Nhanh nhất & Chủ động nhất):**
   - Copy ảnh từ LCDWiki hoặc các trang khác.
   - Paste (Ctrl+V) vào các trang như **ImgBB (imgbb.com)** hoặc **Imgur (imgur.com)**.
   - Lấy **Direct Link** (Link có đuôi `.jpg` hoặc `.png`) và dán vào hệ thống. Cách này đảm bảo ảnh không bao giờ bị lỗi do chặn hotlink.

2. **Nguồn ảnh từ GitHub (Mã nguồn mở):**
   - Các repo của Adafruit, Sparkfun hoặc các dự án DIY thường chứa ảnh linh kiện.
   - Khi tìm được ảnh trên GitHub, click chuột phải chọn **"Copy Image Address"** (Link sẽ có dạng `raw.githubusercontent.com/...`). Link này hoàn toàn hợp lệ để làm ảnh linh kiện.

3. **Wikimedia Commons:**
   - Là kho ảnh miễn phí của Wikipedia.
   - Chấp nhận hiển thị trực tiếp ở mọi nơi.

## Datasheet Link
Link datasheet user cung cấp: `https://datasheethub.com/ssd1306-128x64-mono-0-96-inch-i2c-oled-display/` là hoàn toàn hợp lệ và hoạt động bình thường, vì datasheet thường là liên kết dẫn ra ngoài, hệ thống không tải trực tiếp nội dung đó lên UI.
