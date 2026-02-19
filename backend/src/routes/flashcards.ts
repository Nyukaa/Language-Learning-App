import express from "express";
import { supabase } from "../utils/supabaseClient";
import { checkAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", checkAuth, async (req, res) => {
  const user = (req as any).user;

  const { data, error } = await supabase
    .from("flashcards")
    .select(
      `
      *,
      contexts (*),
      learning_progress (*)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ flashcards: data });
});
router.post("/", checkAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { word, translation, sentence, textId } = req.body;

    if (!word || !sentence) {
      return res.status(400).json({ error: "Word and sentence required" });
    }

    // Create flashcard
    const { data: flashcard, error: flashcardError } = await supabase
      .from("flashcards")
      .insert({
        user_id: user.id,
        word,
        lemma: word,
        translation,
        category: "",
      })
      .select()
      .single();

    if (flashcardError) throw flashcardError;

    // Create context
    const { error: contextError } = await supabase.from("contexts").insert({
      flashcard_id: flashcard.id,
      text_id: textId || null,
      sentence,
    });

    if (contextError) throw contextError;

    // Create learning progress
    const { error: progressError } = await supabase
      .from("learning_progress")
      .insert({
        flashcard_id: flashcard.id,
        user_id: user.id,
        level: 0,
        repetitions: 0,
        next_review: new Date(), // Set next review to now for new flashcards
      });

    if (progressError) throw progressError;

    res.status(201).json({
      message: "Flashcard created successfully",
      flashcard,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:id", checkAuth, async (req, res) => {
  const user = (req as any).user;
  const { id } = req.params;

  const { error } = await supabase
    .from("flashcards")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); //defend against deleting others' flashcards

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Flashcard deleted successfully" });
});
//update flashcard
router.patch("/:id", checkAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const flashcardId = req.params.id;
    const { word, lemma, translation, category } = req.body;

    const updates: any = {};

    if (word !== undefined) updates.word = word;
    if (lemma !== undefined) updates.lemma = lemma;
    if (translation !== undefined) updates.translation = translation;
    if (category !== undefined) updates.category = category;

    // update only provided fields

    const { data: flashcard, error } = await supabase
      .from("flashcards")
      .update(updates)
      .eq("id", flashcardId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Flashcard updated", flashcard });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
// update knowledge level
router.post("/:id/knowledge", checkAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const flashcardId = req.params.id;
    const { level } = req.body; // 0 | 1 | 2

    if (level === undefined || ![0, 1, 2].includes(level)) {
      return res.status(400).json({ error: "Invalid level" });
    }

    // get existing progress
    const { data: existing, error: existingError } = await supabase
      .from("learning_progress")
      .select()
      .eq("flashcard_id", flashcardId)
      .eq("user_id", user.id)
      .single();

    if (existingError && existingError.code !== "PGRST116") throw existingError; // PGRST116 = not found

    if (existing) {
      // update progress
      const { data, error } = await supabase
        .from("learning_progress")
        .update({
          level,
          repetitions: existing.repetitions + 1,
          last_reviewed: new Date(),
          next_review: new Date(Date.now() + 24 * 60 * 60 * 1000), // следующий день, можно менять алгоритм
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      res.json({ message: "Knowledge updated", progress: data });
    } else {
      // create new record
      const { data, error } = await supabase
        .from("learning_progress")
        .insert({
          flashcard_id: flashcardId,
          user_id: user.id,
          level,
          repetitions: 1,
          last_reviewed: new Date(),
          next_review: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .select()
        .single();

      if (error) throw error;
      res.json({ message: "Knowledge created", progress: data });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/flashcards/:id/contexts
router.post("/:id/contexts", checkAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const flashcardId = req.params.id;
    const { sentence, textId } = req.body;

    if (!sentence) {
      return res.status(400).json({ error: "Sentence required" });
    }

    // check flashcard belongs to user
    const { data: flashcard, error: fcError } = await supabase
      .from("flashcards")
      .select()
      .eq("id", flashcardId)
      .eq("user_id", user.id)
      .single();

    if (fcError || !flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    const { data, error } = await supabase
      .from("contexts")
      .insert({
        flashcard_id: flashcardId,
        text_id: textId || null,
        sentence,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Context added", context: data });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
export default router;
