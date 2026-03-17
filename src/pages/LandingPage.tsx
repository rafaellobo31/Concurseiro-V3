import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Rocket, Shield, Star, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6"
            >
              Aprovação em Concursos <br />
              <span className="text-indigo-600">Potencializada por IA</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            >
              Gere simulados personalizados, acompanhe seu desempenho e estude com questões comentadas pela nossa inteligência artificial.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/login"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Começar Agora Grátis
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
              >
                Ver Demonstração
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-400 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher o Concurseiro?</h2>
            <p className="text-gray-600">Tudo o que você precisa para passar no concurso dos seus sonhos.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Simulados com IA',
                desc: 'Questões geradas e selecionadas por IA com base no edital do seu concurso.',
                icon: Rocket,
                color: 'bg-blue-50 text-blue-600'
              },
              {
                title: 'Correção Inteligente',
                desc: 'Receba explicações detalhadas sobre cada alternativa e entenda seus erros.',
                icon: Shield,
                color: 'bg-green-50 text-green-600'
              },
              {
                title: 'Análise de Desempenho',
                desc: 'Gráficos e estatísticas para você saber exatamente onde precisa melhorar.',
                icon: Star,
                color: 'bg-yellow-50 text-yellow-600'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Questões', value: '50k+' },
              { label: 'Usuários', value: '10k+' },
              { label: 'Simulados', value: '100k+' },
              { label: 'Aprovações', value: '500+' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-indigo-200 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
