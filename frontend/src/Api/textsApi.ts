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
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await fetch("http://localhost:4000/api/texts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch texts");
  return res.json();
};

// Create a new text
export const createText = async (
  title: string,
  content: string,
  language: string
) => {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await fetch("http://localhost:4000/api/texts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, language }),
  });

  if (!res.ok) throw new Error("Failed to create text");
  return res.json();
};

// Update a text by ID
export const updateText = async (id: string, updates: Partial<TextEntry>) => {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await fetch(`http://localhost:4000/api/texts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Failed to update text");
  return res.json();
};

// Delete a text by ID
export const deleteText = async (id: string) => {
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await fetch(`http://localhost:4000/api/texts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to delete text");
  return res.json();
};
