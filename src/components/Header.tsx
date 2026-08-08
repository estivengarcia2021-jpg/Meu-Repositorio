import React from 'react';
import { Star, CheckCircle, MessageSquarePlus, Award, ShieldCheck, Sparkles, TrendingUp, Mail } from 'lucide-react';

interface HeaderProps {
  totalReviews: number;
  averageRating: number;
  onOpenAddModal: () => void;
  onOpenAiSummary: () => void;
  onOpenContactModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalReviews,
  averageRating,
  onOpenAddModal,
  onOpenAiSummary,
  onOpenContactModal
}) => {
  return (
    <header className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-700/60 shadow-xl overflow-hidden">
      {/* Background Subtle Accent Grids */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Developer Badge & Profile Avatar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-300 shadow-md">
            <img
              src="/avatar.jpg"
              alt="Arnol Estiven Garcia Diaz"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              }}
            />
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Desenvolvedor Frontend Senior</span>
              </div>
              <span className="text-emerald-400 font-bold text-sm sm:text-base flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Arnol Estiven Garcia Diaz
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenContactModal && (
              <button
                onClick={onOpenContactModal}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 hover:text-white hover:bg-indigo-500/30 transition-all text-xs sm:text-sm font-semibold cursor-pointer"
                id="contact-modal-btn"
              >
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Enviar E-mail</span>
              </button>
            )}

            <button
              onClick={onOpenAiSummary}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/15 border border-blue-400/30 text-blue-300 hover:text-white hover:bg-blue-500/25 transition-all text-xs sm:text-sm font-medium cursor-pointer"
              id="ai-summary-btn"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Resumo IA</span>
            </button>
          </div>
        </div>

        {/* Main Title & Description */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Depoimentos & Avaliações dos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Nossos Clientes</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Confira a opinião real de empresas, startups e empreendedores que contrataram meus serviços de desenvolvimento web, e-commerce, UI/UX e aplicações de alta performance.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAddModal}
                id="btn-open-add-testimonial"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer active:scale-98"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Deixar Meu Depoimento</span>
              </button>

              <a
                href="#reviews-section"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all cursor-pointer"
              >
                <span>Ver Todas as {totalReviews} Avaliações</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Header Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div>
                  <div className="text-3xl font-black text-white flex items-center gap-2">
                    <span>{averageRating.toFixed(1)}</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Baseado em <strong className="text-slate-200 font-medium">{totalReviews} depoimentos</strong> de clientes atendidos
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                  <Award className="w-7 h-7" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/60">
                  <div className="text-emerald-400 font-bold text-lg">100%</div>
                  <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Entregas no Prazo
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/60">
                  <div className="text-blue-400 font-bold text-lg">98%</div>
                  <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Recomendação
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
