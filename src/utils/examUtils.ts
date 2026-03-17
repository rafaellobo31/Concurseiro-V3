import { ExamQuestion, ExamInput } from '../types/exam';

/**
 * Verifica se uma questão é compatível com a seleção do usuário.
 * Retorna false se houver uma divergência crítica que não pode ser sanitizada.
 */
export function isQuestionCompatibleWithSelection(q: ExamQuestion, input: ExamInput): boolean {
  const targetCargo = input.cargo?.toLowerCase() || '';
  const targetConcurso = input.concurso?.toLowerCase() || '';
  
  if (!targetCargo && !targetConcurso) return true;

  const enunciado = q.enunciado.toLowerCase();
  const ref = q.concursoReferencia.toLowerCase();

  // Lista de cargos "rivais" ou muito diferentes que indicariam erro grave de contexto
  // Se o usuário quer Banco do Brasil (Bancário) e vem algo de Polícia, é incompatível.
  const contexts = [
    { name: 'bancário', keywords: ['banco', 'escriturário', 'caixa', 'bancário', 'agente comercial', 'investimentos'] },
    { name: 'policial', keywords: ['polícia', 'soldado', 'delegado', 'escrivão', 'investigador', 'militar', 'penal'] },
    { name: 'tribunal', keywords: ['tribunal', 'tj', 'trf', 'tre', 'trt', 'analista judiciário', 'técnico judiciário', 'juiz'] },
    { name: 'fiscal', keywords: ['receita', 'fiscal', 'auditor', 'sefaz', 'iss'] }
  ];

  const targetContext = contexts.find(c => c.keywords.some(k => targetCargo.includes(k) || targetConcurso.includes(k)));
  
  if (targetContext) {
    // Se identificamos um contexto alvo, verificamos se a questão pertence a um contexto oposto
    const otherContexts = contexts.filter(c => c.name !== targetContext.name);
    for (const other of otherContexts) {
      // Se a referência da questão menciona explicitamente um cargo de outro contexto
      if (other.keywords.some(k => ref.includes(k))) {
        // Divergência crítica de contexto (ex: pediu Banco, veio Polícia)
        return false;
      }
    }
  }

  return true;
}

/**
 * Sanitiza os metadados de uma questão para garantir que o cabeçalho seja neutro e aderente.
 */
export function sanitizeQuestionMetadata(q: ExamQuestion, input: ExamInput): ExamQuestion {
  const targetCargo = input.cargo || '';
  const targetConcurso = input.concurso || '';
  
  let cleanedConcursoReferencia = q.concursoReferencia;
  const targetCargoLower = targetCargo.toLowerCase();

  // Lista de cargos comuns que costumam aparecer por engano
  const commonCargos = [
    'escriturário', 'analista', 'técnico', 'perito', 
    'agente de tecnologia', 'agente comercial', 'soldado', 
    'oficial', 'delegado', 'escrivão', 'investigador'
  ];
  
  // Filtramos os cargos que NÃO são o solicitado
  const otherCargos = commonCargos.filter(c => 
    targetCargoLower && !targetCargoLower.includes(c) && !c.includes(targetCargoLower)
  );

  // 1. Limpeza do Concurso de Referência (Cabeçalho)
  otherCargos.forEach(c => {
    const regex = new RegExp(`\\b${c}\\b`, 'gi');
    
    if (regex.test(cleanedConcursoReferencia)) {
      const separators = [' - ', ' – ', ' — ', ' / ', ' | '];
      let replaced = false;
      
      for (const sep of separators) {
        const sepRegex = new RegExp(`${sep}${c}`, 'gi');
        if (sepRegex.test(cleanedConcursoReferencia)) {
          cleanedConcursoReferencia = cleanedConcursoReferencia.replace(sepRegex, '');
          replaced = true;
          break;
        }
      }
      
      if (!replaced) {
        cleanedConcursoReferencia = cleanedConcursoReferencia.replace(regex, '');
      }
    }
  });

  // 2. Garantir que o cabeçalho seja limpo e profissional
  // Se após a limpeza o cabeçalho ficou vazio ou estranho, usamos um padrão neutro
  if (!cleanedConcursoReferencia.trim() || cleanedConcursoReferencia.length < 3) {
    cleanedConcursoReferencia = targetConcurso || 'Simulado Preparatório';
  }

  // 3. Limpeza do Enunciado (opcional, mas recomendado para evitar menções diretas a cargos errados)
  let cleanedEnunciado = q.enunciado;
  if (targetCargo) {
    otherCargos.forEach(c => {
      const regex = new RegExp(`\\b${c}\\b`, 'gi');
      if (regex.test(cleanedEnunciado)) {
        cleanedEnunciado = cleanedEnunciado.replace(regex, targetCargo);
      }
    });
  }

  return {
    ...q,
    enunciado: cleanedEnunciado,
    concursoReferencia: cleanedConcursoReferencia.trim()
  };
}

/**
 * Função principal que aplica validação e sanitização em lote.
 */
export function validateAndCleanQuestions(questoes: ExamQuestion[], input: ExamInput): ExamQuestion[] {
  return questoes
    .filter(q => isQuestionCompatibleWithSelection(q, input))
    .map(q => sanitizeQuestionMetadata(q, input));
}
