import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, FileText, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { EditalUploadCard } from '../components/simulator/EditalUploadCard';
import { EditalAnalysisSummary } from '../components/simulator/EditalAnalysisSummary';
import { EditalSimuladoConfig } from '../components/EditalSimuladoConfig';
import { editalService } from '../services/editalService';
import { editalExamService } from '../services/editalExamService';
import { EditalAnalysis } from '../types/edital';
import { PlanGate } from '../components/PlanGate';

type EditalStatus = 
  | 'idle' 
  | 'extracting' 
  | 'ready' 
  | 'analyzing' 
  | 'analyzed' 
  | 'error' 
  | 'generating' 
  | 'completed';

export default function EditalSimuladoPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'upload' | 'analysis' | 'config' | 'generating'>('upload');
  const [status, setStatus] = useState<EditalStatus>('idle');
  const [analysis, setAnalysis] = useState<EditalAnalysis | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Armazena o texto extraído do PDF para reutilização em retentativas manuais
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);

  // Trava de concorrência e identificador de requisição ativa
  const isBusyRef = useRef(false);
  const currentRequestIdRef = useRef<string | null>(null);

  const handleUpload = async (file: File) => {
    // 4. Trava de concorrência: se a análise já estiver em andamento, ignorar nova chamada
    if (isBusyRef.current || status === 'extracting' || status === 'analyzing') {
      console.warn('[EditalFlow] Trava de concorrência acionada. Análise ou extração já em andamento.');
      return;
    }

    isBusyRef.current = true;
    setError(null);
    setRetryMessage(null);
    setCurrentFileName(file.name);

    console.log(`[EditalFlow] Estado: idle -> extracting`);
    setStatus('extracting');

    let text = '';
    try {
      text = await editalService.extractText(file);
      setExtractedText(text);
      console.log('[EditalFlow] Extração concluída');
      console.log('[EditalFlow] Estado: ready -> analyzing');
      setStatus('analyzing');
    } catch (err: any) {
      console.error('[EditalFlow] Erro na extração do PDF:', err);
      setError('Não foi possível ler o arquivo PDF do edital. Tente outro arquivo.');
      console.log('[EditalFlow] Estado: extracting -> error');
      console.log('[EditalFlow] Loading finalizado');
      console.log('[EditalFlow] Aguardando ação manual para nova tentativa');
      setStatus('error');
      isBusyRef.current = false;
      return;
    }

    // Iniciar a análise com o texto extraído
    await executeAnalysis(text);
  };

  const executeAnalysis = async (text: string) => {
    // 5. Usar requestId para ignorar respostas antigas/concorrentes
    const requestId = Math.random().toString(36).substring(2, 9);
    currentRequestIdRef.current = requestId;
    console.log(`[EditalFlow] Request iniciada: ${requestId}`);

    try {
      const result = await editalService.analyze(text, (attempt) => {
        if (currentRequestIdRef.current === requestId) {
          setRetryMessage(`A IA está com alta demanda. Tentativa ${attempt} de 2...`);
        }
      });

      // Ignorar respostas de requisições anteriores canceladas/obsoletas
      if (currentRequestIdRef.current !== requestId) {
        console.warn(`[EditalFlow] Resposta ignorada para request desatualizada: ${requestId}`);
        return;
      }

      console.log('[EditalFlow] Request concluída');

      if (result.success && result.data) {
        console.log('[EditalFlow] Estado: analyzing -> analyzed');
        setAnalysis(result.data);
        setSelectedSubjects(result.data.materias.map(m => m.nome));
        setStatus('analyzed');
        setStep('analysis');
      } else {
        console.log('[EditalFlow] Estado: analyzing -> error');
        setError(result.error || 'Ocorreu um erro ao analisar o edital com inteligência artificial.');
        setStatus('error');
      }
    } catch (err: any) {
      if (currentRequestIdRef.current === requestId) {
        console.log('[EditalFlow] Estado: analyzing -> error');
        console.error('[EditalFlow] Erro ao chamar serviço de análise:', err);
        setError('Ocorreu uma falha ao comunicar com o servidor.');
        setStatus('error');
      }
    } finally {
      if (currentRequestIdRef.current === requestId) {
        console.log('[EditalFlow] Loading finalizado');
        console.log('[EditalFlow] Aguardando ação manual para nova tentativa');
        isBusyRef.current = false;
        setRetryMessage(null);
      }
    }
  };

  const handleManualRetry = async () => {
    if (isBusyRef.current || status === 'analyzing') return;

    if (!extractedText) {
      // Se não houver texto previamente extraído, resetar para estado idle
      setStatus('idle');
      setStep('upload');
      setError('Por favor, selecione novamente o PDF do edital.');
      return;
    }

    isBusyRef.current = true;
    setError(null);
    setRetryMessage(null);
    console.log('[EditalFlow] Ação manual do usuário: Tentar novamente');
    console.log('[EditalFlow] Estado: error -> analyzing');
    setStatus('analyzing');

    await executeAnalysis(extractedText);
  };

  const handleConfirmAnalysis = () => {
    setStep('config');
  };

  const handleGenerate = async () => {
    if (!analysis || status === 'generating') return;
    
    setStatus('generating');
    setStep('generating');
    setRetryMessage(null);
    setError(null);

    try {
      const result = await editalExamService.generateEditalExam(analysis, selectedQuestionCount, selectedSubjects, (attempt) => {
        setRetryMessage(`A IA está com alta demanda. Tentativa ${attempt} de 2...`);
      });
      
      setStatus('completed');
      navigate('/exam-session', { state: { exam: result } });
    } catch (err) {
      console.error('Erro ao gerar simulado:', err);
      setError('Erro ao gerar as questões do simulado. Tente novamente.');
      setStep('config');
      setStatus('analyzed');
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

  const isProcessing = status === 'extracting' || status === 'analyzing';

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

      <PlanGate feature="edital_mode">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <EditalUploadCard 
                onUpload={handleUpload} 
                isAnalyzing={isProcessing} 
                retryMessage={status === 'extracting' ? 'Lendo PDF do edital...' : retryMessage} 
              />
              
              {/* Card de Erro da IA e Botão de Ação Manual de Nova Tentativa */}
              {status === 'error' && error && (
                <div className="p-6 bg-red-50 rounded-2xl border border-red-200 space-y-4">
                  <div className="flex items-start gap-3 text-red-700">
                    <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-base">Falha na Análise do Edital</h4>
                      <p className="text-sm mt-1 text-red-600">{error}</p>
                      {currentFileName && (
                        <p className="text-xs text-red-500 mt-2 font-medium">
                          Arquivo: <span className="font-semibold">{currentFileName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleManualRetry}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Tentar Novamente
                    </button>
                    
                    <button
                      onClick={() => {
                        setStatus('idle');
                        setExtractedText(null);
                        setError(null);
                        setCurrentFileName(null);
                      }}
                      className="px-4 py-2.5 bg-white text-gray-700 hover:bg-gray-100 font-bold text-sm rounded-xl border border-gray-300 transition-all"
                    >
                      Selecionar outro arquivo
                    </button>
                  </div>
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
                onCancel={() => {
                  setStep('upload');
                  setStatus('idle');
                }} 
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
                isGenerating={status === 'generating'}
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
                <p className="text-indigo-600 font-medium animate-pulse">
                  {retryMessage || "Selecionando as melhores questões para o seu edital..."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PlanGate>
    </div>
  );
}
