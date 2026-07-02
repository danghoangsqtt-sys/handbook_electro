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

### Phase 20: Core Vocabulary Enrichment
- [x] Soạn thảo danh sách 350 từ khoá cơ bản cho 7 chuyên mục.
- [x] Viết kịch bản tự động gộp (append) dữ liệu vào file JSON.
- [x] Triển khai nạp dữ liệu.

### Phase 21: AI Lab Chat History & Supabase Integration (v0.16.0)

**Goal:** Chuyển đổi dữ liệu chat AI từ `localStorage` sang `Supabase` để lưu trữ đồng bộ lịch sử, hỗ trợ quản lý danh sách và ghim hội thoại, cũng như xử lý tính năng đính kèm và lưu trữ hình ảnh.

- [x] **Thiết lập Supabase & Database Schema:**
  - Khởi tạo kết nối Supabase Client (`src/lib/supabase.ts`).
  - Tạo bảng `chat_sessions` (ID, User_PIN, tiêu đề, trạng thái ghim, thời gian cập nhật).
  - Tạo bảng `chat_messages` (ID, Session ID, Role, Nội dung, Danh sách ảnh đính kèm).
  - Cấu hình Storage Bucket (`chat_attachments`) để lưu trữ file ảnh upload từ User.
- [x] **Xây dựng Backend API (Next.js):**
  - CRUD API cho `chat_sessions` (tạo mới, sửa tên, ghim, xóa dựa trên User PIN auth cookie).
  - Cập nhật `/api/chat/route.ts` để upload hình ảnh và ghi lại message của user/assistant vào database.
  - API `GET /api/chat-messages` trả về lịch sử phiên chat chi tiết để render giao diện.
- [x] **Nâng cấp Giao diện (AI Lab Frontend):**
  - Tạo Component `<AILabSidebar />` chứa danh sách cuộc trò chuyện phân nhóm "Đã ghim" và "Gần đây".
  - Refactor `<AILab />` (xóa cơ chế `localStorage`, đồng bộ `sessionId` cho `useChat` và hiển thị ảnh Markdown đính kèm).
  - Hỗ trợ responsive layout (ấn menu trên thiết bị di động).

### Phase 22: Thư viện Linh kiện & Quản lý BOM (Bill of Materials) (v0.17.0)

**Goal:** Sao chép các tính năng trực quan từ EleSelect, cung cấp kho linh kiện có ảnh và datasheet, đồng thời cho phép người dùng thêm vào giỏ BOM.

- [x] Thiết kế bảng `components` trên Supabase (chứa specs, datasheet_url, image_url).
- [x] Xây dựng giao diện Grid Card hiển thị danh sách linh kiện.
- [x] Xây dựng tính năng "Thêm vào BOM" (Lưu giỏ hàng bằng Zustand hoặc LocalStorage).
- [x] Thiết kế giao diện Drawer/Sidebar để quản lý BOM.

### Phase 23: AI Project Studio (v0.18.0)

**Goal:** Nâng cấp AI Lab thành AI Project Studio, tích hợp Mermaid.js để vẽ sơ đồ đấu nối và đánh giá tính tương thích của linh kiện dựa trên BOM.

- [x] Tích hợp tính năng truyền danh sách BOM vào prompt AI.
- [x] Xây dựng System Prompt chuyên sâu tư vấn linh kiện và sinh sơ đồ cắm chân.
- [x] Xây dựng giao diện AI Project Studio (3 Tab: Tổng quan tương thích, Sơ đồ cắm chân (Wiring Diagram), Code mẫu).
- [x] Tích hợp bộ render Mermaid.js an toàn trong Markdown của AI Lab.

### Phase 24: Component Filtering & Seeding (v0.19.0)

**Goal:** Hoàn thiện trải nghiệm Thư viện linh kiện, cho phép tìm kiếm và lọc nâng cao, cũng như tự động hóa dữ liệu.

- [x] Bổ sung logic lọc đa điều kiện (Theo danh mục, Theo giao tiếp I2C/SPI, Theo từ khóa tìm kiếm).
- [x] Tạo kịch bản Node.js tự động nạp dữ liệu linh kiện (Seed script `seed-components.mjs`).
- [x] Xử lý trạng thái Empty UI khi không tìm thấy kết quả.

### Phase 25: Admin Dashboard & Quản trị Dữ liệu (v0.20.0)

**Goal:** Cung cấp công cụ quản trị mạnh mẽ để tự chủ thêm mới linh kiện, thuật ngữ và kiếm tiền.

- [x] Nâng cấp Database Schema bổ sung `shopee_link`, `is_active`.
- [x] Xây dựng trang đăng nhập Admin bằng Supabase Auth.
- [x] Thiết kế layout độc lập và trang Dashboard thống kê cho `/admin`.
- [x] Phát triển form CRUD quản lý linh kiện, tích hợp convert ảnh Google Drive.
- [x] Cập nhật UI thư viện bổ sung tính năng Mua trên Shopee và Tải Datasheet.

### Phase 26: Hoàn thiện Admin CMS & Cấu trúc lại Dữ liệu Thuật ngữ (v0.21.0)

**Goal:** Quản lý tập trung toàn bộ hệ thống "Thuật ngữ" (Terms) trên Supabase để thay thế cho file JSON cục bộ.

- [x] Tạo bảng `terms` trên Supabase với cấu trúc đầy đủ.
- [x] Phát triển giao diện `admin/terms` hỗ trợ CRUD thuật ngữ.
- [x] Viết công cụ Import JSON (đẩy toàn bộ JSON cũ lên Supabase).
- [x] Cập nhật API lấy thuật ngữ sang kết nối với Supabase, tích hợp In-memory Caching để đảm bảo tốc độ.

### Phase 27: User Accounts, AI Image Analysis & Flashcard Quiz (v0.22.0)

**Goal:** Chuyển đổi mã PIN sang hệ thống tài khoản thực (Email/OAuth), hỗ trợ tải ảnh sơ đồ mạch cho AI phân tích, và thay thế Quiz trắc nghiệm bằng dạng Flashcard.

- [x] Thiết lập Supabase Auth và tạo giao diện Đăng nhập/Đăng ký.
- [x] Migrate dữ liệu (chat_sessions, bookmarks) sang Auth UUID mới thay vì chuỗi PIN.
- [x] Bổ sung nút Upload ảnh vào giao diện Chat AI Lab và kết nối Gemini Vision API.
- [x] Gỡ bỏ các component Quiz cũ.
- [x] Xây dựng tính năng học thuật ngữ qua thẻ lật Flashcard (ngẫu nhiên 5 từ).

### Phase 28: User Profile, Community Showcase, OAuth, Export PDF/BOM, PDF Analysis (v0.23.0)

**Goal:** Xây dựng hồ sơ người dùng, cộng đồng chia sẻ dự án, đăng nhập mạng xã hội, xuất báo cáo và hỗ trợ upload PDF cho AI.

- [x] Tích hợp OAuth Google/GitHub.
- [x] Tạo SQL script cho Profiles và Public Projects.
- [x] Phát triển User Profile.
- [x] Phát triển Community Showcase.
- [x] Thêm tính năng Export PDF và Export CSV.
- [x] Cập nhật AILab hỗ trợ file PDF.
