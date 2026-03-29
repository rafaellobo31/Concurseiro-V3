import { GoogleGenAI, Type } from "@google/genai";
import { SimulatorInput, SimulatorOutput } from '../types/simulator';

const SIMULATOR_SYSTEM_INSTRUCTION = `
Você é um especialista em elaboração de questões para concursos públicos brasileiros, com conhecimento em bancas examinadoras, níveis de dificuldade, estilo de cobrança e construção de explicações didáticas.

Sua tarefa é gerar um simulado estruturado e de alta qualidade para estudos.

O simulado deve ser realista, bem formulado, coerente com o contexto de concursos públicos no Brasil e útil para preparação séria do candidato.

Regras gerais:

1. Gere questões inéditas, mas compatíveis com o estilo de concursos reais.
2. As questões devem ser claras, objetivas e bem escritas.
3. O nível de dificuldade deve ser respeitado.
4. A banca deve influenciar o estilo da questão quando informada.
5. O conteúdo deve ser relevante para a matéria ou concurso escolhido.
6. Cada questão deve ter explicação completa da resposta correta.
7. Não escreva nada fora do JSON.
8. Não use markdown.
9. Não invente leis, artigos ou fatos sem coerência.
10. Sempre mantenha o padrão de concurso público brasileiro.

Instruções específicas por tipo:

Para múltipla escolha:
- sempre gerar 5 alternativas
- apenas 1 correta
- alternativas plausíveis
- evitar alternativa obviamente errada

Para verdadeiro ou falso:
- gerar afirmativas claras
- equilibrar itens verdadeiros e falsos
- explicação deve comentar o raciocínio correto

Instruções pedagógicas:
- a explicação deve ensinar
- apontar por que a correta está certa
- apontar, quando possível, o erro conceitual das incorretas
- linguagem clara e objetiva

Instruções estratégicas:
- se o modo for "por concurso", priorize assuntos recorrentes nesse concurso
- se o modo for "por matéria", priorize fundamentos e tópicos de maior incidência
- se a banca for informada, adapte o estilo da cobrança
- se a dificuldade for "difícil", aumente interpretação, armadilhas e profundidade conceitual

Retorne apenas JSON válido.
`;

function getSimulatorPrompt(input: SimulatorInput): string {
  return `
Dados do simulado:
Modo: ${input.modoSimulado}
Concurso: ${input.concurso || 'N/A'}
Área/Cargo: ${input.cargo || 'N/A'}
Matéria: ${input.materia || 'N/A'}
Banca: ${input.banca || 'N/A'}
Tipo de questão: ${input.tipoQuestao}
Quantidade de questões: ${input.quantidade}
Nível de dificuldade: ${input.nivel}

Retorne apenas JSON válido seguindo o formato solicitado.
`;
}

export async function generateSimulator(input: SimulatorInput): Promise<SimulatorOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.log('[SimulatorService] Gemini API Key not configured or placeholder. Using mock simulator.');
    console.log('[SimulatorService] API Key status:', apiKey ? `Placeholder (${apiKey.substring(0, 4)}...)` : 'Missing');
    return generateMockSimulator(input);
  }

  const modelName = "gemini-3-flash-preview";
  console.log(`[SimulatorService] Starting simulator generation with model: ${modelName}`);
  console.log(`[SimulatorService] API Key status: Present (starts with ${apiKey.substring(0, 4)}...)`);

  try {
    const genAI = new GoogleGenAI({ apiKey });
    const model = modelName;
    const prompt = getSimulatorPrompt(input);

    const response = await genAI.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SIMULATOR_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tituloSimulado: { type: Type.STRING },
            descricao: { type: Type.STRING },
            modo: { type: Type.STRING },
            concurso: { type: Type.STRING },
            cargo: { type: Type.STRING },
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
                required: ["id", "enunciado", "tipo", "explicacao", "assunto", "peso"]
              }
            }
          },
          required: ["tituloSimulado", "descricao", "questoes"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as SimulatorOutput;
  } catch (error) {
    console.error("Error generating AI simulator, falling back to mock:", error);
    return generateMockSimulator(input);
  }
}

function generateMockSimulator(input: SimulatorInput): SimulatorOutput {
  const isTF = input.tipoQuestao === 'verdadeiro_falso';
  
  return {
    tituloSimulado: `Simulado de ${input.materia || input.concurso || 'Concurso'}`,
    descricao: `Simulado nível ${input.nivel} focado em ${input.materia || input.cargo || 'conhecimentos gerais'}.`,
    modo: input.modoSimulado,
    concurso: input.concurso || 'N/A',
    cargo: input.cargo || 'N/A',
    materia: input.materia || 'N/A',
    banca: input.banca || 'N/A',
    nivel: input.nivel,
    tipoQuestao: input.tipoQuestao,
    questoes: Array.from({ length: input.quantidade }).map((_, i) => ({
      id: i + 1,
      enunciado: `Enunciado da questão ${i + 1} sobre ${input.materia || 'Direito Administrativo'}. Este é um exemplo de questão formulada para o nível ${input.nivel}.`,
      tipo: input.tipoQuestao,
      ...(isTF ? {
        afirmativas: [
          { id: 1, texto: "Afirmativa verdadeira sobre o tema.", correta: true },
          { id: 2, texto: "Afirmativa falsa que tenta induzir ao erro.", correta: false },
          { id: 3, texto: "Outra afirmativa verdadeira com detalhes técnicos.", correta: true }
        ]
      } : {
        alternativas: [
          { letra: "A", texto: "Alternativa incorreta mas plausível." },
          { letra: "B", texto: "Alternativa correta com base na lei seca." },
          { letra: "C", texto: "Alternativa que confunde conceitos similares." },
          { letra: "D", texto: "Alternativa incompleta." },
          { letra: "E", texto: "Alternativa que extrapola o comando da questão." }
        ],
        correta: "B"
      }),
      explicacao: "Explicação detalhada sobre o porquê da resposta estar correta, citando possíveis artigos de lei ou doutrina relevante para o tema abordado.",
      assunto: input.materia || "Geral",
      peso: "medio"
    }))
  };
}
