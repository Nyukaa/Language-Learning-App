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
