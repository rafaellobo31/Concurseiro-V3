import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

// Import utilities and prompts from src
import { withRetry } from "./src/utils/aiRetry.ts";
import { EXAM_SYSTEM_INSTRUCTION, buildExamPrompt } from "./src/prompts/examPrompt.ts";
import { buildCorrectionPrompt } from "./src/prompts/correctionPrompt.ts";
import { STUDY_PLAN_SYSTEM_INSTRUCTION, getStudyPlanPrompt } from "./src/services/studyPlanPrompt.ts";
import { EDITAL_EXAM_SYSTEM_INSTRUCTION, buildEditalExamPrompt } from "./src/prompts/editalExamPrompt.ts";
import { validateAndCleanQuestions } from "./src/utils/examUtils.ts";

// Import mocks
import { generateMockExam } from "./src/mocks/examMock.ts";
import { generateMockCorrection } from "./src/mocks/correctionMock.ts";
import { generateMockStudyPlan } from "./src/mocks/studyPlanMock.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  const modelName = "gemini-3-flash-preview";

  // Helper to get AI instance
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
      return null;
    }
    return new GoogleGenAI({ apiKey });
  };

  // 1. Generate Exam
  app.post("/api/gemini/generate-exam", async (req, res) => {
    const { input } = req.body;
    const ai = getAI();

    if (!ai) {
      console.log("[Server] API Key missing or placeholder. Falling back to mock exam.");
      return res.json(generateMockExam(input));
    }

    try {
      const result = await withRetry(async () => {
        const prompt = buildExamPrompt(input);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction: EXAM_SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                tituloSimulado: { type: Type.STRING },
                descricao: { type: Type.STRING },
                modo: { type: Type.STRING },
                concurso: { type: Type.STRING },
                orgao: { type: Type.STRING },
                cargo: { type: Type.STRING },
                nivelEscolaridade: { type: Type.STRING },
                materia: { type: Type.STRING },
                banca: { type: Type.STRING },
                nivel: { type: Type.STRING },
                tipoQuestao: { type: Type.STRING },
                questoes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.INTEGER },
                      enunciado: { type: Type.STRING },
                      tipo: { type: Type.STRING },
                      banca: { type: Type.STRING },
                      ano: { type: Type.INTEGER },
                      concursoReferencia: { type: Type.STRING },
                      assunto: { type: Type.STRING },
                      peso: { type: Type.STRING },
                      alternativas: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            letra: { type: Type.STRING },
                            texto: { type: Type.STRING }
                          },
                          required: ["letra", "texto"]
                        }
                      },
                      afirmativas: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.INTEGER },
                            texto: { type: Type.STRING },
                            correta: { type: Type.BOOLEAN }
                          },
                          required: ["id", "texto", "correta"]
                        }
                      },
                      correta: { type: Type.STRING },
                      explicacao: { type: Type.STRING }
                    },
                    required: ["id", "enunciado", "tipo", "explicacao", "assunto", "peso", "banca", "ano", "concursoReferencia"]
                  }
                }
              },
              required: ["tituloSimulado", "descricao", "questoes"]
            }
          }
        });
        return JSON.parse(response.text);
      }, {
        onRetry: (attempt) => console.log(`[Server] Retrying generate-exam (attempt ${attempt})...`)
      });
      res.json(result);
    } catch (error) {
      console.error("[Server] Error in generate-exam:", error);
      res.json(generateMockExam(input));
    }
  });

  // 2. Correct Exam
  app.post("/api/gemini/correct-exam", async (req, res) => {
    const { input } = req.body;
    const ai = getAI();

    if (!ai) {
      console.log("[Server] API Key missing. Falling back to mock correction.");
      return res.json(generateMockCorrection(input));
    }

    try {
      const result = await withRetry(async () => {
        const prompt = buildCorrectionPrompt(input);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.OBJECT,
                  properties: {
                    totalQuestions: { type: Type.NUMBER },
                    correctAnswers: { type: Type.NUMBER },
                    incorrectAnswers: { type: Type.NUMBER },
                    score: { type: Type.NUMBER },
                    performanceLevel: { type: Type.STRING },
                    timeSpent: { type: Type.NUMBER }
                  },
                  required: ["totalQuestions", "correctAnswers", "score", "performanceLevel", "timeSpent"]
                },
                results: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      questionId: { type: Type.NUMBER },
                      enunciado: { type: Type.STRING },
                      isCorrect: { type: Type.BOOLEAN },
                      userAnswer: { type: Type.STRING },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      assunto: { type: Type.STRING },
                      feedback: { type: Type.STRING }
                    },
                    required: ["questionId", "isCorrect", "userAnswer", "correctAnswer", "explanation", "assunto", "feedback"]
                  }
                },
                analysis: {
                  type: Type.OBJECT,
                  properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["strengths", "weaknesses", "recommendations"]
                }
              },
              required: ["summary", "results", "analysis"]
            }
          }
        });
        return JSON.parse(response.text);
      }, {
        onRetry: (attempt) => console.log(`[Server] Retrying correct-exam (attempt ${attempt})...`)
      });
      res.json(result);
    } catch (error) {
      console.error("[Server] Error in correct-exam:", error);
      res.json(generateMockCorrection(input));
    }
  });

  // 3. Analyze Edital
  app.post("/api/gemini/analyze-edital", async (req, res) => {
    const { text } = req.body;
    const ai = getAI();

    if (!ai) {
      console.log("[Server] API Key missing. Falling back to mock analysis.");
      // We need to import editalAnalysisService or just use the mock logic
      return res.json({
        success: true,
        data: {
          concurso: "Concurso Mock (Chave API não configurada)",
          orgao: "Órgão Exemplo",
          cargo: "Cargo Exemplo",
          banca: "Banca Exemplo",
          escolaridade: "superior",
          materias: [
            { nome: "Matéria Exemplo 1", topicos: ["Tópico 1.1", "Tópico 1.2"] },
            { nome: "Matéria Exemplo 2", topicos: ["Tópico 2.1", "Tópico 2.2"] }
          ],
          observacoes: ["Configure sua chave Gemini para análise real"],
          prioridades: [
            { materia: "Matéria Exemplo 1", peso: "alto" }
          ]
        }
      });
    }

    try {
      const data = await withRetry(async () => {
        const prompt = `
          Analise o seguinte texto extraído de um edital de concurso público e extraia as informações estruturadas.
          
          INSTRUÇÃO CRÍTICA: O conteúdo programático (matérias e tópicos) geralmente está localizado no final do documento, em seções chamadas "CONTEÚDO PROGRAMÁTICO" ou em "ANEXOS" (ex: Anexo III). Vasculhe todo o texto para encontrar essas informações.
          
          Seja extremamente fiel ao conteúdo do edital fornecido. Não invente informações.
          Se encontrar o cargo mas não as matérias, procure novamente nos anexos.
          
          Texto do Edital:
          ${text.substring(0, 500000)} 
          
          Extraia:
          1. Nome do Concurso
          2. Órgão
          3. Cargo/Área principal
          4. Banca examinadora
          5. Nível de escolaridade exigido
          6. Lista de matérias do conteúdo programático (cada matéria com seus principais tópicos)
          7. Observações estratégicas (dicas baseadas no edital)
          8. Prioridades de estudo (quais matérias parecem ter mais peso ou importância)
        `;

        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction: "Você é um especialista em análise de editais de concursos públicos. Sua tarefa é extrair informações precisas e estruturadas do texto fornecido. Retorne APENAS o JSON solicitado.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                concurso: { type: Type.STRING },
                orgao: { type: Type.STRING },
                cargo: { type: Type.STRING },
                banca: { type: Type.STRING },
                escolaridade: { type: Type.STRING },
                materias: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      nome: { type: Type.STRING },
                      topicos: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["nome", "topicos"]
                  }
                },
                observacoes: { type: Type.ARRAY, items: { type: Type.STRING } },
                prioridades: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      materia: { type: Type.STRING },
                      peso: { type: Type.STRING, enum: ["baixo", "médio", "alto"] }
                    },
                    required: ["materia", "peso"]
                  }
                }
              },
              required: ["concurso", "orgao", "cargo", "banca", "escolaridade", "materias"]
            }
          }
        });
        return JSON.parse(response.text);
      }, {
        onRetry: (attempt) => console.log(`[Server] Retrying analyze-edital (attempt ${attempt})...`)
      });
      res.json({ success: true, data });
    } catch (error) {
      console.error("[Server] Error in analyze-edital:", error);
      res.json({
        success: false,
        error: "Erro ao analisar edital. Tente novamente."
      });
    }
  });

  // 4. Generate Study Plan
  app.post("/api/gemini/generate-study-plan", async (req, res) => {
    const { input } = req.body;
    const ai = getAI();

    if (!ai) {
      console.log("[Server] API Key missing. Falling back to mock study plan.");
      return res.json(generateMockStudyPlan(input));
    }

    try {
      const result = await withRetry(async () => {
        const prompt = getStudyPlanPrompt(input);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction: STUDY_PLAN_SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                prioridades: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      materia: { type: Type.STRING },
                      nivelPrioridade: { type: Type.STRING, enum: ["Alta", "Média", "Baixa"] },
                      motivo: { type: Type.STRING }
                    },
                    required: ["materia", "nivelPrioridade", "motivo"]
                  }
                },
                planoSemanal: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dia: { type: Type.STRING },
                      atividades: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            materia: { type: Type.STRING },
                            tempo: { type: Type.STRING },
                            tipo: { type: Type.STRING, enum: ["teoria", "revisão", "simulado"] }
                          },
                          required: ["materia", "tempo", "tipo"]
                        }
                      }
                    },
                    required: ["dia", "atividades"]
                  }
                },
                recomendacoes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["prioridades", "planoSemanal", "recomendacoes"]
            }
          }
        });
        return JSON.parse(response.text);
      }, {
        onRetry: (attempt) => console.log(`[Server] Retrying generate-study-plan (attempt ${attempt})...`)
      });
      res.json(result);
    } catch (error) {
      console.error("[Server] Error in generate-study-plan:", error);
      res.json(generateMockStudyPlan(input));
    }
  });

  // 5. Generate Edital Exam
  app.post("/api/gemini/generate-edital-exam", async (req, res) => {
    const { analysis, quantidade, selectedSubjects } = req.body;
    const ai = getAI();

    if (!ai) {
      console.log("[Server] API Key missing. Falling back to mock edital exam.");
      return res.json(generateMockExam({
        modo: 'concurso',
        concurso: analysis.concurso,
        orgao: analysis.orgao,
        cargo: analysis.cargo,
        banca: analysis.banca,
        nivelEscolaridade: analysis.escolaridade,
        materia: selectedSubjects && selectedSubjects.length > 0 ? selectedSubjects.join(', ') : (analysis.materias[0]?.nome || 'Geral'),
        tipoQuestao: 'multipla_escolha',
        quantidade,
        nivel: 'medio'
      }));
    }

    try {
      const result = await withRetry(async () => {
        const prompt = buildEditalExamPrompt(analysis, quantidade, selectedSubjects);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction: EDITAL_EXAM_SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                tituloSimulado: { type: Type.STRING },
                descricao: { type: Type.STRING },
                questoes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.INTEGER },
                      enunciado: { type: Type.STRING },
                      tipo: { type: Type.STRING, enum: ["multipla_escolha", "verdadeiro_falso"] },
                      banca: { type: Type.STRING },
                      ano: { type: Type.INTEGER },
                      concursoReferencia: { type: Type.STRING },
                      alternativas: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            letra: { type: Type.STRING },
                            texto: { type: Type.STRING }
                          },
                          required: ["letra", "texto"]
                        }
                      },
                      correta: { type: Type.STRING },
                      explicacao: { type: Type.STRING },
                      assunto: { type: Type.STRING },
                      peso: { type: Type.STRING, enum: ["baixo", "medio", "alto"] }
                    },
                    required: ["id", "enunciado", "tipo", "explicacao", "assunto", "peso", "banca", "ano", "concursoReferencia"]
                  }
                }
              },
              required: ["tituloSimulado", "descricao", "questoes"]
            }
          }
        });
        return JSON.parse(response.text);
      }, {
        onRetry: (attempt) => console.log(`[Server] Retrying generate-edital-exam (attempt ${attempt})...`)
      });
      res.json(result);
    } catch (error) {
      console.error("[Server] Error in generate-edital-exam:", error);
      res.json(generateMockExam({
        modo: 'concurso',
        concurso: analysis.concurso,
        orgao: analysis.orgao,
        cargo: analysis.cargo,
        banca: analysis.banca,
        nivelEscolaridade: analysis.escolaridade,
        materia: selectedSubjects && selectedSubjects.length > 0 ? selectedSubjects.join(', ') : (analysis.materias[0]?.nome || 'Geral'),
        tipoQuestao: 'multipla_escolha',
        quantidade,
        nivel: 'medio'
      }));
    }
  });

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
