(() => {
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  $('#ano').textContent = new Date().getFullYear();

  const dividir = (no, k = { n: 0 }) => [...no.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const frag = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t => {
        if (!t.trim()) return frag.append(t);
        const w = document.createElement('span'); w.className = 'lw';
        w.innerHTML = `<span style="--i:${k.n++}">${t}</span>`; frag.append(w);
      });
      c.replaceWith(frag);
    } else dividir(c, k);
  });
  dividir($('#titulo'));
  $$('.beat').forEach(b => dividir(b));

  const btn = $('.menu-btn'), nav = $('#nav');
  const fechar = () => { nav.classList.remove('aberto'); document.documentElement.classList.remove('menu-aberto'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir menu'); };
  btn.onclick = () => {
    const a = nav.classList.toggle('aberto');
    document.documentElement.classList.toggle('menu-aberto', a);
    btn.setAttribute('aria-expanded', a); btn.setAttribute('aria-label', a ? 'Fechar menu' : 'Abrir menu');
  };
  $$('#nav a').forEach(a => a.addEventListener('click', fechar));
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('aberto')) { fechar(); btn.focus(); } });
  matchMedia('(min-width:961px)').addEventListener('change', e => e.matches && fechar());

  $$('.reveal').forEach((el, i) => el.style.setProperty('--d', (el.matches('.passos li') ? 0 : 0) + 'ms'));
  if ('IntersectionObserver' in window && !reduz) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); }
    }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('visivel'));

  const sec = $('#acolher'), fotos = $$('#arco img'), beats = $$('.beat'), ticks = $$('.portal-passos i');
  const lim = v => Math.min(1, Math.max(0, v));
  let idxAtual = -1;
  const portal = () => {
    const r = sec.getBoundingClientRect(), p = lim(-r.top / (r.height - innerHeight));
    const idx = p < .34 ? 0 : p < .67 ? 1 : 2;
    if (idx !== idxAtual) {
      idxAtual = idx;
      fotos.forEach((f, i) => f.classList.toggle('on', i === idx));
      beats.forEach((b, i) => { b.classList.toggle('on', i === idx); b.classList.toggle('passou', i < idx); });
    }
    ticks.forEach((t, i) => t.style.setProperty('--f', lim(p * 3 - i).toFixed(3)));
  };

  const falas = [
    'Quando a mente não desacelera e o corpo sente junto, a TCC ajuda a identificar pensamentos que alimentam a preocupação e a construir estratégias práticas para lidar com eles.',
    'Um espaço para olhar com mais gentileza para si mesma(o), reconhecer seu valor e se relacionar com suas qualidades e limites de forma mais equilibrada.',
    'Acolhimento e cuidado nos momentos de tristeza, cansaço e desânimo, com apoio para retomar o interesse pela vida e reorganizar a rotina no seu tempo.',
    'Aprender a dar nome ao que se sente, compreender suas reações e encontrar formas mais saudáveis de lidar com as emoções difíceis.',
    'Refletir sobre vínculos, limites e comunicação, para construir relações mais saudáveis com as pessoas ao seu redor e consigo mesma(o).',
    'Fases de transição, escolhas e novas responsabilidades pedem apoio. O acompanhamento ajuda adolescentes e adultos a atravessarem essas etapas com mais clareza.'
  ];
  const painel = $('#painel-texto'), abas = $$('.ajuda-lista button'), mob = () => matchMedia('(max-width:960px)').matches;
  abas.forEach((b, i) => {
    const d = document.createElement('div'); d.className = 'acc';
    d.innerHTML = `<div class="acc-in"><div class="acc-box"><p>${falas[i]}</p><a class="link-seta" href="#contato">Quero conversar sobre isso</a></div></div>`;
    b.parentElement.append(d);
  });
  const mostrar = (i, alternar) => {
    const jaAtiva = abas[i].classList.contains('ativo');
    abas.forEach((b, k) => {
      const on = k === i && !(alternar && jaAtiva);
      b.classList.toggle('ativo', on); b.parentElement.classList.toggle('aberto', on); b.setAttribute('aria-expanded', on);
    });
    painel.classList.add('troca');
    setTimeout(() => { painel.textContent = falas[i]; painel.classList.remove('troca'); }, reduz ? 0 : 220);
  };
  abas.forEach((b, i) => {
    b.onclick = () => mostrar(i, mob());
    b.onmouseenter = () => !mob() && matchMedia('(hover:hover)').matches && !b.classList.contains('ativo') && mostrar(i);
  });
  const inicial = () => {
    const abrir = !mob();
    abas.forEach((b, k) => {
      const on = abrir && k === 0;
      b.classList.toggle('ativo', on); b.parentElement.classList.toggle('aberto', on); b.setAttribute('aria-expanded', on);
    });
    painel.textContent = falas[0];
  };
  inicial();
  let eraMob = mob();
  addEventListener('resize', () => { if (mob() !== eraMob) { eraMob = mob(); inicial(); } });

  const topo = $('#topo'), barra = $('#progresso'), imgs = $$('[data-parallax]');
  let t = false, pronto = false;
  const atualizar = () => {
    t = false;
    const vh = innerHeight, y = scrollY;
    topo.classList.toggle('rolou', y > 60);
    barra.style.width = (y / (document.documentElement.scrollHeight - vh) * 100) + '%';
    portal();
    if (reduz) return;
    imgs.forEach(img => {
      if (img.closest('.hero-foto') && !pronto && y < 5) return;
      const b = img.parentElement.getBoundingClientRect();
      if (b.bottom < 0 || b.top > vh) return;
      const c = (b.top + b.height / 2 - vh / 2) / vh;
      img.style.animation = img.closest('.hero-foto') ? 'none' : '';
      img.style.transform = `translateY(${c * -60}px) scale(${img.closest('.hero-foto') ? 1 + Math.max(0, y / vh) * .04 : 1.14})`;
    });
  };
  const pedir = () => { if (!t) { t = true; requestAnimationFrame(atualizar); } };
  addEventListener('scroll', pedir, { passive: true }); addEventListener('resize', pedir);
  setTimeout(() => { pronto = true; atualizar(); }, 2500);
  atualizar();
})();