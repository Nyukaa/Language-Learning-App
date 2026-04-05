import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import flashcardRoutes from "./routes/flashcards";
import textsRouter from "./routes/texts";
import contextsRouter from "./routes/contexts";
import voiceRouter from "./routes/voice";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/texts", textsRouter);
app.use("/api/contexts", contextsRouter);
app.use("/api/voice", voiceRouter);
const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../../frontend/build");
  app.use(express.static(distPath));
  app.use((_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
