import request from "supertest";
import express from "express";

// Mock supabase
jest.mock("../utils/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: "123", title: "Test", content: "Hello", language: "en" },
        error: null,
      }),
    })),
  },
}));

// Mock auth middleware
jest.mock("../middleware/auth", () => ({
  checkAuth: (req: any, _res: any, next: any) => {
    req.user = { id: "user-123" };
    next();
  },
}));

import textsRouter from "../routes/texts";

const app = express();
app.use(express.json());
app.use("/api/texts", textsRouter);

describe("POST /api/texts", () => {
  it("returns 400 if fields are missing", async () => {
    const res = await request(app)
      .post("/api/texts")
      .send({ title: "Only title" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing fields");
  });

  it("creates a text successfully", async () => {
    const res = await request(app)
      .post("/api/texts")
      .send({ title: "Test", content: "Hello world", language: "en" });

    expect(res.status).toBe(200);
    expect(res.body.text).toBeDefined();
  });
});

describe("GET /api/texts", () => {
  it("returns texts for authenticated user", async () => {
    // override mock for array response
    const { supabase } = require("../utils/supabaseClient");
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [{ id: "1", title: "T", content: "C", language: "en" }],
        error: null,
      }),
    });

    const res = await request(app).get("/api/texts");
    expect(res.status).toBe(200);
    expect(res.body.texts).toHaveLength(1);
  });
});
