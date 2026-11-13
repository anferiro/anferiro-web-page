export type Topic = 'ai' | 'architecture' | 'leadership';

export type Article = {
  id: string;
  topic: Topic;
  date: string; // ISO
  title: string; // translation key
  excerpt: string; // translation key
  href: string;
  external?: boolean;
  image?: { src: string; width: number; height: number; alt: string };
  tags: string;
  links?: { label: string; href: string; labelKey?: string; local?: boolean }[];
};

export const topicKey: Record<Topic, string> = {
  ai: 'filter.ai',
  architecture: 'filter.architecture',
  leadership: 'filter.leadership',
};

export const articles: Article[] = [
  {
    id: 'knowledge',
    topic: 'ai',
    date: '2026-04-04',
    title: 'site.kgTitle',
    excerpt: 'site.kgExcerpt',
    href: '/articles/using-ai-to-generate-knowledge.html',
    image: { src: '/img/articles/article.2026.04.04.png', width: 998, height: 466, alt: 'Neo4j graph of 81 nodes and their relationship types' },
    tags: 'knowledge graph neo4j claude deep research',
  },
  {
    id: 'gen-ai',
    topic: 'ai',
    date: '2026-04-02',
    title: 'articles.adoptingGenAITitle',
    excerpt: 'articles.adoptingGenAIExcerpt',
    href: '/articles/adopting-generative-ai.html',
    image: { src: '/img/articles/article.2026.04.02.png', width: 1024, height: 434, alt: 'A person directing a glowing AI figure above a mechanical engine' },
    tags: 'generative ai adoption',
    links: [
      { label: 'Leer en Español', labelKey: 'articles.readInSpanish', href: '/articles/adopcion-ia-generativa.html', local: true },
      { label: 'Substack', href: 'https://open.substack.com/pub/anferiro/p/how-to-adopt-gen-ai?r=dnpol&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true' },
      { label: 'Medium', href: 'https://anferiro.medium.com/how-to-adopt-gen-ai-abf9d010c6ed?sk=31a4bb869d452676d0fce1ec55f0e530' },
    ],
  },
  {
    id: 'red-meetings',
    topic: 'leadership',
    date: '2025-06-11',
    title: 'articles.redMeetingMadnessTitle',
    excerpt: 'articles.redMeetingMadnessExcerpt',
    href: '/articles/red-meeting-madness.html',
    image: { src: '/img/articles/article.2025.06.11.png', width: 1024, height: 1024, alt: 'A week calendar filled with red meeting blocks' },
    tags: 'meetings time focus',
    links: [{ label: 'Medium', href: 'https://medium.com/@anferiro/stop-the-red-meeting-madness-1f5c271cfded' }],
  },
  {
    id: 'diagrams',
    topic: 'architecture',
    date: '2025-06-04',
    title: 'articles.diagramsAsCodeTitle',
    excerpt: 'articles.diagramsAsCodeExcerpt',
    href: 'https://anferiro.medium.com/ba56be95ab48',
    external: true,
    tags: 'diagrams code mingrammer docker',
  },
  {
    id: 'knockout',
    topic: 'architecture',
    date: '2024-01-25',
    title: 'articles.architecturalKnockoutTitle',
    excerpt: 'articles.architecturalKnockoutExcerpt',
    href: 'https://medium.com/@anferiro/architectural-knockout-building-your-design-system-edbae5edc106',
    external: true,
    tags: 'design system ads',
  },
  {
    id: 'components',
    topic: 'architecture',
    date: '2023-12-15',
    title: 'articles.componentsTitle',
    excerpt: 'articles.componentsExcerpt',
    href: 'https://medium.com/@anferiro/components-of-the-architecture-design-system-b6d018f2926e',
    external: true,
    tags: 'design system components',
  },
  {
    id: 'ads',
    topic: 'architecture',
    date: '2023-12-05',
    title: 'articles.designSystemTitle',
    excerpt: 'articles.designSystemExcerpt',
    href: 'https://medium.com/@anferiro/architecture-design-system-f24eb1b53638',
    external: true,
    tags: 'design system ads',
    links: [{ label: 'Substack', href: 'https://open.substack.com/pub/anferiro/p/architecture-design-system?r=dnpol&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true' }],
  },
];

export const quotes: { text: string; by: string; cat: string }[] = [
  { text: 'quotes.dickGabrielQuote', by: 'Dick Gabriel', cat: 'quotes.softwareArchitectureCategory' },
  { text: 'quotes.andresGoodSoftwareQuote', by: 'Andres Rincon', cat: 'quotes.developmentCategory' },
  { text: 'quotes.andresLikesQuote', by: 'Andres Rincon', cat: 'quotes.developmentCategory' },
  { text: 'quotes.coryHouseQuote', by: 'Cory House', cat: 'quotes.developmentCategory' },
  { text: 'quotes.robertGreeneQuote', by: 'Robert Greene', cat: 'quotes.growthCategory' },
  { text: 'quotes.heraclitusQuote', by: 'Heraclitus', cat: 'quotes.growthCategory' },
  { text: 'quotes.andresSayNoQuote', by: 'Andres Rincon', cat: 'quotes.leadershipCategory' },
];

export const verses: { ref: string; theme: string; text: string }[] = [
  { ref: 'Proverbs 3:5-6', theme: 'spiritual.trustGuidanceTheme', text: 'spiritual.proverbs356' },
  { ref: 'Jeremiah 29:11', theme: 'spiritual.hopePurposeTheme', text: 'spiritual.jeremiah2911' },
  { ref: 'Philippians 4:13', theme: 'spiritual.strengthTheme', text: 'spiritual.philippians413' },
  { ref: 'Romans 8:28', theme: 'spiritual.faithPurposeTheme', text: 'spiritual.romans828' },
  { ref: 'Psalm 46:10', theme: 'spiritual.peaceStillnessTheme', text: 'spiritual.psalm4610' },
  { ref: 'Colossians 3:23', theme: 'spiritual.workExcellenceTheme', text: 'spiritual.colossians323' },
  { ref: 'Joshua 1:9', theme: 'spiritual.leadershipCourageTheme', text: 'spiritual.joshua19' },
];

export const contactLinks = [
  { label: 'Email', href: 'mailto:anferiro@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/anferiro' },
  { label: 'X', href: 'https://twitter.com/anferiro' },
  { label: 'Instagram', href: 'https://instagram.com/anferiro' },
  { label: 'Medium', href: 'https://anferiro.medium.com' },
  { label: 'Substack', href: 'https://open.substack.com/pub/anferiro' },
];
