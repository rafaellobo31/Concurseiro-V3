import { CategoriaConcurso } from '../types/concurso';

export const CONCURSOS_CATEGORIAS_MOCK: CategoriaConcurso[] = [
  {
    id: 'bancos',
    nome: 'Bancos',
    concursos: [
      {
        id: 'bb',
        nome: 'Banco do Brasil',
        sigla: 'BB',
        cargos: [
          { id: 'agente-comercial', nome: 'Agente Comercial' },
          { id: 'agente-tecnologia', nome: 'Agente de Tecnologia' }
        ],
        bancasSugeridas: ['Cesgranrio']
      },
      {
        id: 'caixa',
        nome: 'Caixa Econômica Federal',
        sigla: 'CEF',
        cargos: [
          { id: 'tecnico-bancario', nome: 'Técnico Bancário' },
          { id: 'tecnico-bancario-ti', nome: 'Técnico Bancário TI' },
          { id: 'engenheiro', nome: 'Engenheiro' }
        ],
        bancasSugeridas: ['Cesgranrio']
      },
      {
        id: 'bacen',
        nome: 'Banco Central (BACEN)',
        sigla: 'BACEN',
        cargos: [
          { id: 'analista', nome: 'Analista' },
          { id: 'tecnico', nome: 'Técnico' },
          { id: 'procurador', nome: 'Procurador' }
        ],
        bancasSugeridas: ['Cebraspe']
      },
      {
        id: 'bndes',
        nome: 'BNDES',
        sigla: 'BNDES',
        cargos: [
          { id: 'analista', nome: 'Analista' },
          { id: 'tecnico', nome: 'Técnico' }
        ],
        bancasSugeridas: ['Cesgranrio']
      }
    ]
  },
  {
    id: 'seguranca-publica',
    nome: 'Segurança Pública',
    concursos: [
      {
        id: 'pf',
        nome: 'Polícia Federal',
        sigla: 'PF',
        cargos: [
          { id: 'agente', nome: 'Agente' },
          { id: 'escrivao', nome: 'Escrivão' },
          { id: 'papiloscopista', nome: 'Papiloscopista' },
          { id: 'perito-criminal', nome: 'Perito Criminal' },
          { id: 'administrativo', nome: 'Administrativo' }
        ],
        bancasSugeridas: ['Cebraspe']
      },
      {
        id: 'prf',
        nome: 'Polícia Rodoviária Federal',
        sigla: 'PRF',
        cargos: [
          { id: 'policial-rodoviario', nome: 'Policial Rodoviário Federal' }
        ],
        bancasSugeridas: ['Cebraspe']
      },
      {
        id: 'depen',
        nome: 'Polícia Penal Federal',
        sigla: 'DEPEN',
        cargos: [
          { id: 'policial-penal', nome: 'Policial Penal' }
        ],
        bancasSugeridas: ['Cebraspe']
      },
      {
        id: 'pc',
        nome: 'Polícias Civis Estaduais',
        sigla: 'PC',
        cargos: [
          { id: 'investigador', nome: 'Investigador' },
          { id: 'escrivao', nome: 'Escrivão' },
          { id: 'delegado', nome: 'Delegado' },
          { id: 'perito', nome: 'Perito' }
        ]
      },
      {
        id: 'pm',
        nome: 'Polícias Militares',
        sigla: 'PM',
        cargos: [
          { id: 'soldado', nome: 'Soldado' },
          { id: 'oficial', nome: 'Oficial' }
        ]
      },
      {
        id: 'cbm',
        nome: 'Corpo de Bombeiros',
        sigla: 'CBM',
        cargos: [
          { id: 'soldado', nome: 'Soldado' },
          { id: 'oficial', nome: 'Oficial' }
        ]
      }
    ]
  },
  {
    id: 'tribunais',
    nome: 'Tribunais',
    concursos: [
      {
        id: 'trf',
        nome: 'Tribunais Regionais Federais (TRF)',
        sigla: 'TRF',
        cargos: [
          { id: 'tecnico-judiciario', nome: 'Técnico Judiciário' },
          { id: 'analista-judiciario', nome: 'Analista Judiciário' }
        ]
      },
      {
        id: 'trt',
        nome: 'Tribunais Regionais do Trabalho (TRT)',
        sigla: 'TRT',
        cargos: [
          { id: 'tecnico-judiciario', nome: 'Técnico Judiciário' },
          { id: 'analista-judiciario', nome: 'Analista Judiciário' }
        ]
      },
      {
        id: 'tj',
        nome: 'Tribunais de Justiça (TJ)',
        sigla: 'TJ',
        cargos: [
          { id: 'tecnico-judiciario', nome: 'Técnico Judiciário' },
          { id: 'analista-judiciario', nome: 'Analista Judiciário' }
        ]
      },
      {
        id: 'tse',
        nome: 'Tribunal Superior Eleitoral (TSE)',
        sigla: 'TSE',
        cargos: [
          { id: 'tecnico-judiciario', nome: 'Técnico Judiciário' },
          { id: 'analista-judiciario', nome: 'Analista Judiciário' }
        ]
      },
      {
        id: 'tre',
        nome: 'Tribunais Regionais Eleitorais (TRE)',
        sigla: 'TRE',
        cargos: [
          { id: 'tecnico-judiciario', nome: 'Técnico Judiciário' },
          { id: 'analista-judiciario', nome: 'Analista Judiciário' }
        ]
      },
      {
        id: 'tcu',
        nome: 'Tribunal de Contas da União (TCU)',
        sigla: 'TCU',
        cargos: [
          { id: 'auditor', nome: 'Auditor' },
          { id: 'tecnico', nome: 'Técnico' }
        ]
      },
      {
        id: 'tce',
        nome: 'Tribunais de Contas Estaduais (TCE)',
        sigla: 'TCE',
        cargos: [
          { id: 'auditor', nome: 'Auditor' },
          { id: 'tecnico', nome: 'Técnico' }
        ]
      }
    ]
  },
  {
    id: 'controle-fiscalizacao',
    nome: 'Controle e Fiscalização',
    concursos: [
      {
        id: 'rfb',
        nome: 'Receita Federal',
        sigla: 'RFB',
        cargos: [
          { id: 'auditor-fiscal', nome: 'Auditor Fiscal' },
          { id: 'analista-tributario', nome: 'Analista Tributário' }
        ]
      },
      {
        id: 'cgu',
        nome: 'Controladoria Geral da União (CGU)',
        sigla: 'CGU',
        cargos: [
          { id: 'auditor-federal', nome: 'Auditor Federal' }
        ]
      },
      {
        id: 'abin',
        nome: 'Agência Brasileira de Inteligência (ABIN)',
        sigla: 'ABIN',
        cargos: [
          { id: 'oficial-inteligencia', nome: 'Oficial de Inteligência' },
          { id: 'agente-inteligencia', nome: 'Agente de Inteligência' }
        ]
      },
      {
        id: 'cvm',
        nome: 'Comissão de Valores Mobiliários (CVM)',
        sigla: 'CVM',
        cargos: [
          { id: 'analista', nome: 'Analista' }
        ]
      },
      {
        id: 'susep',
        nome: 'Superintendência de Seguros Privados (SUSEP)',
        sigla: 'SUSEP',
        cargos: [
          { id: 'analista', nome: 'Analista' }
        ]
      }
    ]
  },
  {
    id: 'administrativo-federal',
    nome: 'Administrativo Federal',
    concursos: [
      {
        id: 'inss',
        nome: 'INSS',
        sigla: 'INSS',
        cargos: [
          { id: 'tecnico-seguro-social', nome: 'Técnico do Seguro Social' },
          { id: 'analista-seguro-social', nome: 'Analista do Seguro Social' }
        ]
      },
      {
        id: 'ibge',
        nome: 'IBGE',
        sigla: 'IBGE',
        cargos: [
          { id: 'tecnico', nome: 'Técnico' },
          { id: 'analista', nome: 'Analista' },
          { id: 'recenseador', nome: 'Recenseador' }
        ]
      },
      {
        id: 'inep',
        nome: 'INEP',
        sigla: 'INEP',
        cargos: [
          { id: 'pesquisador', nome: 'Pesquisador' },
          { id: 'tecnico', nome: 'Técnico' }
        ]
      },
      {
        id: 'fazenda',
        nome: 'Ministério da Fazenda',
        sigla: 'MF',
        cargos: [
          { id: 'analista', nome: 'Analista' }
        ]
      },
      {
        id: 'gestao',
        nome: 'Ministério da Gestão',
        sigla: 'MGI',
        cargos: [
          { id: 'analista', nome: 'Analista' }
        ]
      }
    ]
  },
  {
    id: 'estatais',
    nome: 'Estatais',
    concursos: [
      {
        id: 'petrobras',
        nome: 'Petrobras',
        sigla: 'Petrobras',
        cargos: [
          { id: 'tecnico-administrativo', nome: 'Técnico Administrativo' },
          { id: 'tecnico-seguranca', nome: 'Técnico de Segurança' },
          { id: 'tecnico-industrial', nome: 'Técnico Industrial' },
          { id: 'engenharia', nome: 'Engenharia' }
        ]
      },
      {
        id: 'correios',
        nome: 'Correios',
        sigla: 'Correios',
        cargos: [
          { id: 'agente-correios', nome: 'Agente de Correios' },
          { id: 'analista', nome: 'Analista' }
        ]
      },
      {
        id: 'eletrobras',
        nome: 'Eletrobras',
        sigla: 'Eletrobras',
        cargos: [
          { id: 'tecnico', nome: 'Técnico' },
          { id: 'analista', nome: 'Analista' },
          { id: 'engenharia', nome: 'Engenharia' }
        ]
      },
      {
        id: 'serpro',
        nome: 'Serpro',
        sigla: 'Serpro',
        cargos: [
          { id: 'analista-ti', nome: 'Analista de TI' },
          { id: 'tecnico-ti', nome: 'Técnico de TI' }
        ]
      },
      {
        id: 'dataprev',
        nome: 'Dataprev',
        sigla: 'Dataprev',
        cargos: [
          { id: 'analista-ti', nome: 'Analista de TI' },
          { id: 'tecnico-ti', nome: 'Técnico de TI' }
        ]
      }
    ]
  },
  {
    id: 'agencias-reguladoras',
    nome: 'Agências Reguladoras',
    concursos: [
      {
        id: 'anvisa',
        nome: 'ANVISA',
        sigla: 'ANVISA',
        cargos: [
          { id: 'especialista-regulacao', nome: 'Especialista em Regulação' },
          { id: 'tecnico-administrativo', nome: 'Técnico Administrativo' }
        ]
      },
      {
        id: 'aneel',
        nome: 'ANEEL',
        sigla: 'ANEEL',
        cargos: [
          { id: 'especialista-regulacao', nome: 'Especialista em Regulação' },
          { id: 'tecnico', nome: 'Técnico' }
        ]
      },
      {
        id: 'anatel',
        nome: 'ANATEL',
        sigla: 'ANATEL',
        cargos: [
          { id: 'especialista-regulacao', nome: 'Especialista em Regulação' },
          { id: 'tecnico', nome: 'Técnico' }
        ]
      },
      {
        id: 'antt',
        nome: 'ANTT',
        sigla: 'ANTT',
        cargos: [
          { id: 'especialista-regulacao', nome: 'Especialista em Regulação' },
          { id: 'tecnico', nome: 'Técnico' }
        ]
      },
      {
        id: 'antaq',
        nome: 'ANTAQ',
        sigla: 'ANTAQ',
        cargos: [
          { id: 'especialista-regulacao', nome: 'Especialista em Regulação' },
          { id: 'tecnico', nome: 'Técnico' }
        ]
      }
    ]
  },
  {
    id: 'educacao',
    nome: 'Educação',
    concursos: [
      {
        id: 'universidades-federais',
        nome: 'Universidades Federais',
        cargos: [
          { id: 'tecnico-administrativo', nome: 'Técnico Administrativo' },
          { id: 'analista-administrativo', nome: 'Analista Administrativo' },
          { id: 'professor', nome: 'Professor' }
        ]
      },
      {
        id: 'if',
        nome: 'Institutos Federais (IF)',
        sigla: 'IF',
        cargos: [
          { id: 'tecnico-administrativo', nome: 'Técnico Administrativo' },
          { id: 'professor', nome: 'Professor' }
        ]
      }
    ]
  },
  {
    id: 'area-fiscal',
    nome: 'Área Fiscal',
    concursos: [
      {
        id: 'sefaz',
        nome: 'Secretarias de Fazenda Estaduais (SEFAZ)',
        sigla: 'SEFAZ',
        cargos: [
          { id: 'auditor-fiscal', nome: 'Auditor Fiscal' },
          { id: 'analista', nome: 'Analista' }
        ]
      },
      {
        id: 'iss',
        nome: 'Secretarias de Fazenda Municipais',
        sigla: 'ISS',
        cargos: [
          { id: 'auditor-fiscal', nome: 'Auditor Fiscal' },
          { id: 'analista', nome: 'Analista' }
        ]
      }
    ]
  },
  {
    id: 'area-legislativa',
    nome: 'Área Legislativa',
    concursos: [
      {
        id: 'senado',
        nome: 'Senado Federal',
        sigla: 'Senado',
        cargos: [
          { id: 'tecnico-legislativo', nome: 'Técnico Legislativo' },
          { id: 'analista-legislativo', nome: 'Analista Legislativo' }
        ]
      },
      {
        id: 'camara',
        nome: 'Câmara dos Deputados',
        sigla: 'Câmara',
        cargos: [
          { id: 'tecnico-legislativo', nome: 'Técnico Legislativo' },
          { id: 'analista-legislativo', nome: 'Analista Legislativo' }
        ]
      },
      {
        id: 'assembleias',
        nome: 'Assembleias Legislativas',
        cargos: [
          { id: 'tecnico-legislativo', nome: 'Técnico Legislativo' },
          { id: 'analista-legislativo', nome: 'Analista Legislativo' }
        ]
      },
      {
        id: 'camaras-municipais',
        nome: 'Câmaras Municipais',
        cargos: [
          { id: 'tecnico-legislativo', nome: 'Técnico Legislativo' },
          { id: 'analista-legislativo', nome: 'Analista Legislativo' }
        ]
      }
    ]
  },
  {
    id: 'saude',
    nome: 'Saúde',
    concursos: [
      {
        id: 'sus',
        nome: 'SUS / Ministério da Saúde',
        cargos: [
          { id: 'tecnico-administrativo', nome: 'Técnico Administrativo' },
          { id: 'analista', nome: 'Analista' }
        ]
      },
      {
        id: 'ebserh',
        nome: 'Hospitais Universitários',
        sigla: 'EBSERH',
        cargos: [
          { id: 'enfermeiro', nome: 'Enfermeiro' },
          { id: 'tecnico-enfermagem', nome: 'Técnico em Enfermagem' },
          { id: 'medico', nome: 'Médico' }
        ]
      }
    ]
  },
  {
    id: 'cnu-categoria',
    nome: 'Concurso Nacional Unificado',
    concursos: [
      {
        id: 'cnu',
        nome: 'CNU',
        sigla: 'CNU',
        cargos: [
          { id: 'bloco-1', nome: 'Bloco 1' },
          { id: 'bloco-2', nome: 'Bloco 2' },
          { id: 'bloco-3', nome: 'Bloco 3' },
          { id: 'bloco-4', nome: 'Bloco 4' },
          { id: 'bloco-5', nome: 'Bloco 5' },
          { id: 'bloco-6', nome: 'Bloco 6' },
          { id: 'bloco-7', nome: 'Bloco 7' },
          { id: 'bloco-8', nome: 'Bloco 8' }
        ]
      }
    ]
  }
];

// Flat list for backward compatibility or direct access
export const CONCURSOS_MOCK = CONCURSOS_CATEGORIAS_MOCK.flatMap(cat => cat.concursos);
