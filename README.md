# 📘 Language Learning App — Smart Anki

A lightweight single-page app for learning vocabulary from real texts.  
Select a word → add a flashcard with context → track learning progress.

Built with **React + Vite**, focused on fast UX and clean state management.

---

## ✨ Key Features

- Select words directly in text
- One-click flashcard creation with context
- Highlight known words in reading mode
- 3-level knowledge rating
- Visual progress (charts & colors)
- Edit & manage cards and contexts
- Local-first (no backend required)

---

## 🛠 Tech Stack

- ⚛️ React + Vite
- 🎨 Tailwind CSS
- 📊 Recharts
- 🧩 lucide-react
- 🟦 TypeScript (partial)

---

## 🧠 Architecture (High Level)

- **App.tsx** — global state & `localStorage` sync
- **TextReader** — word selection & add popup
- **Dictionary / Cards** — flashcard management
- **Progress** — learning statistics & charts

Client-side data migration for backward compatibility.

---

## 📚 What This Project Shows

- Strong UX focus & learning-flow design
- Complex state handling in React
- Inline editing & dynamic forms
- Text selection & popup positioning
- Data persistence without backend
- Clean, scalable component structure

---

## 🚀 Possible Next Steps

- i18n (full UI translation)
- Backend sync / auth
- Spaced repetition algorithm
- Accessibility improvements
- Mobile UX polish

---

## 🔧 Backend (short overview)

- Stack: Express + TypeScript + Supabase (Postgres)
- Auth: Google OAuth via Supabase; backend validates JWT with middleware (`checkAuth`)
- Routes:
  - `GET /api/protected` — check token
  - `GET/POST/PUT/DELETE /api/texts` — user texts (title/content/language)
  - `GET/POST/DELETE/PATCH /api/flashcards` — create/update/delete cards
  - `POST /api/flashcards/:id/knowledge` — update learning level
  - `POST /api/flashcards/:id/contexts` — add context to card
- Data model (Supabase tables):
  - `flashcards` (user_id, word, translation, created_at)
  - `contexts` (flashcard_id, text_id, sentence)
  - `learning_progress` (flashcard_id, user_id, level, repetitions, last_reviewed, next_review)
  - `texts` (user_id, title, content, language, created_at)
- Env:
  - Frontend: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Notes:
  - Backend enforces user ownership on mutations
  - Frontend sends `Authorization: Bearer <token>` from Supabase session
  - Service role key used server-side for DB operations
