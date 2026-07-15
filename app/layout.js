import './globals.css';
import { Space_Grotesk, Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google';

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-serif', display: 'swap' });

export const metadata = {
  title: 'Kanhaiya Lal Sharma — Software Engineer, building products',
  description: 'Kanhaiya Lal Sharma is a software engineer building intelligent products end-to-end. Selected work: HireSense AI, Legal AI Platform, Neural Digital Twin, LSTM Forecasting.',
  openGraph: {
    title: 'Kanhaiya Lal Sharma — Software Engineer',
    description: 'Building intelligent products end-to-end.',
    type: 'website',
  },
  metadataBase: new URL('https://kanhaiya.dev'),
};

export const viewport = { themeColor: '#0A0A0B' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${inter.variable} ${mono.variable} ${serif.variable} dark`}>
      <body className="antialiased bg-[#0A0A0B] text-[#F5F4F1] selection:bg-[#0FA47A]/25 selection:text-white">
        {children}
      </body>
    </html>
  );
}
