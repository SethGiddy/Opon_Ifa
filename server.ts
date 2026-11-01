import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Ifá Oracle: Consult on Real-Life User/Seeker Problems
app.post("/api/ifa/divine-problem", async (req, res) => {
  const { userDilemma, seekerCategory, divinerRank } = req.body;

  const fallbackResponses = [
    {
      revealedOdu: "Ìwòrì Méjì",
      oduPattern: [["II", "II"], ["I", "I"], ["I", "I"], ["II", "II"]],
      essence: "Deep Reflection & Seeing Through Illusion",
      proverb: {
        yoruba: "Ojú kì í fọ́ kí a má mọ ọ̀rẹ́ mọ̀ràn; inú ni awo ń gbé.",
        translation: "Blindness of the eyes is nothing compared to blindness of the inner mind.",
      },
      eseIfaVerse: {
        ancientDiviners: "Wò-kí-o-tó-dá (Look-Before-You-Strike)",
        verse: "Ẹni tí ó ń sáré láì mọ ibi tí ó ń lọ a padà sí ẹ̀yìn. Ìwòrì dáfá fún olóye tí ń wá ọ̀nà àbájọ.",
        translation: "The one who runs blindly without knowing their destination inevitably retreats. Ìwòrì divined for the seeker seeking true orientation.",
      },
      customOrikiPanegyric: "Orí mi, fún mi ní ojú inú láti mọ òtítọ́ nínú gbogbo àdánwò. Ọ̀rúnmìlà Ẹlẹ́rìí Ìpín, tọ́ mi sí ọ̀nà ire.",
      orikiTranslation: "My inner Orí, grant me inner vision to discern truth in every trial. Ọ̀rúnmìlà witness of destiny, guide me onto pathways of lasting good.",
      prescribedEboAction: "Take 3 days of quiet contemplation before signing or agreeing. Wash your forehead with cool water at dawn and speak truth with gentle dignity.",
      philosophicalGuidance: "Your current anxiety is born from looking outward for validation. Re-anchor in your character (Ìwà Pẹ̀lẹ́); what belongs to your destiny will not pass you by.",
    },
    {
      revealedOdu: "Ọ̀bàrà Méjì",
      oduPattern: [["I", "I"], ["II", "II"], ["II", "II"], ["II", "II"]],
      essence: "Eloquence, Turning Scarcity to Wealth, Humility over Boasting",
      proverb: {
        yoruba: "Ẹnu tí a fi ń jẹ àpọ́n, a kì í fi sọ ọ̀rọ̀ tí kò dùn mọ́ Ẹlẹ́dàá.",
        translation: "The tongue used to taste sweet nourishment must not utter bitter curses.",
      },
      eseIfaVerse: {
        ancientDiviners: "A-dákẹ́-ṣe-iṣẹ́ (The Quiet Craftsman)",
        verse: "Ọ̀bàrà tẹ́rẹ́ awo ọlọ́rọ̀, ẹni tí ayé kẹ́gàn lana, lónìí ó d’ọba.",
        translation: "Slender Ọ̀bàrà, priest of true wealth: the one mocked yesterday is crowned sovereign today.",
      },
      customOrikiPanegyric: "Ọ̀bàrà awo ọ̀rọ̀, dẹ́kun ìgbéraga, fi iṣẹ́ ọwọ́ rẹ sọ̀rọ̀ dípò ẹnu.",
      orikiTranslation: "Ọ̀bàrà priest of prosperity, discard boastful pride, let the excellence of your hands speak rather than empty words.",
      prescribedEboAction: "Cultivate quiet discipline. Give a meal to someone in need without publicizing it, and focus on mastering your craft.",
      philosophicalGuidance: "Do not defend your worth to those who mock your humble beginnings. Your quiet consistency will soon become sovereign proof.",
    },
  ];

  if (!process.env.GEMINI_API_KEY) {
    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return res.json({
      success: true,
      divination: randomFallback,
      source: "codex_fallback",
    });
  }

  try {
    const prompt = `You are a revered, deeply wise Babalawo (high priest of Ifá and custodian of Yoruba sacred wisdom) consulting for a modern seeker in the sacred Ọpọ́n Ifá shrine.

The seeker presents this real-life human dilemma:
"${userDilemma || "I am feeling overwhelmed by work stress, family expectations, and an ethical dilemma regarding my career path."}"
Category: ${seekerCategory || "Career & Purpose"}
Diviner's Rank: ${divinerRank || "Babalawo"}

Divinate and generate an authentic, culturally accurate Ifá consultation response in JSON with:
1. "revealedOdu": The name of one of the 16 Principal Odù (e.g. Èjì Ogbè, Ọ̀yẹ̀kú Méjì, Ìwòrì Méjì, Òdí Méjì, Ìrosùn Méjì, Ọ̀wọ́nrín Méjì, Ọ̀bàrà Méjì, Ọ̀kànràn Méjì, Ògúndá Méjì, Ọ̀sá Méjì, Ìká Méjì, Òtúrúpọ̀n Méjì, Òtúrá Méjì, Ìrẹtẹ̀ Méjì, Ọ̀ṣẹ́ Méjì, Òfún Méjì) that metaphorically addresses this crisis.
2. "oduPattern": A 4x2 array of "I" or "II" strings representing the binary signature of the chosen Odù.
3. "essence": A 1-sentence cosmic essence of the Odù.
4. "proverb": An object with "yoruba" (authentic Yoruba proverb with diacritics) and "translation" (English).
5. "eseIfaVerse": An object with "ancientDiviners" (name of mythical diviners), "verse" (Yoruba poetic verse), and "translation" (English narrative context).
6. "customOrikiPanegyric": A poetic 2-line Yoruba panegyric praising their Orí (inner destiny) or Ọ̀rúnmìlà.
7. "orikiTranslation": English translation of the panegyric.
8. "prescribedEboAction": Practical, ethical real-world action (Ebọ Ìwà - character transformation, reconciliation, charity, or rest).
9. "philosophicalGuidance": 2-3 sentences of deep, empathetic psychological and philosophical counsel applying Ifá wisdom to modern life.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      divination: parsed,
      source: "gemini_ifa_oracle",
    });
  } catch (error) {
    console.error("Gemini Ifá Oracle error:", error);
    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return res.json({
      success: true,
      divination: randomFallback,
      source: "codex_fallback",
    });
  }
});

// Dynamic Procedural Seeker Case Generator
app.post("/api/ifa/generate-seeker-case", async (req, res) => {
  const { theme, era } = req.body;

  const fallbackCase = {
    name: "Dr. Dayo Adebisi",
    title: "The Visionary Marine Biologist",
    avatar: "🌊",
    category: "Ethics & Justice",
    context: "Contemporary African City",
    backgroundNarrative: "Dayo discovered that an offshore oil consortium has been illegally dumping chemical toxins into the Lagos coastal wetlands, poisoning local artisanal fisheries.",
    dilemmaSummary: "The consortium offers to fund his marine research institute for 20 years if he buries the report. Should he take the funding or publish the truth to save the fishermen?",
    emotionalState: "Deeply conflicted, fearing for his laboratory's future.",
    revealedOdu: "Ọ̀kànràn Méjì",
    panegyricTheme: "Oríkì Òtítọ́ (The Truth of Ọ̀kànràn)",
    prescribedAction: "Speak the unvarnished truth, build a coalition with local fishing guilds, and reject corrupt sponsorship.",
  };

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ success: true, caseData: fallbackCase, source: "offline_generator" });
  }

  try {
    const prompt = `Generate a rich, dramatic seeker dilemma for a Yoruba Ifá Divination wisdom game.
Theme: ${theme || "Complex Moral Dilemma / Career / Family"}
Era: ${era || "Contemporary African City / Global Diaspora"}

Return a JSON object with:
- "name": African name
- "title": Descriptive seeker title (e.g. "The Torn Tech Founder", "The Estranged Sister")
- "avatar": Single emoji
- "category": One of ["Career & Purpose", "Family & Lineage", "Ethics & Justice", "Health & Grief", "Love & Trust", "Communal Leadership"]
- "context": String
- "backgroundNarrative": 2-3 vivid sentences detailing their real-life struggle
- "dilemmaSummary": 1 clear sentence posing the ethical/emotional choice
- "emotionalState": 3 adjectives
- "revealedOdu": One of the 16 Principal Odù
- "panegyricTheme": Title of the Yoruba Oríkì to chant
- "prescribedAction": The noble ethical resolution (Ebọ Ìwà)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, caseData: parsed, source: "gemini_dynamic_case" });
  } catch (err) {
    console.error("Generate seeker case error:", err);
    return res.json({ success: true, caseData: fallbackCase, source: "offline_generator" });
  }
});

// Vite middleware and static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Òpó Ifá Divination Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
