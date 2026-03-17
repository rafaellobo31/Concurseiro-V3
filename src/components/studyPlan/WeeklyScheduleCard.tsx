import { WeeklyScheduleItem, WeeklyLoad } from '../../types/studyPlan';
import { Calendar, Clock, PieChart, BookOpen, CheckCircle2 } from 'lucide-react';

interface WeeklyScheduleCardProps {
  schedule: WeeklyScheduleItem[];
  load: WeeklyLoad;
}

export function WeeklyScheduleCard({ schedule, load }: WeeklyScheduleCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-10">
      {/* Carga Semanal Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 border-bottom border-gray-100">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Carga Horária Semanal</h3>
              <p className="text-sm text-gray-500">Distribuição recomendada para máxima eficiência.</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{load.descricao}</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Semanal</span>
            <span className="text-2xl font-black text-indigo-600">{load.horasTotais}h</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Teoria</span>
              <span className="font-bold text-gray-900">{load.divisao.teoria}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: load.divisao.teoria }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Questões</span>
              <span className="font-bold text-gray-900">{load.divisao.questoes}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: load.divisao.questoes }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Revisão</span>
              <span className="font-bold text-gray-900">{load.divisao.revisao}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: load.divisao.revisao }} />
            </div>
          </div>
        </div>
      </div>

      {/* Grade Semanal */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600" />
          Grade de Estudos
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {schedule.map((day) => (
            <div key={day.dia} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{day.dia}</span>
              <div className="space-y-2 flex-grow">
                {day.blocos.map((bloco, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-900 leading-tight">{bloco.materia}</p>
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {bloco.duracao}
                      </span>
                    </div>
                    <div className="flex items-start gap-1 text-[10px] text-gray-500">
                      <BookOpen className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{bloco.foco}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
