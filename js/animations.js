/* =============================================================
   animations.js — anferiro.me
   Scroll reveal · Hero role cycler · Reading progress
   ============================================================= */

(function () {
  'use strict';

  /* ── 1. Navbar: class-based scroll (overrides script.js inline) ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const tick = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', tick, { passive: true });
    tick();

    /* Also clear any inline styles script.js may have set */
    const originalOnScroll = window.onscroll;
    window.addEventListener('scroll', () => {
      if (navbar.style.background) {
        navbar.style.background = '';
        navbar.style.boxShadow  = '';
      }
    }, { passive: true });
  }

  /* ── 2. Scroll reveal ───────────────────────────────────────── */
  function initReveal() {
    /* Auto-tag section headers and cards not already tagged */
    const autoTargets = [
      '.featured-article .featured-inner',
      '.bio-compact',
      '.section-header',
      '.filter-tabs',
      '.posts-feed .post-card',
      '.quotes-grid .quote-card',
      '.bible-quote-item',
      '.contact-info .contact-item',
    ];
    autoTargets.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (!el.hasAttribute('data-reveal')) {
          el.setAttribute('data-reveal', '');
          if (i > 0 && i < 7) el.setAttribute('data-reveal-delay', String(i));
        }
      });
    });

    /* Article cards get staggered delay */
    document.querySelectorAll('.article-card').forEach((card, i) => {
      card.setAttribute('data-reveal', '');
      card.setAttribute('data-reveal-delay', String(Math.min(i + 1, 6)));
    });

    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
  }

  /* ── 3. Hero role cycler (typewriter) ───────────────────────── */
  function initRoleCycler() {
    const el = document.querySelector('.hero-role');
    if (!el) return;

    const roles = [
      'Engineering Manager',
      'Solution Architect',
      'AI Practitioner',
      'Tech Leader',
      'Continuous Learner',
    ];

    let ri = 0, ci = 0, deleting = false;

    function tick() {
      const word = roles[ri];

      if (deleting) {
        ci--;
      } else {
        ci++;
      }

      el.textContent = word.substring(0, ci);

      let delay = deleting ? 55 : 95;

      if (!deleting && ci === word.length) {
        delay = 2200;
        deleting = true;
      } else if (deleting && ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        delay = 350;
      }

      setTimeout(tick, delay);
    }

    setTimeout(tick, 900);
  }

  /* ── 4. Reading progress bar ────────────────────────────────── */
  function initReadingProgress() {
    if (!document.querySelector('.article-body')) return;

    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = Math.min(Math.max(pct, 0), 100) + '%';
    }, { passive: true });
  }

  /* ── 5. Smooth hero scroll indicator ────────────────────────── */
  function initScrollIndicator() {
    const ind = document.querySelector('.hero-scroll-indicator');
    if (!ind) return;
    ind.addEventListener('click', () => {
      const next = document.querySelector('.featured-article, .bio, #bio');
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
    ind.style.cursor = 'pointer';
  }

  /* ── Init ───────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initReveal();
      initRoleCycler();
      initReadingProgress();
      initScrollIndicator();
    });
  } else {
    initReveal();
    initRoleCycler();
    initReadingProgress();
    initScrollIndicator();
  }

})();
