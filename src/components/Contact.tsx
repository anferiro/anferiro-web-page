'use client';

import { motion } from 'motion/react';
import { contactLinks } from '@/data/content';
import { useLang } from '@/i18n/LanguageProvider';
import { Reveal, Stagger, StaggerItem } from './Reveal';

export function Contact() {
  const { t } = useLang();
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <Reveal>
          <h2 className="h2">{t('contact.title')}</h2>
          <p className="contact-sub">{t('contact.subtitle')}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <motion.a className="contact-mail" href="https://www.linkedin.com/in/anferiro/" target="_blank" rel="noopener" whileHover="hover" initial="rest">
            <span className="contact-mail-text">
              linkedin.com/in/anferiro
              <motion.span className="contact-line" variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }} />
            </span>
            <motion.span className="contact-arrow" aria-hidden variants={{ rest: { x: 0, y: 0 }, hover: { x: 8, y: -8 } }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>↗</motion.span>
          </motion.a>
        </Reveal>
        <Stagger className="contact-links">
          {contactLinks.map((l) => (
            <StaggerItem key={l.label}>
              <a href={l.href} {...(l.href.startsWith('mailto') ? {} : { target: '_blank', rel: 'noopener' })}>{l.label}</a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
