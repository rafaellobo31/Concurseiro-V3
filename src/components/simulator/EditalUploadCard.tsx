import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditalUploadCardProps {
  onUpload: (file: File) => void;
  isAnalyzing: boolean;
}

export function EditalUploadCard({ onUpload, isAnalyzing }: EditalUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Por favor, envie apenas arquivos PDF.');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setError('O arquivo deve ter no máximo 10MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        setError('Por favor, envie apenas arquivos PDF.');
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-10 transition-all text-center ${
          file 
            ? 'border-indigo-200 bg-indigo-50/30' 
            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="text-indigo-600 w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Arraste seu edital aqui</p>
                <p className="text-sm text-gray-500">ou clique para selecionar o arquivo PDF</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
              >
                Selecionar PDF
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <FileText className="text-indigo-600 w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                disabled={isAnalyzing}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center justify-center gap-2 text-red-500 text-sm font-medium"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!file || isAnalyzing}
        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
          !file || isAnalyzing
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analisando Edital...
          </>
        ) : (
          <>
            Analisar Edital
          </>
        )}
      </button>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Dica:</strong> Para melhores resultados, envie o edital completo ou a seção de "Conteúdo Programático". Nossa IA identificará automaticamente as matérias e o peso de cada tema.
        </p>
      </div>
    </div>
  );
}
