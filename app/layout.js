import './globals.css';
import { Space_Grotesk, Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google';

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-serif', display: 'swap' });

const SITE_URL = 'https://kanhaiya.dev';
const NAME = 'Kanhaiya Lal Sharma';
const TITLE = `${NAME} — Software Engineer building production-grade products`;
const DESCRIPTION = 'Software engineer working across applied AI, backend systems, and product. Selected work: HireSense AI, Legal AI Platform, Neural Digital Twin, LSTM Forecasting.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s — ${NAME}` },
  description: DESCRIPTION,
  keywords: ['Kanhaiya Lal Sharma','Software Engineer','AI Engineer','Full-Stack','RAG','Next.js','FastAPI','FAISS','HireSense AI','Portfolio'],
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  publisher: NAME,
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@kanhaiya',
  },
  category: 'technology',
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport = {
  themeColor: '#0A0A0B',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const PERSON_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: NAME,
  url: SITE_URL,
  jobTitle: 'Software Engineer',
  worksFor: { '@type': 'EducationalOrganization', name: 'KIIT, Bhubaneswar' },
  alumniOf: { '@type': 'EducationalOrganization', name: 'KIIT, Bhubaneswar' },
  email: 'mailto:kanhaiyals2019@gmail.com',
  telephone: '+91-9123678922',
  address: { '@type': 'PostalAddress', addressLocality: 'Bhubaneswar', addressCountry: 'IN' },
  knowsAbout: ['Applied AI', 'Retrieval-Augmented Generation', 'Backend Engineering', 'Full-Stack Development', 'System Design'],
  sameAs: [SITE_URL],
};

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  inLanguage: 'en',
  author: { '@type': 'Person', name: NAME },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${inter.variable} ${mono.variable} ${serif.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSONLD) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
      </head>
      <body className="antialiased bg-[#0A0A0B] text-[#F5F4F1] selection:bg-[#0FA47A]/25 selection:text-white">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#0FA47A] focus:text-black focus:font-mono focus:text-xs"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
