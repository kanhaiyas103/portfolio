import './globals.css';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata = {
  title: 'Kanhaiya Lal Sharma — AI Engineer • Building Intelligent Products',
  description: 'I don\u2019t build websites. I build intelligent products. AI Engineer & Full-Stack Engineer shipping production-grade LLM, RAG, and ML systems.',
  openGraph: {
    title: 'Kanhaiya Lal Sharma — AI Engineer',
    description: 'Building the next generation of AI products.',
    type: 'website',
  },
  metadataBase: new URL('https://kanhaiya.dev'),
};

export const viewport = {
  themeColor: '#020617',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${inter.variable} ${mono.variable} dark`}>
      <body className="antialiased bg-[#020617] text-white selection:bg-[#00D9FF]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
