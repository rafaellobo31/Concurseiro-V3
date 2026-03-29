import { Type } from "@google/genai";
import { getAI, withRetry, handleGeminiError, modelName } from "./_shared.ts";
import { EXAM_SYSTEM_INSTRUCTION, buildExamPrompt } from "../../src/prompts/examPrompt.ts";
import { generateMockExam } from "../../src/mocks/examMock.ts";

export default async function handler(req: any, res: any) {
  console.log(`[Generate-Exam] Início da requisição. Método: ${req.method}`);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, message: "Método não permitido" });
  }

  const { input } = req.body;
  console.log(`[Generate-Exam] Payload recebido:`, JSON.stringify(input));

  if (!input) {
    return res.status(400).json({ error: true, message: "Payload 'input' ausente na requisição" });
  }

  const ai = getAI();

  if (!ai) {
    console.warn("[Generate-Exam] API Key missing. Falling back to mock.");
    return res.json(generateMockExam(input));
  }

  try {
    const result = await withRetry(async () => {
      const prompt = buildExamPrompt(input);
      console.log(`[Generate-Exam] Prompt construído. Chamando Gemini...`);
      
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
      
      console.log(`[Generate-Exam] Resposta recebida da Gemini.`);
      
      if (!response.text) {
        throw new Error("Resposta vazia da Gemini");
      }

      try {
        return JSON.parse(response.text);
      } catch (parseError: any) {
        console.error(`[Generate-Exam] Erro ao parsear JSON da Gemini:`, response.text);
        throw new Error(`Erro de parsing JSON: ${parseError.message}`);
      }
    }, "generate-exam");
    
    console.log(`[Generate-Exam] Sucesso na geração.`);
    res.json(result);
  } catch (error: any) {
    console.error(`[Generate-Exam] Falha na geração:`, error);
    handleGeminiError(res, error, "generate-exam", generateMockExam(input));
  }
}
