import { CorrectionInput } from '../types/correction';

/**
 * Constrói o prompt para a IA corrigir o simulado e gerar análise.
 */
export function buildCorrectionPrompt(input: CorrectionInput): string {
  const { exam, answers, timeSpent } = input;
  
  return `
Você é um mentor especialista em concursos públicos brasileiros de alto desempenho. Sua tarefa é corrigir um simulado realizado por um aluno e fornecer uma análise pedagógica e estratégica detalhada.

Dados do simulado:
Título: ${exam.tituloSimulado}
Descrição: ${exam.descricao}
Modo: ${exam.modo}
Concurso: ${exam.concurso}
Matéria: ${exam.materia}
Banca: ${exam.banca}
Nível: ${exam.nivel}
Tipo de questão: ${exam.tipoQuestao}

Questões e Respostas do Usuário:
${exam.questoes.map(q => {
  const userAnswer = answers.find(a => a.questionId === q.id);
  const userDisplayAnswer = q.tipo === 'multipla_escolha' 
    ? (userAnswer?.selectedOption || 'Não respondida')
    : (userAnswer?.statements?.map(s => s.answer ? 'V' : 'F').join(', ') || 'Não respondida');
  
  const correctDisplayAnswer = q.tipo === 'multipla_escolha'
    ? (q.correta || '')
    : (q.afirmativas?.map(af => af.correta ? 'V' : 'F').join(', ') || '');

  return `
Questão ${q.id}:
Enunciado: ${q.enunciado}
Assunto: ${q.assunto}
Resposta Correta: ${correctDisplayAnswer}
Resposta do Usuário: ${userDisplayAnswer}
Explicação Original: ${q.explicacao}
`;
}).join('\n')}

Tempo total de prova: ${Math.floor(timeSpent / 60)} minutos e ${timeSpent % 60} segundos.

Instruções de resposta:
Retorne um JSON seguindo estritamente este formato:
{
  "summary": {
    "totalQuestions": number,
    "correctAnswers": number,
    "incorrectAnswers": number,
    "score": number (0-100),
    "performanceLevel": "Excelente" | "Bom" | "Regular" | "Insuficiente" | "Crítico",
    "timeSpent": number (em segundos)
  },
  "results": [
    {
      "questionId": number,
      "enunciado": "string",
      "isCorrect": boolean,
      "userAnswer": "string",
      "correctAnswer": "string",
      "explanation": "string",
      "assunto": "string",
      "feedback": "string (feedback personalizado curto focado no erro ou acerto específico)"
    }
  ],
  "analysis": {
    "strengths": ["string (mínimo 3)"],
    "weaknesses": ["string (mínimo 3)"],
    "recommendations": ["string (mínimo 4)"]
  }
}

Regras Cruciais:
1. A análise de pontos fortes, fracos e recomendações deve ser REALISTA e baseada nos assuntos que o aluno errou ou acertou.
2. Identifique padrões de erro (ex: erros em prazos, erros em conceitos básicos, erros em jurisprudência).
3. As recomendações devem ser práticas (ex: "Revisar o artigo 5º da CF", "Focar em exercícios da banca X sobre o tema Y").
4. Não escreva nada fora do JSON. Não use markdown.
`;
}
