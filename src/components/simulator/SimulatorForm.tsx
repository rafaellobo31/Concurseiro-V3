import React, { useState, useMemo } from 'react';
import { SimulatorInput } from '../../types/simulator';
import { CONCURSOS_CATEGORIAS_MOCK, CONCURSOS_MOCK } from '../../mocks/concursosMock';
import { MOCK_BANCAS } from '../../mocks/data';
import { Target, BookOpen, Building2, ListChecks, BarChart3, Sparkles, ArrowRight, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

interface SimulatorFormProps {
  onSubmit: (input: SimulatorInput) => void;
  loading: boolean;
}

const MATERIAS_LIST = [
  'Direito Administrativo',
  'Direito Constitucional',
  'Língua Portuguesa',
  'Raciocínio Lógico',
  'Informática',
  'Direito Penal',
  'Direito Processual Penal',
  'Direito Civil',
  'Contabilidade',
  'Administração Pública'
];

export function SimulatorForm({ onSubmit, loading }: SimulatorFormProps) {
  const [formData, setFormData] = useState<SimulatorInput>({
    modoSimulado: 'concurso',
    concurso: '',
    cargo: '',
    materia: '',
    banca: '',
    tipoQuestao: 'multipla_escolha',
    quantidade: 10,
    nivel: 'medio'
  });

  const selectedConcurso = useMemo(() => {
    return CONCURSOS_MOCK.find(c => c.id === formData.concurso);
  }, [formData.concurso]);

  const handleConcursoChange = (concursoId: string) => {
    const concurso = CONCURSOS_MOCK.find(c => c.id === concursoId);
    setFormData({
      ...formData,
      concurso: concursoId,
      cargo: '',
      banca: concurso?.bancasSugeridas?.[0] || ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div className="p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure seu Simulado</h2>
          <p className="text-gray-500">Personalize o nível, a banca e a matéria para um treino focado.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Modo */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                Modo do Simulado
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, modoSimulado: 'concurso' })}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                    formData.modoSimulado === 'concurso'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  Por Concurso
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, modoSimulado: 'materia' })}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                    formData.modoSimulado === 'materia'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  Por Matéria
                </button>
              </div>
            </div>

            {/* Concurso ou Matéria */}
            {formData.modoSimulado === 'concurso' ? (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    Selecione o Concurso
                  </label>
                  <select
                    required
                    value={formData.concurso}
                    onChange={(e) => handleConcursoChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700"
                  >
                    <option value="">Selecione...</option>
                    {CONCURSOS_CATEGORIAS_MOCK.map((cat) => (
                      <optgroup key={cat.id} label={cat.nome}>
                        {cat.concursos.map((c) => (
                          <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    Área / Cargo
                  </label>
                  <select
                    required
                    disabled={!formData.concurso}
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">Selecione...</option>
                    {selectedConcurso?.cargos.map((cargo) => (
                      <option key={cargo.id} value={cargo.id}>{cargo.nome}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Selecione a Matéria
                </label>
                <select
                  required
                  value={formData.materia}
                  onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700"
                >
                  <option value="">Selecione...</option>
                  {MATERIAS_LIST.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Banca */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Banca Examinadora (Opcional)
              </label>
              <select
                value={formData.banca}
                onChange={(e) => setFormData({ ...formData, banca: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700"
              >
                <option value="">Qualquer Banca</option>
                {MOCK_BANCAS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Tipo de Questão */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-600" />
                Tipo de Questão
              </label>
              <select
                value={formData.tipoQuestao}
                onChange={(e) => setFormData({ ...formData, tipoQuestao: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700"
              >
                <option value="multipla_escolha">Múltipla Escolha (A, B, C, D, E)</option>
                <option value="verdadeiro_falso">Verdadeiro ou Falso</option>
              </select>
            </div>

            {/* Quantidade */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Quantidade de Questões
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700"
              />
            </div>

            {/* Nível */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Nível de Dificuldade
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['facil', 'medio', 'dificil'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFormData({ ...formData, nivel: n as any })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                      formData.nivel === n
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    {n === 'facil' ? 'Fácil' : n === 'medio' ? 'Médio' : 'Difícil'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading || (formData.modoSimulado === 'concurso' && (!formData.concurso || !formData.cargo)) || (formData.modoSimulado === 'materia' && !formData.materia)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Simulado com IA
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
