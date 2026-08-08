import React, { useState } from 'react';
import { X, Star, Send, Building2, User, Sparkles, AlertCircle, MapPin } from 'lucide-react';
import { ServiceCategory } from '../types';

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testimonialData: {
    clientName: string;
    role: string;
    company: string;
    avatarUrl: string;
    rating: number;
    category: ServiceCategory;
    categoryLabel: string;
    projectTitle: string;
    comment: string;
    impactMetric?: string;
    tags: string[];
    location?: string;
  }) => void;
}

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  'todos': 'Geral',
  'web-apps': 'SaaS & Web App',
  'e-commerce': 'E-commerce & Vendas',
  'ui-ux': 'Design UI/UX & Landing Page',
  'performance-seo': 'Otimização de Performance & SEO',
  'mobile-pwa': 'Aplicação Mobile & PWA'
};

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
];

export const AddTestimonialModal: React.FC<AddTestimonialModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [clientName, setClientName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<ServiceCategory>('web-apps');
  const [projectTitle, setProjectTitle] = useState('');
  const [comment, setComment] = useState('');
  const [impactMetric, setImpactMetric] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_OPTIONS[0]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !company.trim() || !projectTitle.trim() || !comment.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    if (comment.trim().length < 15) {
      setErrorMsg('O comentário deve ter pelo menos 15 caracteres.');
      return;
    }

    const tags = tagsInput
      ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      : ['React', 'TypeScript', 'Tailwind CSS'];

    onSubmit({
      clientName: clientName.trim(),
      role: role.trim() || 'Cliente',
      company: company.trim(),
      avatarUrl,
      rating,
      category,
      categoryLabel: CATEGORY_LABELS[category] || 'Desenvolvimento Web',
      projectTitle: projectTitle.trim(),
      comment: comment.trim(),
      impactMetric: impactMetric.trim() || undefined,
      tags,
      location: location.trim() || undefined
    });

    // Reset form
    setClientName('');
    setRole('');
    setCompany('');
    setProjectTitle('');
    setComment('');
    setImpactMetric('');
    setTagsInput('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-6 sm:p-8 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Deixe sua Avaliação
          </div>
          <h2 className="text-2xl font-bold text-white">Publicar Depoimento de Cliente</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Compartilhe como foi sua experiência de trabalho com o desenvolvedor Arnol Estiven Garcia Diaz.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Avatar Selector */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Escolha uma foto de perfil:</label>
            <div className="flex items-center gap-3">
              {AVATAR_OPTIONS.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatarUrl(img)}
                  className={`relative rounded-full p-0.5 transition-all cursor-pointer ${
                    avatarUrl === img ? 'ring-2 ring-blue-500 scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt="Avatar option"
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=User&background=1e293b&color=38bdf8&font-size=0.45`;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Client Name & Role */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Seu Nome Completo <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Ana Souza"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Seu Cargo / Função</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Gerente de Projetos"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Company & Location */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Empresa ou Projeto <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex: Startup Tech"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Cidade / Estado</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Category & Rating */}
          <div className="grid sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tipo de Serviço</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="web-apps">SaaS & Web App</option>
                <option value="e-commerce">E-commerce</option>
                <option value="ui-ux">Design UI/UX & Landing Page</option>
                <option value="performance-seo">Otimização de Performance</option>
                <option value="mobile-pwa">Mobile & PWA</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Sua Avaliação (Estrelas)</label>
              <div className="flex items-center gap-1 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-300 ml-2 font-bold">{rating}/5</span>
              </div>
            </div>
          </div>

          {/* Project Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Título do Projeto / Entregável <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Ex: Novo Portal Web e Sistema de Login"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Seu Depoimento / Comentário <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descreva como foi trabalhar com Arnol, qualidade do código, pontualidade e resultados obtidos..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Impact Metric & Tags */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Métrica de Impacto (Opcional)</label>
              <input
                type="text"
                value={impactMetric}
                onChange={(e) => setImpactMetric(e.target.value)}
                placeholder="Ex: +50% em conversão"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Tecnologias Usadas (Separadas por vírgula)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: React, Tailwind, Next.js"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar Depoimento</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
