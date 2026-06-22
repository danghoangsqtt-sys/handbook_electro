# System Architecture

## System Overview
The application is a full-stack web application designed to serve as a digital dictionary and AI lab for engineers. It leverages a modern Next.js frontend, a Supabase backend for persistent storage and authentication (via a simplified PIN code system), and Google Gemini API for the core AI mentoring experience.

### Cấu trúc Backend & Frontend (Separation of Concerns)
Dù sử dụng Next.js, kiến trúc dự án phân tách rạch ròi hai phần để dễ bảo trì và nâng cấp:
- **Frontend (Client-side):** Các thư mục `src/components`, `src/app/(routes)`, `src/hooks`. Chỉ chịu trách nhiệm giao diện (UI) và state (React).
- **Backend (Server-side):** Các thư mục `src/app/api`, `src/services`, `src/scripts`. Xử lý logic nghiệp vụ, tích hợp an toàn Gemini API, quản lý admin Supabase và chạy dữ liệu mồi (Database Seeding).

## Diagram Applicability Matrix

| Diagram Type | Status | Rationale |
|---|---|---|
| system-overview | optional | Standard Next.js + Supabase BaaS pattern. |
| data-flow | optional | Simple CRUD for terms + chat request forwarding. |
| event-flows | N/A | No complex asynchronous event broker used. |
| module-dependencies | optional | Standard React component tree. |
| deployment | optional | Standard Vercel deployment pipeline. |
| user-use-case | required | Important to visualize the PIN auth and AI Lab flow. |

## User Use Case Diagram

```mermaid
flowchart TD
    User([Kỹ sư / Sinh viên])
    
    User --> |Tra cứu không cần đăng nhập| Search[Tìm kiếm Thuật ngữ & Module]
    Search --> |Xem chi tiết| Detail[Trang Thông tin chi tiết]
    
    User --> |Tạo session riêng tư| Auth[Đăng nhập bằng PIN Code]
    Auth --> |Thành công| AILab[Không gian: Phòng Lab AI]
    
    AILab --> |Hỏi đáp dự án| Gemini[Hệ thống Gemini AI (Backend API)]
    Gemini --> |Gợi ý linh kiện, code, hướng dẫn| AILab
    
    Detail --> |Lưu trữ| Bookmark[Bookmark vào tài khoản cá nhân]
    Auth --> |Thành công| Bookmark
```

## Data Flow
- **Frontend (Browser):** Requests public data (terms, modules) directly from Supabase via the Supabase JS Client for optimal speed.
- **AI Chat Requests:** Sent from the client to a Next.js Serverless Route. The route securely holds the Gemini API Key, constructs the payload with a rigorous system prompt, calls Google AI Studio, and returns the response to the frontend.

## Technology Decisions
- **Next.js (App Router):** Chosen for its Server-Side Rendering capabilities, excellent SEO (vital for a dictionary), and seamless Vercel deployment.
- **Tailwind CSS:** For rapid mobile-first UI development, allowing easy translation from the user's `root.html` prototype.
- **Supabase:** Provides an instant PostgreSQL database with row-level security and JSON storage, perfect for storing varied module specs and chat histories.
- **Gemini API:** Selected for its advanced reasoning capabilities to act as an engineering mentor.
