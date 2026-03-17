import { useState, FormEvent } from 'react';
import { StudyPlanInput } from '../../types/studyPlan';
import { CONCURSOS_LIST } from '../../mocks/studyPlanMock';
import { ClipboardList, Clock, Calendar, Target, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface StudyPlanFormProps {
  onSubmit: (input: StudyPlanInput) => void;
  loading: boolean;
}

export function StudyPlanForm({ onSubmit, loading }: StudyPlanFormProps) {
  const [formData, setFormData] = useState<StudyPlanInput>({
    concurso: '',
    hoursPerDay: '3 horas',
    daysPerWeek: '5 dias',
    timeUntilExam: '3 meses'
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div className="p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure seu Plano Estratégico</h2>
          <p className="text-gray-500">Responda as perguntas abaixo para que nossa inteligência monte seu cronograma ideal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pergunta 1: Concurso */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                1. Para qual concurso você vai estudar?
              </label>
              <select
                required
                value={formData.concurso}
                onChange={(e) => setFormData({ ...formData, concurso: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700"
              >
                <option value="">Selecione um concurso...</option>
                {CONCURSOS_LIST.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Pergunta 2: Horas por dia */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                2. Quanto tempo por dia você tem disponível?
              </label>
              <select
                value={formData.hoursPerDay}
                onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700"
              >
                {['1 hora', '2 horas', '3 horas', '4 horas', '5 horas ou mais'].map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Pergunta 3: Dias por semana */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                3. Quantos dias por semana você vai estudar?
              </label>
              <select
                value={formData.daysPerWeek}
                onChange={(e) => setFormData({ ...formData, daysPerWeek: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700"
              >
                {['3 dias', '4 dias', '5 dias', '6 dias', '7 dias'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Pergunta 4: Tempo até a prova */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-600" />
                4. Quanto tempo falta para a prova?
              </label>
              <select
                value={formData.timeUntilExam}
                onChange={(e) => setFormData({ ...formData, timeUntilExam: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-gray-700"
              >
                {['1 mês', '2 meses', '3 meses', '6 meses', 'mais de 6 meses'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading || !formData.concurso}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Plano de Estudos Profissional
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
