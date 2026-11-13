// anferiro.me — behaviour for the home page.
// Language switching lives in translations.js (data-i18n + #language-toggle).
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const t = key => (typeof i18n !== 'undefined' ? i18n.t(key) : key);

  /* Entrances: stagger the children of each section as it arrives */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  $$('section').forEach(sec => {
    $$('[data-in]', sec).forEach((el, i) => { el.style.setProperty('--d', Math.min(i, 6) * 60 + 'ms'); io.observe(el); });
  });

  /* Topic chips and search filter the articles */
  const entries = $$('.entry');
  const chips = $$('.chip');
  const search = $('#global-search');
  const count = $('#search-count');
  let filter = 'all';

  function apply() {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    entries.forEach(el => {
      const hay = (el.textContent + ' ' + el.dataset.category + ' ' + (el.dataset.tags || '')).toLowerCase();
      const ok = (filter === 'all' || el.dataset.category === filter) && (!q || hay.includes(q));
      el.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = shown ? '' : t('site.noResults');
  }
  function labels() {
    chips.forEach(b => {
      const f = b.dataset.filter;
      $('[data-count]', b).textContent = entries.filter(e => f === 'all' || e.dataset.category === f).length;
    });
    search.placeholder = t('site.search');
  }
  chips.forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.filter;
    chips.forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    apply();
  }));
  search.addEventListener('input', apply);

  /* Theme button */
  $('#theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Current section in the header */
  const navLinks = $$('.bar-links a[href^="#"]');
  const spy = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(a => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });

  /* i18n runs on DOMContentLoaded; refresh derived text after it and after each toggle */
  labels(); apply();
  document.addEventListener('DOMContentLoaded', () => { labels(); apply(); });
  $('#language-toggle').addEventListener('click', () => setTimeout(() => { labels(); apply(); }, 0));
})();
