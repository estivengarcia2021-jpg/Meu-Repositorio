import React, { useState } from 'react';
import { X, Star, CheckCircle2, Building2, MapPin, Calendar, ThumbsUp, Share2, Copy, Check, Quote, TrendingUp, Code2 } from 'lucide-react';
import { ClientTestimonial } from '../types';

interface TestimonialDetailModalProps {
  testimonial: ClientTestimonial | null;
  onClose: () => void;
  onToggleLike: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const TestimonialDetailModal: React.FC<TestimonialDetailModalProps> = ({
  testimonial,
  onClose,
  onToggleLike,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  if (!testimonial) return null;

  const handleCopy = () => {
    const textToCopy = `"${testimonial.comment}" — ${testimonial.clientName}, ${testimonial.role} na ${testimonial.company} (Avaliação do serviço de Arnol Garcia)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    onShowToast('Depoimento copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6 sm:p-8 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Client Header */}
        <div className="flex items-start gap-4">
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.clientName}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/80 shrink-0 shadow-md"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.clientName)}&background=1e293b&color=38bdf8&font-size=0.45`;
            }}
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{testimonial.clientName}</h2>
              {testimonial.verified && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cliente Verificado
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 font-medium">
              {testimonial.role} <span className="text-slate-500">na</span> <strong className="text-white">{testimonial.company}</strong>
            </p>
            {testimonial.location && (
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {testimonial.location}
              </p>
            )}
          </div>
        </div>

        {/* Rating and Meta Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Avaliação Prestada:</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <span>{testimonial.rating.toFixed(1)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Categoria:</span>
            <span className="font-semibold text-blue-300">{testimonial.categoryLabel}</span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 block mb-1">Data de Conclusão:</span>
            <span className="font-semibold text-slate-200 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(testimonial.date).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Project Title & Deliverables */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
            {testimonial.projectTitle}
          </h3>

          {/* Testimonial Quote */}
          <div className="bg-slate-800/40 border-l-4 border-blue-500 p-4 rounded-r-xl space-y-2">
            <div className="text-blue-400 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
              <Quote className="w-4 h-4" /> Depoimento Completo do Cliente
            </div>
            <p className="text-slate-200 text-base leading-relaxed italic">
              "{testimonial.comment}"
            </p>
          </div>
        </div>

        {/* Impact Metric & Tech Stack */}
        <div className="space-y-3">
          {testimonial.impactMetric && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs text-emerald-300 font-semibold uppercase block">Impacto e Resultado Alcançado</span>
                <span className="text-sm font-bold text-white">{testimonial.impactMetric}</span>
              </div>
            </div>
          )}

          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-slate-400" /> Tecnologias e Metodologias Entregues:
            </span>
            <div className="flex flex-wrap gap-2">
              {testimonial.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onToggleLike(testimonial.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              testimonial.userLiked
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${testimonial.userLiked ? 'fill-white' : ''}`} />
            <span>Útil ({testimonial.likesCount})</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Copiado!' : 'Copiar Depoimento'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
