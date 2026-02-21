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
  - `flashcards` (user_id, word, translation, created_at)
  - `contexts` (flashcard_id, text_id, sentence)
  - `learning_progress` (flashcard_id, user_id, level, repetitions, next_review)
  - `texts` (user_id, title, content, language, created_at)

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
