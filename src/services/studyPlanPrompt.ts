import { StudyPlanInput } from '../types/studyPlan';

export const getStudyPlanPrompt = (input: StudyPlanInput) => {
  const performanceInfo = input.performanceData ? `
    DADOS REAIS DE DESEMPENHO DO USUÁRIO:
    - Média Geral de Acertos: ${input.performanceData.mediaGeral.toFixed(1)}%
    - Desempenho por Matéria: ${input.performanceData.desempenhoPorMateria.map(m => `${m.materia}: ${m.percentual.toFixed(1)}% (${m.acertos}/${m.totalQuestoes})`).join(', ')}
    - Assuntos Críticos (Maior Erro): ${input.performanceData.assuntosCriticos.map(a => `${a.assunto}: ${a.percentual.toFixed(1)}% acerto, ${a.erros} erros`).join(', ')}
  ` : 'O usuário ainda não possui dados de desempenho suficientes. Gere um plano baseado em pesos padrão para o concurso informado.';

  return `
    Você é um especialista em preparação para concursos públicos com experiência em planejamento estratégico de estudos utilizado por grandes instituições educacionais.
    Sua tarefa é criar um plano de estudos altamente profissional, personalizado e ESTRATÉGICO para um candidato.

    CONTEXTO DO CANDIDATO:
    - Concurso: ${input.concurso}
    - Horas disponíveis por dia: ${input.hoursPerDay}
    - Dias de estudo por semana: ${input.daysPerWeek}
    - Tempo restante até a prova: ${input.timeUntilExam}

    ${performanceInfo}

    OBJETIVOS DO PLANO:
    1. Priorizar matérias com menor desempenho (percentual baixo).
    2. Manter revisão constante das matérias com bom desempenho (percentual alto).
    3. Distribuir a carga horária de forma equilibrada, sem sobrecarga.
    4. Incluir momentos obrigatórios de simulado (pelo menos 1 por semana se o tempo permitir).
    5. Incluir momentos de revisão (diária ou semanal).

    ESTRUTURA DO PLANO (JSON):
    O plano deve ser retornado estritamente no seguinte formato JSON:
    {
      "prioridades": [
        { "materia": "Nome da Matéria", "nivelPrioridade": "Alta|Média|Baixa", "motivo": "Explicação pedagógica baseada no desempenho" }
      ],
      "planoSemanal": [
        {
          "dia": "Segunda-feira",
          "atividades": [
            { "materia": "Nome da Matéria", "tempo": "1h 30min", "tipo": "teoria|revisão|simulado" }
          ]
        }
      ],
      "recomendacoes": [
        "Texto pedagógico curto e direto com dica de estudo"
      ]
    }

    REGRAS:
    1. Não escreva texto fora do JSON.
    2. Use linguagem didática, profissional e motivadora.
    3. Adapte o tempo das atividades à disponibilidade real do usuário (${input.hoursPerDay}h/dia).
    4. Se houver assuntos críticos, mencione-os nos motivos das prioridades ou recomendações.
  `;
};

export const STUDY_PLAN_SYSTEM_INSTRUCTION = `
  Você é um especialista em preparação para concursos públicos com experiência em planejamento estratégico de estudos utilizado por grandes instituições educacionais.
  Sua tarefa é criar um plano de estudos altamente profissional e personalizado para um candidato.
  O plano precisa ter profundidade estratégica, organização clara e orientação prática.
  Responda estritamente em JSON seguindo o esquema fornecido.
`;
