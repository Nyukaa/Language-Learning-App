import axios from "axios";
import { supabase } from "../../supabaseClient";

// Create a new context for a flashcard
export const createContext = async (
  flashcardId: string,
  sentence: string,
  textId?: string
) => {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.post(
    `/api/flashcards/${flashcardId}/contexts`,
    { flashcard_id: flashcardId, sentence, textId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

// Update an existing context
export const updateContext = async (
  flashcardId: string,
  id: string,
  sentence: string
) => {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.patch(
    `/api/flashcards/${flashcardId}/contexts/${id}`,
    { sentence },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

// Delete a context by ID
export const deleteContext = async (flashcardId: string, id: string) => {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.delete(`/api/flashcards/${flashcardId}/contexts`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
