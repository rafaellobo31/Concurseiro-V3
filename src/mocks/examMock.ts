import { ExamInput, ExamOutput, ExamQuestion } from '../types/exam';
import { QUESTION_BANK, DEFAULT_QUESTIONS, MockQuestion } from './questionBankMock';

/**
 * Gera um simulado mockado para testes e preview com questões realistas.
 */
export function generateMockExam(input: ExamInput): ExamOutput {
  const { modo, concurso, orgao, cargo, materia, banca, tipoQuestao, quantidade, nivel, nivelEscolaridade } = input;

  const tituloSimulado = modo === 'concurso' 
    ? `Simulado Preparatório: ${concurso || 'Geral'}`
    : `Treino de Matéria: ${materia || 'Geral'}`;

  // Forçamos o sourceMode para 'previous_exam_based'
  const effectiveSourceMode = 'previous_exam_based';

  const prefixoDescricao = 'Simulado baseado em questões de provas anteriores.';

  const descricao = `${prefixoDescricao} Nível ${nivel}. Foco em ${materia || cargo || concurso || 'conhecimentos gerais'}${banca ? ` seguindo o estilo da banca ${banca}` : ''}.${nivelEscolaridade ? ` Nível exigido: ${nivelEscolaridade}.` : ''}`;

  // Selecionar base de questões
  let baseQuestoes: MockQuestion[] = [];
  
  if (modo === 'materia' && materia && QUESTION_BANK[materia]) {
    baseQuestoes = QUESTION_BANK[materia];
  } else if (modo === 'concurso' && cargo) {
    // Tentar mapear cargo para matérias relevantes (simplificado)
    if (cargo.toLowerCase().includes('bancário') || cargo.toLowerCase().includes('escriturário')) {
      baseQuestoes = [...(QUESTION_BANK['Conhecimentos Bancários'] || []), ...(QUESTION_BANK['Atendimento ao Cliente'] || []), ...(QUESTION_BANK['Português'] || [])];
    } else if (cargo.toLowerCase().includes('polícia') || cargo.toLowerCase().includes('soldado')) {
      baseQuestoes = [...(QUESTION_BANK['Segurança Pública'] || []), ...(QUESTION_BANK['Direito Administrativo'] || []), ...(QUESTION_BANK['Português'] || [])];
    }
  }

  // Se não encontrou base específica ou é insuficiente, usa a base geral
  if (baseQuestoes.length === 0) {
    baseQuestoes = DEFAULT_QUESTIONS;
  }

  // Filtramos as que têm metadados se possível
  const comMetadados = baseQuestoes.filter(q => q.banca && q.ano);
  if (comMetadados.length > 0) {
    baseQuestoes = comMetadados;
  }

  // Embaralhar e selecionar a quantidade solicitada
  const shuffled = [...baseQuestoes].sort(() => 0.5 - Math.random());
  const selectedMockQuestions = shuffled.slice(0, Math.min(quantidade, shuffled.length));

  // Se ainda faltarem questões (quantidade > base), repetir ou gerar genéricas melhores
  const questoes: ExamQuestion[] = Array.from({ length: quantidade }).map((_, index) => {
    const mockQ = selectedMockQuestions[index % selectedMockQuestions.length];
    const id = index + 1;
    const isTF = tipoQuestao === 'verdadeiro_falso';

    const questao: ExamQuestion = {
      id,
      enunciado: mockQ ? mockQ.text : `Considere os princípios fundamentais do ${materia || 'Direito'} e assinale a alternativa que descreve corretamente a aplicação da norma no contexto administrativo contemporâneo.`,
      tipo: tipoQuestao,
      assunto: mockQ ? mockQ.topic : (materia || cargo || 'Conhecimentos Gerais'),
      peso: nivel === 'facil' ? 'baixo' : nivel === 'medio' ? 'medio' : 'alto',
      explicacao: mockQ ? mockQ.explanation : `Esta questão aborda conceitos fundamentais de ${materia || 'conhecimentos gerais'}. A alternativa correta reflete a interpretação predominante na doutrina e jurisprudência para este tema.`,
      // Metadados obrigatórios
      sourceMode: effectiveSourceMode,
      banca: mockQ?.banca || banca || 'Banca Geral',
      ano: mockQ?.ano || 2023,
      concursoReferencia: mockQ?.concursoReferencia || concurso || 'Concurso Geral'
    };

    if (isTF) {
      questao.afirmativas = [
        { id: 1, texto: mockQ ? `O conceito de ${mockQ.topic} aplica-se integralmente ao caso apresentado.` : "Afirmativa que descreve um conceito correto sobre o tema.", correta: true },
        { id: 2, texto: "A jurisprudência atual veda a aplicação retroativa desta norma em qualquer hipótese.", correta: false },
        { id: 3, texto: "O princípio da legalidade deve ser observado rigorosamente em todos os atos descritos.", correta: true }
      ];
    } else {
      const letras = ['A', 'B', 'C', 'D', 'E'];
      if (mockQ) {
        questao.alternativas = mockQ.options.map((opt, i) => ({
          letra: letras[i],
          texto: opt
        }));
        questao.correta = letras[mockQ.correctAnswer];
      } else {
        questao.alternativas = [
          { letra: 'A', texto: 'Apresenta uma interpretação restritiva que não se aplica ao caso.' },
          { letra: 'B', texto: 'Alternativa correta que reflete a literalidade da norma vigente.' },
          { letra: 'C', texto: 'Utiliza termos ambíguos para tentar induzir o candidato ao erro.' },
          { letra: 'D', texto: 'Inverte a relação de causa e efeito estabelecida no enunciado.' },
          { letra: 'E', texto: 'Extrapola o comando da questão ao incluir temas não solicitados.' }
        ];
        questao.correta = 'B';
      }
    }

    return questao;
  });

  return {
    tituloSimulado,
    descricao,
    modo,
    concurso: concurso || 'N/A',
    orgao: orgao || 'N/A',
    cargo: cargo || 'N/A',
    nivelEscolaridade: nivelEscolaridade || 'N/A',
    materia: materia || 'N/A',
    banca: banca || 'N/A',
    nivel,
    tipoQuestao,
    questoes
  };
}
