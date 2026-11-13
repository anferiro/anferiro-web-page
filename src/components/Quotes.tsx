'use client';

import { motion } from 'motion/react';
import { quotes } from '@/data/content';
import { useLang } from '@/i18n/LanguageProvider';
import { Reveal, Stagger, StaggerItem } from './Reveal';

export function Quotes() {
  const { t } = useLang();
  return (
    <section id="quotes" className="quotes alt">
      <div className="wrap">
        <Reveal><h2 className="h2">{t('quotes.title')}</h2></Reveal>
        <Stagger className="quote-list">
          {quotes.map((q) => (
            <StaggerItem key={q.text} className="quote">
              <motion.div whileHover={{ x: 6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                <blockquote>{t(q.text)}</blockquote>
                <p className="quote-by"><cite>{q.by}</cite> · {t(q.cat)}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
