# 📘 Language Learning App — Smart Anki

A lightweight app for learning vocabulary from real texts.  
Select a word → add a flashcard with context → track learning progress.

Built with **React + Vite** and **Supabase**, focused on fast UX and clean state management.

---

## ✨ Key Features

- Select words directly in text
- One-click flashcard creation with context
- Highlight known words in reading mode
- 3-level knowledge rating
- Visual progress (charts & colors)
- Edit & manage cards and contexts
- Google OAuth for user authentication
- Backend sync with Supabase (Postgres)

---

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, TypeScript
- **Backend**: Express, Supabase (Postgres), TypeScript
- **Other**: Recharts, lucide-react, Axios

---

## 🧠 Architecture Overview

### Frontend

- **App.tsx**: Manages global state, user session, and API calls
- **TextReader**: Word selection, context extraction, and vocabulary highlighting
- **Dictionary / Cards**: Flashcard management and inline editing
- **Progress**: Learning statistics and spaced repetition tracking

### Backend

- **Stack**: Express + Supabase (Postgres)
- **Auth**: Google OAuth via Supabase; backend validates JWT with middleware (`checkAuth`)
- **Routes**:
  - `GET /api/protected` — validate token
  - `GET/POST/PUT/DELETE /api/texts` — manage user texts
  - `GET/POST/DELETE/PATCH /api/flashcards` — manage flashcards
  - `POST /api/flashcards/:id/knowledge` — update learning level
  - `POST /api/flashcards/:id/contexts` — add context to flashcard
- **Data Model**:
  - `texts`:
    - `id` (UUID, primary key)
    - `user_id` (UUID, references `auth.users`)
    - `title` (text, not null)
    - `content` (text, not null)
    - `language` (text, default 'en')
    - `created_at` (timestamp, default now)
  - `flashcards`:
    - `id` (UUID, primary key)
    - `user_id` (UUID, references `auth.users`)
    - `word` (text, not null)
    - `translation` (text)
    - `notes` (text)
    - `lemma` (text, default '')
    - `category` (text)
    - `language` (text, default 'en')
    - `created_at` (timestamp, default now)
  - `contexts`:
    - `id` (UUID, primary key)
    - `flashcard_id` (UUID, references `flashcards`)
    - `text_id` (UUID, references `texts`, nullable)
    - `sentence` (text, not null)
    - `created_at` (timestamp, default now)
  - `learning_progress`:
    - `id` (UUID, primary key)
    - `flashcard_id` (UUID, references `flashcards`)
    - `user_id` (UUID, references `auth.users`)
    - `level` (int, default 0) — 0 = new, 1 = learning, 2 = known
    - `repetitions` (int, default 0)
    - `last_reviewed` (timestamp)
    - `next_review` (timestamp)
    - `created_at` (timestamp, default now)

---

## 📚 What This Project Demonstrates

- Seamless integration of frontend and backend
- Strong UX focus with dynamic forms and inline editing
- Google OAuth for secure authentication
- Scalable architecture with Supabase for data persistence
- Clean and modular React component structure

---

## 🚀 Future Enhancements

- Full i18n support (UI translation)
- Advanced spaced repetition algorithm
- Accessibility improvements
- Mobile-first design optimizations
- Enhanced analytics and progress tracking
