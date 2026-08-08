import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsSection } from './components/StatsSection';
import { FilterBar } from './components/FilterBar';
import { TestimonialCard } from './components/TestimonialCard';
import { TestimonialDetailModal } from './components/TestimonialDetailModal';
import { AddTestimonialModal } from './components/AddTestimonialModal';
import { AiSummaryModal } from './components/AiSummaryModal';
import { ContactModal } from './components/ContactModal';
import { GithubProjects } from './components/GithubProjects';
import { Toast } from './components/Toast';

import { ClientTestimonial, ServiceCategory, SortOption, RatingStats } from './types';
import {
  getStoredTestimonials,
  toggleLikeTestimonial,
  addTestimonial
} from './lib/storage';
import { INITIAL_STATS } from './data/testimonials';
import { MessageSquare, Star, Plus, ShieldCheck, Heart, Sparkles, Filter, Github, Layers, Mail } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'testimonials' | 'github'>('testimonials');
  const [testimonials, setTestimonials] = useState<ClientTestimonial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('todos');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Modals state
  const [selectedDetail, setSelectedDetail] = useState<ClientTestimonial | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getStoredTestimonials();
    setTestimonials(loaded);
  }, []);

  const handleToggleLike = (id: string) => {
    const { testimonials: updated, liked } = toggleLikeTestimonial(id);
    setTestimonials(updated);

    if (selectedDetail && selectedDetail.id === id) {
      const refreshedItem = updated.find(t => t.id === id);
      if (refreshedItem) setSelectedDetail(refreshedItem);
    }

    setToastMsg(liked ? 'Obrigado por marcar este depoimento como útil! 👍' : 'Voto removido.');
  };

  const handleAddTestimonialSubmit = (data: Parameters<typeof addTestimonial>[0]) => {
    const updated = addTestimonial(data);
    setTestimonials(updated);
    setToastMsg('🎉 Seu depoimento foi publicado com sucesso!');
  };

  // Derived filtered & sorted list
  const filteredTestimonials = useMemo(() => {
    return testimonials
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'todos' && item.category !== selectedCategory) {
          return false;
        }

        // Rating filter
        if (selectedRating > 0 && item.rating < selectedRating) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.clientName.toLowerCase().includes(q);
          const matchCompany = item.company.toLowerCase().includes(q);
          const matchRole = item.role.toLowerCase().includes(q);
          const matchTitle = item.projectTitle.toLowerCase().includes(q);
          const matchComment = item.comment.toLowerCase().includes(q);
          const matchTags = item.tags.some(t => t.toLowerCase().includes(q));

          return matchName || matchCompany || matchRole || matchTitle || matchComment || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'rating-high') {
          return b.rating - a.rating;
        }
        if (sortBy === 'likes') {
          return b.likesCount - a.likesCount;
        }
        return 0;
      });
  }, [testimonials, selectedCategory, selectedRating, searchQuery, sortBy]);

  // Compute live stats
  const liveStats: RatingStats = useMemo(() => {
    if (testimonials.length === 0) return INITIAL_STATS;
    const total = testimonials.length;
    const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
    const fiveStar = testimonials.filter(t => t.rating === 5).length;
    const fourStar = testimonials.filter(t => t.rating === 4).length;
    const threeStar = testimonials.filter(t => t.rating <= 3).length;

    return {
      averageRating: Number((sum / total).toFixed(1)),
      totalReviews: total,
      fiveStarCount: fiveStar,
      fourStarCount: fourStar,
      threeStarCount: threeStar,
      satisfactionRate: 100,
      onTimeRate: 100,
      recommendationRate: 98
    };
  }, [testimonials]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Main Header Banner */}
        <Header
          totalReviews={liveStats.totalReviews}
          averageRating={liveStats.averageRating}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenAiSummary={() => setIsAiModalOpen(true)}
          onOpenContactModal={() => setIsContactModalOpen(true)}
        />

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'testimonials'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Depoimentos dos Clientes</span>
                <span className="ml-1 px-1.5 py-0.2 bg-slate-800 rounded-full text-[10px] text-blue-300">
                  {liveStats.totalReviews}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('github')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'github'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Github className="w-3.5 h-3.5" />
                <span>Projetos do GitHub API</span>
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px]">
                  Ao Vivo
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conectado a <strong className="text-white">estivengarcia2021</strong></span>
            </div>
          </div>
        </div>

        {/* Breakdown Stats Section (Shown on Testimonials tab) */}
        {activeTab === 'testimonials' && <StatsSection stats={liveStats} />}

        {/* Tab 1: Client Testimonials View */}
        {activeTab === 'testimonials' && (
          <>
            {/* Filter & Search Bar */}
            <div id="reviews-section">
              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedRating={selectedRating}
                onRatingChange={setSelectedRating}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalResults={filteredTestimonials.length}
              />
            </div>

            {/* Testimonials Grid Section */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {filteredTestimonials.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      onToggleLike={handleToggleLike}
                      onSelect={(item) => setSelectedDetail(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Nenhuma avaliação encontrada</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Não encontramos nenhum depoimento com os filtros selecionados. Tente buscar por outros termos ou limpar os filtros.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('todos');
                      setSelectedRating(0);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Limpar Todos os Filtros
                  </button>
                </div>
              )}

              {/* Bottom Floating CTA banner */}
              <div className="mt-14 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Atendimento de Excelência
                  </span>
                  <h3 className="text-xl font-bold text-white">Também foi atendido por Arnol Garcia?</h3>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                    Sua avaliação é muito importante para ajudar outras empresas e projetos a encontrarem soluções de desenvolvimento frontend de alto nível.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Enviar E-mail</span>
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Depoimento</span>
                  </button>
                </div>
              </div>
            </main>
          </>
        )}

        {/* Tab 2: GitHub Projects View */}
        {activeTab === 'github' && (
          <GithubProjects initialUsername="estivengarcia2021" />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-slate-400">
            <span>© {new Date().getFullYear()} Arnol Estiven Garcia Diaz</span>
            <span>•</span>
            <span>estivengarcia2021</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {liveStats.averageRating} Nota Média
            </span>
            <span>•</span>
            <span>{liveStats.totalReviews} Clientes Atendidos</span>
          </div>
        </div>
      </footer>

      {/* Modals & Toast */}
      <TestimonialDetailModal
        testimonial={selectedDetail}
        onClose={() => setSelectedDetail(null)}
        onToggleLike={handleToggleLike}
        onShowToast={(msg) => setToastMsg(msg)}
      />

      <AddTestimonialModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTestimonialSubmit}
      />

      <AiSummaryModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        testimonials={testimonials}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
    </div>
  );
}

