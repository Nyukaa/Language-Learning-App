import express from "express";
import { checkAuth } from "../middleware/auth";

const router = express.Router();

router.get("/protected", checkAuth, (req, res) => {
  res.json({ message: "Access granted", user: (req as any).user });
});

export default router;
