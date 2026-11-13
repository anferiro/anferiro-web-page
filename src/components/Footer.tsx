'use client';

import { useLang } from '@/i18n/LanguageProvider';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <p>{t('site.legal')}</p>
        <p>
          {t('site.credit')} <a href="https://commons.wikimedia.org/wiki/File:Manhattan_Bridge_Construction_1909.jpg">“Manhattan Bridge Construction 1909”</a>, Irving Underhill,{' '}
          <a href="https://creativecommons.org/publicdomain/mark/1.0/">public domain</a>, via Wikimedia Commons.
        </p>
      </div>
    </footer>
  );
}
