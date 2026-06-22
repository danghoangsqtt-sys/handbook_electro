# Project Context

## Domain Knowledge
- The application handles highly specialized technical terminology across: Mechatronics, Automation, Computer Science, Microprocessors, Digital Electronics, IoT, Web, Data Analysis, Cybersecurity, and Cryptography.
- Academic and scientific accuracy is paramount.
- Users are primarily engineers, IT professionals, and technical students.

## Business Rules
- **No Standard Registration:** To minimize friction, the app does not use email/password or OAuth. Authentication relies entirely on a user-defined 4-6 digit **PIN code** which is used to retrieve their session (bookmarks and chat history).
- **AI Role:** The AI must strictly act as an engineering mentor. It should evaluate project feasibility, provide cost estimates, and suggest specific electronic modules and GitHub repositories.

## Product Vision

<product_vision>
To build a comprehensive, AI-empowered pocket handbook that not only provides deep technical definitions but actively assists engineers in realizing their ideas from prototype to production.
</product_vision>

### Anti-goals
- **General-Purpose Chatbot:** Do not allow the AI to function as a generic chatbot. The system prompt must heavily steer the context towards engineering and technical problem-solving.
- **E-commerce Platform:** Do not build a complex shopping cart or e-commerce site for electronic modules. The goal is only to provide information, datasheets, and specifications.
