import express from "express";
import { supabase } from "../utils/supabaseClient";
import { checkAuth } from "../middleware/auth";

const router = express.Router();
// post contexts for a flashcard in flashcard.ts // POST /api/flashcards/:id/contexts
//router.post("/", checkAuth, async (req, res) => {

router.patch("/:id", checkAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { sentence } = req.body;
    const { id } = req.params;

    //find context
    const { data: context, error: contextError } = await supabase
      .from("contexts")
      .select("*")
      .eq("id", id)
      .single();

    if (contextError || !context) {
      return res.status(404).json({ error: "Context not found" });
    }

    // check if context belongs to user's flashcard
    const { data: flashcard, error: flashcardError } = await supabase
      .from("flashcards")
      .select("id")
      .eq("id", context.flashcard_id)
      .eq("user_id", user.id)
      .single();

    if (flashcardError || !flashcard) {
      return res.status(403).json({ error: "Not allowed" });
    }

    // update context
    const { data, error } = await supabase
      .from("contexts")
      .update({ sentence })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    console.error("Update context error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    // find context
    const { data: context, error: contextError } = await supabase
      .from("contexts")
      .select("*")
      .eq("id", id)
      .single();

    if (contextError || !context) {
      return res.status(404).json({ error: "Context not found" });
    }

    // check if context belongs to user's flashcard
    const { data: flashcard, error: flashcardError } = await supabase
      .from("flashcards")
      .select("id")
      .eq("id", context.flashcard_id)
      .eq("user_id", user.id)
      .single();

    if (flashcardError || !flashcard) {
      return res.status(403).json({ error: "Not allowed" });
    }

    // delete context
    const { error: deleteError } = await supabase
      .from("contexts")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    res.json({ message: "Context deleted" });
  } catch (err: any) {
    console.error("Delete context error:", err);
    res.status(500).json({ error: err.message });
  }
});
export default router;
