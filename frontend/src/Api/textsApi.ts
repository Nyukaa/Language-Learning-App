import axios from "axios";
import { supabase } from "../../supabaseClient";

export interface TextEntry {
  id: string;
  title: string;
  content: string;
  language: string;
  createdAt: Date;
}

// Fetch all texts for the current user
export const getTexts = async (): Promise<{ texts: TextEntry[] }> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.get("/api/texts", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// Create a new text
export const createText = async (
  title: string,
  content: string,
  language: string
) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.post(
    "/api/texts",
    { title, content, language },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

// Update a text by ID
export const updateText = async (id: string, updates: Partial<TextEntry>) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.put(`/api/texts/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// Delete a text by ID
export const deleteText = async (id: string) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.delete(`/api/texts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
