'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  description: string;
  icon: string;
  status?: string;
}

const DEFAULT_PHASES: RoadmapItem[] = [
  {
    id: '1',
    phase: '01',
    title: 'THE FIRST BREW',
    description: 'Launch the 3,333 Punks, website, community & holder verification.',
    icon: '🧪',
    status: 'COMPLETED',
  },
  {
    id: '2',
    phase: '02',
    title: 'POTION LAB',
    description: 'Holder hub with quests, XP, badges & Potion crafting.',
    icon: '⚗️',
    status: 'IN_PROGRESS',
  },
  {
    id: '3',
    phase: '03',
    title: 'PUNK PASS',
    description: 'Exclusive events, content, drops & early access for holders.',
    icon: '🪪',
    status: 'UPCOMING',
  },
  {
    id: '4',
    phase: '04',
    title: 'PUNK ARCADE',
    description: 'Pixel-art games, challenges, leaderboards & community rewards.',
    icon: '🎮',
    status: 'UPCOMING',
  },
  {
    id: '5',
    phase: '05',
    title: 'THE NEXT BREW',
    description: 'New collectibles, collaborations, experiences & community-driven utilities.',
    icon: '🔮',
    status: 'UPCOMING',
  },
];

export default function RoadmapSection() {
  const [phases, setPhases] = useState<RoadmapItem[]>(DEFAULT_PHASES);

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.roadmap && data.roadmap.length > 0) {
          // Map DB roadmap items if updated via admin
          const mapped = data.roadmap.map((item: any, idx: number) => ({
            id: item.id || String(idx + 1),
            phase: String(idx + 1).padStart(2, '0'),
            title: item.title || DEFAULT_PHASES[idx]?.title || 'NEW PHASE',
            description: item.description || DEFAULT_PHASES[idx]?.description || '',
            icon: DEFAULT_PHASES[idx]?.icon || '🧪',
            status: item.status || 'UPCOMING',
          }));
          setPhases(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="roadmap" className="relative z-10 py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-kicker mb-4">03 — The Path</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-smoke-100">
            Project <span className="italic text-gold-400">roadmap</span>
          </h2>
          <p className="mt-4 text-smoke-400 font-light">
            Potions. Punks. Progress. — each brew more refined than the last.
          </p>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative pt-6">
          
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-400 via-gold-400/40 to-transparent -translate-x-1/2 hidden md:block" />

          <div className="space-y-14 md:space-y-20">
            {phases.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={item.id || idx} className="relative flex flex-col md:flex-row items-center">
                  
                  {/* Timeline Card */}
                  <motion.div
                    className={`w-full md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}
                    initial={{ opacity: 0, x: isEven ? -60 : 60, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="glass-panel p-7 group hover:border-gold-400/50 transition-all duration-300 relative">
                      <div className={`flex items-baseline gap-3 mb-3 ${isEven ? 'md:justify-end' : ''}`}>
                        <span className="text-[11px] tracking-[0.2em] text-gold-400">
                          {item.phase}
                        </span>
                        <span className="font-serif-display text-2xl text-smoke-100 group-hover:text-gold-400 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-sm text-smoke-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Center Node Icon Circle */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-charcoal-950 border border-gold-400 rounded-full hidden md:flex items-center justify-center text-xl shadow-gold z-10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span>{item.icon}</span>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 flex justify-center items-center space-x-4">
          <a
            href="https://x.com/potionpunks"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 glass-panel hover:border-gold-400 text-smoke-200 hover:text-gold-400 flex items-center justify-center rounded-full transition-all duration-300"
            aria-label="X / Twitter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://opensea.io/collection/portion-punks"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 glass-panel hover:border-gold-400 text-smoke-200 hover:text-gold-400 flex items-center justify-center rounded-full transition-all duration-300"
            aria-label="OpenSea"
          >
            <svg viewBox="0 0 32 32" className="w-6 h-6">
              <circle cx="16" cy="16" r="14" fill="#2081E2" />
              <path
                d="M8.5 20.2c.4 2.8 14.6 2.8 15 0H8.5zm6.7-11.8c-2.8 4.2-4.5 7.6-6 9.8h6V8.4zm1.6-1.9c3.2 4.4 5.2 8.1 6 11.7h-6V6.5z"
                fill="#FFFFFF"
              />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
