'use client';

import { verses } from '@/data/content';
import { useLang } from '@/i18n/LanguageProvider';
import { Reveal, Stagger, StaggerItem } from './Reveal';

export function Spiritual() {
  const { t } = useLang();
  return (
    <section id="keep-me-real" className="faith">
      <div className="wrap">
        <Reveal>
          <h2 className="h2">{t('spiritual.title')}</h2>
          <p className="faith-sub">{t('spiritual.subtitle')}</p>
        </Reveal>
        <Stagger className="verses">
          {verses.map((v) => (
            <StaggerItem key={v.ref} className="verse">
              <p className="verse-ref"><cite>{v.ref}</cite><span>{t(v.theme)}</span></p>
              <blockquote>{t(v.text)}</blockquote>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
