import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, RotateCcw, PlusCircle, BookOpen } from 'lucide-react';

export function ResultActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link
        to="/generator"
        className="flex items-center justify-center gap-3 p-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group"
      >
        <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Novo Simulado
      </Link>
      
      <button
        onClick={() => window.location.reload()}
        className="flex items-center justify-center gap-3 p-5 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:border-indigo-200 hover:bg-indigo-50 transition-all"
      >
        <RotateCcw className="w-5 h-5" />
        Refazer Este
      </button>

      <Link
        to="/study-plan"
        className="flex items-center justify-center gap-3 p-5 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:border-indigo-200 hover:bg-indigo-50 transition-all"
      >
        <BookOpen className="w-5 h-5" />
        Ver Plano de Estudo
      </Link>

      <Link
        to="/dashboard"
        className="flex items-center justify-center gap-3 p-5 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:border-indigo-200 hover:bg-indigo-50 transition-all"
      >
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </Link>
    </div>
  );
}
