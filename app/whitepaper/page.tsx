'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronDown, ExternalLink } from 'lucide-react';

/* ─────────────── PARTICLE CANVAS ─────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 10; // tall canvas for scrolling
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#d4af77', '#e4c99a', '#c49a55', '#3ee08a'];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}

/* ─────────────── ANIMATED SECTION WRAPPER ─────────────── */
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── ANIMATED COUNTER ─────────────── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const duration = 2000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * end);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─────────────── GLOWING ORB DECORATION ─────────────── */
function GlowOrb({ color, size, top, left, delay = 0 }: { color: string; size: string; top: string; left: string; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        width: size,
        height: size,
        top,
        left,
        filter: 'blur(60px)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ─────────────── TABLE OF CONTENTS ─────────────── */
const tocItems = [
  { id: 'introduction', label: 'Introduction', num: '01' },
  { id: 'vision', label: 'Vision & Mission', num: '02' },
  { id: 'collection', label: 'The Collection', num: '03' },
  { id: 'utility', label: 'Utility & Rewards', num: '04' },
  { id: 'tokenomics', label: '$PPUNKS Tokenomics', num: '05' },
  { id: 'roadmap', label: 'Roadmap', num: '06' },
  { id: 'team', label: 'Team & Community', num: '07' },
  { id: 'disclaimer', label: 'Disclaimer', num: '08' },
];

function FloatingTOC() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    tocItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-1">
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`group flex items-center gap-3 py-1.5 px-3 rounded-full transition-all duration-300 ${
              activeSection === item.id
                ? 'bg-gold-400/15 text-gold-400'
                : 'text-smoke-500 hover:text-smoke-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                activeSection === item.id ? 'bg-gold-400 scale-150' : 'bg-smoke-600 group-hover:bg-smoke-400'
              }`}
            />
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Mobile floating button */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-16 right-0 glass-panel rounded-xl p-4 w-56"
            >
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 rounded text-xs tracking-[0.15em] uppercase transition-all ${
                    activeSection === item.id
                      ? 'text-gold-400 bg-gold-400/10'
                      : 'text-smoke-400 hover:text-smoke-100'
                  }`}
                >
                  <span className="text-gold-400/50 mr-2">{item.num}</span>
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full btn-gold flex items-center justify-center shadow-lg"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </>
  );
}

/* ─────────────── SCROLL PROGRESS BAR ─────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(90deg, #d4af77, #3ee08a, #d4af77)',
      }}
    />
  );
}

/* ─────────────── ROADMAP PHASES ─────────────── */
const roadmapPhases = [
  {
    phase: '01',
    title: 'THE FIRST BREW',
    subtitle: 'Foundation',
    status: 'COMPLETED',
    items: [
      'Launch 3,333 unique Portion Punks',
      'Official website & whitepaper',
      'Community channels (X / Discord)',
      'Holder verification system',
      'Whitelist security with math CAPTCHA',
    ],
    icon: '🧪',
    color: '#3ee08a',
  },
  {
    phase: '02',
    title: 'POTION LAB',
    subtitle: 'Engagement',
    status: 'IN PROGRESS',
    items: [
      'Holder hub with quests & XP system',
      'Badge collection framework',
      'Potion crafting mini-game',
      'Community leaderboards',
      'Trait rarity explorer',
    ],
    icon: '⚗️',
    color: '#d4af77',
  },
  {
    phase: '03',
    title: 'PUNK PASS',
    subtitle: 'Exclusivity',
    status: 'UPCOMING',
    items: [
      'Exclusive holder events & AMAs',
      'Early access to future drops',
      'Gated content & premium features',
      'Collaboration drops with partners',
      'Real-world event access',
    ],
    icon: '🪪',
    color: '#e85a9b',
  },
  {
    phase: '04',
    title: 'PUNK ARCADE',
    subtitle: 'Entertainment',
    status: 'UPCOMING',
    items: [
      'Pixel-art arcade games',
      'Competitive challenges & tournaments',
      'Play-to-earn mechanics',
      'Global leaderboards',
      'Community rewards pool',
    ],
    icon: '🎮',
    color: '#6c63ff',
  },
  {
    phase: '05',
    title: 'THE NEXT BREW',
    subtitle: 'Expansion',
    status: 'UPCOMING',
    items: [
      'New collectible series',
      'Cross-collection collaborations',
      'Metaverse integration',
      'Community-driven governance',
      'Expanded utility ecosystem',
    ],
    icon: '🔮',
    color: '#00d4ff',
  },
];


/* ═══════════════════════════════════════════════════
   MAIN WHITEPAPER PAGE
   ═══════════════════════════════════════════════════ */
export default function WhitepaperPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <main className="relative min-h-screen bg-charcoal-950 text-smoke-100 overflow-hidden">
      {/* Background effects */}
      <ParticleField />
      <div className="film-grain" />
      <ScrollProgress />
      <FloatingTOC />

      {/* ═══════ HERO / COVER ═══════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <GlowOrb color="rgba(212, 175, 119, 0.25)" size="600px" top="-10%" left="60%" />
        <GlowOrb color="rgba(62, 224, 138, 0.15)" size="400px" top="60%" left="-5%" delay={2} />

        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-smoke-400 hover:text-gold-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>

          <motion.p
            className="section-kicker mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Official Whitepaper — V1.0
          </motion.p>

          <motion.h1
            className="font-serif-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <span className="text-smoke-100">Portion</span>
            <br />
            <motion.span
              className="italic text-gold-400"
              animate={{
                textShadow: [
                  '0 0 20px rgba(212, 175, 119, 0)',
                  '0 0 40px rgba(212, 175, 119, 0.3)',
                  '0 0 20px rgba(212, 175, 119, 0)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Punks
            </motion.span>
          </motion.h1>

          <motion.p
            className="font-serif-display italic text-xl sm:text-2xl text-smoke-300 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Potions fuel a brighter tomorrow.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-6 text-[10px] tracking-[0.25em] uppercase text-smoke-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span>3,333 Unique Punks</span>
            <span className="text-gold-400">·</span>
            <span>Robinhood Crypto</span>
            <span className="text-gold-400">·</span>
            <span>Freemint</span>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-20"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-gold-400/50 mx-auto" />
          </motion.div>
        </motion.div>

        {/* Decorative corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold-400/20" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-gold-400/20" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-gold-400/20" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold-400/20" />
      </section>

      {/* ═══════ SECTION 01: INTRODUCTION ═══════ */}
      <section id="introduction" className="relative z-10 py-32">
        <GlowOrb color="rgba(212, 175, 119, 0.15)" size="500px" top="10%" left="70%" delay={1} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="section-kicker mb-4">01 — Introduction</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-smoke-100 leading-tight mb-10">
              Welcome to the{' '}
              <span className="italic text-gold-400">Laboratory</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="glass-panel p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/5 rounded-full blur-3xl" />
              <div className="space-y-6 text-smoke-300 font-light leading-relaxed text-lg relative z-10">
                <p>
                  <span className="font-serif-display text-3xl text-gold-400 italic float-left mr-4 mt-1">P</span>
                  ortion Punks is a curated genesis collection of <strong className="text-smoke-100 font-medium">3,333 algorithmically-generated pixel-art NFTs</strong> built
                  exclusively for the Robinhood Crypto ecosystem. Each Punk is a one-of-a-kind digital artifact
                  composed from hand-crafted pixel assets — potion vials, alchemical visors, cybernetic
                  accessories, and mysterious backgrounds — that bridge street culture with ceremonial mystique.
                </p>
                <p>
                  Born in a smoke-filled digital laboratory, Portion Punks represents a new paradigm in NFT
                  collecting: where quiet luxury meets Web3 innovation. This whitepaper outlines the vision,
                  mechanics, and future trajectory of the Portion Punks ecosystem.
                </p>
                <p>
                  The collection is designed with a <strong className="text-smoke-100 font-medium">Freemint</strong> model — removing barriers to entry and
                  ensuring that the community forms around genuine interest and cultural alignment, not
                  financial speculation.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Key metrics */}
          <AnimatedSection delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {[
                { label: 'Total Supply', value: 3333, suffix: '' },
                { label: 'Unique Traits', value: 150, suffix: '+' },
                { label: 'Trait Categories', value: 6, suffix: '' },
                { label: 'Mint Price', value: 0, suffix: '', display: 'FREE' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="glass-panel p-6 text-center group hover:border-gold-400/40 transition-all duration-300"
                  whileHover={{ scale: 1.03, y: -4 }}
                >
                  <div className="font-serif-display text-3xl sm:text-4xl text-gold-400 italic mb-2">
                    {stat.display || <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
                  </div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-smoke-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════ SECTION 02: VISION & MISSION ═══════ */}
      <section id="vision" className="relative z-10 py-32">
        <GlowOrb color="rgba(62, 224, 138, 0.12)" size="450px" top="20%" left="-10%" delay={3} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="section-kicker mb-4">02 — Vision & Mission</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-smoke-100 leading-tight mb-10">
              Forging the{' '}
              <span className="italic text-gold-400">Future</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedSection delay={0.1}>
              <motion.div
                className="glass-panel p-8 h-full relative overflow-hidden group"
                whileHover={{ borderColor: 'rgba(212, 175, 119, 0.5)' }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-400/8 rounded-full blur-2xl group-hover:bg-gold-400/15 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-serif-display text-2xl text-gold-400 italic mb-4">Our Vision</h3>
                  <p className="text-smoke-300 font-light leading-relaxed">
                    To establish Portion Punks as the premier pixel-art NFT collection on Robinhood Crypto,
                    creating a cultural movement where digital art ownership is accessible, meaningful,
                    and rewarding. We envision a world where every collector is an alchemist — transforming
                    digital assets into lasting value.
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <motion.div
                className="glass-panel p-8 h-full relative overflow-hidden group"
                whileHover={{ borderColor: 'rgba(62, 224, 138, 0.5)' }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-green/8 rounded-full blur-2xl group-hover:bg-neon-green/15 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="font-serif-display text-2xl text-gold-400 italic mb-4">Our Mission</h3>
                  <p className="text-smoke-300 font-light leading-relaxed">
                    To build a thriving, holder-first ecosystem around pixel-art NFTs that delivers real
                    utility — from exclusive community access and gamified experiences to governance rights
                    and future collection benefits. Portion Punks isn&apos;t just art; it&apos;s your entry ticket
                    to the laboratory.
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>

          {/* Core Values */}
          <AnimatedSection delay={0.3}>
            <div className="mt-10 glass-panel p-8 sm:p-10">
              <h3 className="font-serif-display text-2xl text-smoke-100 mb-8 text-center">
                Core <span className="italic text-gold-400">Principles</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  {
                    icon: '⚗️',
                    title: 'Craftsmanship',
                    desc: 'Every pixel is intentional. Every trait tells a story. No shortcuts in the brewing process.',
                  },
                  {
                    icon: '🤝',
                    title: 'Community First',
                    desc: 'Holders shape the future. Governance, feedback, and shared ownership drive every decision.',
                  },
                  {
                    icon: '🔐',
                    title: 'True Ownership',
                    desc: 'On-chain, immutable, yours forever. Robinhood Crypto ensures frictionless digital sovereignty.',
                  },
                ].map((v) => (
                  <motion.div
                    key={v.title}
                    className="text-center"
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="text-4xl mb-4">{v.icon}</div>
                    <h4 className="font-serif-display text-xl text-gold-400 mb-3">{v.title}</h4>
                    <p className="text-sm text-smoke-400 leading-relaxed">{v.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════ SECTION 03: THE COLLECTION ═══════ */}
      <section id="collection" className="relative z-10 py-32">
        <GlowOrb color="rgba(232, 90, 155, 0.1)" size="500px" top="30%" left="80%" delay={1.5} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="section-kicker mb-4">03 — The Collection</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-smoke-100 leading-tight mb-6">
              Anatomy of a{' '}
              <span className="italic text-gold-400">Punk</span>
            </h2>
            <p className="text-smoke-400 font-light text-lg max-w-2xl mb-14">
              Each of the 3,333 Portion Punks is algorithmically generated from over 150+ unique
              hand-crafted traits across 6 categories, ensuring every Punk is distinct.
            </p>
          </AnimatedSection>

          {/* NFT Showcase */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-14">
              {['8', '26', '30', '46', '58'].map((num, i) => (
                <motion.div
                  key={num}
                  className="ornate-frame bg-charcoal-900/70 p-3"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <img
                    src={`/${num}.png`}
                    alt={`Portion Punk #${num}`}
                    className="w-full aspect-square object-contain pixelated"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/images/nfts/${num}.png`;
                    }}
                  />
                  <div className="mt-2 text-center text-[9px] tracking-[0.2em] uppercase text-gold-400/70">
                    Potion Punks
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Generation Process */}
          <AnimatedSection delay={0.3}>
            <div className="mt-10 glass-panel p-8 sm:p-10">
              <h3 className="font-serif-display text-2xl text-smoke-100 mb-6">
                The Brewing <span className="italic text-gold-400">Process</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {[
                  { step: '01', title: 'Asset Creation', desc: 'Hand-pixel each trait layer at the atelier level.' },
                  { step: '02', title: 'Algorithm Mix', desc: 'Rarity-weighted generation ensures balanced distribution.' },
                  { step: '03', title: 'Quality Control', desc: 'Every combination reviewed for visual harmony.' },
                  { step: '04', title: 'On-Chain Seal', desc: 'Metadata & artwork permanently stored on-chain.' },
                ].map((s, i) => (
                  <motion.div
                    key={s.step}
                    className="relative"
                    whileHover={{ y: -4 }}
                  >
                    <div className="text-5xl font-serif-display text-gold-400/15 italic mb-2">{s.step}</div>
                    <h4 className="font-serif-display text-lg text-smoke-100 mb-2">{s.title}</h4>
                    <p className="text-sm text-smoke-400 leading-relaxed">{s.desc}</p>
                    {i < 3 && (
                      <ArrowRight className="hidden sm:block absolute top-8 -right-3 w-4 h-4 text-gold-400/30" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>


      {/* ═══════ SECTION 04: UTILITY & REWARDS ═══════ */}
      <section id="utility" className="relative z-10 py-32">
        <GlowOrb color="rgba(62, 224, 138, 0.18)" size="500px" top="20%" left="15%" delay={1.5} />
        <GlowOrb color="rgba(212, 175, 119, 0.12)" size="400px" top="60%" left="75%" delay={3} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="section-kicker mb-4">04 — Utility & Rewards</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-smoke-100 leading-tight mb-6">
              Holder{' '}
              <span className="italic text-gold-400">Benefits</span>
            </h2>
            <p className="text-smoke-400 font-light text-lg max-w-2xl mb-16">
              Owning a Portion Punk unlocks a living ecosystem of rewards — from passive XP accumulation to governance power and weekly prize draws.
            </p>
          </AnimatedSection>

          {/* XP System */}
          <AnimatedSection delay={0.1}>
            <div className="glass-panel p-8 sm:p-10 mb-8 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-neon-green/8 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-full bg-neon-green/15 flex items-center justify-center text-xl">⚡</span>
                  <h3 className="font-serif-display text-2xl text-smoke-100">
                    XP <span className="italic text-gold-400">System</span>
                  </h3>
                </div>
                <p className="text-smoke-300 font-light leading-relaxed text-lg mb-8">
                  Every Portion Punk holder earns <strong className="text-smoke-100 font-medium">Experience Points (XP)</strong> passively based on two key factors: the <strong className="text-neon-green font-medium">rarity of their NFTs</strong> and the <strong className="text-gold-400 font-medium">total number of Punks held</strong> in their wallet. The rarer and more Punks you hold, the faster your XP grows.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    {
                      icon: '💎',
                      title: 'Rarity Multiplier',
                      desc: 'Legendary and rare Punks generate XP at significantly higher rates than common ones. Rarity pays off.',
                      color: '#e85a9b',
                    },
                    {
                      icon: '📦',
                      title: 'Holding Bonus',
                      desc: 'The more Punks in your wallet, the higher your XP multiplier. Collecting is rewarded exponentially.',
                      color: '#d4af77',
                    },
                    {
                      icon: '🏆',
                      title: 'Leaderboard Ranks',
                      desc: 'Top XP earners unlock exclusive perks, badges, and priority access to future drops and events.',
                      color: '#3ee08a',
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.title}
                      className="p-5 rounded-xl bg-charcoal-900/60 border border-gold-400/10 hover:border-gold-400/30 transition-all duration-300 text-center"
                      whileHover={{ y: -6, scale: 1.02 }}
                    >
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <h4 className="font-serif-display text-lg mb-2" style={{ color: item.color }}>{item.title}</h4>
                      <p className="text-sm text-smoke-400 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Governance */}
          <AnimatedSection delay={0.2}>
            <div className="glass-panel p-8 sm:p-10 mb-8 relative overflow-hidden">
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-gold-400/8 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-full bg-gold-400/15 flex items-center justify-center text-xl">🗳️</span>
                  <h3 className="font-serif-display text-2xl text-smoke-100">
                    Governance <span className="italic text-gold-400">Voting</span>
                  </h3>
                </div>
                <p className="text-smoke-300 font-light leading-relaxed text-lg mb-6">
                  Portion Punk holders aren&apos;t just collectors — they&apos;re <strong className="text-smoke-100 font-medium">decision makers</strong>. Every holder has the right to vote on key ecosystem proposals, from future collection themes and partnership decisions to community fund allocation and feature roadmaps.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Proposal Voting', desc: 'Vote on major ecosystem decisions — your Punk is your ballot.', icon: '📜' },
                    { title: 'Feature Requests', desc: 'Shape the roadmap by proposing and voting on new features.', icon: '🛠️' },
                    { title: 'Fund Allocation', desc: 'Community treasury spending is decided by holder consensus.', icon: '💰' },
                    { title: 'Partnership Approval', desc: 'Approve or reject collaboration proposals with other projects.', icon: '🤝' },
                  ].map((item) => (
                    <motion.div
                      key={item.title}
                      className="flex items-start gap-4 p-4 rounded-lg bg-charcoal-900/50 border border-gold-400/8 hover:border-gold-400/25 transition-all duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <h4 className="font-serif-display text-lg text-smoke-100 mb-1">{item.title}</h4>
                        <p className="text-sm text-smoke-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Weekly Raffle */}
          <AnimatedSection delay={0.3}>
            <div className="glass-panel p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-purple-500/8 rounded-full blur-3xl" />
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #6c63ff, #e85a9b, #d4af77, #3ee08a)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-full bg-purple-500/15 flex items-center justify-center text-xl">🎰</span>
                  <h3 className="font-serif-display text-2xl text-smoke-100">
                    Weekly <span className="italic text-gold-400">Raffle</span>
                  </h3>
                </div>
                <p className="text-smoke-300 font-light leading-relaxed text-lg mb-8">
                  Every week, holders are automatically entered into the <strong className="text-smoke-100 font-medium">Portion Punks Raffle</strong> — a community-wide draw with real, tangible rewards. The more Punks you hold and the higher your XP, the more raffle entries you earn.
                </p>

                <h4 className="font-serif-display text-xl text-smoke-200 mb-6 text-center">
                  Raffle <span className="italic text-gold-400">Prize Pool</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      icon: '💵',
                      title: 'Real Currency',
                      desc: 'Win real-valued currency rewards distributed directly to your wallet.',
                      color: '#3ee08a',
                      glow: 'rgba(62, 224, 138, 0.15)',
                    },
                    {
                      icon: '🖼️',
                      title: 'NFT Prizes',
                      desc: 'Win exclusive NFTs from the Portion Punks collection and partner projects.',
                      color: '#d4af77',
                      glow: 'rgba(212, 175, 119, 0.15)',
                    },
                    {
                      icon: '⚡',
                      title: 'Bonus XP',
                      desc: 'Boost your XP balance with massive bonus XP drops from the raffle.',
                      color: '#6c63ff',
                      glow: 'rgba(108, 99, 255, 0.15)',
                    },
                    {
                      icon: '🎫',
                      title: 'NFT Slots',
                      desc: 'Win guaranteed mint slots for upcoming NFT collections and partner drops.',
                      color: '#e85a9b',
                      glow: 'rgba(232, 90, 155, 0.15)',
                    },
                  ].map((prize) => (
                    <motion.div
                      key={prize.title}
                      className="relative p-6 rounded-xl bg-charcoal-900/70 border border-gold-400/10 hover:border-gold-400/30 transition-all duration-300 text-center overflow-hidden"
                      whileHover={{ y: -8, scale: 1.03 }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: `radial-gradient(circle at center, ${prize.glow}, transparent 70%)` }}
                      />
                      <div className="relative z-10">
                        <div className="text-4xl mb-3">{prize.icon}</div>
                        <h5 className="font-serif-display text-lg mb-2" style={{ color: prize.color }}>{prize.title}</h5>
                        <p className="text-xs text-smoke-400 leading-relaxed">{prize.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-5 rounded-lg bg-charcoal-900/50 border border-neon-green/15">
                  <p className="text-sm text-smoke-300 leading-relaxed text-center">
                    <span className="text-neon-green font-medium">How it works:</span> Raffle entries are calculated weekly based on your NFT count and cumulative XP. Rarer Punks = more entries. Draws happen every <strong className="text-smoke-100">Sunday at 20:00 UTC</strong>, and winners are announced on X and Discord.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      {/* ═══════ SECTION 05: $PPUNKS TOKENOMICS ═══════ */}
      <section id="tokenomics" className="relative z-10 py-32">
        <GlowOrb color="rgba(212, 175, 119, 0.18)" size="500px" top="15%" left="50%" />
        <GlowOrb color="rgba(108, 99, 255, 0.12)" size="400px" top="65%" left="10%" delay={2} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="section-kicker mb-4">05 — Tokenomics</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-smoke-100 leading-tight mb-6">
              <span className="italic text-gold-400">$PPUNKS</span>{' '}
              Distribution
            </h2>
            <p className="text-smoke-400 font-light text-lg max-w-2xl mb-16">
              The $PPUNKS token powers the Potion Punks ecosystem — aligning incentives across holders, contributors, and the community at large.
            </p>
          </AnimatedSection>

          {/* Donut Chart + Legend */}
          <AnimatedSection delay={0.1}>
            <div className="glass-panel p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                {/* Donut Chart */}
                <div className="relative w-64 h-64 shrink-0">
                  <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                    {/* XP Earners - 30% */}
                    <circle
                      cx="100" cy="100" r="80"
                      fill="none" stroke="#3ee08a" strokeWidth="28"
                      strokeDasharray={`${0.30 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                      strokeDashoffset="0"
                      className="drop-shadow-lg"
                    />
                    {/* Marketing - 30% */}
                    <circle
                      cx="100" cy="100" r="80"
                      fill="none" stroke="#6c63ff" strokeWidth="28"
                      strokeDasharray={`${0.30 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                      strokeDashoffset={`${-0.30 * 2 * Math.PI * 80}`}
                      className="drop-shadow-lg"
                    />
                    {/* Team & Investors - 20% */}
                    <circle
                      cx="100" cy="100" r="80"
                      fill="none" stroke="#d4af77" strokeWidth="28"
                      strokeDasharray={`${0.20 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                      strokeDashoffset={`${-0.60 * 2 * Math.PI * 80}`}
                      className="drop-shadow-lg"
                    />
                    {/* NFT Holders - 20% */}
                    <circle
                      cx="100" cy="100" r="80"
                      fill="none" stroke="#e85a9b" strokeWidth="28"
                      strokeDasharray={`${0.20 * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                      strokeDashoffset={`${-0.80 * 2 * Math.PI * 80}`}
                      className="drop-shadow-lg"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-serif-display text-3xl text-gold-400 italic">$PPUNKS</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-smoke-500 mt-1">Total Supply</span>
                  </div>
                </div>

                {/* Distribution Legend */}
                <div className="flex-1 w-full space-y-6">
                  {[
                    {
                      label: 'XP Earners',
                      percent: 30,
                      color: '#3ee08a',
                      icon: '⚡',
                      desc: 'Rewarding active community members who earn XP through holding, engagement, and participation.',
                    },
                    {
                      label: 'Marketing & Promotion',
                      percent: 30,
                      color: '#6c63ff',
                      icon: '📣',
                      desc: 'Fueling growth, partnerships, influencer campaigns, and ecosystem expansion.',
                    },
                    {
                      label: 'Team & Investors',
                      percent: 20,
                      color: '#d4af77',
                      icon: '🧑‍💻',
                      desc: 'Vested allocation for the core team and early backers aligned with long-term project success.',
                    },
                    {
                      label: 'NFT Holders',
                      percent: 20,
                      color: '#e85a9b',
                      icon: '🖼️',
                      desc: 'Airdropped directly to Potion Punks NFT holders proportional to their holdings and rarity.',
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      className="group"
                      whileHover={{ x: 6 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-serif-display text-lg text-smoke-100">{item.label}</span>
                        </div>
                        <span className="font-serif-display text-2xl italic" style={{ color: item.color }}>
                          {item.percent}%
                        </span>
                      </div>
                      <div className="h-2 bg-charcoal-800 rounded-full overflow-hidden mb-2">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percent}%` }}
                          viewport={{ once: false }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-xs text-smoke-500 leading-relaxed pl-9">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Token Utility Cards */}
          <AnimatedSection delay={0.25}>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: '🔥',
                  title: 'Earn & Hold',
                  desc: 'Accumulate $PPUNKS through XP milestones, raffle wins, and active participation in the ecosystem.',
                  color: '#d4af77',
                },
                {
                  icon: '🗳️',
                  title: 'Govern & Vote',
                  desc: '$PPUNKS amplifies your governance power — stake tokens alongside your NFTs for stronger voting weight.',
                  color: '#3ee08a',
                },
                {
                  icon: '🔓',
                  title: 'Access & Unlock',
                  desc: 'Use $PPUNKS to unlock premium features, exclusive drops, and priority access to future collections.',
                  color: '#6c63ff',
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  className="glass-panel p-7 text-center group hover:border-gold-400/40 transition-all duration-300 relative overflow-hidden"
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1 opacity-60"
                    style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }}
                  />
                  <div className="text-4xl mb-4">{card.icon}</div>
                  <h4 className="font-serif-display text-xl mb-3" style={{ color: card.color }}>{card.title}</h4>
                  <p className="text-sm text-smoke-400 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════ SECTION 06: ROADMAP ═══════ */}
      <section id="roadmap" className="relative z-10 py-32">
        <GlowOrb color="rgba(108, 99, 255, 0.12)" size="500px" top="40%" left="85%" delay={2} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="section-kicker mb-4">06 — Roadmap</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-smoke-100 leading-tight mb-6">
              The Path{' '}
              <span className="italic text-gold-400">Forward</span>
            </h2>
            <p className="text-smoke-400 font-light text-lg max-w-2xl mb-16">
              Each phase is a new brew — more refined, more potent, more rewarding for the community.
            </p>
          </AnimatedSection>

          {/* Roadmap Timeline */}
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-400 via-gold-400/30 to-transparent md:-translate-x-px" />

            <div className="space-y-16 md:space-y-24">
              {roadmapPhases.map((phase, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={phase.phase} className="relative">
                    {/* Timeline node */}
                    <motion.div
                      className="absolute left-6 md:left-1/2 -translate-x-1/2 w-14 h-14 bg-charcoal-950 border-2 rounded-full flex items-center justify-center text-2xl z-10"
                      style={{ borderColor: phase.color }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, type: 'spring' }}
                      whileHover={{ scale: 1.2, boxShadow: `0 0 30px ${phase.color}40` }}
                    >
                      {phase.icon}
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      className={`ml-16 md:ml-0 md:w-[45%] ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}
                      initial={{ opacity: 0, x: isEven ? -80 : 80 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="glass-panel p-7 group hover:border-gold-400/40 transition-all duration-300 relative overflow-hidden">
                        <div
                          className="absolute top-0 left-0 w-full h-1 opacity-60"
                          style={{ background: `linear-gradient(90deg, ${phase.color}, transparent)` }}
                        />

                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: phase.color }}>
                            Phase {phase.phase}
                          </span>
                          <span
                            className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full font-medium ${
                              phase.status === 'COMPLETED'
                                ? 'bg-neon-green/15 text-neon-green'
                                : phase.status === 'IN PROGRESS'
                                ? 'bg-gold-400/15 text-gold-400'
                                : 'bg-smoke-700/40 text-smoke-500'
                            }`}
                          >
                            {phase.status}
                          </span>
                        </div>

                        <h3 className="font-serif-display text-2xl text-smoke-100 group-hover:text-gold-400 transition-colors mb-1">
                          {phase.title}
                        </h3>
                        <p className="text-xs text-smoke-500 tracking-[0.15em] uppercase mb-4">{phase.subtitle}</p>

                        <ul className="space-y-2">
                          {phase.items.map((item, i) => (
                            <motion.li
                              key={i}
                              className="flex items-start gap-3 text-sm text-smoke-400 font-light"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: false }}
                              transition={{ delay: i * 0.06 }}
                            >
                              <span
                                className="w-1 h-1 rounded-full mt-2 shrink-0"
                                style={{ backgroundColor: phase.color }}
                              />
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 07: TEAM & COMMUNITY ═══════ */}
      <section id="team" className="relative z-10 py-32">
        <GlowOrb color="rgba(212, 175, 119, 0.15)" size="450px" top="25%" left="5%" delay={1} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="section-kicker mb-4">07 — Team & Community</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-smoke-100 leading-tight mb-10">
              The{' '}
              <span className="italic text-gold-400">Alchemists</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="glass-panel p-8 sm:p-10 mb-10">
              <p className="text-smoke-300 font-light leading-relaxed text-lg mb-8">
                Portion Punks is built by a collective of artists, developers, and Web3 enthusiasts
                who share a passion for pixel art, community building, and digital ownership. Our team
                operates with transparency and is committed to delivering on every phase of the roadmap.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { role: 'Art Direction', name: 'The Alchemist', desc: 'Pixel art maestro crafting every trait by hand.' },
                  { role: 'Development', name: 'The Engineer', desc: 'Smart contracts, web3 integration, and platform architecture.' },
                  { role: 'Community', name: 'The Herald', desc: 'Growing and nurturing the Portion Punks community.' },
                ].map((member) => (
                  <motion.div
                    key={member.role}
                    className="text-center p-6 rounded-lg bg-charcoal-900/50 border border-gold-400/10 hover:border-gold-400/30 transition-all duration-300"
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-400/10 flex items-center justify-center">
                      <span className="text-2xl">
                        {member.role === 'Art Direction' ? '🎨' : member.role === 'Development' ? '⚙️' : '📣'}
                      </span>
                    </div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gold-400 mb-1">{member.role}</p>
                    <h4 className="font-serif-display text-xl text-smoke-100 italic mb-2">{member.name}</h4>
                    <p className="text-sm text-smoke-400 leading-relaxed">{member.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Community Stats */}
          <AnimatedSection delay={0.25}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-panel p-8 text-center">
                <h3 className="font-serif-display text-2xl text-gold-400 italic mb-4">Join the Brew</h3>
                <p className="text-smoke-400 text-sm leading-relaxed mb-6">
                  Connect with fellow collectors, stay updated on drops, and shape the future of Portion Punks.
                </p>
                <a
                  href="https://x.com/potionpunks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-[11px] px-6 py-3 rounded-full inline-flex items-center gap-2"
                >
                  Follow on X
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="glass-panel p-8 text-center">
                <h3 className="font-serif-display text-2xl text-gold-400 italic mb-4">Holder Benefits</h3>
                <ul className="text-sm text-smoke-400 space-y-3 text-left">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green shrink-0" />
                    Private community access
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                    Future drop priority
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-pink shrink-0" />
                    Governance voting rights
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    Exclusive events & content
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    Arcade rewards & XP system
                  </li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>


      {/* ═══════ SECTION 08: DISCLAIMER ═══════ */}
      <section id="disclaimer" className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="section-kicker mb-4">08 — Disclaimer</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-smoke-100 leading-tight mb-10">
              Legal <span className="italic text-gold-400">Notice</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="glass-panel p-8 sm:p-10">
              <div className="space-y-5 text-sm text-smoke-400 font-light leading-relaxed">
                <p>
                  This whitepaper is for informational purposes only and does not constitute financial advice,
                  an investment prospectus, or a solicitation of any kind. Portion Punks NFTs are digital
                  collectibles and should not be considered securities or investment instruments.
                </p>
                <p>
                  The roadmap and future plans outlined in this document represent the team&apos;s current
                  intentions and are subject to change based on market conditions, technical developments,
                  and community feedback. No guarantees are made regarding the implementation timeline
                  or specific feature delivery.
                </p>
                <p>
                  Purchasing an NFT carries inherent risks, including but not limited to market volatility,
                  technical vulnerabilities, and regulatory changes. Buyers should conduct their own research
                  and only participate with funds they can afford to lose.
                </p>
                <p>
                  By participating in the Portion Punks ecosystem, you acknowledge that you have read and
                  understood this disclaimer and accept full responsibility for your actions.
                </p>
                <p className="text-smoke-500 italic">
                  © 2024 Portion Punks. All rights reserved.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════ FOOTER CTA ═══════ */}
      <section className="relative z-10 py-24 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="glass-panel px-8 py-16 sm:px-16 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[28rem] h-32 bg-gold-400/10 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <p className="section-kicker">The Laboratory Awaits</p>
                <h2 className="font-serif-display text-4xl sm:text-5xl text-smoke-100">
                  Ready to <span className="italic text-gold-400">brew</span>?
                </h2>
                <p className="text-smoke-400 max-w-xl mx-auto font-light leading-relaxed">
                  Join the Portion Punks community. Reserve your whitelist spot today — Freemint means
                  no barriers, just pure alchemy.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <Link
                    href="/"
                    className="btn-gold text-[11px] px-7 py-3.5 rounded-full inline-flex items-center gap-2"
                  >
                    Go to Mint Page
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://x.com/potionpunks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-[11px] px-7 py-3.5 rounded-full inline-flex items-center gap-2"
                  >
                    Follow on X
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Bottom footer */}
      <footer className="relative z-10 border-t border-gold-400/10 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-smoke-500">
            Portion Punks — Potions Fuel a Brighter Tomorrow
          </p>
        </div>
      </footer>
    </main>
  );
}
