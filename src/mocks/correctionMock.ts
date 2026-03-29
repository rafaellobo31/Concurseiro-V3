import { CorrectionInput, CorrectionOutput, QuestionCorrectionResult } from '../types/correction.js';

/**
 * Gera uma correção mockada para o simulado.
 */
export function generateMockCorrection(input: CorrectionInput): CorrectionOutput {
  const { exam, answers, timeSpent } = input;
  
  const results: QuestionCorrectionResult[] = exam.questoes.map(q => {
    const userAnswer = answers.find(a => a.questionId === q.id);
    let isCorrect = false;
    let userDisplayAnswer = 'Não respondida';
    let correctDisplayAnswer = '';

    if (q.tipo === 'multipla_escolha') {
      isCorrect = userAnswer?.selectedOption === q.correta;
      userDisplayAnswer = userAnswer?.selectedOption || 'Não respondida';
      correctDisplayAnswer = q.correta || '';
    } else {
      // Verdadeiro ou Falso
      const allCorrect = q.afirmativas?.every(af => {
        const userAf = userAnswer?.statements?.find(s => s.id === af.id);
        return userAf?.answer === af.correta;
      });
      isCorrect = !!allCorrect;
      
      userDisplayAnswer = userAnswer?.statements?.map(s => s.answer ? 'V' : 'F').join(', ') || 'Não respondida';
      correctDisplayAnswer = q.afirmativas?.map(af => af.correta ? 'V' : 'F').join(', ') || '';
    }

    return {
      questionId: q.id,
      enunciado: q.enunciado,
      isCorrect,
      userAnswer: userDisplayAnswer,
      correctAnswer: correctDisplayAnswer,
      explanation: q.explicacao,
      assunto: q.assunto,
      feedback: isCorrect 
        ? "Excelente! Você compreendeu bem o comando da questão e o assunto abordado." 
        : "Houve um equívoco na interpretação ou no conhecimento técnico. Revise a explicação detalhada.",
      alternativas: q.alternativas,
      sourceMode: q.sourceMode,
      banca: q.banca,
      ano: q.ano,
      concursoReferencia: q.concursoReferencia
    };
  });

  const correctCount = results.filter(r => r.isCorrect).length;
  const totalCount = exam.questoes.length;
  const score = (correctCount / totalCount) * 100;
  
  let performanceLevel: any = 'Insuficiente';
  if (score >= 90) performanceLevel = 'Excelente';
  else if (score >= 75) performanceLevel = 'Bom';
  else if (score >= 50) performanceLevel = 'Regular';
  else if (score >= 30) performanceLevel = 'Insuficiente';
  else performanceLevel = 'Crítico';

  return {
    summary: {
      totalQuestions: totalCount,
      correctAnswers: correctCount,
      incorrectAnswers: totalCount - correctCount,
      score,
      performanceLevel,
      timeSpent
    },
    results,
    analysis: {
      strengths: [
        "Domínio de conceitos fundamentais da matéria",
        "Boa velocidade de raciocínio e resolução",
        "Atenção aos detalhes nos enunciados complexos"
      ],
      weaknesses: [
        "Dificuldade em tópicos específicos de legislação",
        "Erros em questões que exigem memorização de prazos",
        "Necessidade de aprofundamento em jurisprudência"
      ],
      recommendations: [
        "Revisar os tópicos onde houve erro através de mapas mentais",
        "Focar na leitura da 'lei seca' para os assuntos deste simulado",
        "Realizar um novo simulado focado apenas nos assuntos com erro em 48h",
        "Assistir videoaulas de reforço sobre os temas de maior peso"
      ]
    }
  };
}
