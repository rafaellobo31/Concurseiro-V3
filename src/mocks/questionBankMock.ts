export interface MockQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // 0-4 for A-E
  explanation: string;
  subject: string;
  topic: string;
  // Metadados para questões baseadas em provas anteriores
  banca?: string;
  ano?: number;
  concursoReferencia?: string;
}

export const QUESTION_BANK: Record<string, MockQuestion[]> = {
  'Português': [
    {
      id: 'pt-1',
      text: 'Assinale a alternativa em que a concordância verbal está em conformidade com a norma-padrão da língua portuguesa:',
      options: [
        'Fazem dez anos que não visito minha cidade natal.',
        'Houveram muitos incidentes durante a manifestação de ontem.',
        'Devem haver soluções mais simples para este problema complexo.',
        'Tratam-se de questões fundamentais para o desenvolvimento do projeto.',
        'Mais de um aluno faltou à aula de revisão para o concurso.'
      ],
      correctAnswer: 4,
      explanation: 'A expressão "Mais de um" exige o verbo no singular, a menos que haja reciprocidade ou repetição. As outras alternativas apresentam erros comuns: "Fazer" indicando tempo decorrido é impessoal (deve ser "Faz"); "Haver" no sentido de existir é impessoal (deve ser "Houve" e "Deve haver"); "Tratar-se" com preposição é impessoal (deve ser "Trata-se").',
      subject: 'Português',
      topic: 'Concordância Verbal',
      banca: 'FGV',
      ano: 2022,
      concursoReferencia: 'TJ-SP'
    },
    {
      id: 'pt-2',
      text: 'No trecho "O candidato estava otimista, conquanto soubesse da dificuldade da prova", a conjunção em destaque estabelece relação de:',
      options: [
        'Causa',
        'Consequência',
        'Concessão',
        'Condição',
        'Adição'
      ],
      correctAnswer: 2,
      explanation: '"Conquanto" é uma conjunção subordinativa concessiva, introduzindo uma ideia que se opõe à principal sem impedi-la.',
      subject: 'Português',
      topic: 'Conjunções',
      banca: 'VUNESP',
      ano: 2021,
      concursoReferencia: 'PC-SP'
    },
    {
      id: 'pt-3',
      text: 'Assinale a alternativa em que o uso da crase está CORRETO:',
      options: [
        'O documento foi entregue à ele pessoalmente.',
        'Estamos dispostos à colaborar com a nova equipe.',
        'Referiu-se à situações que já foram resolvidas.',
        'O palestrante chegou à uma conclusão surpreendente.',
        'O acesso à informação é um direito fundamental.'
      ],
      correctAnswer: 4,
      explanation: 'A crase ocorre antes de substantivos femininos determinados pelo artigo "a". Não ocorre antes de pronomes masculinos (ele), verbos (colaborar), palavras no plural sem artigo (situações) ou artigo indefinido (uma).',
      subject: 'Português',
      topic: 'Crase',
      banca: 'FCC',
      ano: 2023,
      concursoReferencia: 'TRT-2'
    }
  ],
  'Direito Administrativo': [
    {
      id: 'da-1',
      text: 'Sobre os poderes da Administração Pública, o poder que permite à autoridade superior remover atribuições de um subordinado é o:',
      options: [
        'Poder Regulamentar',
        'Poder Hierárquico',
        'Poder Disciplinar',
        'Poder de Polícia',
        'Poder Discricionário'
      ],
      correctAnswer: 1,
      explanation: 'O Poder Hierárquico é o que estabelece relações de subordinação e coordenação, permitindo delegar e avocar atribuições, além de dar ordens e fiscalizar.',
      subject: 'Direito Administrativo',
      topic: 'Poderes Administrativos',
      banca: 'CESPE/Cebraspe',
      ano: 2021,
      concursoReferencia: 'PF'
    },
    {
      id: 'da-2',
      text: 'A extinção de um ato administrativo legítimo por razões de conveniência e oportunidade denomina-se:',
      options: [
        'Anulação',
        'Cassação',
        'Revogação',
        'Caducidade',
        'Contraposição'
      ],
      correctAnswer: 2,
      explanation: 'A revogação é o desfazimento de um ato administrativo válido por razões de mérito (conveniência e oportunidade), enquanto a anulação ocorre por ilegalidade.',
      subject: 'Direito Administrativo',
      topic: 'Atos Administrativos',
      banca: 'FGV',
      ano: 2023,
      concursoReferencia: 'Receita Federal'
    }
  ],
  'Informática': [
    {
      id: 'inf-1',
      text: 'No Microsoft Excel, a função utilizada para somar valores em um intervalo que atendem a um critério específico é:',
      options: [
        'SOMAR',
        'SOMA.SE',
        'CONT.SE',
        'PROCV',
        'MÉDIA'
      ],
      correctAnswer: 1,
      explanation: 'A função SOMA.SE (ou SUMIF em inglês) adiciona as células especificadas por um determinado critério ou condição.',
      subject: 'Informática',
      topic: 'Planilhas Eletrônicas'
    },
    {
      id: 'inf-2',
      text: 'Qual dos seguintes protocolos é utilizado para o envio de e-mails na internet?',
      options: [
        'HTTP',
        'FTP',
        'SMTP',
        'POP3',
        'IMAP'
      ],
      correctAnswer: 2,
      explanation: 'O SMTP (Simple Mail Transfer Protocol) é o protocolo padrão para envio de e-mails. POP3 e IMAP são utilizados para recebimento.',
      subject: 'Informática',
      topic: 'Redes de Computadores'
    }
  ],
  'Raciocínio Lógico': [
    {
      id: 'rl-1',
      text: 'Considere a proposição: "Se estudo, então passo no concurso". A negação lógica dessa proposição é:',
      options: [
        'Se não estudo, então não passo no concurso.',
        'Estudo e não passo no concurso.',
        'Não estudo ou passo no concurso.',
        'Se passo no concurso, então estudo.',
        'Não estudo e não passo no concurso.'
      ],
      correctAnswer: 1,
      explanation: 'A negação de uma condicional (p -> q) é dada por (p ^ ~q), ou seja, mantém-se a primeira parte e nega-se a segunda.',
      subject: 'Raciocínio Lógico',
      topic: 'Lógica Proposicional'
    }
  ],
  'Conhecimentos Bancários': [
    {
      id: 'cb-1',
      text: 'O órgão responsável por formular a política da moeda e do crédito no Brasil, objetivando a estabilidade da moeda e o desenvolvimento econômico, é o:',
      options: [
        'Banco Central do Brasil (BCB)',
        'Conselho Monetário Nacional (CMN)',
        'Comissão de Valores Mobiliários (CVM)',
        'Banco do Brasil (BB)',
        'Ministério da Fazenda'
      ],
      correctAnswer: 1,
      explanation: 'O CMN é o órgão deliberativo máximo do Sistema Financeiro Nacional, responsável por fixar as diretrizes das políticas monetária, creditícia e cambial.',
      subject: 'Conhecimentos Bancários',
      topic: 'Sistema Financeiro Nacional'
    }
  ],
  'Atendimento ao Cliente': [
    {
      id: 'ac-1',
      text: 'No contexto de vendas e atendimento, a técnica que consiste em oferecer um produto complementar ao que o cliente está adquirindo é chamada de:',
      options: [
        'Upselling',
        'Cross-selling',
        'Telemarketing',
        'Pós-venda',
        'CRM'
      ],
      correctAnswer: 1,
      explanation: 'Cross-selling (venda cruzada) é a oferta de produtos relacionados ou complementares. Upselling é incentivar o cliente a comprar uma versão mais cara ou premium do mesmo produto.',
      subject: 'Atendimento ao Cliente',
      topic: 'Técnicas de Vendas'
    }
  ],
  'Segurança Pública': [
    {
      id: 'sp-1',
      text: 'De acordo com a Constituição Federal, a segurança pública é dever do Estado, direito e responsabilidade de todos, sendo exercida para a preservação da ordem pública e da incolumidade das pessoas e do patrimônio, através dos seguintes órgãos, EXCETO:',
      options: [
        'Polícia Federal',
        'Polícia Rodoviária Federal',
        'Polícias Civis',
        'Guardas Municipais',
        'Polícias Militares e Corpos de Bombeiros Militares'
      ],
      correctAnswer: 3,
      explanation: 'Embora as Guardas Municipais contribuam para a segurança, o Art. 144 da CF lista taxativamente os órgãos de segurança pública, e as guardas são mencionadas em parágrafo à parte, não compondo o rol principal dos órgãos policiais.',
      subject: 'Segurança Pública',
      topic: 'Constituição Federal'
    }
  ],
  'Matemática': [
    {
      id: 'mat-1',
      text: 'Um capital de R$ 2.000,00 foi aplicado a juros simples com uma taxa de 2% ao mês durante 5 meses. O montante final dessa aplicação foi de:',
      options: [
        'R$ 2.100,00',
        'R$ 2.200,00',
        'R$ 2.300,00',
        'R$ 2.400,00',
        'R$ 2.500,00'
      ],
      correctAnswer: 1,
      explanation: 'Juros = C * i * t = 2000 * 0,02 * 5 = 200. Montante = Capital + Juros = 2000 + 200 = 2200.',
      subject: 'Matemática',
      topic: 'Juros Simples'
    }
  ]
};

export const DEFAULT_QUESTIONS: MockQuestion[] = Object.values(QUESTION_BANK).flat();
