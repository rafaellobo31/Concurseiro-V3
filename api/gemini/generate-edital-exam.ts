import { Type } from "@google/genai";
import { getAI, withRetry, handleGeminiError, modelName } from "./_shared.ts";
import { EDITAL_EXAM_SYSTEM_INSTRUCTION, buildEditalExamPrompt } from "../../src/prompts/editalExamPrompt.ts";
import { generateMockExam } from "../../src/mocks/examMock.ts";

export default async function handler(req: any, res: any) {
  console.log(`[Generate-Edital-Exam] Início da requisição. Método: ${req.method}`);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, message: "Método não permitido" });
  }

  const { analysis, quantidade, selectedSubjects } = req.body;
  console.log(`[Generate-Edital-Exam] Payload recebido:`, JSON.stringify({ analysis: analysis?.concurso, quantidade, selectedSubjects }));

  if (!analysis) {
    return res.status(400).json({ error: true, message: "Análise do edital ausente na requisição" });
  }

  const ai = getAI();

  if (!ai) {
    console.warn("[Generate-Edital-Exam] API Key missing. Falling back to mock.");
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
      console.log(`[Generate-Edital-Exam] Prompt construído. Chamando Gemini...`);
      
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
      
      console.log(`[Generate-Edital-Exam] Resposta recebida da Gemini.`);
      
      if (!response.text) {
        throw new Error("Resposta vazia da Gemini");
      }

      try {
        return JSON.parse(response.text);
      } catch (parseError: any) {
        console.error(`[Generate-Edital-Exam] Erro ao parsear JSON da Gemini:`, response.text);
        throw new Error(`Erro de parsing JSON: ${parseError.message}`);
      }
    }, "generate-edital-exam");
    
    console.log(`[Generate-Edital-Exam] Sucesso na geração.`);
    res.json(result);
  } catch (error: any) {
    console.error(`[Generate-Edital-Exam] Falha na geração:`, error);
    handleGeminiError(res, error, "generate-edital-exam", generateMockExam({
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
}
