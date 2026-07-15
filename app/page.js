'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail, Phone, ChevronRight, ExternalLink, ArrowRight, ArrowDown, Search } from 'lucide-react';

/* ---------- Data ---------- */
const PROFILE = {
  name: 'Kanhaiya Lal Sharma',
  email: 'kanhaiyals2019@gmail.com',
  phone: '+91 9123678922',
  github: 'https://github.com/kanhaiyas103',
  linkedin: 'https://www.linkedin.com/in/kanhaiya-lal-sharma-a70a72293',
  resume: '/resume.pdf',
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
    links: { demo: 'https://hiresense-ai-roan.vercel.app/', github: '#', study: '#' },
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
  { year: '2022', title: 'Started B.Tech, Computer Science', body: 'Joined KIIT University, Bhubaneswar. Built a strong foundation in programming, algorithms, and core computer science.' },
  { year: '2023', title: 'AI and full-stack, side by side', body: 'Explored AI and full-stack development through practical projects using Python, machine learning, and modern web technologies.' },
  { year: '2024', title: 'End-to-end software', body: 'Shipped end-to-end projects across backend systems, APIs, deployment, and machine learning — building the muscle for real products.' },
  { year: '2025', title: 'Applied AI and RAG', body: 'Focused on applied AI, multimodal machine learning, and retrieval-augmented generation through academic and personal projects.' },
  { year: '2026', title: 'Shipping production AI', body: 'Built and deployed production-ready software including HireSense AI and other AI-powered applications. Open to Software Engineer and AI Engineer roles.' },
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


/* ---------- Engineering Notes data ---------- */
const ENG_NOTES = {
  hiresense: {
    problem: 'Recruiters lose hours sifting unstructured resumes. Pure semantic search hallucinates and misses exact skills; pure lexical misses meaning.',
    architecture: 'Next.js 15 + React 19 UI → FastAPI service (stateless) → FAISS vector index + BM25 lexical index → Reciprocal Rank Fusion → ranked candidates with score. Deployed to Vercel (edge) and Hugging Face Spaces (inference).',
    decisions: [
      'FAISS over pgvector — faster iteration, no DB coupling for a single-tenant demo.',
      'RRF over learned rerankers — deterministic, explainable, low latency, no fine-tuning needed.',
      'FastAPI stateless — trivial to scale horizontally and cache.',
    ],
    challenges: [
      'Cold start on Spaces — mitigated with a pinned warm ping.',
      'Score calibration between two very different retrievers — solved by rank-based fusion (RRF) instead of score fusion.',
    ],
    tradeoffs: [
      'No learned reranker means slightly lower ceiling on niche queries, but strong baseline out of the box.',
      'Single-tenant demo — no auth / RBAC yet; production tenant story would need Postgres row-level security.',
    ],
    future: [
      'LLM reranker on top-20 for niche queries.',
      'Persisted candidate embeddings in pgvector for multi-tenant use.',
      'Feedback loop to fine-tune fusion weights per team.',
    ],
  },
  legal: {
    problem: 'Legal teams re-read the same clauses across hundreds of contracts. Answers need citations, not summaries.',
    architecture: 'Next.js UI → Supabase (Postgres + pgvector) → LLM-powered chunker + clause extractor → signed URL streaming → SWR frontend cache. Edge runtime for query endpoints.',
    decisions: [
      'pgvector over standalone vector DB — one primitive, one source of truth.',
      'Signed URLs for documents — no proxying, no bandwidth cost.',
      'Chunk with structure-aware splitter (headings, sections) rather than fixed tokens.',
    ],
    challenges: [
      'Overlapping clauses across pages — solved with sentence-boundary overlap windows.',
      'Auth0 + Supabase RLS wiring — resolved with a JWT template mapping to Supabase claims.',
    ],
    tradeoffs: [
      'pgvector limits ANN throughput vs. FAISS at very large scale — acceptable up to ~1M chunks.',
      'Structure-aware chunking is slower to ingest but produces better retrieval quality.',
    ],
    future: [
      'Redlining view with diff-aware citations.',
      'Multi-document reasoning with an agentic loop.',
    ],
  },
  twin: {
    problem: 'Early detection of cognitive disorders benefits from fusing modalities (EEG + MRI). Most work sticks to a single modality.',
    architecture: 'Two independent branches — CMF-ViT for EEG (TUH dataset) and EfficientNet-B4 for MRI (ADNI). Softmax outputs combined via a late-fusion decision layer.',
    decisions: [
      'Modality-specific encoders instead of a joint model — cleaner training, easier interpretability.',
      'EfficientNet-B4 for MRI — strong accuracy/parameter trade-off on 111 volumes.',
      'CMF-ViT for EEG — captures cross-channel temporal patterns better than 1D CNNs at this scale.',
    ],
    challenges: [
      'Class imbalance in EEG dataset — handled with focal loss + oversampling.',
      'Slice selection for MRI — used middle-N axial slices per subject to stabilize training.',
    ],
    tradeoffs: [
      'Late fusion is simple but caps ceiling vs. joint representation learning.',
      'Modality dropout not yet implemented — model degrades gracefully but not gracefully-and-calibrated.',
    ],
    future: [
      'Joint embedding space + contrastive alignment across modalities.',
      'Longitudinal signal — track same subject over time.',
    ],
  },
  lstm: {
    problem: 'Financial time-series are noisy and non-stationary. Naive models overfit and produce unstable forecasts.',
    architecture: '3-layer stacked LSTM on 5,000+ daily points → EarlyStopping + LR scheduling → walk-forward validation → RMSE/MAE/R² reporting.',
    decisions: [
      'Stacked LSTM over Transformer — small data, LSTM inductive bias helps.',
      'Walk-forward CV over random splits — respects time causality.',
      'EarlyStopping on val loss, not train loss — reduces overfitting.',
    ],
    challenges: [
      'Val loss oscillated early — solved with LR scheduling (ReduceLROnPlateau).',
      'Scaler leakage — moved to per-fold fit_transform.',
    ],
    tradeoffs: [
      'LSTM captures short-range dependencies well but struggles with regime changes.',
      'Univariate only — no exogenous features (volume, macro) yet.',
    ],
    future: [
      'Add exogenous features and Temporal Fusion Transformer for comparison.',
      'Monte-Carlo dropout for uncertainty bounds.',
    ],
  },
};

/* ---------- Custom Cursor ---------- */
function CustomCursor() {
  const dot = useRef(null); const ring = useRef(null);
  useEffect(() => {
    // Respect reduced-motion and touch devices
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReduced) {
      document.body.style.cursor = 'auto';
      return;
    }
    let rx = 0, ry = 0, dx = 0, dy = 0, rafId;
    const onMove = (e) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
    };
    const raf = () => {
      rx += (dx - rx) * 0.2; ry += (dy - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(raf);
    };
    const onOver = (e) => {
      const t = e.target;
      if (t.closest('a,button,[data-hover],input,textarea')) ring.current?.classList.add('hover');
      else ring.current?.classList.remove('hover');
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    rafId = requestAnimationFrame(raf);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); cancelAnimationFrame(rafId); };
  }, []);
  return (<><div ref={ring} className="cursor-ring" aria-hidden="true" /><div ref={dot} className="cursor-dot" aria-hidden="true" /></>);
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
function HireSenseDemo({ compact = false }) {
  const queries = [
    { q: 'senior ML engineer with RAG experience' },
    { q: 'full-stack engineer, Next.js, ships fast' },
    { q: 'vector search + Postgres, production' },
    { q: 'backend engineer, distributed systems' },
  ];
  const pool = React.useMemo(() => ([
    { name: 'Priya S.', role: 'ML Engineer · 4y', tags: ['RAG', 'FAISS', 'PyTorch'], base: 0.94, seed: 0.11 },
    { name: 'Marcus T.', role: 'Full-Stack · 6y', tags: ['Next.js', 'Node', 'AWS'], base: 0.88, seed: 0.63 },
    { name: 'Ana L.', role: 'AI Engineer · 3y', tags: ['LLMs', 'Vector', 'FastAPI'], base: 0.86, seed: 0.37 },
    { name: 'Rahul D.', role: 'Backend · 5y', tags: ['Postgres', 'pgvector', 'Go'], base: 0.79, seed: 0.82 },
    { name: 'Sofia M.', role: 'ML Engineer · 2y', tags: ['NLP', 'Keras'], base: 0.71, seed: 0.24 },
  ]), []);
  const [qi, setQi] = useState(0);
  const [scores, setScores] = useState(pool.map(p => p.base));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cycle = async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 520));
      if (cancelled) return;
      setQi(v => (v + 1) % queries.length);
      // deterministic-ish, but only client-side (post-mount) so hydration is safe
      setScores(pool.map((p, i) => {
        const t = (Date.now() / 1200 + p.seed * 7) % 1;
        const jitter = Math.sin(t * Math.PI * 2) * 0.14;
        return Math.min(0.98, Math.max(0.42, p.base + jitter - 0.04));
      }));
      setLoading(false);
    };
    const iv = setInterval(cycle, 4200);
    return () => { cancelled = true; clearInterval(iv); };
  }, [pool]);

  const ranked = pool.map((p, i) => ({ ...p, s: scores[i] })).sort((a, b) => b.s - a.s);
  return (
    <div className="relative w-full rounded-2xl border border-white/8 bg-[#0E0E10]/70 backdrop-blur-sm overflow-hidden shadow-[0_30px_80px_-40px_rgba(15,164,122,0.25)]">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/6">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-white/50">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FA47A]/60 opacity-70" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0FA47A]" />
          </span>
          HIRESENSE · LIVE
        </div>
        <a href="https://hiresense-ai-roan.vercel.app/" target="_blank" rel="noopener noreferrer"
          data-hover
          onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('ach:hiresense'))}
          aria-label="Open HireSense AI live demo in a new tab"
          className="font-mono text-[10px] tracking-widest text-white/50 hover:text-[#0FA47A] inline-flex items-center gap-1.5 group transition-colors">
          VIEW LIVE DEMO
          <ArrowUpRight className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" aria-hidden="true" />
        </a>
      </div>
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <Search className={`w-4 h-4 ${loading ? 'text-white/40 animate-pulse' : 'text-[#0FA47A]'}`} />
          <AnimatePresence mode="wait">
            <motion.div key={qi} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }} className="font-mono text-[13px] text-white/85 flex-1 truncate">
              {queries[qi].q}
            </motion.div>
          </AnimatePresence>
          <span className="font-mono text-[10px] text-white/40">⌘K</span>
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-white/40 mt-5 mb-2">
          <span>RANKED · RRF(FAISS ⊕ BM25)</span>
          <span className={`transition-opacity ${loading ? 'opacity-100' : 'opacity-0'}`}>SEARCHING…</span>
        </div>
      </div>
      <div className="px-3 pb-4">
        {ranked.map((r, idx) => (
          <motion.div key={r.name} layout transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/[0.03] transition-colors">
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
                <motion.div animate={{ width: `${r.s * 100}%`, opacity: loading ? 0.4 : 1 }}
                  transition={{ duration: 0.9, ease: [0.65,0,0.35,1] }}
                  className="h-full bg-[#0FA47A]" />
              </div>
              <div className="font-mono text-[10px] text-white/50 mt-1 text-right tabular-nums">{r.s.toFixed(2)}</div>
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
        <KbdHint />
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
              {['I build production','software that solves'].map((line, idx) => (
                <motion.div key={idx} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + idx * 0.09, duration: 0.9, ease: [0.16,1,0.3,1] }}>
                  {line}
                </motion.div>
              ))}
              <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.9, ease: [0.16,1,0.3,1] }}>
                <span className="font-serif-display accent italic pr-1">real problems</span>.
              </motion.div>
            </h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
              className="mt-10 max-w-xl text-white/60 font-body text-[17px] md:text-[19px] leading-[1.6]">
              Software engineer working across applied AI, backend systems, and product. I take problems from first sketch to something running in production — measurable, tested, and used.
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
          aside="Five years of building — from foundations in CS to shipping production AI. The path, in five moments." />
        <div className="mt-20 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4 md:sticky md:top-32 self-start">
            <motion.div
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.1, ease: [0.16,1,0.3,1] }}
              className="mb-8 w-[160px] group">
              <div className="relative rounded-2xl border border-white/12 bg-[#0E0E10] overflow-hidden aspect-[4/5] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]">
                <img
                  src="/portrait.jpg"
                  alt="Portrait of Kanhaiya Lal Sharma"
                  width={320}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05] brightness-[0.92] transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:brightness-100"
                />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(180deg, rgba(10,10,11,0) 55%, rgba(10,10,11,0.55) 100%)' }} />
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] tracking-[0.25em] text-white/70">
                  <span>KLS · 2026</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0FA47A]" aria-hidden="true" />
                </div>
              </div>
            </motion.div>
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
  const [notesOpen, setNotesOpen] = useState(false);
  return (
    <motion.article initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}
      className={`relative group py-24 md:py-40 border-t border-white/6 transition-colors duration-500 hover:bg-white/[0.008]`}>
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-y-4 mb-10">
          <div className="flex items-baseline gap-6">
            <span className="font-mono text-[11px] tracking-[0.3em] text-white/40">{p.num}</span>
            <span className="font-mono text-[11px] tracking-[0.3em] text-white/40">{tone || 'PROJECT'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {p.links.demo && p.links.demo !== '#' && <a data-hover href={p.links.demo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} live demo (opens in new tab)`} className="chip hover:border-[#0FA47A]/40 hover:text-white"><ExternalLink className="w-3 h-3" aria-hidden="true"/> Live</a>}
            {p.links.github && p.links.github !== '#' && <a data-hover href={p.links.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} source on GitHub (opens in new tab)`} className="chip hover:border-[#0FA47A]/40 hover:text-white"><Github className="w-3 h-3" aria-hidden="true"/> Code</a>}
            <button data-hover onClick={() => setNotesOpen(true)} aria-label={`Open engineering notes for ${p.name}`}
              className="chip hover:border-[#0FA47A]/40 hover:text-white">
              Engineering Notes <ArrowUpRight className="w-3 h-3" aria-hidden="true"/>
            </button>
          </div>
        </div>
        {children}
      </Container>
      <EngineeringNotesDrawer open={notesOpen} onClose={() => setNotesOpen(false)} projectName={p.name} notes={ENG_NOTES[p.id]} />
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
            <div className="mt-6 h-16 flex items-end gap-1" aria-hidden="true">
              {Array.from({length:22}).map((_,i)=>{
                const h = (20 + Math.abs(Math.sin(i*0.9)) * 70).toFixed(2);
                return <div key={i} className="flex-1 bg-[#0FA47A]/70" style={{height: `${h}%`}} />;
              })}
            </div>
            <div className="mt-4 font-display text-3xl text-white">88–92%</div>
            <div className="font-mono text-[11px] text-white/45">accuracy · 22 patient records</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#0E0E10]/70 p-6">
            <div className="font-mono text-[10px] tracking-[0.25em] text-white/40">MRI · EFFICIENTNET-B4 · ADNI</div>
            <div className="mt-6 grid grid-cols-6 gap-1" aria-hidden="true">
              {Array.from({length:24}).map((_,i)=>{
                const a = (0.15 + ((i*7)%10)/25).toFixed(3);
                return <div key={i} className="aspect-square rounded-sm" style={{background: `rgba(15,164,122,${a})`}} />;
              })}
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
  const points = React.useMemo(() => (
    Array.from({length: 60}, (_,i) => {
      const base = 100 + Math.sin(i/6)*35 + i*0.6;
      const noise = Math.sin(i*1.7) * 3.2 + Math.cos(i*0.9) * 1.8; // deterministic
      return { x: i, actual: base + Math.sin(i/3)*8, pred: base + Math.sin(i/3)*8 + noise };
    })
  ), []);
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
  const endRef = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        window.dispatchEvent(new CustomEvent('ach:projects'));
        io.disconnect();
      }
    }, { threshold: 0.4 });
    if (endRef.current) io.observe(endRef.current);
    return () => io.disconnect();
  }, []);
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
        <div ref={endRef} aria-hidden="true" />
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

/* ---------- Typing line ---------- */
function TypingLine({ text, className, speed = 14, onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) { onDone?.(); return; }
    const t = setTimeout(() => setN(n + 1), speed);
    return () => clearTimeout(t);
  }, [n, text, speed]);
  return <div className={className}>{text.slice(0, n)}{n < text.length && <span className="text-[#0FA47A] blink">▍</span>}</div>;
}

/* ---------- Terminal Contact ---------- */
function Contact() {
  const [history, setHistory] = useState([
    { t: 'system', v: 'Welcome. Type "help" for commands, or "hire" to reach me directly.', typed: true },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scroller = useRef(null);
  useEffect(() => { scroller.current?.scrollTo({ top: 9e9, behavior: 'smooth' }); }, [history]);

  const emit = async (lines, delayEach = 220) => {
    setBusy(true);
    for (const line of lines) {
      await new Promise(r => setTimeout(r, delayEach));
      setHistory(h => [...h, { ...line, typed: false }]);
    }
    setBusy(false);
  };

  const run = async (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd || busy) return;
    setHistory(h => [...h, { t: 'user', v: raw, typed: true }]);
    if (cmd === 'help') return emit([
      { t: 'out', v: 'Available commands:' },
      { t: 'dim', v: '  about        — a short introduction' },
      { t: 'dim', v: '  whoami       — alias of about' },
      { t: 'dim', v: '  projects     — list selected work' },
      { t: 'dim', v: '  resume       — download my resume' },
      { t: 'dim', v: '  hire         — start a conversation' },
      { t: 'dim', v: '  email        — show email address' },
      { t: 'dim', v: '  phone        — show phone number' },
      { t: 'dim', v: '  github       — open GitHub profile' },
      { t: 'dim', v: '  linkedin     — open LinkedIn profile' },
      { t: 'dim', v: '  coffee       — a short break' },
      { t: 'dim', v: '  clear        — clear the terminal' },
    ], 55);
    if (cmd === 'sudo hire kanhaiya') return emit([
      { t: 'ok', v: 'Permission granted.' },
      { t: 'out', v: 'Offer letter pending…' },
      { t: 'dim', v: '(Just kidding 😄)' },
    ], 300);
    if (cmd === 'cat motivation.txt' || cmd === 'motivation') return emit([
      { t: 'dim', v: 'while (!successful) {' },
      { t: 'dim', v: '    learn();' },
      { t: 'dim', v: '    build();' },
      { t: 'dim', v: '    improve();' },
      { t: 'dim', v: '}' },
    ], 120);
    if (cmd === 'coffee') return emit([
      { t: 'out', v: '☕' },
      { t: 'ok', v: 'Compiling motivation…' },
      { t: 'ok', v: 'Done.' },
      { t: 'out', v: 'Now go build something awesome.' },
    ], 260);
    if (cmd.startsWith('hire')) {
      await emit([
        { t: 'ok', v: 'Initializing hiring protocol…' },
        { t: 'ok', v: '✓ Resume loaded' },
        { t: 'ok', v: '✓ Projects verified' },
        { t: 'ok', v: '✓ Production systems detected' },
        { t: 'out', v: 'Ready for interview.' },
        { t: 'dim', v: `Reach out directly: ${PROFILE.email}` },
      ], 260);
      setTimeout(() => window.location.href = `mailto:${PROFILE.email}?subject=Let%27s%20build%20something`, 400);
      return;
    }
    if (cmd === 'resume') {
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('ach:resume'));
      setTimeout(() => window.open(PROFILE.resume, '_blank', 'noopener,noreferrer'), 900);
      return emit([
        { t: 'ok', v: 'Preparing resume…' },
        { t: 'out', v: 'Kanhaiya Lal Sharma — Software Engineer.' },
        { t: 'out', v: 'B.Tech CSE, KIIT (2022–2026). Focus: AI, backend, full-stack.' },
        { t: 'out', v: `Direct download: ${PROFILE.resume}` },
      ], 240);
    }
    if (cmd === 'email') return emit([{ t: 'out', v: PROFILE.email }]);
    if (cmd === 'phone') return emit([{ t: 'out', v: PROFILE.phone }]);
    if (cmd === 'github') { await emit([{ t: 'ok', v: 'Opening GitHub…' }]); window.open(PROFILE.github, '_blank', 'noopener,noreferrer'); return; }
    if (cmd === 'linkedin') { await emit([{ t: 'ok', v: 'Opening LinkedIn…' }]); window.open(PROFILE.linkedin, '_blank', 'noopener,noreferrer'); return; }
    if (cmd === 'projects') return emit(PROJECTS.map(p => ({ t: 'out', v: `• ${p.name} — ${p.subtitle}` })), 140);
    if (cmd === 'about' || cmd === 'whoami') return emit([
      { t: 'out', v: 'Kanhaiya Sharma' },
      { t: 'out', v: 'Software Engineer' },
      { t: 'out', v: 'AI Engineer' },
      { t: 'dim', v: 'Building production software using AI, backend systems, and modern web technologies.' },
      { t: 'dim', v: 'KIIT 2026.' },
      { t: 'dim', v: 'Open to Software Engineer and AI Engineer opportunities.' },
    ], 180);
    if (cmd === 'clear') { setHistory([]); return; }
    return emit([{ t: 'err', v: `command not found: ${cmd}. type "help".` }]);
  };
  const submit = (e) => { e.preventDefault(); run(input); setInput(''); };

  const colorFor = (t) => (
    t === 'user' ? 'text-white' :
    t === 'ok' ? 'text-[#0FA47A]' :
    t === 'err' ? 'text-rose-400/80' :
    t === 'system' ? 'text-white/60' :
    t === 'dim' ? 'text-white/55' :
    t === 'link' ? 'text-[#0FA47A] underline underline-offset-4' :
    'text-white/75'
  );

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
              I read every message. Fastest way to reach me is email — the terminal on the right works too, if you prefer keyboards.
            </p>
            <div className="mt-10 space-y-0">
              <a href={`mailto:${PROFILE.email}`} data-hover aria-label={`Email ${PROFILE.email}`}
                className="flex items-center justify-between py-4 border-t border-white/8 group hover:pl-1 transition-all">
                <span className="flex items-center gap-3 text-white/85"><Mail className="w-4 h-4 text-[#0FA47A]" aria-hidden="true" />{PROFILE.email}</span>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" aria-hidden="true" />
              </a>
              <div className="flex items-center justify-between py-4 border-t border-white/8">
                <span className="flex items-center gap-3 text-white/85"><Phone className="w-4 h-4 text-[#0FA47A]" aria-hidden="true" />{PROFILE.phone}</span>
              </div>
              <a href={PROFILE.github} data-hover target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in new tab)"
                className="flex items-center justify-between py-4 border-t border-white/8 group hover:pl-1 transition-all">
                <span className="flex items-center gap-3 text-white/85"><Github className="w-4 h-4 text-[#0FA47A]" aria-hidden="true" />GitHub</span>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" aria-hidden="true" />
              </a>
              <a href={PROFILE.linkedin} data-hover target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in new tab)"
                className="flex items-center justify-between py-4 border-t border-white/8 group hover:pl-1 transition-all">
                <span className="flex items-center gap-3 text-white/85"><Linkedin className="w-4 h-4 text-[#0FA47A]" aria-hidden="true" />LinkedIn</span>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" aria-hidden="true" />
              </a>
              <a href={PROFILE.resume} data-hover target="_blank" rel="noopener noreferrer"
                onClick={() => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('ach:resume')); }}
                aria-label="Download resume (PDF, opens in a new tab)"
                className="flex items-center justify-between py-4 border-t border-b border-white/8 group hover:pl-1 transition-all">
                <span className="flex items-center gap-3 text-white/85"><ExternalLink className="w-4 h-4 text-[#0FA47A]" aria-hidden="true" />Download Resume <span className="text-white/40 font-mono text-[11px]">PDF</span></span>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" aria-hidden="true" />
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
                <span className="ml-auto font-mono text-[10px] text-white/45 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#0FA47A]"/>{busy ? 'running…' : 'ready'}</span>
              </div>
              <div ref={scroller} className="p-5 md:p-7 h-[440px] overflow-y-auto font-mono text-[13px] leading-relaxed space-y-1">
                {history.map((h, i) => {
                  const cls = colorFor(h.t);
                  const prefix = h.t === 'user' ? <span className="text-[#0FA47A]">→ </span> : null;
                  if (h.typed) return <div key={i} className={cls}>{prefix}{h.v}</div>;
                  return (
                    <TypingLine key={i}
                      text={h.v}
                      className={cls}
                      speed={h.t === 'err' ? 10 : 12}
                    />
                  );
                })}
                <form onSubmit={submit} className="flex items-center gap-2 pt-2">
                  <span className="text-[#0FA47A]">→</span>
                  <input autoFocus value={input} onChange={(e) => setInput(e.target.value)}
                    onFocus={() => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('ach:terminal')); }}
                    disabled={busy}
                    aria-label="Terminal input"
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-white/25 disabled:opacity-40"
                    placeholder={busy ? '' : 'try: help'} />
                  <span className="w-1.5 h-4 bg-[#0FA47A] blink" aria-hidden="true" />
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
    <footer className="relative border-t border-white/6 pt-24 pb-14">
      <Container>
        <div className="font-display font-medium text-[clamp(3rem,10vw,9rem)] leading-[0.9] tracking-[-0.04em] text-white/95">
          Build. Ship. <span className="font-serif-display accent">Repeat.</span>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-8 items-end border-t border-white/6 pt-8">
          <div className="text-white/55 text-[13px] font-body leading-relaxed">
            Designed &amp; engineered by <span className="text-white/90">Kanhaiya Sharma</span>.
          </div>
          <div className="text-white/45 text-[13px] font-body leading-relaxed md:text-center">
            Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.
          </div>
          <div className="flex md:justify-end gap-5 text-[13px] font-mono text-white/45">
            <a href={`mailto:${PROFILE.email}`} data-hover className="link-underline hover:text-white" aria-label={`Email ${PROFILE.email}`}>Email</a>
            <a href={PROFILE.github} data-hover target="_blank" rel="noopener noreferrer" className="link-underline hover:text-white" aria-label="GitHub (opens in new tab)">GitHub</a>
            <a href={PROFILE.linkedin} data-hover target="_blank" rel="noopener noreferrer" className="link-underline hover:text-white" aria-label="LinkedIn (opens in new tab)">LinkedIn</a>
          </div>
        </div>
        <div className="mt-8 font-mono text-[11px] text-white/30">© 2026 Kanhaiya Lal Sharma. All rights reserved.</div>
      </Container>
    </footer>
  );
}


/* ---------- Achievement Toasts ---------- */
const ACHIEVEMENTS_MAP = {
  'ach:terminal': '🏆 Opened terminal',
  'ach:resume': '🏆 Resume downloaded',
  'ach:hiresense': '🏆 Explored HireSense',
  'ach:projects': '🏆 Viewed all projects',
};

function AchievementToasts() {
  const [items, setItems] = useState([]);
  const [seen, setSeen] = useState(new Set());

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('kls_ach') || '[]');
      setSeen(new Set(s));
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    const handle = (name) => (e) => {
      if (seen.has(name)) return;
      setSeen(prev => {
        const next = new Set(prev); next.add(name);
        try { localStorage.setItem('kls_ach', JSON.stringify(Array.from(next))); } catch { /* noop */ }
        return next;
      });
      const id = Math.random().toString(36).slice(2);
      setItems(list => [...list, { id, label: ACHIEVEMENTS_MAP[name] }]);
      setTimeout(() => setItems(list => list.filter(x => x.id !== id)), 4200);
    };
    const handlers = Object.keys(ACHIEVEMENTS_MAP).map(n => [n, handle(n)]);
    handlers.forEach(([n, h]) => window.addEventListener(n, h));
    return () => handlers.forEach(([n, h]) => window.removeEventListener(n, h));
  }, [seen]);

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-2 pointer-events-none" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {items.map(item => (
          <motion.div key={item.id}
            initial={{ opacity: 0, x: 40, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 40, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto rounded-full border border-white/10 bg-[#0E0E10]/95 backdrop-blur px-4 py-2.5 font-mono text-[12px] text-white/90 shadow-[0_20px_60px_-30px_rgba(15,164,122,0.4)]">
            {item.label}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Command Palette ---------- */
function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const inputRef = useRef(null);

  const actions = React.useMemo(() => ([
    { id: 'work',       label: 'Projects',              hint: 'Selected work',        run: () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'about',      label: 'Journey',               hint: 'About & timeline',     run: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'skills',     label: 'Craft',                 hint: 'Skills',               run: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'contact',    label: 'Contact',               hint: 'Terminal & email',     run: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'resume',     label: 'Resume',                hint: 'Download PDF',         run: () => window.open(PROFILE.resume, '_blank', 'noopener,noreferrer'), ext: true },
    { id: 'github',     label: 'GitHub',                hint: 'External',             run: () => window.open(PROFILE.github, '_blank', 'noopener,noreferrer'), ext: true },
    { id: 'linkedin',   label: 'LinkedIn',              hint: 'External',             run: () => window.open(PROFILE.linkedin, '_blank', 'noopener,noreferrer'), ext: true },
    { id: 'hiresense',  label: 'HireSense · Live Demo', hint: 'hiresense-ai.vercel.app', run: () => { window.dispatchEvent(new CustomEvent('ach:hiresense')); window.open('https://hiresense-ai-roan.vercel.app/', '_blank', 'noopener,noreferrer'); }, ext: true },
    { id: 'email',      label: 'Email Kanhaiya',        hint: PROFILE.email,          run: () => { window.location.href = `mailto:${PROFILE.email}`; } },
  ]), []);

  const filtered = q.trim() === ''
    ? actions
    : actions.filter(a => (a.label + ' ' + a.hint).toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e) => {
      const isK = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
      if (isK) { e.preventDefault(); setOpen(v => !v); setQ(''); setI(0); return; }
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setI(v => Math.min(filtered.length - 1, v + 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setI(v => Math.max(0, v - 1)); }
      if (e.key === 'Enter') {
        e.preventDefault();
        const a = filtered[i];
        if (a) { a.run(); setOpen(false); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, i]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open]);
  useEffect(() => { setI(0); }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-start justify-center pt-[16vh] px-4"
          role="dialog" aria-modal="true" aria-label="Command palette"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0E0E10]/95 backdrop-blur-xl shadow-[0_60px_120px_-40px_rgba(0,0,0,0.7)] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/6">
              <Search className="w-4 h-4 text-[#0FA47A]" aria-hidden="true" />
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search or jump to…"
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 font-body text-[15px]" />
              <span className="chip">ESC</span>
            </div>
            <div className="max-h-[52vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <div className="px-5 py-6 font-mono text-[13px] text-white/40">No matches.</div>
              )}
              {filtered.map((a, idx) => (
                <button key={a.id}
                  data-hover
                  onMouseEnter={() => setI(idx)}
                  onClick={() => { a.run(); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-4 px-5 py-3 text-left transition-colors ${idx === i ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-white font-body text-[14px]">{a.label}</span>
                    <span className="text-white/40 font-mono text-[11px]">{a.hint}</span>
                  </div>
                  {a.ext
                    ? <ArrowUpRight className="w-3.5 h-3.5 text-white/40" aria-hidden="true" />
                    : <ChevronRight className="w-3.5 h-3.5 text-white/40" aria-hidden="true" />}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/6 font-mono text-[10px] text-white/40">
              <span>↑↓ navigate · ↵ open · Esc close</span>
              <span>⌘K to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Engineering Notes Drawer ---------- */
function EngineeringNotesDrawer({ open, onClose, projectName, notes }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  const sections = notes ? [
    { k: 'Problem', v: notes.problem },
    { k: 'Architecture', v: notes.architecture },
    { k: 'Technical decisions', v: notes.decisions },
    { k: 'Challenges', v: notes.challenges },
    { k: 'Trade-offs', v: notes.tradeoffs },
    { k: 'Future improvements', v: notes.future },
  ] : [];

  return (
    <AnimatePresence>
      {open && notes && (
        <motion.div className="fixed inset-0 z-[75]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          role="dialog" aria-modal="true" aria-labelledby="eng-notes-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.aside
            initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 h-full w-full sm:max-w-[560px] bg-[#0E0E10] border-l border-white/8 overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/6 bg-[#0E0E10]/95 backdrop-blur">
              <div className="font-mono text-[11px] tracking-[0.3em] text-white/45">ENGINEERING NOTES</div>
              <button data-hover onClick={onClose} aria-label="Close engineering notes"
                className="chip hover:border-white/30 hover:text-white">ESC · Close</button>
            </div>
            <div className="px-6 pt-8 pb-16">
              <h3 id="eng-notes-title" className="font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.05] tracking-[-0.03em]">
                {projectName} <span className="font-serif-display accent">— under the hood.</span>
              </h3>
              <div className="mt-10 space-y-10">
                {sections.map(s => (
                  <div key={s.k}>
                    <div className="font-mono text-[10px] tracking-[0.3em] text-white/40">{s.k.toUpperCase()}</div>
                    {Array.isArray(s.v) ? (
                      <ul className="mt-3 space-y-2">
                        {s.v.map((line, idx) => (
                          <li key={idx} className="flex gap-3 text-white/75 font-body text-[15px] leading-[1.65]">
                            <span className="text-[#0FA47A] mt-2 shrink-0 w-1.5 h-1.5 rounded-full" aria-hidden="true" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-white/75 font-body text-[15px] leading-[1.65]">{s.v}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Command Palette hint button ---------- */
function KbdHint() {
  const [mac, setMac] = useState(false);
  useEffect(() => {
    setMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);
  return (
    <button
      data-hover
      onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))}
      aria-label="Open command palette"
      className="hidden md:inline-flex items-center gap-2 chip hover:border-white/25 hover:text-white">
      <Search className="w-3 h-3" aria-hidden="true" />
      <span className="tabular-nums">{mac ? '⌘' : 'Ctrl'} K</span>
    </button>
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
      <CommandPalette />
      <AchievementToasts />
    </main>
  );
}

export default App;
