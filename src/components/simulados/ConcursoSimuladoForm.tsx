import { useState, FormEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONCURSOS_CATEGORIAS_MOCK, CONCURSOS_MOCK } from '../../mocks/concursosMock';
import { MOCK_BANCAS, MOCK_LEVELS } from '../../mocks/data';
import { Sparkles, ArrowRight, Building2, Landmark, ListChecks, Briefcase, BarChart3, HelpCircle, ChevronLeft } from 'lucide-react';
import { ExamInput } from '../../types/exam';

export function ConcursoSimuladoForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [formData, setFormData] = useState({
    concursoId: '',
    cargoId: '',
    banca: '',
    tipoQuestao: 'multipla_escolha',
    quantidade: '10',
    nivel: 'Médio',
    // Manual fields
    customConcurso: '',
    customOrgao: '',
    customCargo: '',
    customBanca: '',
    customNivelEscolaridade: 'Superior'
  });

  const selectedConcurso = useMemo(() => 
    CONCURSOS_MOCK.find(c => c.id === formData.concursoId),
    [formData.concursoId]
  );

  const handleConcursoChange = (id: string) => {
    const concurso = CONCURSOS_MOCK.find(c => c.id === id);
    setFormData({ 
      ...formData, 
      concursoId: id, 
      cargoId: '', 
      banca: concurso?.bancasSugeridas?.[0] || '' 
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const input: ExamInput = {
      modo: 'concurso' as const,
      concurso: manualMode ? formData.customConcurso : selectedConcurso?.nome,
      orgao: manualMode ? formData.customOrgao : undefined,
      cargo: manualMode ? formData.customCargo : selectedConcurso?.cargos.find(c => c.id === formData.cargoId)?.nome,
      banca: manualMode ? formData.customBanca : formData.banca,
      tipoQuestao: (formData.tipoQuestao === 'certo_errado' ? 'verdadeiro_falso' : 'multipla_escolha') as 'multipla_escolha' | 'verdadeiro_falso',
      quantidade: parseInt(formData.quantidade),
      nivel: formData.nivel.toLowerCase() as 'facil' | 'medio' | 'dificil',
      nivelEscolaridade: manualMode ? formData.customNivelEscolaridade : undefined
    };

    // Simulate generation delay
    setTimeout(() => {
      navigate('/exam-session/new-concurso-exam', { state: { input } });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!manualMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Concurso */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-indigo-600" />
              Selecione o Concurso
            </label>
            <select
              required
              value={formData.concursoId}
              onChange={(e) => handleConcursoChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Escolha um concurso...</option>
              {CONCURSOS_CATEGORIAS_MOCK.map((cat) => (
                <optgroup key={cat.id} label={cat.nome}>
                  {cat.concursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} {c.sigla ? `(${c.sigla})` : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setManualMode(true)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              Não encontrou seu concurso? Informe manualmente
            </button>
          </div>

          {/* Cargo / Área */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Área ou Cargo
            </label>
            <select
              required
              disabled={!formData.concursoId}
              value={formData.cargoId}
              onChange={(e) => setFormData({ ...formData, cargoId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="">{formData.concursoId ? 'Escolha o cargo...' : 'Selecione um concurso primeiro'}</option>
              {selectedConcurso?.cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>{cargo.nome}</option>
              ))}
            </select>
          </div>

          {/* Banca */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Banca (Opcional)
            </label>
            <select
              value={formData.banca}
              onChange={(e) => setFormData({ ...formData, banca: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Qualquer banca</option>
              {/* Sugestões da banca para o concurso selecionado */}
              {selectedConcurso?.bancasSugeridas?.map(b => (
                <option key={b} value={b}>{b} (Sugerida)</option>
              ))}
              {/* Outras bancas */}
              {MOCK_BANCAS.filter(b => !selectedConcurso?.bancasSugeridas?.includes(b)).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Dificuldade */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Nível de Dificuldade
            </label>
            <select
              value={formData.nivel}
              onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              {MOCK_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Informar Concurso Manualmente</h3>
            <button
              type="button"
              onClick={() => setManualMode(false)}
              className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar ao catálogo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do Concurso */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" />
                Nome do Concurso
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Prefeitura de Salvador"
                value={formData.customConcurso}
                onChange={(e) => setFormData({ ...formData, customConcurso: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              />
            </div>

            {/* Órgão */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Órgão ou Instituição
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Prefeitura de Salvador"
                value={formData.customOrgao}
                onChange={(e) => setFormData({ ...formData, customOrgao: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              />
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Área ou Cargo
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Assistente Administrativo"
                value={formData.customCargo}
                onChange={(e) => setFormData({ ...formData, customCargo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              />
            </div>

            {/* Banca Manual */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Banca Examinadora (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: FGV, CESPE, FCC"
                value={formData.customBanca}
                onChange={(e) => setFormData({ ...formData, customBanca: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              />
            </div>

            {/* Nível Escolaridade */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Nível de Escolaridade
              </label>
              <select
                value={formData.customNivelEscolaridade}
                onChange={(e) => setFormData({ ...formData, customNivelEscolaridade: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              >
                <option value="Fundamental">Fundamental</option>
                <option value="Médio">Médio</option>
                <option value="Superior">Superior</option>
              </select>
            </div>

            {/* Dificuldade (Reutilizado) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Dificuldade das Questões
              </label>
              <select
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              >
                {MOCK_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de Questão */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-indigo-600" />
            Tipo de Questão
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipoQuestao: 'multipla_escolha' })}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                formData.tipoQuestao === 'multipla_escolha'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-200'
              }`}
            >
              Múltipla Escolha
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipoQuestao: 'certo_errado' })}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                formData.tipoQuestao === 'certo_errado'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-200'
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
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
          disabled={loading || (!manualMode && (!formData.concursoId || !formData.cargoId)) || (manualMode && (!formData.customConcurso || !formData.customOrgao || !formData.customCargo))}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gerar Simulado por Concurso
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
