import express from "express";
import { supabase } from "../utils/supabaseClient";
import { checkAuth } from "../middleware/auth";

const router = express.Router();

// get
router.get("/", checkAuth, async (req, res) => {
  try {
    const user = (req as any).user;

    const { data, error } = await supabase
      .from("texts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ texts: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch texts" });
  }
});

// create new text
router.post("/", checkAuth, async (req, res) => {
  try {
    const { title, content, language } = req.body;
    const user = (req as any).user;

    if (!title || !content || !language) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data, error } = await supabase
      .from("texts")
      .insert([
        {
          user_id: user.id,
          title,
          content,
          language,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({ text: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create text" });
  }
});

// update text by id
router.put("/:id", checkAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = (req as any).user;

    const { data, error } = await supabase
      .from("texts")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ text: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update text" });
  }
});

// delete text by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const { data, error } = await supabase
      .from("texts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete text" });
  }
});

export default router;
