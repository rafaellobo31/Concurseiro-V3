import { User, Exam, Question, ExamResult } from '../types';

export const MOCK_USER: User = {
  id: 'user-123',
  email: 'estudante@concurseiro.com',
  name: 'João Silva',
  isPro: false,
  avatarUrl: 'https://picsum.photos/seed/user/200/200',
};

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    subject: 'Direito Constitucional',
    text: 'Sobre os direitos e garantias fundamentais, é correto afirmar que:',
    alternatives: [
      { id: 'a1', text: 'A lei não excluirá da apreciação do Poder Judiciário lesão ou ameaça a direito.', isCorrect: true },
      { id: 'a2', text: 'É livre a manifestação do pensamento, sendo permitido o anonimato.', isCorrect: false },
      { id: 'a3', text: 'Ninguém será submetido a tortura, salvo em caso de guerra declarada.', isCorrect: false },
      { id: 'a4', text: 'A casa é asilo inviolável do indivíduo, podendo nela qualquer um ingressar a qualquer hora sem consentimento.', isCorrect: false },
    ],
    explanation: 'O princípio da inafastabilidade da jurisdição está previsto no art. 5º, XXXV, da CF/88.',
  },
  {
    id: 'q2',
    subject: 'Língua Portuguesa',
    text: 'Assinale a alternativa em que a concordância verbal está correta:',
    alternatives: [
      { id: 'b1', text: 'Fazem dez anos que não o vejo.', isCorrect: false },
      { id: 'b2', text: 'Houveram muitos problemas na reunião.', isCorrect: false },
      { id: 'b3', text: 'Faz dez anos que não o vejo.', isCorrect: true },
      { id: 'b4', text: 'Devem haver soluções melhores.', isCorrect: false },
    ],
    explanation: 'O verbo "fazer" indicando tempo decorrido é impessoal e deve ficar na 3ª pessoa do singular.',
  },
  {
    id: 'q3',
    subject: 'Informática',
    text: 'Qual dos seguintes protocolos é utilizado para transferência de arquivos de forma segura?',
    alternatives: [
      { id: 'c1', text: 'HTTP', isCorrect: false },
      { id: 'c2', text: 'FTP', isCorrect: false },
      { id: 'c3', text: 'SFTP', isCorrect: true },
      { id: 'c4', text: 'SMTP', isCorrect: false },
    ],
    explanation: 'SFTP (SSH File Transfer Protocol) é a versão segura do FTP.',
  },
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    title: 'Simulado Geral Iniciante',
    description: 'Um simulado abrangendo as matérias básicas para concursos de nível médio.',
    questions: MOCK_QUESTIONS,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exam-2',
    title: 'Direito Administrativo - Agente',
    description: 'Focado em Atos Administrativos e Licitações.',
    questions: MOCK_QUESTIONS.slice(0, 1),
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_RESULTS: ExamResult[] = [
  {
    id: 'res-1',
    examId: 'exam-1',
    userId: 'user-123',
    score: 66.6,
    totalQuestions: 3,
    correctAnswers: 2,
    timeSpent: 450,
    completedAt: new Date().toISOString(),
  },
];

export const MOCK_CONCURSOS = [
  'INSS',
  'Banco do Brasil',
  'Petrobras',
  'CNU',
  'Polícia Federal',
  'Correios',
  'Caixa Econômica',
  'IBGE'
];

export const MOCK_MATERIAS = [
  'Português',
  'Raciocínio Lógico',
  'Matemática',
  'Informática',
  'Direito Administrativo',
  'Direito Constitucional',
  'Arquivologia',
  'Atualidades'
];

export const MOCK_BANCAS = [
  'CESPE',
  'FCC',
  'FGV',
  'IBFC',
  'VUNESP'
];

export const MOCK_LEVELS = [
  'Fácil',
  'Médio',
  'Difícil'
];
