import { Search, Filter } from 'lucide-react';

interface HistoryFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterMode: string;
  onFilterChange: (value: string) => void;
}

export function HistoryFilterBar({ 
  searchTerm, 
  onSearchChange, 
  filterMode, 
  onFilterChange 
}: HistoryFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por concurso ou matéria..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Filter className="w-5 h-5 text-gray-400 hidden md:block" />
        <select
          value={filterMode}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full md:w-48 px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 text-gray-700 font-medium"
        >
          <option value="all">Todos os Modos</option>
          <option value="por_concurso">Por Concurso</option>
          <option value="por_materia">Por Matéria</option>
        </select>
      </div>
    </div>
  );
}
