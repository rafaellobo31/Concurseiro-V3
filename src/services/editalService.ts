import { GoogleGenAI } from "@google/genai";
import { EditalAnalysis, EditalAnalysisResult } from '../types/edital';
import { EDITAL_ANALYSIS_SYSTEM_INSTRUCTION, buildEditalAnalysisPrompt } from '../prompts/editalAnalysisPrompt';
import { MOCK_EDITAL_ANALYSIS } from '../mocks/editalMock';

export const editalService = {
  /**
   * Analisa um arquivo de edital (PDF) usando IA.
   */
  async analyzeEdital(file: File): Promise<EditalAnalysisResult> {
    const apiKey = process.env.GEMINI_API_KEY;

    // Se não houver chave, simulamos um delay e retornamos o mock
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
      console.log('Gemini API Key not configured. Using mock edital analysis.');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, data: MOCK_EDITAL_ANALYSIS };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3.1-pro-preview";

      // Converter arquivo para base64
      const base64Data = await this.fileToBase64(file);
      
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data
                }
              },
              {
                text: "Analise este edital e extraia as informações conforme as instruções do sistema."
              }
            ]
          }
        ],
        config: {
          systemInstruction: EDITAL_ANALYSIS_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        }
      });

      const text = response.text;
      if (!text) throw new Error("Resposta vazia da IA");
      
      const data = JSON.parse(text) as EditalAnalysis;
      return { success: true, data };
    } catch (error) {
      console.error("Erro ao analisar edital com IA:", error);
      return { 
        success: false, 
        error: "Não foi possível analisar o edital. Verifique se o arquivo é um PDF válido e tente novamente." 
      };
    }
  },

  /**
   * Converte um arquivo para string base64.
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }
};
