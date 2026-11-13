import { About } from '@/components/About';
import { Articles } from '@/components/Articles';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Quotes } from '@/components/Quotes';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Spiritual } from '@/components/Spiritual';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main">
        <Hero />
        <Articles />
        <About />
        <Quotes />
        <Spiritual />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
