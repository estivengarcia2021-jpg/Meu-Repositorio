import React from 'react';
import { Search, Filter, ArrowUpDown, Star } from 'lucide-react';
import { ServiceCategory, SortOption } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ServiceCategory;
  onCategoryChange: (cat: ServiceCategory) => void;
  selectedRating: number; // 0 for all, or 5, 4
  onRatingChange: (r: number) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
}

const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'todos', label: 'Todos os Projetos' },
  { id: 'web-apps', label: 'SaaS & Web Apps' },
  { id: 'e-commerce', label: 'E-commerce' },
  { id: 'ui-ux', label: 'UI/UX & Landing Pages' },
  { id: 'performance-seo', label: 'Otimização & Performance' },
  { id: 'mobile-pwa', label: 'Mobile & PWA' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  sortBy,
  onSortChange,
  totalResults
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8 shadow-md">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Top Controls: Search Bar & Select Dropdowns */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por cliente, empresa, tecnologia ou palavra-chave..."
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-700 px-2 py-0.5 rounded cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Rating Filter & Sort Selector */}
          <div className="flex items-center gap-2.5">
            {/* Rating Filter Dropdown */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <select
                value={selectedRating}
                onChange={(e) => onRatingChange(Number(e.target.value))}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value={0} className="bg-slate-800 text-slate-100">Todas as Estrelas</option>
                <option value={5} className="bg-slate-800 text-slate-100">Apenas 5 ★★★★★</option>
                <option value={4} className="bg-slate-800 text-slate-100">4 ★ ou mais</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="recent" className="bg-slate-800 text-slate-100">Mais Recentes</option>
                <option value="rating-high" className="bg-slate-800 text-slate-100">Maior Avaliação</option>
                <option value="likes" className="bg-slate-800 text-slate-100">Mais Curtidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-medium shrink-0 hidden sm:block">
            {totalResults} {totalResults === 1 ? 'depoimento encontrado' : 'depoimentos encontrados'}
          </div>
        </div>

      </div>
    </div>
  );
};
