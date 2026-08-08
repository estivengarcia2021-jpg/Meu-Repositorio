import React from 'react';
import { Star, ShieldCheck, Clock, Zap, ThumbsUp, Code2 } from 'lucide-react';
import { RatingStats } from '../types';

interface StatsSectionProps {
  stats: RatingStats;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <section className="bg-slate-900 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          
          {/* Rating Bars Breakdown */}
          <div className="md:col-span-5 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Distribuição das Avaliações</h3>
              <span className="text-xs text-slate-400 bg-slate-700/50 px-2.5 py-1 rounded-full border border-slate-600/50">
                100% Verificados
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              {/* 5 Stars */}
              <div className="flex items-center gap-3">
                <span className="w-12 text-slate-300 font-medium flex items-center gap-1">
                  5 <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.fiveStarCount / stats.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-400 text-xs font-semibold">
                  {stats.fiveStarCount}
                </span>
              </div>

              {/* 4 Stars */}
              <div className="flex items-center gap-3">
                <span className="w-12 text-slate-300 font-medium flex items-center gap-1">
                  4 <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400/80 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.fourStarCount / stats.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-400 text-xs font-semibold">
                  {stats.fourStarCount}
                </span>
              </div>

              {/* 3 Stars */}
              <div className="flex items-center gap-3 opacity-60">
                <span className="w-12 text-slate-400 font-medium flex items-center gap-1">
                  3 <Star className="w-3.5 h-3.5 fill-slate-500 text-slate-500" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-500 rounded-full"
                    style={{ width: `${(stats.threeStarCount / stats.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-400 text-xs font-semibold">
                  {stats.threeStarCount}
                </span>
              </div>
            </div>
          </div>

          {/* Highlights & Guarantees */}
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Pontualidade Absoluta</h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  100% das entregas realizadas rigidamente dentro do prazo combinado com o cliente.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Alta Performance & SEO</h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Interfaces com Lighthouse 95+ garantindo carregamento rápido e ótimo SEO.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Código Limpo & Escalável</h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Arquitetura React + TypeScript sustentável e fácil de manter por qualquer equipe.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Comunicação Transparente</h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Relatórios semanais de progresso e suporte contínuo antes, durante e após a entrega.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
