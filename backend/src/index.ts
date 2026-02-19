import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import flashcardRoutes from "./routes/flashcards";
import textsRouter from "./routes/texts";
import contextsRouter from "./routes/contexts";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/texts", textsRouter);
app.use("/api/contexts", contextsRouter);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
