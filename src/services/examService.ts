import { GoogleGenAI, Type } from "@google/genai";
import { ExamInput, ExamOutput } from '../types/exam';
import { EXAM_SYSTEM_INSTRUCTION, buildExamPrompt } from '../prompts/examPrompt';
import { generateMockExam } from '../mocks/examMock';
import { MOCK_EXAMS, MOCK_RESULTS } from '../mocks/data';
import { Exam, ExamResult } from '../types';

/**
 * Serviço para gerenciamento de simulados.
 */
export const examService = {
  /**
   * Retorna todos os simulados disponíveis.
   */
  async getExams(): Promise<Exam[]> {
    return MOCK_EXAMS;
  },

  /**
   * Retorna um simulado específico pelo ID.
   */
  async getExamById(id: string): Promise<Exam | null> {
    return MOCK_EXAMS.find(e => e.id === id) || null;
  },

  /**
   * Retorna os resultados de um usuário.
   */
  async getUserResults(userId: string): Promise<ExamResult[]> {
    return MOCK_RESULTS.filter(r => r.userId === userId);
  },

  /**
   * Salva o resultado de um simulado.
   */
  async saveResult(result: Omit<ExamResult, 'id' | 'completedAt'>): Promise<ExamResult> {
    const newResult: ExamResult = {
      ...result,
      id: `res-${Math.random().toString(36).substr(2, 9)}`,
      completedAt: new Date().toISOString(),
    };
    MOCK_RESULTS.push(newResult);
    return newResult;
  },

  /**
   * Função principal para gerar simulados via IA.
   * Tenta usar a API do Gemini se disponível, caso contrário usa dados mockados.
   */
  async generateExam(input: ExamInput): Promise<ExamOutput> {
    const apiKey = process.env.GEMINI_API_KEY;

    // Verifica se a chave da API está configurada
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
      console.log('Gemini API Key not configured. Using mock exam.');
      return generateMockExam(input);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3.1-pro-preview";
      const prompt = buildExamPrompt(input);

      const response = await ai.models.generateContent({
        model,
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
      
      const result = JSON.parse(text) as ExamOutput;
      
      // Garantir que cada questão tenha o sourceMode correto (sempre previous_exam_based agora)
      result.questoes = result.questoes.map(q => ({
        ...q,
        sourceMode: 'previous_exam_based'
      }));

      return result;
    } catch (error) {
      console.error("Error generating AI exam, falling back to mock:", error);
      return generateMockExam(input);
    }
  }
};
