import { GoogleGenAI, Type } from "@google/genai";
import { EditalAnalysis } from '../types/edital';
import { ExamOutput, ExamInput } from '../types/exam';
import { EDITAL_EXAM_SYSTEM_INSTRUCTION, buildEditalExamPrompt } from '../prompts/editalExamPrompt';
import { generateMockExam } from '../mocks/examMock';
import { validateAndCleanQuestions } from '../utils/examUtils';
import { withRetry } from '../utils/aiRetry';

export const editalExamService = {
  /**
   * Gera um simulado baseado na análise estruturada do edital.
   */
  async generateEditalExam(analysis: EditalAnalysis, quantidade: number = 10, selectedSubjects?: string[], onRetry?: (attempt: number) => void): Promise<ExamOutput> {
    const apiKey = process.env.GEMINI_API_KEY;

    const examInput: ExamInput = {
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
    };

    // Verifica se a chave da API está configurada
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
      console.log('[EditalExamService] Gemini API Key not configured or placeholder. Using mock exam for edital.');
      console.log('[EditalExamService] API Key status:', apiKey ? `Placeholder (${apiKey.substring(0, 4)}...)` : 'Missing');
      return generateMockExam(examInput);
    }

    const modelName = "gemini-3-flash-preview";
    console.log(`[EditalExamService] Starting edital exam generation with model: ${modelName}`);
    console.log(`[EditalExamService] API Key status: Present (starts with ${apiKey.substring(0, 4)}...)`);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = modelName;
      const prompt = buildEditalExamPrompt(analysis, quantidade, selectedSubjects);

      const result = await withRetry(async () => {
        const response = await ai.models.generateContent({
          model,
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

        const text = response.text;
        if (!text) throw new Error("Empty response from AI");
        
        return JSON.parse(text) as ExamOutput;
      }, {
        onRetry: (attempt, error) => {
          console.warn(`[EditalExamService] Tentativa ${attempt} de geração falhou devido a alta demanda ou erro temporário. Tentando novamente...`);
          if (onRetry) onRetry(attempt);
        }
      });
      
      // Camada de validação e limpeza para garantir aderência ao cargo
      result.questoes = validateAndCleanQuestions(result.questoes, examInput);

      // Garantir que cada questão tenha o sourceMode correto
      result.questoes = result.questoes.map(q => ({
        ...q,
        sourceMode: 'edital_based'
      }));

      // Adicionar metadados do edital ao resultado
      result.modo = 'edital';
      result.concurso = analysis.concurso;
      result.orgao = analysis.orgao;
      result.cargo = analysis.cargo;
      result.banca = analysis.banca;
      result.nivelEscolaridade = analysis.escolaridade;
      result.nivel = 'medio';
      result.tipoQuestao = 'multipla_escolha';

      return result;
    } catch (error) {
      console.error("Error generating AI edital exam, falling back to mock:", error);
      return generateMockExam(examInput);
    }
  }
};
