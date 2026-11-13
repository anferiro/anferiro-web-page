'use client';

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { articles, topicKey, type Article, type Topic } from '@/data/content';
import { useLang } from '@/i18n/LanguageProvider';
import { Reveal } from './Reveal';

type Filter = 'all' | Topic;
const filters: { id: Filter; key: string }[] = [
  { id: 'all', key: 'filter.all' },
  { id: 'ai', key: 'filter.ai' },
  { id: 'architecture', key: 'filter.architecture' },
  { id: 'leadership', key: 'filter.leadership' },
];

/** A number that counts up to its value. */
function Count({ to }: { to: number }) {
  const v = useMotionValue(0);
  const rounded = useTransform(v, (n) => Math.round(n));
  useEffect(() => {
    const controls = animate(v, to, { duration: 0.8, ease: 'easeOut' });
    return () => controls.stop();
  }, [to, v]);
  return <motion.span>{rounded}</motion.span>;
}

function Card({ a, index, latest }: { a: Article; index: number; latest: boolean }) {
  const { t, lang } = useLang();
  const date = new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(a.date));
  const ext = a.external ? { target: '_blank', rel: 'noopener' } : {};

  return (
    <motion.li
      layout
      className="entry"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay: (index % 3) * 0.07, layout: { type: 'spring', stiffness: 380, damping: 36 } }}
      whileHover="hover"
    >
      <div className={`entry-cover${a.image ? '' : ' is-label'}`}>
        {a.image ? (
          <motion.div className="entry-media" variants={{ hover: { scale: 1.05 } }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}>
            <Image className="entry-thumb" src={a.image.src} alt={a.image.alt} width={a.image.width} height={a.image.height} sizes="(max-width: 700px) 100vw, 360px" />
          </motion.div>
        ) : (
          <span className="entry-label">{t(topicKey[a.topic])}</span>
        )}
      </div>
      <div className="entry-main">
        <h3 className="entry-title">
          <a href={a.href} {...ext}>{t(a.title)}</a>
          <motion.span className="entry-arrow" aria-hidden variants={{ hover: { x: 4, y: -4, opacity: 1 } }} initial={{ opacity: 0.35 }}>↗</motion.span>
        </h3>
        <p className="entry-excerpt">{t(a.excerpt)}</p>
        <p className="entry-meta">
          {latest && <span className="signal">{t('featured.label')}</span>}
          <time dateTime={a.date}>{date}</time>
          <span className="tag">{t(topicKey[a.topic])}</span>
          {a.links?.map((l) => (
            <a key={l.href} href={l.href} {...(l.local ? {} : { target: '_blank', rel: 'noopener' })}>
              {l.labelKey ? t(l.labelKey) : l.label}{l.local ? '' : ' ↗'}
            </a>
          ))}
          {!a.links && a.external && <span>{a.href.includes('substack') ? 'Substack' : 'Medium'} ↗</span>}
        </p>
      </div>
    </motion.li>
  );
}

export function Articles() {
  const { t } = useLang();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const counts = useMemo(
    () => Object.fromEntries(filters.map((f) => [f.id, articles.filter((a) => f.id === 'all' || a.topic === f.id).length])) as Record<Filter, number>,
    [],
  );

  const q = query.trim().toLowerCase();
  const shown = articles.filter((a) => {
    if (filter !== 'all' && a.topic !== filter) return false;
    if (!q) return true;
    return `${t(a.title)} ${t(a.excerpt)} ${t(topicKey[a.topic])} ${a.tags}`.toLowerCase().includes(q);
  });

  return (
    <section id="writing" className="writing alt">
      <span id="articles" className="anchor" />
      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="h2">{t('nav.articles')}</h2>
          <label className="search">
            <span className="sr">{t('site.search')}</span>
            <input type="search" autoComplete="off" placeholder={t('site.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
        </Reveal>

        <Reveal className="chips" delay={0.08}>
          <div role="group" aria-label="Topics" className="chips-row">
            {filters.map((f) => (
              <button key={f.id} type="button" className={`chip${filter === f.id ? ' is-on' : ''}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {filter === f.id && <motion.span layoutId="chip-bg" className="chip-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className="chip-text">
                  {t(f.key)} <span className="chip-n"><Count to={counts[f.id]} /></span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <p className="search-count" role="status" aria-live="polite">{shown.length === 0 ? t('site.noResults') : ''}</p>

        <motion.ul className="ledger" layout>
          <AnimatePresence mode="popLayout">
            {shown.map((a, i) => (
              <Card key={a.id} a={a} index={i} latest={a.id === 'knowledge'} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
