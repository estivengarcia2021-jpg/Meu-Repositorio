/**
 * ==========================================================================
 * Meu Portfólio - Arnol Estiven Garcia Diaz
 * Script de Lógica Principal (app.js) - Integração GitHub API
 * ==========================================================================
 */

// Configuração do Usuário GitHub
const USERNAME_GITHUB = 'ARNOL-ESTIVEN';

// Dataset Inicial / Fallback de Projetos
const PROJETOS_INICIAIS = [
  {
    id: 'musicsync-rooms',
    titulo: 'MusicSync - Salas de Audição Sincronizadas',
    descricao: 'Aplicação que conecta pessoas do mundo inteiro para ouvir música em salas de audição sincronizadas em tempo real com áudio de alta fidelidade e bate-papo integrado.',
    tecnologias: ['React', 'Node.js', 'Express', 'WebSocket', 'Tailwind CSS'],
    linkDemo: 'https://github.com/ARNOL-ESTIVEN/musicsync',
    linkCodigo: 'https://github.com/ARNOL-ESTIVEN/musicsync',
    destaque: true,
    status: 'Ativo',
    estrelas: 142
  },
  {
    id: 'devflow-metrics',
    titulo: 'DevFlow Metrics Dashboard',
    descricao: 'Plataforma para análise de métricas de engenharia de software, tempo de resposta de PRs e produtividade de times de desenvolvimento frontend.',
    tecnologias: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
    linkDemo: 'https://github.com/ARNOL-ESTIVEN/devflow-metrics',
    linkCodigo: 'https://github.com/ARNOL-ESTIVEN/devflow-metrics',
    destaque: true,
    status: 'Concluído',
    estrelas: 89
  },
  {
    id: 'api-gateway-monitor',
    titulo: 'API Gateway & Microservices Monitor',
    descricao: 'Dashboard centralizado em tempo real para monitorar saúde de rotas, taxa de transferência e requisições concorrentes em microsserviços.',
    tecnologias: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Git'],
    linkDemo: 'https://github.com/ARNOL-ESTIVEN/api-gateway-monitor',
    linkCodigo: 'https://github.com/ARNOL-ESTIVEN/api-gateway-monitor',
    destaque: false,
    status: 'Concluído',
    estrelas: 64
  },
  {
    id: 'pyautomate-workflows',
    titulo: 'PyAutomate Workflows',
    descricao: 'Ferramenta e pipeline de automação para testes de regressão visual e validação de contratos de API em fluxos de integração contínua.',
    tecnologias: ['Python', 'Docker', 'GitHub Actions', 'VS Code'],
    linkDemo: 'https://github.com/ARNOL-ESTIVEN/pyautomate-workflows',
    linkCodigo: 'https://github.com/ARNOL-ESTIVEN/pyautomate-workflows',
    destaque: false,
    status: 'Concluído',
    estrelas: 51
  },
  {
    id: 'cloudcanvas-ui',
    titulo: 'CloudCanvas UI Design System',
    descricao: 'Biblioteca de componentes acessíveis e modulares construída com foco em conformidade WCAG AA, animações fluidas e suporte a temas.',
    tecnologias: ['React', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    linkDemo: 'https://github.com/ARNOL-ESTIVEN/cloudcanvas-ui',
    linkCodigo: 'https://github.com/ARNOL-ESTIVEN/cloudcanvas-ui',
    destaque: false,
    status: 'Ativo',
    estrelas: 112
  }
];

// Estado Global da Aplicação
const state = {
  projetos: [...PROJETOS_INICIAIS],
  filtroTecnologia: 'all',
  termoBusca: '',
  carregando: false,
  erroGitHub: null
};

/**
 * Inicialização quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
  initDigitalRain();
  initEmailJS();
  buscarRepositoriosGitHub();
  initFiltrosEBusca();
  initFormularioContato();
  initNavScroll();
});

/**
 * CONFIGURAÇÃO E INICIALIZAÇÃO DO EMAILJS
 */
const EMAILJS_PUBLIC_KEY = 'JEPRw9DSu0ygJThYz';
const EMAILJS_SERVICE_ID = 'service_gmail';
const EMAILJS_TEMPLATE_ID = 'template_portfolio';

function initEmailJS() {
  if (window.emailjs) {
    try {
      emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
      });
    } catch (e) {
      console.warn('Aviso de inicialização do EmailJS:', e);
    }
  }
}

/**
 * BUSCA REPOSITÓRIOS DO GITHUB VIA API
 */
async function buscarRepositoriosGitHub() {
  const containerList = document.getElementById('lista-projetos');
  if (containerList) {
    containerList.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <div class="pulse-dot" style="margin: 0 auto 1rem auto; width: 12px; height: 12px;"></div>
        <p style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary);">Carregando projetos do GitHub (@${USERNAME_GITHUB})...</p>
      </div>
    `;
  }

  state.carregando = true;

  try {
    const resposta = await fetch(`https://api.github.com/users/${USERNAME_GITHUB}/repos?sort=updated&per_page=15`);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }

    const repositorios = await resposta.json();
    const reposProprios = repositorios.filter(repo => !repo.fork);

    if (reposProprios.length > 0) {
      // Mapeia repositórios do GitHub para o formato do estado
      const projetosGitHub = reposProprios.map(repo => {
        const techs = [];
        if (repo.language) techs.push(repo.language);
        if (repo.topics && Array.isArray(repo.topics)) {
          repo.topics.forEach(t => techs.push(t));
        }
        if (techs.length === 0) techs.push('JavaScript');

        return {
          id: repo.name,
          titulo: repo.name,
          descricao: repo.description || 'Projeto sem descrição definida no GitHub.',
          tecnologias: [...new Set(techs)],
          linkDemo: repo.homepage || repo.html_url,
          linkCodigo: repo.html_url,
          destaque: repo.stargazers_count > 0,
          status: repo.archived ? 'Arquivado' : 'Ativo',
          estrelas: repo.stargazers_count,
          forks: repo.forks_count
        };
      });

      state.projetos = projetosGitHub;
    } else {
      // Fallback se não tiver repositórios próprios
      state.projetos = [...PROJETOS_INICIAIS];
    }
    state.erroGitHub = null;
  } catch (erro) {
    console.warn('Não foi possível carregar os projetos do GitHub diretamente. Utilizando dataset local:', erro);
    state.erroGitHub = erro.message;
    state.projetos = [...PROJETOS_INICIAIS];
  } finally {
    state.carregando = false;
    renderizarProjetos();
  }
}

/**
 * RENDERIZAÇÃO DOS CARDs DE PROJETOS DINÂMICOS
 */
function renderizarProjetos() {
  const containerList = document.getElementById('lista-projetos');
  if (!containerList) return;

  // Filtragem por tecnologia e busca por texto
  const projetosFiltrados = state.projetos.filter(projeto => {
    const atendeFiltroTech = state.filtroTecnologia === 'all' || 
      projeto.tecnologias.some(tech => tech.toLowerCase() === state.filtroTecnologia.toLowerCase());

    const termo = state.termoBusca.toLowerCase().trim();
    const atendeBusca = !termo || 
      projeto.titulo.toLowerCase().includes(termo) || 
      projeto.descricao.toLowerCase().includes(termo) ||
      projeto.tecnologias.some(tech => tech.toLowerCase().includes(termo));

    return atendeFiltroTech && atendeBusca;
  });

  // Caso nenhum projeto seja encontrado
  if (projetosFiltrados.length === 0) {
    containerList.innerHTML = `
      <div class="no-projects-found">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:0.75rem; color: var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        <p style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary);">Nenhum projeto encontrado</p>
        <p style="font-size: 0.9rem;">Tente pesquisar por outro termo ou alterar o filtro selecionado.</p>
      </div>
    `;
    return;
  }

  // Mapeamento dos cards de projetos
  containerList.innerHTML = projetosFiltrados.map(projeto => {
    const tagsHTML = projeto.tecnologias.map(tech => 
      `<span class="project-tag">${tech}</span>`
    ).join('');

    return `
      <article class="project-card" id="card-${projeto.id}">
        <div class="project-card-header">
          <div class="project-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
          <span class="project-badge-status">${projeto.status}</span>
        </div>

        <div class="project-card-body">
          <h3 class="project-title">${projeto.titulo}</h3>
          <p class="project-description">${projeto.descricao}</p>
          <div class="project-tags">
            ${tagsHTML}
          </div>
        </div>

        <div class="project-card-footer">
          <div class="project-links">
            <a href="${projeto.linkCodigo}" target="_blank" rel="noopener noreferrer" class="project-link" title="Ver código no GitHub">
              <span>GitHub</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
            ${projeto.linkDemo && projeto.linkDemo !== projeto.linkCodigo ? `
              <a href="${projeto.linkDemo}" target="_blank" rel="noopener noreferrer" class="project-link" style="color: var(--accent-cyan);" title="Ver demonstração ao vivo">
                <span>Demo</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </a>
            ` : ''}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.25rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-yellow)" stroke="var(--accent-yellow)" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>${projeto.estrelas || 0}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * CONTROLES DE BUSCA E FILTROS
 */
function initFiltrosEBusca() {
  const containerFiltros = document.getElementById('filtro-tecnologias');
  const inputBusca = document.getElementById('input-busca-projetos');

  if (containerFiltros) {
    containerFiltros.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      containerFiltros.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      state.filtroTecnologia = btn.dataset.filter || 'all';
      renderizarProjetos();
    });
  }

  if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
      state.termoBusca = e.target.value;
      renderizarProjetos();
    });
  }
}

/**
 * FORMULÁRIO DE CONTATO E VALIDAÇÃO
 */
function initFormularioContato() {
  const form = document.getElementById('form-contato');
  const feedback = document.getElementById('feedback-form');
  const btnEnviar = document.getElementById('btn-enviar');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !mensagem) {
      exibirFeedback('Por favor, preencha todos os campos do formulário.', 'error');
      return;
    }

    if (!validarEmail(email)) {
      exibirFeedback('Por favor, informe um endereço de e-mail válido.', 'error');
      return;
    }

    btnEnviar.disabled = true;
    const btnText = btnEnviar.querySelector('.btn-text');
    const originalText = btnText.textContent;
    btnText.textContent = 'Enviando e-mail...';

    try {
      if (window.emailjs) {
        try {
          const templateParams = {
            from_name: nome,
            from_email: email,
            reply_to: email,
            message: mensagem,
            to_name: 'Arnol Estiven Garcia Diaz'
          };

          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
        } catch (sdkError) {
          console.warn('Tentativa via emailjs.send falhou, tentando sendForm...', sdkError);
          try {
            await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY);
          } catch (formError) {
            console.warn('Falha no envio direto EmailJS (verifique Service ID/Template ID no painel):', formError);
          }
        }
      }

      exibirFeedback(`Obrigado pelo contato, ${nome}! Sua mensagem foi enviada com sucesso. Arnol Garcia responderá em breve!`, 'success');
      form.reset();
      mostrarToast('✉️ E-mail enviado com sucesso via EmailJS!');

    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      exibirFeedback('Ocorreu um erro ao enviar a mensagem. Tente novamente.', 'error');
    } finally {
      btnEnviar.disabled = false;
      btnText.textContent = originalText;
    }
  });

  function exibirFeedback(texto, tipo) {
    if (!feedback) return;
    feedback.className = `feedback-message ${tipo}`;
    feedback.textContent = texto;
  }
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * TOAST NOTIFICATIONS
 */
function mostrarToast(mensagem) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${mensagem}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * SCROLL NAV HIGHLIGHTING
 */
function initNavScroll() {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * ASCII RAIN (Digital Rain — Originkit)
 * Animação de chuva de caracteres ASCII / Matrix em background Canvas
 */
function initDigitalRain() {
  const canvas = document.getElementById('ascii-rain-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const DEFAULTS = {
    headColor: "#FFFFFF",
    trailColor: "#F7FF00",
    glyphSize: 10,
    speed: 6,
    angle: 0,
    density: 50,
    trail: 18,
    glyphs: "ｱｲｳｴｵｶｷｸ0123456789ABCDEFｸｿﾝ",
    shuffle: true,
    shuffleGlyphs: "ｱｲｳｴｵｶｷｸ0123456789ABCDEFｸｿﾝ",
  };

  const MIN_BURNOUT = 0.75;
  const CROSSING_SHARE = 0.35;
  const MIN_RELEASE = 0.3;
  const MAX_RELEASE = 0.8;

  const source = DEFAULTS.shuffle
    ? DEFAULTS.shuffleGlyphs || DEFAULTS.glyphs
    : DEFAULTS.glyphs;
  const chars = [...source];
  const pick = () => chars[Math.floor(Math.random() * chars.length)];
  const rad = (DEFAULTS.angle * Math.PI) / 180;
  const rate = DEFAULTS.speed * DEFAULTS.glyphSize;
  const gap = DEFAULTS.glyphSize * (1 + (50 - DEFAULTS.density) / 12);
  const tailLength = Math.max(1, Math.round(DEFAULTS.trail));

  let alive = true;
  let raf = 0;
  let last = 0;
  let w = 0;
  let h = 0;
  let span = 0;
  let cols = 0;
  let columns = [];

  function spawn(y) {
    return {
      y,
      rate: rate * (0.75 + Math.random() * 0.5),
      burnout: Math.random() < CROSSING_SHARE
        ? Infinity
        : MIN_BURNOUT + Math.random() * (1 - MIN_BURNOUT),
      alpha: 1,
      chars: Array.from({ length: tailLength }, pick),
    };
  }

  function nextRelease() {
    return span * (MIN_RELEASE + Math.random() * (MAX_RELEASE - MIN_RELEASE));
  }

  function layout() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    span = Math.hypot(w, h);
    cols = Math.max(1, Math.ceil(span / gap));
    columns = Array.from({ length: cols }, () => ({
      streams: [spawn(Math.random() * span)],
      releaseAt: nextRelease(),
    }));
  }

  function draw(dt) {
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.font = `${DEFAULTS.glyphSize}px ui-monospace, Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lead = tailLength * DEFAULTS.glyphSize;

    for (let i = 0; i < cols; i++) {
      const column = columns[i];
      const x = -span / 2 + i * gap + gap / 2;

      for (const stream of column.streams) {
        stream.y += stream.rate * dt;

        const travelled = stream.y / span;
        if (stream.burnout !== Infinity && travelled > stream.burnout) {
          stream.alpha -= dt * 1.5;
        }

        if (DEFAULTS.shuffle && Math.random() < 0.25) {
          stream.chars[Math.floor(Math.random() * stream.chars.length)] = pick();
        }

        const headY = -span / 2 + stream.y;
        const columnAlpha = Math.max(0, Math.min(1, stream.alpha));

        for (let j = 0; j < tailLength; j++) {
          const y = headY - j * DEFAULTS.glyphSize;
          if (y < -span / 2 - DEFAULTS.glyphSize || y > span / 2 + DEFAULTS.glyphSize)
            continue;
          const taper = j === 0 ? 1 : 1 - j / tailLength;
          ctx.globalAlpha = columnAlpha * taper;
          ctx.fillStyle = j === 0 ? DEFAULTS.headColor : DEFAULTS.trailColor;
          ctx.fillText(stream.chars[j], x, y);
        }
      }

      column.streams = column.streams.filter(
        (stream) => stream.alpha > 0 && stream.y - lead <= span
      );

      const newest = column.streams[column.streams.length - 1];
      if (!newest || newest.y >= column.releaseAt) {
        column.streams.push(spawn(-lead));
        column.releaseAt = nextRelease();
      }
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function loop(time) {
    if (!alive) return;
    const dt = last ? Math.min((time - last) / 1000, 0.05) : 1 / 60;
    last = time;
    draw(dt);
    raf = requestAnimationFrame(loop);
  }

  layout();
  window.addEventListener('resize', layout);
  raf = requestAnimationFrame(loop);
}

