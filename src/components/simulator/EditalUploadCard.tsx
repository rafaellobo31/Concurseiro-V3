import React from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface EditalUploadCardProps {
  onUpload: (file: File) => void;
  isAnalyzing: boolean;
}

export const EditalUploadCard: React.FC<EditalUploadCardProps> = ({ onUpload, isAnalyzing }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "bg-white p-8 rounded-3xl border-2 border-dashed transition-all text-center",
        isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-gray-200 hover:border-indigo-300"
      )}
    >
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Upload className="w-8 h-8 text-indigo-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Upload do Edital</h3>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        Arraste o PDF do edital ou clique para selecionar o arquivo. Nossa IA irá analisar o conteúdo automaticamente.
      </p>
      
      <label className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
        <FileText className="w-5 h-5 mr-2" />
        {isAnalyzing ? 'Analisando...' : 'Selecionar PDF'}
        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} disabled={isAnalyzing} />
      </label>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-amber-600 bg-amber-50 py-2 px-4 rounded-lg inline-flex">
        <AlertCircle className="w-4 h-4" />
        Apenas arquivos PDF são suportados no momento.
      </div>
    </div>
  );
};
