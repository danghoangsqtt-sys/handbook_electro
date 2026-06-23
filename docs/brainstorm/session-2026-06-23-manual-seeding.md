# Brainstorm Session: Manual Keyword Seeding
**Date**: 2026-06-23
**Context**: Người dùng yêu cầu tạo lập và bổ sung từ khóa mới cho các danh mục (IoT, Vi xử lý, Vô tuyến & Viễn thông) trực tiếp bằng khả năng sinh dữ liệu của AI Agent thay vì sử dụng tập lệnh gọi API Gemini từ terminal (`npm run seed`) do thiếu API Key ở môi trường máy trạm.

## Mục tiêu phiên làm việc
1. Đảm bảo toàn bộ các mục còn trống (IoT, Vô tuyến & Viễn thông) được khởi tạo với những từ khóa chuyên ngành chất lượng cao.
2. Bổ sung từ khóa nâng cao cho danh mục "Vi xử lý" (vốn đã có 500 từ) mà không gây ra hiện tượng trùng lặp.
3. Chạy quá trình "Deduplication" toàn cục trên dữ liệu tĩnh để loại bỏ mọi sự cố chồng chéo giữa các danh mục chuyên ngành.

## Dữ liệu được sinh trực tiếp

### 1. IoT (Internet of Things)
- Sinh mới 20 từ khóa vào `iot.json`.
- Các công nghệ nổi bật: MQTT, CoAP, LoRaWAN, NB-IoT, Zigbee, Z-Wave, BLE, RFID, Node-RED, ThingsBoard, Digital Twin, Edge Computing, v.v.

### 2. Vô tuyến & Viễn thông
- Sinh mới 20 từ khóa vào `vo_tuyen_vien_thong.json`.
- Các công nghệ nổi bật: 5G, LTE, OFDM, QAM, MIMO, VSWR, SNR, dBm, BER, CDMA, Baseband, Yagi-Uda, Microstrip Patch, v.v.

### 3. Vi xử lý
- Đọc 500 từ khóa hiện tại, sinh mới và đối chiếu (append) các khái niệm kiến trúc siêu vô hướng.
- Các công nghệ nổi bật được bổ sung: Superscalar, Out-of-Order Execution, Branch Prediction, Cache Coherence, MESI Protocol, TLB, MMU, Interrupt Latency, RISC-V, AVX-512, Pipeline Stall, Hyper-Threading, NUMA, Watchdog Timer, JTAG, SIMD, Cortex-M, FPGA, DMA, ASIC.

## Quá trình Deduplication (Loại bỏ trùng lặp)
Sau khi nạp toàn bộ 60 từ khóa này vào hệ thống, lệnh `node src/scripts/dedup-terms.mjs` đã được thực thi để quét chéo 8 file JSON (bao gồm Khoa học máy tính, Cơ điện tử, Tự động hóa, v.v.).
- Kết quả: **Xóa bỏ 4 từ khóa bị trùng lặp chéo** giữa các danh mục. 
- Tính trạng hiện tại: Bộ dữ liệu đang đạt 100% độ "sạch" (không có bất cứ `term` nào trùng tên nhau trên toàn hệ thống).

## Phases (Định vị Giai đoạn)
- **Phase 6: Data Enrichment**: Hoàn tất việc nạp dữ liệu thủ công. Các danh mục đã có dữ liệu mẫu chất lượng cao.

## Project meta intake (FEAT-009)
*(Đã được thiết lập trong `.viepilot/META.md` từ phiên trước, bỏ qua bước cấu hình Global Profile ở phiên này).*

## Next Actions
- Cập nhật tài liệu báo cáo người dùng.
- Sẵn sàng tiến tới các tính năng của giai đoạn tiếp theo (nếu có).
