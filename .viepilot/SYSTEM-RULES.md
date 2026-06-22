# System Rules

## Architecture Rules
- Use Next.js App Router for all routing.
- Keep components modular and strictly typed.
- API keys (especially Gemini API Key) must ONLY be accessed Server-Side (inside Next.js Route Handlers). NEVER expose them to the browser.
- **Strict Frontend/Backend Separation:** 
  - Do NOT place any API logic, database mutations, or AI calling directly inside UI components (`src/components`, `src/app`).
  - ALL business logic, API requests, and third-party integrations MUST reside in the Backend layer (`src/app/api`, `src/services`, `src/scripts`).

## Coding Rules
- Language: TypeScript (Strict mode enabled).
- Styling: Tailwind CSS utility classes directly in `className`.
- Responsive Design: Always adopt a Mobile-First approach. Test layouts using `sm:`, `md:`, `lg:` prefixes.
- Error Handling: Catch all API errors and provide a graceful fallback UI to the user.

## Code Quality Standards
- Adhere to Clean Code principles: descriptive variable names, short functions.
- Run ESLint and Prettier before committing code.
- Follow Conventional Commits for Git (`feat:`, `fix:`, `docs:`, etc.).

## Security Rules
- PIN codes should be hashed (e.g., using bcrypt) before being stored in Supabase. Do not store PINs in plain text.
- Configure Supabase Row Level Security (RLS) so that a user session can only access its own chat history and bookmarks based on their hashed PIN.
