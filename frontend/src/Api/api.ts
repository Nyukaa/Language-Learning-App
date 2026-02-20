import axios from "axios";
import { supabase } from "../../supabaseClient";

// Create a new flashcard for the logged-in user
export const createFlashcard = async (
  word: string,
  lemma?: string,
  translation?: string,
  sentence?: string,
  textId?: string
) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.post(
    "/api/flashcards",
    { word, translation, sentence, textId, lemma },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

// Fetch flashcards for the logged-in user
export const getFlashcards = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.get("/api/flashcards", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// Delete a flashcard by ID
export const deleteFlashcard = async (id: string) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.delete(`/api/flashcards/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// Update a flashcard by ID
export const updateFlashcard = async (
  cardId: string,
  updates: {
    word?: string;
    lemma?: string;
    translation?: string;
    category?: string;
  }
) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No auth session");

  console.log("PATCH payload:", updates);

  // если updates пустой — не отправляем
  if (Object.keys(updates).length === 0) {
    throw new Error("No fields to update");
  }

  const res = await axios.patch(`/api/flashcards/${cardId}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// Update flashcard knowledge level
export const updateFlashcardKnowledge = async (
  cardId: string,
  level: 0 | 1 | 2
) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.post(
    `/api/flashcards/${cardId}/knowledge`,
    { level },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

//Add a context to a flashcard
export const addContextToFlashcard = async (
  cardId: string,
  sentence: string,

  textId?: string
) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.post(
    `/api/flashcards/${cardId}/contexts`,
    { sentence, textId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
