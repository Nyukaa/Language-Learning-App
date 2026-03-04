import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ReqPayload {
  word: string;
  context: string;
  language: string;
}

console.info("AI Fill Card function started");

Deno.serve(async (req: Request) => {
  try {
    const { word, context, language }: ReqPayload = await req.json();

    const prompt = `
You are a language learning assistant.

Analyze the word "${word}" in this context:
"${context}"

Return ONLY valid JSON in this format:
{
  "lemma": "",
  "translation": "",
  "category": "",
  "example": ""
}

Language: ${language}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Deno.env.get(
        "GEMINI_API_KEY"
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Remove ```json if Gemini adds it
    const cleanText = rawText.replace(/```json|```/g, "").trim();

    return new Response(cleanText, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: "AI processing failed" }), {
      status: 500,
    });
  }
});
