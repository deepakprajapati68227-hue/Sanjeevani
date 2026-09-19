import { NextRequest, NextResponse } from "next/server";
import { getGroqApiKey } from "@/lib/ai-config";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  mr: "Marathi (मराठी)",
  te: "Telugu (తెలుగు)",
  ta: "Tamil (தமிழ்)",
  bn: "Bengali (বাংলা)",
  gu: "Gujarati (ગુજરાતી)",
  kn: "Kannada (ಕನ್ನಡ)",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, targetLanguage = "hi", context = "disaster_alert" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const langName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

    // If already in target language (e.g. asking for English when source is English)
    if (targetLanguage === "en" && /^[A-Za-z0-9\s.,!?:;'"()-]+$/.test(text)) {
      return NextResponse.json({
        translatedText: text,
        targetLanguage,
        model_used: "identity",
      });
    }

    const groqApiKey = getGroqApiKey();

    if (!groqApiKey) {
      return NextResponse.json({
        translatedText: text,
        targetLanguage,
        model_used: "fallback",
      });
    }

    const systemPrompt = `You are an elite multilingual disaster communications expert for Indian civil defense and District Disaster Management Authorities (DDMA).
Your mission is to translate the provided text into ${langName}.
Guidelines:
1. Tone must be authoritative, urgent, caring, and crystal-clear for rural and urban citizens.
2. Keep numbers, temperatures (e.g., 44°C), phone helplines (e.g., 1077), and key location names intact or in natural transliteration.
3. Preserve bullet points and line breaks.
4. Output ONLY the raw translated text. Do NOT add notes, quotes, or explanations.`;

    const userPrompt = `Translate the following ${context} into ${langName}:\n\n${text}`;

    const modelsToTry = ["qwen/qwen3.8-27b", "openai/gpt-oss-20b"];

    for (const model of modelsToTry) {
      try {
        const groqResponse = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 1500,
          }),
        });

        if (groqResponse.ok) {
          const completion = await groqResponse.json();
          const translatedText = completion.choices?.[0]?.message?.content?.trim();
          if (translatedText) {
            return NextResponse.json({
              translatedText,
              targetLanguage,
              model_used: model,
            });
          }
        }
      } catch (err) {
        console.warn(`Translation attempt with ${model} failed, trying fallback model...`, err);
      }
    }

    // Graceful fallback if API fails
    return NextResponse.json({
      translatedText: text,
      targetLanguage,
      model_used: "passthrough_fallback",
    });
  } catch (error: any) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Internal translation error", message: error.message },
      { status: 500 }
    );
  }
}
