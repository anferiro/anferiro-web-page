'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useState } from 'react';
import { useLang } from '@/i18n/LanguageProvider';
import { ThemeToggle } from './ThemeToggle';

// anferiro = AN(drés) FE(lipe) RI(ncón) RO(dríguez): la marca nace del "a." y el hover despliega el nombre.
const NAME = [['an', 'drés '], ['fe', 'lipe '], ['ri', 'ncón '], ['ro', 'dríguez']] as const;

function Mark() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(id);
  }, []);
  return (
    <a
      className={open ? 'bar-mark is-open' : 'bar-mark'}
      href="#home"
      aria-label="anferiro: Andrés Felipe Rincón Rodríguez"
      title="Andrés Felipe Rincón Rodríguez"
    >
      <span className="mark-icon" aria-hidden>a<span className="mark-dot">.</span></span>
      <span className="mark-name" aria-hidden>
        {NAME.map(([pair, rest], i) => (
          <span key={pair} className="mark-pair" style={{ ['--i' as string]: i }}>
            {pair}
            <span className="mark-rest">{rest}</span>
          </span>
        ))}
      </span>
    </a>
  );
}

const links = [
  { id: 'writing', key: 'nav.articles' },
  { id: 'about', key: 'nav.bio' },
  { id: 'contact', key: 'nav.contact' },
];

export function Header() {
  const { t, lang, toggle } = useLang();
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const { scrollY } = useScroll();

  // Slide away while reading down, come back the moment the visitor scrolls up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    links.forEach((l) => { const el = document.getElementById(l.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <motion.header className="bar" animate={{ y: hidden ? '-100%' : '0%' }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
      <div className="wrap bar-in">
        <Mark />
        <nav className="bar-links" aria-label="Main">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''} data-hide-sm={l.id === 'about' ? '' : undefined}>
              {t(l.key)}
              {active === l.id && <motion.span layoutId="nav-underline" className="bar-underline" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            </a>
          ))}
          <ThemeToggle />
          <motion.button className="bar-lang" type="button" onClick={toggle} whileTap={{ scale: 0.92 }} title="Cambiar idioma / Switch language">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={lang} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }} style={{ display: 'block' }}>
                {lang === 'en' ? 'ES' : 'EN'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </nav>
      </div>
    </motion.header>
  );
}
