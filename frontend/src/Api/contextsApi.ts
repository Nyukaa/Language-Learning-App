export const createContext = async (flashcardId: string, sentence: string) => {
  const res = await fetch("/api/contexts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flashcard_id: flashcardId, sentence }),
  });

  if (!res.ok) throw new Error("Failed to create context");
  return res.json();
};

export const updateContext = async (id: string, sentence: string) => {
  const res = await fetch(`/api/contexts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence }),
  });

  if (!res.ok) throw new Error("Failed to update context");
  return res.json();
};

export const deleteContext = async (id: string) => {
  const res = await fetch(`/api/contexts/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete context");
};
