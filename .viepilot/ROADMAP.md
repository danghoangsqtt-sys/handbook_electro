# Project Roadmap

## Phase 1: Foundation & Mobile-First UI (Tái cấu trúc root.html)
- [x] Khởi tạo dự án Next.js, thiết lập Tailwind CSS.
- [x] Chuyển đổi giao diện `root.html` sang dạng Component (Mobile-First).
- [x] Cấu hình kết nối Supabase, thiết kế schema (`terms`, `modules`, `users_pin`, `chat_sessions`).

## Phase 2: Database AI Generation & Core Lookup
- [x] Viết NodeJS Script dùng Gemini API để sinh tự động thuật ngữ/module.
- [x] Chạy script nạp dữ liệu (seed) vào Supabase.
- [x] Xây dựng tính năng Tìm kiếm (Search), Lọc (Filter), Chi tiết (Detail).

## Phase 3: PIN Code Auth & "Phòng Lab AI"
- [x] Xây dựng logic đăng nhập bằng Mã PIN (Supabase).
- [x] Xây dựng giao diện Phòng Lab AI (Chat UI, Markdown, Code block).
- [x] Tích hợp API Gemini vào Next.js backend với System Prompt kỹ thuật.

## Phase 4: Polish, Testing & Deployment
- [x] Kiểm thử Mobile Responsive & UX.
- [x] Deploy lên Vercel.
- [x] Hoàn thiện tài liệu README.

## Phase 5: Domain Expansion
- [x] Viết công cụ Batch Seeding (seed-terms.mjs) sinh dữ liệu qua Gemini API.
- [x] Cập nhật giao diện (TermsList, QuizSystem, IntroStats).
- [x] Mở rộng System Prompt cho AI Lab.

### Phase 6: Data Enrichment & Full Categories
- [x] Tạo file sinh dữ liệu riêng cho từng danh mục
- [x] Triển khai global `excludeList` để chặn AI sinh từ trùng lặp
- [x] Mở rộng danh mục: IoT, Vi xử lý, Vô tuyến & Viễn thông

### Phase 7: Automation Data Expansion
- [x] Nạp 100 từ khóa chuyên ngành tự động hóa cấp cao (SCADA, Robotics, Control Systems, Industry 4.0)
- [x] Thiết lập dữ liệu tĩnh độc nhất cho mục tự động hóa

### Phase 8: Digital Electronics Data Expansion
- [x] Nạp 100 từ khóa Kỹ thuật Số hiện đại (Đại số Boole, Mạch Logic, FPGA, IC Design, Memory)
- [x] Củng cố dữ liệu chuyên sâu cho mục Điện tử số

### Phase 9: Microprocessor Data Expansion
- [x] Nạp 100 từ khóa Kiến trúc máy tính & Vi điều khiển (Cấu trúc CPU, Cache, Pipeline, Assembly, RTOS)
- [x] Thiết lập dữ liệu tĩnh cao cấp cho mục Vi xử lý
- [x] Chạy tiến trình seeding toàn diện để làm giàu ngân hàng từ khóa.

### Phase 10: Telecommunications Data Expansion
- [x] Nạp 100 từ khóa Vô tuyến & Viễn thông (Anten, Băng thông, 5G, Truyền dẫn, RFID)

### Phase 11: IoT Data Expansion
- [x] Bổ sung 100 từ khóa chuyên ngành IoT (Cloud, Protocols, WSN, Hardware, Security)
- [x] Sử dụng script tự động để chèn trực tiếp không qua API Key.

### Phase 12: Computer Science Data Expansion
- [x] Bổ sung 100 từ khóa chuyên ngành Khoa học máy tính (Data Structures, Algorithms, OS, Networking, AI).
- [x] Thực thi tự động bằng kịch bản AI trực tiếp.

### Phase 13: Mechatronics Data Expansion
- [x] Bổ sung 100 từ khóa chuyên ngành Cơ điện tử (Robotics, Control, Actuators, Integration).
- [x] Thực thi tự động bằng kịch bản AI trực tiếp.

### Phase 14: AI Lab Refactoring
- [x] Nâng cấp độ ổn định cho tính năng AI Lab (Rate limit Github).
- [x] Cải thiện UX Frontend (Lưu lịch sử chat vào localStorage).

### Phase 15: AI Lab UI/UX Premium & Responsive
- [x] Nâng cấp giao diện AILab (Glassmorphism, Animations, Premium UI).
- [x] Hỗ trợ Responsive đa thiết bị (Máy tính, Điện thoại - loại bỏ chiều cao cố định).
- [x] Tích hợp Syntax Highlighting cho Code blocks trong Chat.
- [x] Auto-test và kiểm tra bugs tự động.

### Phase 16: AI Lab Advanced Features
- [x] Tích hợp nút "Copy Code" cho các đoạn code snippets.
- [x] Định dạng hiển thị Table và Typography chuẩn Markdown.
- [x] Auto-test và đẩy lên Github.

### Phase 17: Project Branding & Favicon
- [x] Auto-gen Logo/Favicon cho website bằng mô hình AI.
- [x] Tích hợp icon vào Next.js App Router metadata.
- [x] Cập nhật giao diện thanh điều hướng để hiển thị Logo nếu cần.

### Phase 18: Search Optimization & Caching
- [x] Xây dựng tiện ích `removeAccents` để hỗ trợ tìm kiếm không dấu Tiếng Việt.
- [x] Cập nhật API tìm kiếm để quét dữ liệu mảng `applications`.
- [x] Triển khai cơ chế Memory Cache cho danh sách thuật ngữ, thay thế thao tác đọc file I/O đồng bộ.

### Phase 19: Extended Lookups (Google, Datasheet, Applications)
- [x] Bổ sung các nút bấm vào giao diện `TermDetail.tsx`.
- [x] Gắn link cấu trúc động tìm kiếm Google, PDF Datasheet, Youtube.
- [x] Đảm bảo giao diện Responsive và có icons minh hoạ trực quan.
