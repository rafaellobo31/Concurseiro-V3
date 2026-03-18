import { EditalAnalysis } from '../types/edital';

export const EDITAL_EXAM_SYSTEM_INSTRUCTION = `
Você é um especialista em concursos públicos brasileiros, especializado em elaboração de questões inéditas e pedagógicas.
Sua tarefa é gerar um simulado baseado estritamente no conteúdo programático de um edital analisado.

Diretrizes de Geração:
1. Questões Inéditas: Gere questões originais que testem o conhecimento dos tópicos listados no edital. Não busque provas anteriores.
2. Estilo da Banca: Adapte o estilo de escrita, o nível de dificuldade e o tipo de cobrança ao perfil da banca informada (ex: FGV, CESPE, FCC).
3. Aderência ao Cargo: As questões devem ser pertinentes ao cargo e nível de escolaridade informados.
4. Distribuição de Matérias: Distribua as questões entre as matérias e tópicos fornecidos na análise do edital.
5. Qualidade Pedagógica: Cada questão deve ter alternativas plausíveis e uma explicação clara citando a base legal ou teórica.

Regras de Formato:
- Retorne APENAS um JSON válido.
- Não use markdown no JSON.
- Para múltipla escolha, use 5 alternativas (A a E).
`;

export function buildEditalExamPrompt(analysis: EditalAnalysis, quantidade: number = 10): string {
  return `
Gere um simulado inédito baseado na seguinte análise de edital:

DADOS DO EDITAL:
- Concurso: ${analysis.concurso}
- Órgão: ${analysis.orgao}
- Cargo: ${analysis.cargo}
- Banca: ${analysis.banca}
- Escolaridade: ${analysis.escolaridade}

CONTEÚDO PROGRAMÁTICO (MATÉRIAS E TÓPICOS):
${analysis.materias.map(m => `- ${m.nome}: ${m.topicos.join(', ')}`).join('\n')}

OBSERVAÇÕES ADICIONAIS:
${analysis.observacoes.join('\n')}

REQUISITOS:
- Quantidade de questões: ${quantidade}
- Tipo: Múltipla Escolha (A-E)
- Estilo: ${analysis.banca}
- Foco: ${analysis.cargo}

FORMATO DO JSON:
{
  "tituloSimulado": "Simulado Inédito - ${analysis.concurso}",
  "descricao": "Simulado elaborado com base no conteúdo programático do edital para o cargo de ${analysis.cargo}.",
  "questoes": [
    {
      "id": 1,
      "enunciado": "...",
      "tipo": "multipla_escolha",
      "banca": "${analysis.banca}",
      "ano": 2026,
      "concursoReferencia": "${analysis.concurso}",
      "assunto": "...",
      "peso": "medio",
      "alternativas": [
        { "letra": "A", "texto": "..." },
        { "letra": "B", "texto": "..." },
        { "letra": "C", "texto": "..." },
        { "letra": "D", "texto": "..." },
        { "letra": "E", "texto": "..." }
      ],
      "correta": "A",
      "explicacao": "..."
    }
  ]
}
`;
}
