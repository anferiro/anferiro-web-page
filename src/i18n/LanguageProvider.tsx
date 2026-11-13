'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import translations from './translations.json';

export type Lang = 'en' | 'es';

type Ctx = { lang: Lang; t: (key: string) => string; toggle: () => void };

const LanguageContext = createContext<Ctx>({ lang: 'en', t: (k) => k, toggle: () => {} });

function lookup(lang: Lang, key: string): string {
  const value = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], translations[lang]);
  return typeof value === 'string' ? value : key;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  // Same storage key the article pages use, so the choice follows the visitor everywhere.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('language');
      if (saved === 'es' || saved === 'en') setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((l) => {
      const next: Lang = l === 'en' ? 'es' : 'en';
      try { localStorage.setItem('language', next); } catch {}
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(() => ({ lang, toggle, t: (k) => lookup(lang, k) }), [lang, toggle]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
