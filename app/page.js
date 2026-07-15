'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail, Phone, ChevronRight, ExternalLink, ArrowRight, ArrowDown, Search } from 'lucide-react';

/* ---------- Data ---------- */
const PROFILE = {
  name: 'Kanhaiya Lal Sharma',
  email: 'kanhaiyals2019@gmail.com',
  phone: '+91 9123678922',
  github: 'https://github.com/',
  linkedin: 'https://linkedin.com/',
  graduation: '2026',
  institute: 'KIIT, Bhubaneswar',
};

const PROJECTS = [
  {
    id: 'hiresense', num: '01', name: 'HireSense AI', subtitle: 'AI Recruiter Copilot',
    tagline: 'Hybrid retrieval for grounded hiring decisions — shipped end-to-end.',
    problem: 'Recruiters drown in unstructured candidate data. Semantic search alone hallucinates; keyword alone misses meaning.',
    solution: 'FAISS vector search fused with lexical retrieval via Reciprocal Rank Fusion, wrapped in a stateless FastAPI service and a Next.js 15 UI. Fully live, publicly used.',
    stack: ['Next.js 15', 'React 19', 'FastAPI', 'FAISS', 'RRF', 'TypeScript', 'Vercel', 'Hugging Face'],
    metrics: [ { k: '377', v: 'records indexed' }, { k: '<1s', v: 'query latency' }, { k: 'Live', v: 'in production' } ],
    links: { demo: '#', github: '#', study: '#' },
  },
  {
    id: 'legal', num: '02', name: 'Legal AI Platform', subtitle: 'Document Automation & Analysis',
    tagline: 'Semantic search and clause extraction across 1,000+ legal documents.',
    problem: 'Legal review is slow, expensive, and error-prone. Teams need grounded answers with citations in under a second.',
    solution: 'Next.js + Supabase (pgvector) RAG pipeline. LLM-powered clause extraction. Signed URLs, edge APIs, SWR frontend for real-time analysis.',
    stack: ['Next.js', 'Supabase', 'pgvector', 'Auth0', 'LLM APIs', 'SWR', 'Edge Runtime'],
    metrics: [ { k: '1,000+', v: 'documents' }, { k: '~50ms', v: 'retrieval' }, { k: '<1s', v: 'query' } ],
    links: { demo: null, github: '#', study: '#' },
  },
  {
    id: 'twin', num: '03', name: 'Neural Digital Twin', subtitle: 'Cognitive Disorder Detection',
    tagline: 'Multimodal EEG + MRI diagnostic AI for early cognitive decline.',
    problem: 'Early detection of cognitive disorders requires fusing signals across modalities — rarely done well.',
    solution: 'CMF-ViT on EEG (TUH dataset) and EfficientNet-B4 on MRI (ADNI). Unified diagnostic decision layer.',
    stack: ['PyTorch', 'Vision Transformer', 'EfficientNet-B4', 'EEG', 'MRI', 'TUH', 'ADNI'],
    metrics: [ { k: '97.6%', v: 'MRI test acc.' }, { k: '88–92%', v: 'EEG acc.' }, { k: '2', v: 'modalities' } ],
    links: { demo: null, github: '#', study: '#' },
  },
  {
    id: 'lstm', num: '04', name: 'LSTM Forecasting', subtitle: 'Stock Market Time-Series',
    tagline: '3-layer LSTM forecasting with rigorous validation and stability tuning.',
    problem: 'Financial series are noisy and non-stationary — naive models fail quietly.',
    solution: '3-layer LSTM on 5,000+ points with EarlyStopping and LR scheduling. Tuned for stability, not just accuracy.',
    stack: ['TensorFlow', 'Keras', 'NumPy', 'Pandas', 'Matplotlib'],
    metrics: [ { k: '0.96', v: 'R²' }, { k: '66.5', v: 'RMSE' }, { k: '−70%', v: 'val loss' } ],
    links: { demo: null, github: '#', study: '#' },
  },
];

const TIMELINE = [
  { year: '2022', title: 'B.Tech, Computer Science', body: 'Enrolled at KIIT Bhubaneswar. First Python.' },
  { year: '2023', title: 'AI Masterclass', body: 'Fell for neural networks — supervised, unsupervised, everything.' },
  { year: '2024', title: 'ML in production', body: 'LSTMs, CNNs, Vision Transformers on real datasets.' },
  { year: '2024', title: 'Full-stack shift', body: 'Next.js, FastAPI, Postgres, Supabase — the whole stack.' },
  { year: '2025', title: 'HireSense AI ships', body: 'End-to-end RAG product. Live. Used in real conversations.' },
  { year: '2026', title: 'Graduating', body: 'Looking for a team that ships intelligent software.' },
];

const SKILLS = [
  { cat: 'AI / ML', items: ['LLM APIs', 'RAG Pipelines', 'Vector Embeddings', 'FAISS', 'Reciprocal Rank Fusion', 'CMF-ViT', 'EfficientNet', 'LSTM', 'CNN', 'TensorFlow', 'Keras', 'scikit-learn'] },
  { cat: 'Backend', items: ['Python', 'FastAPI', 'Node.js', 'Express', 'Java', 'C++', 'REST', 'System Design'] },
  { cat: 'Frontend', items: ['Next.js 15', 'React 19', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'SWR'] },
  { cat: 'Data', items: ['PostgreSQL', 'pgvector', 'Supabase', 'MySQL', 'SQL'] },
  { cat: 'Cloud / DevOps', items: ['Docker', 'Vercel', 'Railway', 'Hugging Face', 'CI/CD', 'Git'] },
  { cat: 'Engineering', items: ['Pytest', 'MyPy', 'ESLint', 'DSA', 'OOP', 'Agile'] },
];

const ACHIEVEMENTS = [
  { k: 4, suffix: '+', label: 'Production Projects' },
  { k: 8, suffix: '+', label: 'Models Trained' },
  { k: 20, suffix: '+', label: 'Technologies' },
  { k: 500, suffix: '+', label: 'GitHub Commits' },
  { k: 4, suffix: 'yrs', label: 'Engineering' },
];

/* ---------- Custom Cursor ---------- */
function CustomCursor() {
  const dot = useRef(null); const ring = useRef(null);
  useEffect(() => {
    let rx = 0, ry = 0, dx = 0, dy = 0;
    const onMove = (e) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
    };
    const raf = () => {
      rx += (dx - rx) * 0.2; ry += (dy - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    };
    const onOver = (e) => {
      const t = e.target;
      if (t.closest('a,button,[data-hover]')) ring.current?.classList.add('hover');
      else ring.current?.classList.remove('hover');
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    const id = requestAnimationFrame(raf);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); cancelAnimationFrame(id); };
  }, []);
  return (<><div ref={ring} className="cursor-ring" /><div ref={dot} className="cursor-dot" /></>);
}

/* ---------- Boot: minimal editorial intro ---------- */
function Intro({ onDone }) {
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => { setDone(true); onDone(); }, 1400); return () => clearTimeout(t); }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: [0.65,0,0.35,1] }}
          className="fixed inset-0 z-[100] bg-[#0A0A0B] flex items-center justify-center">
          <div className="flex items-baseline gap-4">
            <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="font-mono text-[10px] tracking-[0.35em] text-[#F5F4F1]/50">KLS · 2026</motion.span>
            <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.0, ease: [0.65,0,0.35,1] }}
              className="origin-left inline-block h-px w-40 bg-[#0FA47A]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Magnetic ---------- */
function Magnetic({ children, className = '', ...rest }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const onMove = (e) => { const r = ref.current.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.25); y.set((e.clientY - r.top - r.height / 2) * 0.25); };
  const onLeave = () => { x.set(0); y.set(0); };
  return (<motion.button ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy }} className={className} {...rest}>{children}</motion.button>);
}

/* ---------- HireSense retrieval demo (hero visual) ---------- */
function HireSenseDemo() {
  const queries = [
    { q: 'senior ML engineer with RAG experience', highlight: ['ML', 'RAG'] },
    { q: 'full-stack engineer, Next.js, ships fast', highlight: ['Next.js', 'ships'] },
    { q: 'vector search + Postgres, production', highlight: ['vector', 'Postgres'] },
  ];
  const pool = [
    { name: 'Priya S.', role: 'ML Engineer · 4y', tags: ['RAG', 'FAISS', 'PyTorch'], base: 0.94 },
    { name: 'Marcus T.', role: 'Full-Stack · 6y', tags: ['Next.js', 'Node', 'AWS'], base: 0.88 },
    { name: 'Ana L.', role: 'AI Engineer · 3y', tags: ['LLMs', 'Vector', 'FastAPI'], base: 0.86 },
    { name: 'Rahul D.', role: 'Backend · 5y', tags: ['Postgres', 'pgvector', 'Go'], base: 0.79 },
    { name: 'Sofia M.', role: 'ML Engineer · 2y', tags: ['NLP', 'Keras'], base: 0.71 },
  ];
  const [qi, setQi] = useState(0);
  const [scores, setScores] = useState(pool.map(p => p.base));
  useEffect(() => {
    const t = setInterval(() => {
      setQi(v => (v + 1) % queries.length);
      setScores(pool.map(p => Math.min(0.98, Math.max(0.35, p.base + (Math.random() - 0.45) * 0.3))));
    }, 3400);
    return () => clearInterval(t);
  }, []);
  const ranked = pool.map((p, i) => ({ ...p, s: scores[i] })).sort((a, b) => b.s - a.s);
  return (
    <div className="relative w-full rounded-2xl border border-white/8 bg-[#0E0E10]/70 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/6">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0FA47A]" /> HIRESENSE · LIVE
        </div>
        <div className="font-mono text-[10px] text-white/30">v2026.06</div>
      </div>
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <Search className="w-4 h-4 text-[#0FA47A]" />
          <AnimatePresence mode="wait">
            <motion.div key={qi} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }} className="font-mono text-[13px] text-white/85 flex-1 truncate">
              {queries[qi].q}
            </motion.div>
          </AnimatePresence>
          <span className="font-mono text-[10px] text-white/40">⌘K</span>
        </div>
        <div className="font-mono text-[10px] tracking-[0.25em] text-white/40 mt-5 mb-2">RANKED · RRF(FAISS ⊕ BM25)</div>
      </div>
      <div className="px-3 pb-4">
        {ranked.map((r, idx) => (
          <motion.div key={r.name} layout transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/[0.02]">
            <div className="font-mono text-[10px] text-white/30 w-5">{String(idx + 1).padStart(2, '0')}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[15px] text-white">{r.name}</span>
                <span className="text-[11px] text-white/40 truncate">{r.role}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {r.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/8 text-white/60">{t}</span>
                ))}
              </div>
            </div>
            <div className="w-24 shrink-0">
              <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                <motion.div animate={{ width: `${r.s * 100}%` }} transition={{ duration: 0.9, ease: [0.65,0,0.35,1] }}
                  className="h-full bg-[#0FA47A]" />
              </div>
              <div className="font-mono text-[10px] text-white/50 mt-1 text-right">{r.s.toFixed(2)}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Section wrapper ---------- */
const Section = ({ id, children, className = '' }) => (
  <section id={id} className={`relative w-full ${className}`}>{children}</section>
);
const Container = ({ children, className = '' }) => (
  <div className={`max-w-[1200px] mx-auto px-6 md:px-10 ${className}`}>{children}</div>
);

/* ---------- Nav ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const on = () => setScrolled(window.scrollY > 40); on(); window.addEventListener('scroll', on); return () => window.removeEventListener('scroll', on); }, []);
  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
      <Container className="flex items-center justify-between py-5">
        <a href="#top" data-hover className="font-display text-sm tracking-tight">Kanhaiya <span className="text-white/40">Sharma</span></a>
        <div className="hidden md:flex items-center gap-9 font-body text-[13px] text-white/60">
          {[['work','Work'],['about','About'],['skills','Craft'],['contact','Contact']].map(([id,label]) => (
            <a key={id} href={`#${id}`} data-hover className="link-underline hover:text-white transition-colors">{label}</a>
          ))}
        </div>
        <a href="#contact" data-hover className="hidden md:inline-flex items-center gap-2 text-[13px] text-white/80 hover:text-white group">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0FA47A]" /> Available · 2026
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
        </a>
      </Container>
    </nav>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden pt-32 md:pt-40">
      <div className="absolute inset-0 wash-top" />
      <div className="absolute inset-0 bg-dots opacity-70" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0A0A0B]" />

      <Container>
        <motion.div style={{ y, opacity }} className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
              className="flex items-center gap-3 text-[12px] tracking-[0.2em] font-mono text-white/50 mb-8">
              <span className="w-8 h-px bg-[#0FA47A]" />
              SOFTWARE ENGINEER · BUILDING PRODUCTS
            </motion.div>
            <h1 className="font-display font-medium leading-[0.98] tracking-[-0.04em] text-[clamp(2.6rem,7vw,6.5rem)] text-[#F5F4F1]">
              {['I don’t build','websites. I build','intelligent'].map((line, idx) => (
                <motion.div key={idx} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + idx * 0.09, duration: 0.9, ease: [0.16,1,0.3,1] }}>
                  {line}
                </motion.div>
              ))}
              <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.9, ease: [0.16,1,0.3,1] }}>
                <span className="font-serif-display accent italic pr-1">products</span>.
              </motion.div>
            </h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
              className="mt-10 max-w-xl text-white/60 font-body text-[17px] md:text-[19px] leading-[1.6]">
              I design and ship software that combines applied AI, backend engineering, and thoughtful product craft — from first sketch to production.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}
              className="mt-12 flex flex-wrap items-center gap-5">
              <Magnetic onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#F5F4F1] text-[#0A0A0B] font-body text-[14px] font-medium hover:bg-white transition">
                See selected work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Magnetic>
              <a href="#contact" data-hover className="inline-flex items-center gap-2 text-white/70 hover:text-white text-[14px] link-underline">
                Or get in touch
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[11px]">
              {[['Based','Bhubaneswar, IN'],['Graduating','2026 · KIIT'],['Focus','AI · Full-Stack'],['Status','Open to roles']].map(([k,v]) => (
                <div key={k} className="border-t border-white/8 pt-3">
                  <div className="text-white/40">{k}</div>
                  <div className="text-white/85 mt-1">{v}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }}
            className="lg:col-span-5">
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 mb-3">LIVE · FROM HIRESENSE AI</div>
            <HireSenseDemo />
            <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-white/40">
              <span>Interactive preview · not a mockup</span>
              <a href="#work" data-hover className="link-underline text-white/70">See the project →</a>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-3 text-white/40">
          <span className="font-mono text-[10px] tracking-[0.4em]">SCROLL</span>
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ArrowDown className="w-3.5 h-3.5" />
          </motion.span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section header ---------- */
function SectionHeader({ index, kicker, title, accentWord, aside }) {
  return (
    <div className="grid md:grid-cols-12 gap-8 items-end">
      <div className="md:col-span-8">
        <div className="flex items-center gap-4 font-mono text-[11px] tracking-[0.3em] text-white/45">
          <span>{index}</span><span className="h-px w-8 bg-white/15" /><span>{kicker}</span>
        </div>
        <h2 className="mt-6 font-display font-medium text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.02] tracking-[-0.03em]">
          {title} <span className="font-serif-display accent">{accentWord}</span>
        </h2>
      </div>
      {aside && <div className="md:col-span-4 text-white/55 font-body text-[15px] leading-relaxed">{aside}</div>}
    </div>
  );
}

/* ---------- Marquee (quiet) ---------- */
function Marquee() {
  const items = ['LLMs','RAG','Vector Search','FAISS','Next.js','FastAPI','TensorFlow','PyTorch','Supabase','pgvector','Vercel','Hugging Face','TypeScript','System Design'];
  const dup = [...items, ...items];
  return (
    <div className="relative py-10 border-y border-white/6 overflow-hidden">
      <div className="marquee-track flex gap-14 whitespace-nowrap font-display text-2xl md:text-3xl font-medium text-white/25">
        {dup.map((t,i) => (<span key={i} className="inline-flex items-center gap-14">{t}<span className="w-1 h-1 rounded-full bg-[#0FA47A]/50" /></span>))}
      </div>
    </div>
  );
}

/* ---------- About / Timeline ---------- */
function About() {
  return (
    <Section id="about" className="py-28 md:py-40">
      <Container>
        <SectionHeader index="01" kicker="ORIGIN" title="From first line of code to" accentWord="production."
          aside="Four years of building — from ML notebooks to full-stack products shipping to real users. The story in six moments." />
        <div className="mt-20 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4 md:sticky md:top-32 self-start">
            <div className="font-serif-display italic text-white/85 text-2xl leading-snug">
              “Build things that work. Ship them. Learn what breaks. Repeat.”
            </div>
            <div className="mt-6 font-mono text-[11px] text-white/40 tracking-widest">— WORKING PRINCIPLE</div>
          </div>
          <ol className="md:col-span-8 relative">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-white/8" />
            {TIMELINE.map((t, i) => (
              <motion.li key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, delay: i * 0.04 }}
                className="relative pl-12 py-6 border-b border-white/6 last:border-b-0">
                <span className="absolute left-0 top-8 w-4 h-4 rounded-full border border-white/20 bg-[#0A0A0B] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0FA47A]" />
                </span>
                <div className="grid grid-cols-[80px,1fr] gap-6 items-baseline">
                  <div className="font-mono text-[12px] text-white/45 tracking-widest">{t.year}</div>
                  <div>
                    <div className="font-display text-xl md:text-2xl text-white">{t.title}</div>
                    <div className="text-white/55 mt-1 font-body text-[15px]">{t.body}</div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/* ---------- Projects (unique layouts each) ---------- */
function ProjectShell({ p, children, tone }) {
  return (
    <motion.article initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}
      className={`relative group py-24 md:py-36 border-t border-white/6`}>
      <Container>
        <div className="flex items-baseline justify-between mb-10">
          <div className="flex items-baseline gap-6">
            <span className="font-mono text-[11px] tracking-[0.3em] text-white/40">{p.num}</span>
            <span className="font-mono text-[11px] tracking-[0.3em] text-white/40">{tone || 'PROJECT'}</span>
          </div>
          <div className="flex items-center gap-3">
            {p.links.demo && <a data-hover href={p.links.demo} className="chip hover:border-[#0FA47A]/40 hover:text-white"><ExternalLink className="w-3 h-3"/> Live</a>}
            {p.links.github && <a data-hover href={p.links.github} className="chip hover:border-[#0FA47A]/40 hover:text-white"><Github className="w-3 h-3"/> Code</a>}
            {p.links.study && <a data-hover href={p.links.study} className="chip hover:border-[#0FA47A]/40 hover:text-white">Case Study <ChevronRight className="w-3 h-3"/></a>}
          </div>
        </div>
        {children}
      </Container>
    </motion.article>
  );
}

function MetricRow({ items }) {
  return (
    <div className="grid grid-cols-3 gap-8 mt-10">
      {items.map(m => (
        <div key={m.v}>
          <div className="font-display text-3xl md:text-4xl text-white tracking-tight">{m.k}</div>
          <div className="mt-1 text-white/45 font-mono text-[11px] tracking-widest uppercase">{m.v}</div>
        </div>
      ))}
    </div>
  );
}

function StackChips({ items }) {
  return (
    <div className="flex flex-wrap gap-2 mt-8">
      {items.map(s => <span key={s} className="chip">{s}</span>)}
    </div>
  );
}

// Layout 1: HireSense — hero split with big narrative
function ProjectOne({ p }) {
  return (
    <ProjectShell p={p} tone="FLAGSHIP · LIVE">
      <div className="grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-7">
          <h3 className="font-display font-medium text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
            {p.name}. <span className="font-serif-display accent">Grounded.</span>
          </h3>
          <p className="mt-6 text-white/75 text-[17px] md:text-[19px] leading-[1.6] max-w-xl">{p.tagline}</p>
          <p className="mt-6 text-white/55 font-body leading-relaxed max-w-xl">{p.solution}</p>
          <MetricRow items={p.metrics} />
          <StackChips items={p.stack} />
        </div>
        <div className="md:col-span-5">
          <HireSenseDemo />
        </div>
      </div>
    </ProjectShell>
  );
}

// Layout 2: Legal AI — document-first with highlighted clauses
function ProjectTwo({ p }) {
  return (
    <ProjectShell p={p} tone="PLATFORM">
      <div className="grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5 order-2 md:order-1">
          <div className="rounded-2xl border border-white/8 bg-[#0E0E10]/70 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6 font-mono text-[10px] text-white/40">
              <span>service_agreement_v4.pdf</span><span>Page 3 of 47</span>
            </div>
            <div className="p-6 font-body text-[13px] leading-relaxed text-white/70 space-y-3">
              <p>The Parties agree that <span className="bg-[#0FA47A]/15 text-white px-1 rounded">confidential information shall be held for five (5) years</span> following termination.</p>
              <p>Payment terms are <span className="bg-[#0FA47A]/15 text-white px-1 rounded">Net 30 from invoice date</span>, subject to <span className="bg-[#0FA47A]/15 text-white px-1 rounded">1.5% monthly late fee</span>.</p>
              <p className="text-white/40">Liability capped at fees paid in the preceding twelve months...</p>
              <p className="text-white/30">Governing law of the State of Delaware, without regard to conflict...</p>
            </div>
            <div className="border-t border-white/6 px-4 py-3 flex items-center gap-2 font-mono text-[10px] text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0FA47A]" /> 3 clauses extracted · 42ms
            </div>
          </div>
        </div>
        <div className="md:col-span-7 order-1 md:order-2">
          <h3 className="font-display font-medium text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
            {p.name}. <span className="font-serif-display accent">Cited.</span>
          </h3>
          <p className="mt-6 text-white/75 text-[17px] md:text-[19px] leading-[1.6] max-w-xl">{p.tagline}</p>
          <p className="mt-6 text-white/55 font-body leading-relaxed max-w-xl">{p.solution}</p>
          <MetricRow items={p.metrics} />
          <StackChips items={p.stack} />
        </div>
      </div>
    </ProjectShell>
  );
}

// Layout 3: Neural Digital Twin — data-focused with modality panels
function ProjectThree({ p }) {
  return (
    <ProjectShell p={p} tone="RESEARCH">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-6">
          <h3 className="font-display font-medium text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
            {p.name}. <span className="font-serif-display accent">Multimodal.</span>
          </h3>
          <p className="mt-6 text-white/75 text-[17px] md:text-[19px] leading-[1.6]">{p.tagline}</p>
          <p className="mt-6 text-white/55 font-body leading-relaxed">{p.solution}</p>
          <StackChips items={p.stack} />
        </div>
        <div className="md:col-span-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/8 bg-[#0E0E10]/70 p-6">
            <div className="font-mono text-[10px] tracking-[0.25em] text-white/40">EEG · CMF-VIT · TUH</div>
            <div className="mt-6 h-16 flex items-end gap-1">
              {Array.from({length:22}).map((_,i)=>(
                <div key={i} className="flex-1 bg-[#0FA47A]/70" style={{height: `${20+Math.abs(Math.sin(i*0.9))*70}%`}} />
              ))}
            </div>
            <div className="mt-4 font-display text-3xl text-white">88–92%</div>
            <div className="font-mono text-[11px] text-white/45">accuracy · 22 patient records</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0E0E10]/70 p-6">
            <div className="font-mono text-[10px] tracking-[0.25em] text-white/40">MRI · EFFICIENTNET-B4 · ADNI</div>
            <div className="mt-6 grid grid-cols-6 gap-1">
              {Array.from({length:24}).map((_,i)=>(
                <div key={i} className="aspect-square rounded-sm" style={{background: `rgba(15,164,122,${0.15+((i*7)%10)/25})`}} />
              ))}
            </div>
            <div className="mt-4 font-display text-3xl text-white">97.6%</div>
            <div className="font-mono text-[11px] text-white/45">test acc. · 111 records</div>
          </div>
          <div className="col-span-2 rounded-2xl border border-white/8 bg-[#0E0E10]/70 p-6">
            <div className="font-mono text-[10px] tracking-[0.25em] text-white/40">PROBLEM</div>
            <p className="mt-3 text-white/70 font-body leading-relaxed">{p.problem}</p>
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}

// Layout 4: LSTM — chart-forward
function ProjectFour({ p }) {
  const points = Array.from({length: 60}, (_,i) => {
    const base = 100 + Math.sin(i/6)*35 + i*0.6;
    return { x: i, actual: base + Math.sin(i/3)*8, pred: base + Math.sin(i/3)*8 + (Math.random()-0.5)*4 };
  });
  const path = (key) => {
    const w = 600, h = 200; const max = 200; const min = 60;
    return points.map((p_, i) => {
      const x = (i/(points.length-1))*w;
      const y = h - ((p_[key]-min)/(max-min))*h;
      return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  };
  return (
    <ProjectShell p={p} tone="TIME-SERIES">
      <div className="grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5">
          <h3 className="font-display font-medium text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
            {p.name}. <span className="font-serif-display accent">Stable.</span>
          </h3>
          <p className="mt-6 text-white/75 text-[17px] md:text-[19px] leading-[1.6]">{p.tagline}</p>
          <p className="mt-6 text-white/55 font-body leading-relaxed">{p.solution}</p>
          <MetricRow items={p.metrics} />
          <StackChips items={p.stack} />
        </div>
        <div className="md:col-span-7">
          <div className="rounded-2xl border border-white/8 bg-[#0E0E10]/70 p-6">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-white/45">
              <span>FORECAST vs ACTUAL · 60 STEPS</span>
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-white/60 rounded-full" /> actual</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#0FA47A] rounded-full" /> predicted</span>
              </span>
            </div>
            <svg viewBox="0 0 600 210" className="w-full mt-4">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0FA47A" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#0FA47A" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[0,1,2,3].map(i=>(<line key={i} x1="0" x2="600" y1={i*50+10} y2={i*50+10} stroke="rgba(255,255,255,0.05)"/>))}
              <motion.path d={path('actual')} fill="none" stroke="rgba(245,244,241,0.55)" strokeWidth="1.5"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
              <motion.path d={path('pred')+' L600,210 L0,210 Z'} fill="url(#g)"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.4 }} />
              <motion.path d={path('pred')} fill="none" stroke="#0FA47A" strokeWidth="1.8"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.4 }} />
            </svg>
            <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/6">
              <div><div className="font-mono text-[10px] text-white/40">R²</div><div className="font-display text-2xl mt-1">0.96</div></div>
              <div><div className="font-mono text-[10px] text-white/40">RMSE</div><div className="font-display text-2xl mt-1">66.5</div></div>
              <div><div className="font-mono text-[10px] text-white/40">MAE</div><div className="font-display text-2xl mt-1">31.06</div></div>
            </div>
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}

function Projects() {
  return (
    <Section id="work">
      <Container className="pt-28 md:pt-40">
        <SectionHeader index="02" kicker="SELECTED WORK" title="Products, not" accentWord="demos."
          aside="Four projects, shipped end-to-end. Each one solves a real problem — not a resume line." />
      </Container>
      <div className="mt-16">
        <ProjectOne p={PROJECTS[0]} />
        <ProjectTwo p={PROJECTS[1]} />
        <ProjectThree p={PROJECTS[2]} />
        <ProjectFour p={PROJECTS[3]} />
      </div>
    </Section>
  );
}

/* ---------- Skills ---------- */
function Skills() {
  return (
    <Section id="skills" className="py-28 md:py-40 border-t border-white/6">
      <Container>
        <SectionHeader index="03" kicker="CRAFT" title="The tools I reach for when" accentWord="shipping."
          aside="Not a laundry list. The stack I actually use, grouped by how I think about a problem." />
        <div className="mt-20 grid md:grid-cols-2 gap-x-16 gap-y-14">
          {SKILLS.map((s, i) => (
            <motion.div key={s.cat} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05 }}
              className="border-t border-white/8 pt-6">
              <div className="flex items-baseline justify-between">
                <div className="font-display text-xl text-white">{s.cat}</div>
                <div className="font-mono text-[11px] text-white/35">{String(i+1).padStart(2,'0')} / {String(SKILLS.length).padStart(2,'0')}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-body text-[15px] text-white/70">
                {s.items.map((it, idx) => (
                  <span key={it} className="inline-flex items-baseline gap-2">
                    <span className="text-white/25 font-mono text-[10px]">·</span>{it}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ---------- Counter ---------- */
function Counter({ to, suffix }) {
  const [n, setN] = useState(0); const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const dur = 1400; const t0 = performance.now();
        const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setN(Math.floor(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick); io.disconnect();
      }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Achievements() {
  return (
    <Section id="stats" className="py-28 md:py-36">
      <Container>
        <div className="grid md:grid-cols-5 gap-10 md:gap-6">
          {ACHIEVEMENTS.map(a => (
            <div key={a.label} className="border-t border-white/8 pt-6">
              <div className="font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-none tracking-[-0.02em]"><Counter to={a.k} suffix={a.suffix} /></div>
              <div className="mt-3 text-white/45 text-[12px] font-mono tracking-widest uppercase">{a.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ---------- Terminal Contact ---------- */
function Contact() {
  const [history, setHistory] = useState([
    { t: 'system', v: 'Welcome. Type “help” to see commands, or “hire” to reach out.' },
  ]);
  const [input, setInput] = useState('');
  const scroller = useRef(null);
  useEffect(() => { scroller.current?.scrollTo({ top: 9e9 }); }, [history]);

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const push = (arr) => setHistory(h => [...h, { t: 'user', v: raw }, ...arr]);
    if (!cmd) return;
    if (cmd === 'help') return push([
      { t: 'out', v: 'Commands:' },
      { t: 'out', v: '  hire       — start a conversation' },
      { t: 'out', v: '  email      — show email address' },
      { t: 'out', v: '  phone      — show phone number' },
      { t: 'out', v: '  github     — open GitHub profile' },
      { t: 'out', v: '  linkedin   — open LinkedIn profile' },
      { t: 'out', v: '  projects   — list projects' },
      { t: 'out', v: '  whoami     — about Kanhaiya' },
      { t: 'out', v: '  clear      — clear terminal' },
    ]);
    if (cmd.startsWith('hire')) {
      push([
        { t: 'ok', v: 'Opening a channel…' },
        { t: 'ok', v: 'Composing email.' },
        { t: 'out', v: `Reach out directly: ${PROFILE.email}` },
      ]);
      setTimeout(() => window.location.href = `mailto:${PROFILE.email}?subject=Let%27s%20build%20something`, 700);
      return;
    }
    if (cmd === 'email') return push([{ t: 'out', v: PROFILE.email }]);
    if (cmd === 'phone') return push([{ t: 'out', v: PROFILE.phone }]);
    if (cmd === 'github') { push([{ t: 'ok', v: 'Opening GitHub…' }]); window.open(PROFILE.github, '_blank'); return; }
    if (cmd === 'linkedin') { push([{ t: 'ok', v: 'Opening LinkedIn…' }]); window.open(PROFILE.linkedin, '_blank'); return; }
    if (cmd === 'projects') return push(PROJECTS.map(p => ({ t: 'out', v: `• ${p.name} — ${p.subtitle}` })));
    if (cmd === 'whoami') return push([
      { t: 'out', v: 'Kanhaiya Lal Sharma · Software Engineer' },
      { t: 'out', v: `${PROFILE.institute} · Graduating ${PROFILE.graduation}` },
      { t: 'out', v: 'Focus: applied AI · full-stack · product craft.' },
    ]);
    if (cmd === 'clear') { setHistory([]); return; }
    push([{ t: 'err', v: `command not found: ${cmd}. type “help”.` }]);
  };
  const submit = (e) => { e.preventDefault(); run(input); setInput(''); };

  return (
    <Section id="contact" className="py-28 md:py-40 border-t border-white/6">
      <Container>
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <div className="font-mono text-[11px] tracking-[0.3em] text-white/45">04 — CONTACT</div>
            <h2 className="mt-4 font-display font-medium text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
              Let’s build something <span className="font-serif-display accent">worth building.</span>
            </h2>
            <p className="mt-6 text-white/60 font-body text-[17px] leading-[1.6] max-w-md">
              Whether you’re hiring, collaborating, or just curious — I read every message. The fastest way to reach me is email, but the terminal works too.
            </p>
            <div className="mt-10 space-y-4">
              <a href={`mailto:${PROFILE.email}`} data-hover className="flex items-center justify-between py-4 border-t border-white/8 group">
                <span className="flex items-center gap-3 text-white/85"><Mail className="w-4 h-4 text-[#0FA47A]" />{PROFILE.email}</span>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
              </a>
              <div className="flex items-center justify-between py-4 border-t border-white/8">
                <span className="flex items-center gap-3 text-white/85"><Phone className="w-4 h-4 text-[#0FA47A]" />{PROFILE.phone}</span>
              </div>
              <a href={PROFILE.github} data-hover className="flex items-center justify-between py-4 border-t border-white/8 group">
                <span className="flex items-center gap-3 text-white/85"><Github className="w-4 h-4 text-[#0FA47A]" />GitHub</span>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
              </a>
              <a href={PROFILE.linkedin} data-hover className="flex items-center justify-between py-4 border-t border-b border-white/8 group">
                <span className="flex items-center gap-3 text-white/85"><Linkedin className="w-4 h-4 text-[#0FA47A]" />LinkedIn</span>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
              </a>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="rounded-2xl border border-white/8 bg-[#0E0E10]/70 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6">
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="ml-3 font-mono text-[11px] text-white/45">kanhaiya — terminal</span>
                <span className="ml-auto font-mono text-[10px] text-white/45 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#0FA47A]"/>ready</span>
              </div>
              <div ref={scroller} className="p-5 md:p-7 h-[420px] overflow-y-auto font-mono text-[13px] leading-relaxed space-y-1">
                {history.map((h, i) => (
                  <div key={i} className={
                    h.t === 'user' ? 'text-white' :
                    h.t === 'ok' ? 'text-[#0FA47A]' :
                    h.t === 'err' ? 'text-rose-400/80' :
                    h.t === 'system' ? 'text-white/60' :
                    'text-white/70'
                  }>
                    {h.t === 'user' ? <span className="text-[#0FA47A]">→ </span> : null}{h.v}
                  </div>
                ))}
                <form onSubmit={submit} className="flex items-center gap-2 pt-2">
                  <span className="text-[#0FA47A]">→</span>
                  <input autoFocus value={input} onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-white/25"
                    placeholder="try: hire" />
                  <span className="w-1.5 h-4 bg-[#0FA47A] blink" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="relative border-t border-white/6 py-16">
      <Container>
        <div className="font-display font-medium text-[clamp(3rem,10vw,9rem)] leading-[0.9] tracking-[-0.04em] text-white/95">
          Build. Ship. <span className="font-serif-display accent">Repeat.</span>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-white/40">
          <div>© 2026 Kanhaiya Lal Sharma — Crafted with care.</div>
          <div>Next.js · Framer Motion · Tailwind</div>
        </div>
      </Container>
    </footer>
  );
}

/* ---------- App ---------- */
function App() {
  const [ready, setReady] = useState(false);
  return (
    <main id="top" className="relative min-h-screen bg-[#0A0A0B] noise">
      <CustomCursor />
      <Intro onDone={() => setReady(true)} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 0.7 }}>
        <Nav />
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
        <Footer />
      </motion.div>
    </main>
  );
}

export default App;
