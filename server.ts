import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

// Import utilities and prompts from src
import { withRetry } from "./src/utils/aiRetry.js";
import { EXAM_SYSTEM_INSTRUCTION, buildExamPrompt } from "./src/prompts/examPrompt.js";
import { buildCorrectionPrompt } from "./src/prompts/correctionPrompt.js";
import { STUDY_PLAN_SYSTEM_INSTRUCTION, getStudyPlanPrompt } from "./src/services/studyPlanPrompt.js";
import { EDITAL_EXAM_SYSTEM_INSTRUCTION, buildEditalExamPrompt } from "./src/prompts/editalExamPrompt.js";
import { validateAndCleanQuestions } from "./src/utils/examUtils.js";

// Import mocks
import { generateMockExam } from "./src/mocks/examMock.js";
import { generateMockCorrection } from "./src/mocks/correctionMock.js";
import { generateMockStudyPlan } from "./src/mocks/studyPlanMock.js";

// Import Gemini handlers
import generateExamHandler from "./api/gemini/generate-exam.js";
import correctExamHandler from "./api/gemini/correct-exam.js";
import analyzeEditalHandler from "./api/gemini/analyze-edital.js";
import generateStudyPlanHandler from "./api/gemini/generate-study-plan.js";
import generateEditalExamHandler from "./api/gemini/generate-edital-exam.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // 1. Generate Exam
  app.post("/api/gemini/generate-exam", generateExamHandler);

  // 2. Correct Exam
  app.post("/api/gemini/correct-exam", correctExamHandler);

  // 3. Analyze Edital
  app.post("/api/gemini/analyze-edital", analyzeEditalHandler);

  // 4. Generate Study Plan
  app.post("/api/gemini/generate-study-plan", generateStudyPlanHandler);

  // 5. Generate Edital Exam
  app.post("/api/gemini/generate-edital-exam", generateEditalExamHandler);

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
