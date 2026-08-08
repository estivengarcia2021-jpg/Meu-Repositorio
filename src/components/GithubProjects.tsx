import React, { useState, useEffect } from 'react';
import { GitBranch, Star, ExternalLink, RefreshCw, Search, Github, Code2, Sparkles, FolderGit2, CheckCircle2 } from 'lucide-react';
import { GitHubRepo } from '../types';

interface GithubProjectsProps {
  initialUsername?: string;
}

export const GithubProjects: React.FC<GithubProjectsProps> = ({
  initialUsername = 'estivengarcia2021'
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [inputUser, setInputUser] = useState(initialUsername);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [apiSource, setApiSource] = useState<'github-api' | 'fallback'>('github-api');

  const fetchRepos = async (targetUser: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`/api/github-repos?username=${encodeURIComponent(targetUser)}`);
      if (response.ok) {
        const data = await response.json();
        setRepos(data.repos || []);
        setApiSource(data.source || 'github-api');
      } else {
        setErrorMsg('Não foi possível carregar os projetos no momento.');
      }
    } catch {
      setErrorMsg('Erro na conexão com o servidor de projetos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos(username);
  }, [username]);

  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUser.trim()) {
      setUsername(inputUser.trim());
    }
  };

  // Available languages
  const languages = Array.from(
    new Set(repos.map(r => r.language).filter(Boolean) as string[])
  );

  // Filtered repositories
  const filteredRepos = repos.filter(repo => {
    const matchSearch =
      repo.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchFilter.toLowerCase())) ||
      repo.topics.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchLang = selectedLanguage === 'all' || repo.language === selectedLanguage;

    return matchSearch && matchLang;
  });

  const getLanguageColor = (lang: string | null) => {
    switch (lang?.toLowerCase()) {
      case 'typescript': return 'bg-blue-500 text-blue-400 border-blue-500/30';
      case 'javascript': return 'bg-amber-500 text-amber-400 border-amber-500/30';
      case 'html': return 'bg-orange-500 text-orange-400 border-orange-500/30';
      case 'css': return 'bg-sky-500 text-sky-400 border-sky-500/30';
      case 'python': return 'bg-emerald-500 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <section className="bg-slate-900 border-b border-slate-800 py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={repos[0]?.owner?.avatar_url || '/avatar.jpg'}
              alt={username}
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-md shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/avatar.jpg';
              }}
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold uppercase tracking-wider">
                <Github className="w-3.5 h-3.5" /> Perfil Oficial do GitHub
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                Projetos & Repositórios Públicos
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
                Conectado ao perfil <strong className="text-blue-400">@{username}</strong>. Os repositórios são sincronizados e carregados via API oficial.
              </p>
            </div>
          </div>

          {/* GitHub Username Sync Form */}
          <form onSubmit={handleUserSearch} className="flex items-center gap-2">
            <div className="relative">
              <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputUser}
                onChange={(e) => setInputUser(e.target.value)}
                placeholder="Usuário GitHub"
                className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Conectar</span>
            </button>
          </form>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrar projetos por nome, descrição ou tag..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedLanguage('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                selectedLanguage === 'all'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Todas as Linguagens
            </button>
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                  selectedLanguage === lang
                    ? 'bg-blue-600 text-white font-semibold shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Repos Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-blue-400">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <p className="text-xs text-slate-400">Buscando repositórios no GitHub API...</p>
          </div>
        ) : filteredRepos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-200 group shadow-md"
              >
                <div className="space-y-3">
                  {/* Repo Title & Stars */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-white text-base hover:text-blue-300 transition-colors line-clamp-1"
                      >
                        {repo.name}
                      </a>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-700 text-xs font-semibold text-amber-400 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                    {repo.description || 'Sem descrição fornecida no repositório.'}
                  </p>

                  {/* Topics / Badges */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {repo.topics.slice(0, 4).map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-mono border border-blue-500/20"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Meta info */}
                <div className="border-t border-slate-700/60 pt-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    {repo.language && (
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                        <span className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language).split(' ')[0]}`} />
                        {repo.language}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <GitBranch className="w-3 h-3" /> {repo.forks_count}
                      </span>
                    )}
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium cursor-pointer"
                  >
                    <span>Ver no GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-10 text-center space-y-3">
            <p className="text-slate-300 text-sm">Nenhum repositório encontrado para o filtro digitado.</p>
            <button
              onClick={() => { setSearchFilter(''); setSelectedLanguage('all'); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Limpar Filtros de Repositório
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
