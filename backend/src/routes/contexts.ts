import express from "express";
import { supabase } from "../utils/supabaseClient";
import { checkAuth } from "../middleware/auth";

const router = express.Router();

router.post("/", checkAuth, async (req, res) => {
  try {
    const { flashcard_id, sentence } = req.body;

    if (!flashcard_id || !sentence) {
      return res.status(400).json({ error: "Missing data" });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(
      req.headers.authorization?.replace("Bearer ", "")
    );

    const { data, error } = await supabase
      .from("contexts")
      .insert({
        flashcard_id,
        sentence,
        user_id: user?.id,
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Create context error:", err);
    res.status(500).json({ error: "Failed to create context" });
  }
});
router.patch("/:id", checkAuth, async (req, res) => {
  try {
    const { sentence } = req.body;
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contexts")
      .update({ sentence })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Update context error:", err);
    res.status(500).json({ error: "Failed to update context" });
  }
});
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("contexts").delete().eq("id", id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error("Delete context error:", err);
    res.status(500).json({ error: "Failed to delete context" });
  }
});

export default router;
