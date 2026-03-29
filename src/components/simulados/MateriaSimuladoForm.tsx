import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MATERIAS, MOCK_LEVELS } from '../../mocks/data';
import { Sparkles, ArrowRight, BookOpen, BarChart3, ListChecks } from 'lucide-react';

export function MateriaSimuladoForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    materia: '',
    nivel: '',
    tipoQuestao: 'multipla_escolha',
    quantidade: '10'
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const input = {
      modo: 'materia' as const,
      materia: formData.materia,
      tipoQuestao: formData.tipoQuestao === 'certo_errado' ? 'verdadeiro_falso' : 'multipla_escolha' as any,
      quantidade: parseInt(formData.quantidade),
      nivel: (formData.nivel.toLowerCase() || 'medio') as 'facil' | 'medio' | 'dificil'
    };

    // Simulate generation delay
    setTimeout(() => {
      navigate('/exam-session/new-materia-exam', { state: { input } });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matéria */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Selecione a Matéria
          </label>
          <select
            required
            value={formData.materia}
            onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
          >
            <option value="">Escolha uma matéria...</option>
            {MOCK_MATERIAS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Nível */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Nível de Dificuldade (Opcional)
          </label>
          <select
            value={formData.nivel}
            onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
          >
            <option value="">Qualquer nível</option>
            {MOCK_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Tipo de Questão */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-emerald-600" />
            Tipo de Questão
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipoQuestao: 'multipla_escolha' })}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                formData.tipoQuestao === 'multipla_escolha'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-200'
              }`}
            >
              Múltipla Escolha
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipoQuestao: 'certo_errado' })}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                formData.tipoQuestao === 'certo_errado'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-200'
              }`}
            >
              Certo ou Errado
            </button>
          </div>
        </div>

        {/* Quantidade */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Quantidade de Questões
          </label>
          <select
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
          >
            <option value="5">5 questões</option>
            <option value="10">10 questões</option>
            <option value="20">20 questões</option>
            <option value="50">50 questões</option>
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || !formData.materia}
          className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gerar Simulado por Matéria
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
