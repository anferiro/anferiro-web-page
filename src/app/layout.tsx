import type { Metadata, Viewport } from 'next';
import { DM_Mono, Montserrat } from 'next/font/google';
import Script from 'next/script';
import { MotionConfig } from 'motion/react';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import './globals.css';

const sans = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--next-sans', display: 'swap' });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--next-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://anferiro.me'),
  title: 'Andres Rincon · CTO',
  description: 'Andres Rincon, CTO in fintech. Writing about AI adoption, architecture design systems and principled leadership.',
  icons: { icon: '/img/favicon.png', apple: '/img/avatar_latest.png' },
  openGraph: {
    title: 'Andres Rincon · CTO',
    description: 'I help teams build better software through AI, architecture, and principled leadership.',
    images: ['/img/bio-photo.jpg'],
    url: 'https://anferiro.me',
    type: 'website',
  },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// Runs before first paint: theme follows the system, the header button overrides, #light / #dark force one.
const themeScript = `(function(){try{var r=document.documentElement,f=/^#(light|dark)$/.exec(location.hash),s=localStorage.getItem('theme');r.setAttribute('data-theme',f?f[1]:s||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <LanguageProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </LanguageProvider>

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-NNSEEY27SZ" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-NNSEEY27SZ');`}</Script>
        <Script src="//gc.zgo.at/count.js" data-goatcounter="https://anferiro.goatcounter.com/count" strategy="afterInteractive" />
      </body>
    </html>
  );
}
