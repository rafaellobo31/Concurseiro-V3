import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import { EditalUploadCard } from '../components/simulator/EditalUploadCard';
import { EditalAnalysisSummary } from '../components/simulator/EditalAnalysisSummary';
import { EditalSimuladoConfig } from '../components/EditalSimuladoConfig';
import { editalService } from '../services/editalService';
import { editalExamService } from '../services/editalExamService';
import { EditalAnalysis } from '../types/edital';

export default function EditalSimuladoPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'upload' | 'analysis' | 'config' | 'generating'>('upload');
  const [analysis, setAnalysis] = useState<EditalAnalysis | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setError(null);
    
    const result = await editalService.analyzeEdital(file);
    
    if (result.success && result.data) {
      setAnalysis(result.data);
      // Pré-selecionar todas as matérias por padrão
      setSelectedSubjects(result.data.materias.map(m => m.nome));
      setStep('analysis');
    } else {
      setError(result.error || 'Ocorreu um erro ao analisar o edital.');
    }
    
    setIsAnalyzing(false);
  };

  const handleConfirmAnalysis = () => {
    setStep('config');
  };

  const handleGenerate = async () => {
    if (!analysis || isGenerating) return;
    
    setIsGenerating(true);
    setStep('generating');
    setError(null);

    try {
      // ETAPA 2: Geração do simulado usando APENAS o resultado estruturado da análise e as configurações do usuário
      const result = await editalExamService.generateEditalExam(analysis, selectedQuestionCount, selectedSubjects);
      
      // Navegar para a sessão do simulado com os dados gerados
      navigate('/exam-session', { state: { exam: result } });
    } catch (err) {
      console.error('Erro ao gerar simulado:', err);
      setError('Erro ao gerar as questões do simulado. Tente novamente.');
      setStep('config');
      setIsGenerating(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate('/simulados')}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
          <Sparkles className="w-3 h-3" />
          Novo: Simulado por Edital
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Treine com Base no seu Edital
        </h1>
        <p className="text-gray-600">
          Nossa IA analisa o conteúdo programático do seu edital e gera um simulado 100% aderente aos temas cobrados.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EditalUploadCard onUpload={handleUpload} isAnalyzing={isAnalyzing} />
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3 text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </motion.div>
        )}

        {step === 'analysis' && analysis && (
          <motion.div
            key="analysis-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <EditalAnalysisSummary 
              analysis={analysis} 
              onConfirm={handleConfirmAnalysis} 
              onCancel={() => setStep('upload')} 
            />
          </motion.div>
        )}

        {step === 'config' && analysis && (
          <motion.div
            key="config-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <EditalSimuladoConfig
              analysis={analysis}
              selectedSubjects={selectedSubjects}
              onToggleSubject={toggleSubject}
              onSelectAll={() => setSelectedSubjects(analysis.materias.map(m => m.nome))}
              onDeselectAll={() => setSelectedSubjects([])}
              selectedQuestionCount={selectedQuestionCount}
              onSelectQuestionCount={setSelectedQuestionCount}
              onGenerate={handleGenerate}
              onBack={() => setStep('analysis')}
              isGenerating={isGenerating}
            />
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div
            key="generating-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="text-indigo-600 w-8 h-8" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Gerando seu Simulado</h3>
              <p className="text-gray-500">Selecionando as melhores questões para o seu edital...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
