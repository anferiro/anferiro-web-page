'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';
import { useLang } from '@/i18n/LanguageProvider';
import { Reveal } from './Reveal';

export function About() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section id="about" className="about" ref={ref}>
      <span id="bio" className="anchor" />
      <div className="wrap about-in">
        <Reveal className="about-text">
          <h2 className="h2">{t('bio.title')}</h2>
          <p className="prose">
            {t('site.a1')}<strong>{t('site.a2')}</strong>{t('site.a3')}{t('site.a4')}{t('site.a5')}{t('site.a6')}{t('site.a7')}{t('site.a8')}
            {t('site.a9')}{t('site.a10')}{t('site.a11')}{t('site.a12')}{t('site.a13')}{t('site.a14')}{t('site.a15')}
            <a className="link" href="#contact">{t('site.a16')}</a>
          </p>
          <p className="prose prose-2">{t('hero.purpose')}</p>
        </Reveal>

        <figure className="bridge">
          <motion.div
            className="bridge-frame"
            initial={{ clipPath: 'inset(0 0 100% 0 round 12px)' }}
            whileInView={{ clipPath: 'inset(0 0 0% 0 round 12px)' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div className="bridge-parallax" style={{ y }}>
              <Image
                src="/assets/manhattan-bridge-construction-1909.jpg"
                width={1920}
                height={1157}
                sizes="(max-width: 820px) 100vw, 480px"
                alt="Photograph of the Manhattan Bridge in 1909: a suspension bridge with its roadway half built, crossing the East River above the rooftops of a ferry terminal."
              />
            </motion.div>
          </motion.div>
          <Reveal delay={0.3}>
            <figcaption>{t('site.bridgeCap')}</figcaption>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}
