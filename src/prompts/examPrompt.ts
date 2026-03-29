import { ExamInput, ExamOutput } from '../types/exam.js';

export const EXAM_SYSTEM_INSTRUCTION = `
Você é um especialista sênior em concursos públicos brasileiros, especializado em análise de provas anteriores e engenharia reversa de bancas examinadoras (como FGV, CESPE/Cebraspe, FCC, VUNESP).

Sua tarefa é gerar um simulado de alta fidelidade baseado estritamente em padrões de provas anteriores.

Diretrizes de Geração:
1. Aderência Estrita: Se um Cargo/Área for solicitado, TODAS as questões geradas devem ser específicas para esse cargo. É PROIBIDO gerar questões que mencionem ou sejam baseadas em cargos diferentes do solicitado (ex: se o usuário pediu "Agente Comercial", não gere questões de "Escriturário").
2. Análise de Padrões: Analise o concurso, cargo e banca solicitados. Identifique os temas mais recorrentes, o "tom" das questões e as armadilhas comuns da banca para aquele cargo específico.
3. Inspiração Real e Coerente: Gere questões que pareçam ter sido retiradas de uma prova real para o CARGO solicitado. Se usar uma prova de outro concurso como inspiração, adapte os metadados para que o cargo seja omitido ou seja idêntico ao solicitado, evitando confusão.
4. Metadados Obrigatórios: Cada questão DEVE conter uma referência de banca, ano e concurso. O campo "concursoReferencia" deve ser coerente com o cargo. Se o cargo da prova original for diferente do solicitado, use um cabeçalho neutro ou adapte.
5. Qualidade das Alternativas: As alternativas incorretas (distratores) devem ser plausíveis, baseadas em erros comuns de candidatos ou interpretações equivocadas da lei/doutrina para o nível do cargo.
6. Explicação Pedagógica: A explicação deve ser clara, citando a base legal ou doutrinária quando aplicável.

Regras de Formato:
- Retorne APENAS um JSON válido.
- Não use markdown no JSON.
- Respeite o nível de dificuldade solicitado.
- Para múltipla escolha, use sempre 5 alternativas (A a E).
`;

/**
 * Constrói dinamicamente o prompt de geração de simulados.
 */
export function buildExamPrompt(input: ExamInput): string {
  const { modo, concurso, orgao, cargo, materia, banca, tipoQuestao, quantidade, nivel, nivelEscolaridade } = input;

  return `
Gere um simulado com as seguintes características:

PARÂMETROS:
- Modo: ${modo}
- Concurso Alvo: ${concurso || 'Geral'}
- Órgão: ${orgao || 'N/A'}
- Cargo/Área: ${cargo || 'N/A'}
- Nível de Escolaridade: ${nivelEscolaridade || 'N/A'}
- Matéria: ${materia || 'N/A'}
- Banca de Referência: ${banca || 'Definir baseada no concurso'}
- Tipo de Questão: ${tipoQuestao}
- Quantidade: ${quantidade}
- Nível de Dificuldade: ${nivel}

REQUISITOS ADICIONAIS:
- RIGOR TOTAL AO CARGO: Se o cargo solicitado for "${cargo}", todas as questões devem ser pertinentes a este cargo. Não mencione outros cargos (como Escriturário, Analista, etc) se eles não foram os solicitados.
- Se a questão for inspirada em uma prova de outro cargo, você DEVE omitir o nome do cargo original nos metadados ou adaptá-lo para "${cargo}".
- Cada questão deve ter os campos "banca", "ano" e "concursoReferencia" preenchidos. No campo "concursoReferencia", use o formato "Concurso - Órgão" e evite incluir cargos divergentes.

FORMATO DO JSON:
{
  "tituloSimulado": "Título profissional do simulado",
  "descricao": "Descrição detalhada mencionando a banca e o foco das questões",
  "modo": "${modo}",
  "concurso": "${concurso || ''}",
  "orgao": "${orgao || ''}",
  "cargo": "${cargo || ''}",
  "nivelEscolaridade": "${nivelEscolaridade || ''}",
  "materia": "${materia || ''}",
  "banca": "${banca || ''}",
  "nivel": "${nivel}",
  "tipoQuestao": "${tipoQuestao}",
  "questoes": [
    {
      "id": 1,
      "enunciado": "Enunciado da questão no estilo da banca...",
      "tipo": "${tipoQuestao}",
      "banca": "Nome da Banca (ex: FGV)",
      "ano": 2023,
      "concursoReferencia": "Nome do Concurso (ex: Senado Federal)",
      "assunto": "Tópico específico",
      "peso": "medio",
      ${tipoQuestao === 'multipla_escolha' ? `
      "alternativas": [
        { "letra": "A", "texto": "..." },
        { "letra": "B", "texto": "..." },
        { "letra": "C", "texto": "..." },
        { "letra": "D", "texto": "..." },
        { "letra": "E", "texto": "..." }
      ],
      "correta": "A",` : `
      "afirmativas": [
        { "id": 1, "texto": "...", "correta": true },
        { "id": 2, "texto": "...", "correta": false }
      ],`}
      "explicacao": "Explicação técnica e didática..."
    }
  ]
}
`;
}
