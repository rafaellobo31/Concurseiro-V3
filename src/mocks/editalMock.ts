import { EditalAnalysis } from '../types/edital';

export const MOCK_EDITAL_ANALYSIS: EditalAnalysis = {
  concurso: "Banco do Brasil 2025",
  orgao: "Banco do Brasil S.A.",
  cargo: "Agente Comercial",
  banca: "Cesgranrio",
  escolaridade: "Nível Médio",
  materias: [
    {
      nome: "Língua Portuguesa",
      topicos: ["Compreensão e interpretação de textos", "Ortografia oficial", "Morfologia", "Sintaxe"]
    },
    {
      nome: "Conhecimentos Bancários",
      topicos: ["Sistema Financeiro Nacional", "Produtos Bancários", "Garantias do Sistema Financeiro Nacional"]
    },
    {
      nome: "Vendas e Negociação",
      topicos: ["Noções de Estratégia Empresarial", "Atendimento ao Cliente", "Ética e Compliance"]
    }
  ],
  observacoes: [
    "Presença de redação de caráter eliminatório",
    "Forte ênfase em conhecimentos bancários e atendimento",
    "Cobrança de legislação específica sobre sigilo bancário"
  ],
  prioridades: [
    { materia: "Conhecimentos Bancários", peso: "alto" },
    { materia: "Vendas e Negociação", peso: "alto" },
    { materia: "Língua Portuguesa", peso: "médio" }
  ]
};
