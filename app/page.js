'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail, Terminal as TerminalIcon, Cpu, Brain, Database, Cloud, Code2, Layers, Sparkles, ChevronRight, ExternalLink, Phone } from 'lucide-react';

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
    id: 'hiresense',
    name: 'HireSense AI',
    subtitle: 'AI Recruiter Copilot',
    color: '#00D9FF',
    tagline: 'Production-grade hybrid retrieval for grounded hiring decisions.',
    problem: 'Recruiters drown in unstructured candidate data. Off-the-shelf semantic search hallucinates and misses lexical signals.',
    solution: 'Hybrid FAISS + BM25 retrieval fused via Reciprocal Rank Fusion, wrapped in a stateless FastAPI service and a Next.js 15 UI.',
    stack: ['Next.js 15', 'React 19', 'FastAPI', 'FAISS', 'RRF', 'TypeScript', 'Vercel', 'HF Spaces'],
    metrics: [
      { k: '377', v: 'records indexed' },
      { k: '<1s', v: 'query latency' },
      { k: '100%', v: 'live in prod' },
    ],
    links: { demo: '#', github: '#', study: '#' },
  },
  {
    id: 'legal',
    name: 'Legal AI Platform',
    subtitle: 'Document Automation & Analysis',
    color: '#8B5CF6',
    tagline: 'Semantic search & clause extraction across 1,000+ legal documents.',
    problem: 'Legal review is slow, expensive, and error-prone. Teams need sub-second grounded answers with citations.',
    solution: 'Next.js + Supabase pgvector RAG pipeline with LLM-powered clause extraction, signed URLs, and edge APIs.',
    stack: ['Next.js', 'Supabase', 'pgvector', 'Auth0', 'LLM APIs', 'SWR', 'Edge Runtime'],
    metrics: [
      { k: '1000+', v: 'documents' },
      { k: '~50ms', v: 'upload/retrieval' },
      { k: '<1s', v: 'RAG query' },
    ],
    links: { demo: null, github: '#', study: '#' },
  },
  {
    id: 'twin',
    name: 'Neural Digital Twin',
    subtitle: 'Cognitive Disorder Detection',
    color: '#4F8CFF',
    tagline: 'Multimodal EEG + MRI diagnostic AI for early cognitive decline.',
    problem: 'Early detection of cognitive disorders requires fusing signals across modalities — rarely done well.',
    solution: 'CMF-ViT for EEG (TUH) and EfficientNet-B4 for MRI (ADNI), unified into a diagnostic decision layer.',
    stack: ['PyTorch', 'Vision Transformer', 'EfficientNet-B4', 'EEG/MRI', 'TUH', 'ADNI'],
    metrics: [
      { k: '97.6%', v: 'MRI test acc.' },
      { k: '88\u201392%', v: 'EEG acc.' },
      { k: '2', v: 'modalities fused' },
    ],
    links: { demo: null, github: '#', study: '#' },
  },
  {
    id: 'lstm',
    name: 'LSTM Forecasting',
    subtitle: 'Stock Market Time-Series',
    color: '#22D3EE',
    tagline: '3-layer LSTM forecasting with rigorous validation and stability tuning.',
    problem: 'Financial series are noisy, non-stationary, and punish naive models.',
    solution: '3-layer LSTM with EarlyStopping + LR scheduling over 5,000+ points, tuned for stability.',
    stack: ['TensorFlow', 'Keras', 'NumPy', 'Pandas', 'Matplotlib'],
    metrics: [
      { k: '0.96', v: 'R\u00b2' },
      { k: '66.5', v: 'RMSE' },
      { k: '-70%', v: 'val loss' },
    ],
    links: { demo: null, github: '#', study: '#' },
  },
];

const TIMELINE = [
  { year: '2022', title: 'Started Computer Science', body: 'Enrolled at KIIT Bhubaneswar. First lines of Python.' },
  { year: '2023', title: 'Discovered AI', body: 'Fell in love with neural networks after an AI Masterclass.' },
  { year: '2024', title: 'Built ML Projects', body: 'LSTMs, CNNs, Vision Transformers on real datasets.' },
  { year: '2024', title: 'Started Full-Stack', body: 'Next.js, FastAPI, Postgres, Supabase, Vercel.' },
  { year: '2025', title: 'Shipped Production AI', body: 'HireSense AI — live end-to-end RAG product.' },
  { year: '2026', title: 'Graduate', body: 'B.Tech CSE — ready to build the next generation of AI.' },
];

const SKILLS = [
  { cat: 'AI / ML', icon: Brain, color: '#00D9FF', items: ['LLM APIs', 'RAG Pipelines', 'Vector Embeddings', 'FAISS', 'Reciprocal Rank Fusion', 'CMF-ViT', 'EfficientNet', 'LSTM', 'CNN', 'TensorFlow', 'Keras', 'scikit-learn'] },
  { cat: 'Backend', icon: Cpu, color: '#4F8CFF', items: ['Python', 'FastAPI', 'Node.js', 'Express', 'Java', 'C++', 'REST', 'System Design'] },
  { cat: 'Frontend', icon: Layers, color: '#8B5CF6', items: ['Next.js 15', 'React 19', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'SWR'] },
  { cat: 'Database', icon: Database, color: '#22D3EE', items: ['PostgreSQL', 'pgvector', 'Supabase', 'MySQL', 'SQL'] },
  { cat: 'Cloud / DevOps', icon: Cloud, color: '#60A5FA', items: ['Docker', 'Vercel', 'Railway', 'Hugging Face Spaces', 'CI/CD', 'Git'] },
  { cat: 'Engineering', icon: Code2, color: '#A78BFA', items: ['Pytest', 'MyPy', 'ESLint', 'DSA', 'OOP', 'Agile / SDLC'] },
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
      document.documentElement.style.setProperty('--mx', dx + 'px');
      document.documentElement.style.setProperty('--my', dy + 'px');
    };
    const raf = () => {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
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

/* ---------- Boot Loader ---------- */
function BootLoader({ onDone }) {
  const steps = [
    'Initializing Neural Engine',
    'Loading Knowledge Graph',
    'Connecting Language Models',
    'Warming Vector Index',
    'Launching Portfolio',
  ];
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (i >= steps.length) { const t = setTimeout(() => { setDone(true); onDone(); }, 350); return () => clearTimeout(t); }
    const t = setTimeout(() => setI(i + 1), 380);
    return () => clearTimeout(t);
  }, [i]);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative w-[min(560px,88vw)] font-mono text-sm">
            <div className="flex items-center gap-2 mb-6 text-[#00D9FF]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
              <span className="tracking-[0.3em] text-xs uppercase">KLS // AI OS v2026</span>
            </div>
            {steps.map((s, idx) => (
              <div key={s} className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className={idx < i ? 'text-white' : idx === i ? 'text-[#00D9FF]' : 'text-white/30'}>&gt; {s}</span>
                <span className={idx < i ? 'text-emerald-400' : idx === i ? 'text-[#00D9FF]' : 'text-white/20'}>
                  {idx < i ? 'OK' : idx === i ? '...' : '—'}
                </span>
              </div>
            ))}
            <div className="mt-6 h-[2px] bg-white/10 overflow-hidden rounded-full">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(i / steps.length) * 100}%` }}
                transition={{ duration: 0.35 }}
                className="h-full bg-gradient-to-r from-[#00D9FF] via-[#4F8CFF] to-[#8B5CF6]" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Neural Grid Canvas ---------- */
function NeuralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    let w, h, nodes = [], mouse = { x: -9999, y: -9999 };
    const resize = () => {
      w = c.width = window.innerWidth * devicePixelRatio;
      h = c.height = Math.max(window.innerHeight, 800) * devicePixelRatio;
      c.style.width = window.innerWidth + 'px';
      c.style.height = Math.max(window.innerHeight, 800) + 'px';
      const N = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 22000));
      nodes = Array.from({ length: N }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
      }));
    };
    const move = (e) => { mouse.x = e.clientX * devicePixelRatio; mouse.y = e.clientY * devicePixelRatio; };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', move);
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      const linkDist = 160 * devicePixelRatio;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y; const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const alpha = 1 - d / linkDist;
            ctx.strokeStyle = `rgba(79,140,255,${alpha * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y; const md = Math.hypot(mdx, mdy);
        const mDist = 220 * devicePixelRatio;
        if (md < mDist) {
          const alpha = 1 - md / mDist;
          ctx.strokeStyle = `rgba(0,217,255,${alpha * 0.55})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(0,217,255,0.55)';
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.6 * devicePixelRatio, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', move); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}

/* ---------- Magnetic Button ---------- */
function Magnetic({ children, className = '', ...rest }) {
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.button ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ x: sx, y: sy }} className={className} {...rest}>
      {children}
    </motion.button>
  );
}

/* ---------- Counter ---------- */
function Counter({ to, suffix }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0; const dur = 1400; const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          setN(Math.floor(start + (to - start) * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick); io.disconnect();
      }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* ---------- Section wrapper ---------- */
const Section = ({ id, children, className = '' }) => (
  <section id={id} className={`relative w-full py-28 md:py-36 ${className}`}>{children}</section>
);

/* ---------- Hero ---------- */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const blur = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(6px)']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden">
      {/* backgrounds */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <NeuralCanvas />
      <div className="absolute inset-0 spotlight" />
      {/* beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0,1,2,3].map(i => (
          <div key={i} className="beam absolute top-0 h-[40vh] w-[1px] bg-gradient-to-b from-transparent via-[#00D9FF]/60 to-transparent"
            style={{ left: `${15 + i*22}%`, animationDelay: `${i*1.6}s`, animationDuration: `${8 + i}s` }} />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#020617]" />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <a href="#top" className="font-mono text-xs tracking-[0.3em] text-white/80 hover:text-[#00D9FF]" data-hover>
          KLS<span className="text-[#00D9FF]">.</span>AI
        </a>
        <div className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest text-white/60">
          {['work','about','skills','contact'].map(s => (
            <a key={s} href={`#${s}`} className="hover:text-white transition-colors" data-hover>{s.toUpperCase()}</a>
          ))}
        </div>
        <a href="#contact" className="hidden md:inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-2 text-xs font-mono hover:border-[#00D9FF] hover:text-[#00D9FF] transition-all" data-hover>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AVAILABLE 2026
        </a>
      </nav>

      {/* Content */}
      <motion.div style={{ y, opacity, filter: blur }} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-[#00D9FF]/80 mb-8">
          <span className="h-px w-10 bg-[#00D9FF]/60" />
          KANHAIYA LAL SHARMA · AI ENGINEER · FULL-STACK
        </motion.div>
        <h1 className="font-display font-bold leading-[0.92] tracking-tight text-[clamp(2.6rem,7.5vw,7.5rem)]">
          {['I DON’T BUILD','WEBSITES.','I BUILD','INTELLIGENT','PRODUCTS.'].map((line, idx) => (
            <motion.div key={idx} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 + idx * 0.09, duration: 0.9, ease: [0.16,1,0.3,1] }}
              className={idx === 3 ? 'text-accent-gradient' : 'text-gradient'}>
              {line}
            </motion.div>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
          className="mt-8 max-w-2xl text-white/60 font-body text-lg md:text-xl leading-relaxed">
          I design intelligent software combining <span className="text-white">AI</span>, <span className="text-white">backend engineering</span>, and <span className="text-white">scalable systems</span> — from idea to production.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }}
          className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white text-black font-medium font-body overflow-hidden">
            <span className="relative z-10">Explore My Work</span>
            <ArrowUpRight className="relative z-10 w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] via-[#4F8CFF] to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity" />
          </Magnetic>
          <a href="#contact" data-hover className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/15 hover:border-white/40 font-body text-white/80 hover:text-white transition">
            <TerminalIcon className="w-4 h-4" /> Open Terminal
          </a>
        </motion.div>

        {/* meta strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs text-white/50">
          {[
            ['LOCATION','Bhubaneswar, IN'],
            ['GRADUATION','2026 · B.Tech CSE'],
            ['FOCUS','LLM · RAG · Systems'],
            ['STATUS','Open to Roles'],
          ].map(([k,v]) => (
            <div key={k} className="border-t border-white/10 pt-3">
              <div className="text-white/40">{k}</div>
              <div className="text-white mt-1">{v}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 font-mono text-[10px] tracking-[0.4em] text-white/40">
        <div className="flex flex-col items-center gap-2">
          <span>SCROLL</span>
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="w-px h-8 bg-white/30 block" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Marquee ---------- */
function Marquee() {
  const items = ['LLMs','RAG','Vector Search','FAISS','Next.js 15','FastAPI','TensorFlow','PyTorch','Supabase','pgvector','Vercel','Hugging Face','Docker','TypeScript','System Design'];
  const dup = [...items, ...items];
  return (
    <div className="relative py-10 border-y border-white/5 overflow-hidden bg-[#0B1120]">
      <div className="marquee-track flex gap-14 whitespace-nowrap font-display text-3xl md:text-4xl font-medium">
        {dup.map((t,i) => (
          <span key={i} className="inline-flex items-center gap-14 text-white/30">
            {t}
            <Sparkles className="w-5 h-5 text-[#00D9FF]/50" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- About Timeline ---------- */
function About() {
  return (
    <Section id="about" className="bg-[#020617]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeader kicker="01 // ORIGIN" title="From first line of code" titleAccent="to production AI." />
        <div className="mt-20 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          {TIMELINE.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
              className={`relative flex md:items-center gap-6 md:gap-16 py-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#00D9FF] shadow-[0_0_20px_#00D9FF]" />
              </div>
              <div className="ml-14 md:ml-0 md:w-1/2 md:px-8">
                <div className="font-mono text-xs tracking-[0.3em] text-[#00D9FF]">{t.year}</div>
                <div className="mt-2 font-display text-2xl md:text-3xl font-semibold text-white">{t.title}</div>
                <p className="mt-2 text-white/50 font-body">{t.body}</p>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function SectionHeader({ kicker, title, titleAccent }) {
  return (
    <div className="max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-mono text-xs tracking-[0.3em] text-[#00D9FF]/80">{kicker}</motion.div>
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-4 font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
        <span className="text-gradient">{title}</span> <span className="text-accent-gradient">{titleAccent}</span>
      </motion.h2>
    </div>
  );
}

/* ---------- Projects ---------- */
function ProjectCard({ p, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.6]);
  return (
    <motion.div ref={ref} style={{ scale, opacity }}
      className="sticky top-24 mb-8">
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0B1120] card-glow">
        {/* color aura */}
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(600px circle at 20% 0%, ${p.color}22, transparent 60%)` }} />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative grid md:grid-cols-2 gap-10 p-8 md:p-14">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 font-mono text-xs tracking-[0.25em]" style={{ color: p.color }}>
              <span className="h-px w-8" style={{ background: p.color }} />
              PROJECT {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="mt-5 font-display text-4xl md:text-6xl font-bold text-white leading-[1.02]">{p.name}</h3>
            <div className="mt-2 text-white/50 font-body text-lg">{p.subtitle}</div>
            <p className="mt-8 text-white/80 font-body text-lg leading-relaxed">{p.tagline}</p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {p.metrics.map((m) => (
                <div key={m.v} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="font-display text-2xl font-bold" style={{ color: p.color }}>{m.k}</div>
                  <div className="text-white/50 text-xs font-mono mt-1">{m.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {p.links.demo && <a data-hover href={p.links.demo} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90">Live Demo <ExternalLink className="w-3.5 h-3.5"/></a>}
              {p.links.github && <a data-hover href={p.links.github} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40"><Github className="w-4 h-4"/>GitHub</a>}
              {p.links.study && <a data-hover href={p.links.study} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm hover:border-white/40">Case Study <ChevronRight className="w-4 h-4"/></a>}
            </div>
          </div>
          {/* Right */}
          <div className="space-y-6">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] text-white/40">PROBLEM</div>
              <p className="mt-2 text-white/70 font-body">{p.problem}</p>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] text-white/40">ARCHITECTURE</div>
              <p className="mt-2 text-white/70 font-body">{p.solution}</p>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] text-white/40">STACK</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map(s => (
                  <span key={s} className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-white/70">{s}</span>
                ))}
              </div>
            </div>
            {/* faux code snippet */}
            <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"/>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"/>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"/>
                <span className="ml-3 font-mono text-[10px] text-white/40">{p.id}.py</span>
              </div>
              <pre className="p-4 text-[11px] leading-relaxed font-mono text-white/70 overflow-x-auto">
<span style={{color: p.color}}>from</span> pipeline <span style={{color: p.color}}>import</span> retrieve, rerank, generate{'\n'}
{'\n'}
<span style={{color: p.color}}>def</span> answer(query: str){' '}-&gt; str:{'\n'}
{'  '}ctx = retrieve(query, k=<span className="text-emerald-300">12</span>){'\n'}
{'  '}ctx = rerank(query, ctx){'\n'}
{'  '}<span style={{color: p.color}}>return</span> generate(query, ctx){'\n'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Projects() {
  return (
    <Section id="work" className="bg-[#020617]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeader kicker="02 // SELECTED WORK" title="Products, not demos." titleAccent="Shipped end-to-end." />
      </div>
      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-20">
        {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
        <div className="h-[40vh]" />
      </div>
    </Section>
  );
}

/* ---------- Skills OS ---------- */
function Skills() {
  const [active, setActive] = useState(0);
  return (
    <Section id="skills" className="bg-[#0B1120] border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeader kicker="03 // AI OPERATING SYSTEM" title="The stack that ships" titleAccent="intelligent products." />
        <div className="mt-16 grid md:grid-cols-[280px,1fr] gap-8">
          <div className="space-y-2">
            {SKILLS.map((s, i) => {
              const Icon = s.icon;
              const active_ = i === active;
              return (
                <button key={s.cat} data-hover onClick={() => setActive(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left ${active_ ? 'border-[#00D9FF]/40 bg-white/[0.04]' : 'border-white/10 hover:border-white/20'}`}>
                  <span className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="font-mono text-sm text-white/80">{s.cat}</span>
                  <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${active_ ? 'rotate-90 text-[#00D9FF]' : 'text-white/30'}`} />
                </button>
              );
            })}
          </div>
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl border border-white/10 bg-[#020617] p-8 min-h-[320px] overflow-hidden">
            <div className="absolute inset-0 opacity-30 pointer-events-none"
              style={{ background: `radial-gradient(500px circle at 100% 0%, ${SKILLS[active].color}25, transparent 60%)` }} />
            <div className="relative">
              <div className="font-mono text-xs tracking-[0.3em]" style={{ color: SKILLS[active].color }}>MODULE // {SKILLS[active].cat.toUpperCase()}</div>
              <h3 className="mt-3 font-display text-3xl md:text-4xl font-bold text-white">{SKILLS[active].cat}</h3>
              <div className="mt-8 flex flex-wrap gap-2">
                {SKILLS[active].items.map((it, idx) => (
                  <motion.span key={it} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                    data-hover
                    className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] font-mono text-sm text-white/80 hover:border-[#00D9FF]/40 hover:text-white transition">
                    {it}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Achievements ---------- */
function Achievements() {
  return (
    <Section id="stats" className="bg-[#020617]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeader kicker="04 // NUMBERS" title="Signal over noise." titleAccent="Real output." />
        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4">
          {ACHIEVEMENTS.map(a => (
            <div key={a.label} className="rounded-2xl border border-white/10 bg-[#0B1120] p-6">
              <div className="font-display text-5xl font-bold text-accent-gradient"><Counter to={a.k} suffix={a.suffix} /></div>
              <div className="mt-3 text-white/50 text-sm font-mono">{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Terminal Contact ---------- */
function Contact() {
  const [history, setHistory] = useState([
    { t: 'system', v: 'KLS Neural Terminal v2026.06 — secure channel established.' },
    { t: 'system', v: 'Type "help" to see available commands.' },
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
      { t: 'out', v: '  hire kanhaiya   — initiate outreach' },
      { t: 'out', v: '  email           — show email address' },
      { t: 'out', v: '  phone           — show phone number' },
      { t: 'out', v: '  github          — open GitHub profile' },
      { t: 'out', v: '  linkedin        — open LinkedIn profile' },
      { t: 'out', v: '  projects        — list projects' },
      { t: 'out', v: '  whoami          — about Kanhaiya' },
      { t: 'out', v: '  clear           — clear terminal' },
    ]);
    if (cmd.startsWith('hire')) {
      push([
        { t: 'ok', v: 'Initializing connection...' },
        { t: 'ok', v: 'Handshaking with recruiter node...' },
        { t: 'ok', v: 'Establishing secure tunnel...' },
        { t: 'ok', v: 'Message successfully transmitted.' },
        { t: 'out', v: `Reach out directly: ${PROFILE.email}` },
      ]);
      setTimeout(() => window.location.href = `mailto:${PROFILE.email}?subject=Let%27s%20build%20something%20intelligent`, 900);
      return;
    }
    if (cmd === 'email') return push([{ t: 'out', v: PROFILE.email }]);
    if (cmd === 'phone') return push([{ t: 'out', v: PROFILE.phone }]);
    if (cmd === 'github') { push([{ t: 'ok', v: 'Opening GitHub...' }]); window.open(PROFILE.github, '_blank'); return; }
    if (cmd === 'linkedin') { push([{ t: 'ok', v: 'Opening LinkedIn...' }]); window.open(PROFILE.linkedin, '_blank'); return; }
    if (cmd === 'projects') return push(PROJECTS.map(p => ({ t: 'out', v: `• ${p.name} — ${p.subtitle}` })));
    if (cmd === 'whoami') return push([
      { t: 'out', v: 'Kanhaiya Lal Sharma · AI Engineer · Full-Stack' },
      { t: 'out', v: `${PROFILE.institute} · Graduating ${PROFILE.graduation}` },
      { t: 'out', v: 'Focus: LLMs · RAG · Systems · Product.' },
    ]);
    if (cmd === 'clear') { setHistory([]); return; }
    push([{ t: 'err', v: `command not found: ${cmd}. type "help".` }]);
  };

  const submit = (e) => { e.preventDefault(); run(input); setInput(''); };

  return (
    <Section id="contact" className="bg-[#0B1120] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <SectionHeader kicker="05 // CONTACT" title="Not a form." titleAccent="A terminal." />
        <div className="mt-14 rounded-2xl border border-white/10 bg-black/60 overflow-hidden shadow-[0_40px_120px_-40px_rgba(0,217,255,0.35)]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-3 font-mono text-xs text-white/50">kanhaiya@neural — zsh</span>
            <span className="ml-auto font-mono text-[10px] text-emerald-400/80">● ONLINE</span>
          </div>
          <div ref={scroller} className="p-5 md:p-8 h-[380px] overflow-y-auto font-mono text-sm space-y-1">
            {history.map((h, i) => (
              <div key={i} className={
                h.t === 'user' ? 'text-white' :
                h.t === 'ok' ? 'text-emerald-400' :
                h.t === 'err' ? 'text-red-400' :
                h.t === 'system' ? 'text-[#00D9FF]' :
                'text-white/70'
              }>
                {h.t === 'user' ? <span className="text-[#00D9FF]">&gt; </span> : null}{h.v}
              </div>
            ))}
            <form onSubmit={submit} className="flex items-center gap-2 pt-2">
              <span className="text-[#00D9FF]">&gt;</span>
              <input autoFocus value={input} onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30"
                placeholder="try: hire kanhaiya" />
              <span className="w-2 h-4 bg-[#00D9FF] animate-pulse" />
            </form>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/50">
          <div className="flex items-center gap-4">
            <a href={`mailto:${PROFILE.email}`} data-hover className="inline-flex items-center gap-2 hover:text-white"><Mail className="w-4 h-4"/>{PROFILE.email}</a>
            <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4"/>{PROFILE.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href={PROFILE.github} data-hover className="p-2 rounded-full border border-white/10 hover:border-white/30"><Github className="w-4 h-4"/></a>
            <a href={PROFILE.linkedin} data-hover className="p-2 rounded-full border border-white/10 hover:border-white/30"><Linkedin className="w-4 h-4"/></a>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="relative bg-[#020617] border-t border-white/5 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <div className="font-display text-[clamp(3rem,10vw,10rem)] font-bold leading-none tracking-tight text-gradient">
          BUILD. SHIP. REPEAT.
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/40">
          <div>© 2026 Kanhaiya Lal Sharma · Crafted with obsession.</div>
          <div>Next.js · Framer Motion · Tailwind</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Easter Eggs ---------- */
function useEasterEggs() {
  useEffect(() => {
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0; let typed = '';
    const flash = (msg) => {
      const el = document.createElement('div');
      el.textContent = msg;
      el.className = 'fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-full bg-[#00D9FF] text-black font-mono text-xs tracking-widest';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2200);
    };
    const onKey = (e) => {
      if (e.key === konami[idx]) { idx++; if (idx === konami.length) { idx = 0; document.body.style.transition='filter .6s'; document.body.style.filter='hue-rotate(180deg)'; flash('⚡ KONAMI — NEURAL OVERDRIVE'); setTimeout(()=>document.body.style.filter='', 3000); } }
      else idx = 0;
      typed = (typed + e.key.toLowerCase()).slice(-3);
      if (typed.endsWith('ai')) {
        document.documentElement.style.setProperty('--accent', ['#00D9FF','#8B5CF6','#4F8CFF','#22D3EE'][Math.floor(Math.random()*4)]);
        flash('AI MODE // PALETTE SHIFT');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

/* ---------- App ---------- */
function App() {
  const [booted, setBooted] = useState(false);
  useEasterEggs();
  return (
    <main id="top" className="relative min-h-screen bg-[#020617] noise">
      <CustomCursor />
      <BootLoader onDone={() => setBooted(true)} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: booted ? 1 : 0 }} transition={{ duration: 0.8 }}>
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
;
