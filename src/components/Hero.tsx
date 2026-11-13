'use client';

import { motion, useScroll, useTransform, type Variants } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';
import { useLang } from '@/i18n/LanguageProvider';

const ease = [0.16, 1, 0.3, 1] as const;
const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } };
const rise: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } };

export function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  return (
    <section id="home" className="hero" ref={ref}>
      <div className="wrap hero-in">
        <motion.div className="hero-photo-wrap" style={{ y: photoY }}>
          <motion.span
            className="hero-halo"
            aria-hidden
            animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.1 }}
          >
            <Image className="hero-photo" src="/img/bio-photo.jpg" width={192} height={192} alt="Andres Rincon" priority />
          </motion.div>
        </motion.div>

        <motion.div className="hero-text" style={{ y: textY }} variants={parent} initial="hidden" animate="show">
          <h1 className="hero-name">
            <span className="mask">
              <motion.span style={{ display: 'block' }} initial={{ y: '115%' }} animate={{ y: '0%' }} transition={{ duration: 0.95, ease, delay: 0.15 }}>
                {t('hero.name')}
              </motion.span>
            </span>
          </h1>
          <motion.p className="hero-role" variants={rise}>{t('site.role')}</motion.p>
          <motion.p className="hero-lead" variants={rise}>{t('hero.subtitle')}</motion.p>
          <motion.p className="hero-sub" variants={rise}>{t('hero.description')}</motion.p>
          <motion.p className="hero-actions" variants={rise}>
            <motion.a className="btn" href="#writing" whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              {t('hero.readArticles')}
              <motion.span className="btn-arrow" aria-hidden initial={{ x: 0 }} whileHover={{ x: 4 }}>→</motion.span>
            </motion.a>
            <a className="link" href="https://anferiro.medium.com" target="_blank" rel="noopener">Medium</a>
            <a className="link" href="https://open.substack.com/pub/anferiro" target="_blank" rel="noopener">Substack</a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
