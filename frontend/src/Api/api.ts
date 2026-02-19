import { supabase } from "../../supabaseClient";
// Create a new flashcard for the logged-in user
export const createFlashcard = async (
  word: string,
  translation: string,
  sentence: string,
  textId?: string
) => {
  const { data } = await supabase.auth.getSession();

  const token = data.session?.access_token;

  if (!token) {
    throw new Error("No auth session");
  }

  const response = await fetch("http://localhost:4000/api/flashcards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      word,
      translation,
      sentence,
      textId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create flashcard");
  }

  return response.json();
};

// Fetch flashcards for the logged-in user
export const getFlashcards = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const response = await fetch("http://localhost:4000/api/flashcards", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch flashcards");
  }

  return response.json();
};

// Delete a flashcard by ID
export const deleteFlashcard = async (id: string) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const response = await fetch(`http://localhost:4000/api/flashcards/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete flashcard");
  }

  return response.json();
};
// Update a flashcard by ID
export const updateFlashcard = async (
  cardId: string,
  updates: { word?: string; translation?: string; category?: string }
) => {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await fetch(`http://localhost:4000/api/flashcards/${cardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Failed to update flashcard");
  return res.json();
};
// Update flashcard knowledge level
export const updateFlashcardKnowledge = async (
  cardId: string,
  level: 0 | 1 | 2
) => {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await fetch(
    `http://localhost:4000/api/flashcards/${cardId}/knowledge`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ level }),
    }
  );

  if (!res.ok) throw new Error("Failed to update knowledge");
  return res.json();
};
//how it send to backend
export const addContextToFlashcard = async (
  cardId: string,
  sentence: string,
  textId?: string
) => {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await fetch(
    `http://localhost:4000/api/flashcards/${cardId}/contexts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sentence, textId }),
    }
  );

  if (!res.ok) throw new Error("Failed to add context");
  return res.json();
};
