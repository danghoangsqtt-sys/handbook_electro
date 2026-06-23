# Handbook Electro ⚡

TechDict v5.0 (Handbook Electro) là từ điển thuật ngữ kỹ thuật điện tử, tự động hóa, cơ điện tử chuyên sâu dành cho kỹ sư và sinh viên. Ứng dụng cung cấp các định nghĩa ngắn gọn, ứng dụng thực tiễn, video hướng dẫn YouTube và đặc biệt là Phòng Lab AI để hỏi đáp kỹ thuật.

## Tính năng nổi bật

- **3000+ Thuật ngữ chuyên ngành**: Tự động hóa, Cơ điện tử, Khoa học máy tính, Vi xử lý.
- **Trắc nghiệm kiến thức (Quiz)**: Hệ thống ôn tập nhanh với các câu hỏi đa dạng dựa trên dữ liệu từ điển.
- **Phòng Lab AI (AI Lab)**: Tích hợp trợ lý Gemini 2.5 Flash, tư vấn thiết kế mạch, tìm kiếm linh kiện 3D và tra cứu code GitHub. Đăng nhập bằng mã PIN an toàn để lưu session.
- **Đồng bộ tiến độ học tập**: Đánh dấu đã học và lưu bookmark các thuật ngữ quan trọng qua LocalStorage.
- **Chế độ sáng/tối (Dark/Light Mode)**: Responsive cho mọi thiết bị di động.

## Công nghệ sử dụng

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4.
- **AI Integration**: Vercel AI SDK, Google Generative AI (Gemini 2.5 Flash).
- **Backend/API**: Next.js Serverless Functions, tương tác trực tiếp với Supabase và GitHub API.

## Cài đặt & Chạy cục bộ

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường (`.env.local`):**
   Tạo file `.env.local` ở thư mục gốc và thêm API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Chạy server (Development):**
   ```bash
   npm run dev
   ```

4. **Sinh dữ liệu mẫu:**
   ```bash
   npm run seed
   ```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để sử dụng hệ thống.

## Phiên bản
- Hiện tại: `v0.2.1`