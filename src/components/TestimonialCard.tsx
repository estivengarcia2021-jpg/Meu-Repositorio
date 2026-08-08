import React from 'react';
import { Star, Quote, CheckCircle2, ThumbsUp, Building2, MapPin, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ClientTestimonial } from '../types';

interface TestimonialCardProps {
  testimonial: ClientTestimonial;
  onToggleLike: (id: string) => void;
  onSelect: (testimonial: ClientTestimonial) => void;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  onToggleLike,
  onSelect
}) => {
  return (
    <div
      className={`group relative bg-slate-800/70 hover:bg-slate-800 border ${
        testimonial.featured
          ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
          : 'border-slate-700/70 hover:border-slate-600'
      } rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4`}
    >
      {/* Featured Badge if applicable */}
      {testimonial.featured && (
        <div className="absolute -top-3 right-6 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
          <span>Destaque</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Top Header: Avatar, Name, Company, Stars */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={testimonial.avatarUrl}
              alt={testimonial.clientName}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-blue-500 transition-colors shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.clientName)}&background=1e293b&color=38bdf8&font-size=0.45`;
              }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-base leading-snug group-hover:text-blue-300 transition-colors">
                  {testimonial.clientName}
                </h3>
                {testimonial.verified && (
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-400 shrink-0"
                    title="Cliente Verificado"
                  />
                )}
              </div>
              <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-slate-500" />
                <span className="text-slate-300">{testimonial.role}</span> na{' '}
                <strong className="text-slate-200 font-semibold">{testimonial.company}</strong>
              </p>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700/60 shrink-0">
            <span className="text-xs font-bold text-amber-400">{testimonial.rating.toFixed(1)}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < testimonial.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Category & Project Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-semibold tracking-wide">
              {testimonial.categoryLabel}
            </span>
            {testimonial.location && (
              <span className="text-slate-500 text-[11px] flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> {testimonial.location}
              </span>
            )}
          </div>
          <h4 className="text-slate-200 font-bold text-sm leading-snug pt-1">
            {testimonial.projectTitle}
          </h4>
        </div>

        {/* Comment Body */}
        <div className="relative text-slate-300 text-sm leading-relaxed pl-3 border-l-2 border-blue-500/40 italic">
          <Quote className="w-5 h-5 text-blue-500/20 absolute -top-1 -left-2 rotate-180 pointer-events-none" />
          "{testimonial.comment}"
        </div>

        {/* Impact Metric highlight if present */}
        {testimonial.impactMetric && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Resultado: {testimonial.impactMetric}</span>
          </div>
        )}

        {/* Technology Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {testimonial.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-slate-400 text-[11px] font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Date, Likes, Detail Trigger */}
      <div className="border-t border-slate-700/60 pt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Concluído em {new Date(testimonial.date).toLocaleDateString('pt-BR')}</span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleLike(testimonial.id)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              testimonial.userLiked
                ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
            title="Marcar como depoimento útil"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${testimonial.userLiked ? 'fill-blue-400 text-blue-400' : ''}`} />
            <span>{testimonial.likesCount}</span>
          </button>

          <button
            onClick={() => onSelect(testimonial)}
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
          >
            <span>Ver Detalhes</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
