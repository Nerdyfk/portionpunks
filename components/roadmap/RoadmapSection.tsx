'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

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
    <section id="roadmap" className="relative z-10 py-24 bg-charcoal-950/80 border-t border-smoke-800 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-pixel-display text-neon-green mb-2">
            <Sparkles className="w-4 h-4 text-neon-green" />
            <span>PORTION PUNKS — ROADMAP</span>
          </div>
          <h2 className="font-pixel-heading text-2xl sm:text-4xl text-white font-bold tracking-tight">
            PROJECT ROADMAP
          </h2>
          <p className="font-pixel-display text-xs text-neon-green tracking-widest mt-2">
            POTIONS. PUNKS. PROGRESS.
          </p>

          {/* Scroll Down Visual Indicator */}
          <div className="mt-8 flex flex-col items-center justify-center space-y-1 text-smoke-400 font-pixel-display text-[10px] animate-bounce">
            <span className="tracking-widest">SCROLL</span>
            <ArrowDown className="w-4 h-4 text-neon-green" />
            <span className="text-sm">☁️ ☁️ ☁️</span>
          </div>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative pt-6">
          
          {/* Glowing Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-green/80 via-neon-green/40 to-smoke-800 -translate-x-1/2 hidden md:block" />

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
                    <div className="bg-charcoal-900 border-2 border-smoke-800 hover:border-neon-green/60 p-6 rounded-sm shadow-2xl transition-all duration-300 group hover:shadow-neon-glow relative">
                      
                      <div className={`flex items-center space-x-2 mb-2 ${isEven ? 'md:justify-end' : ''}`}>
                        <span className="font-pixel-heading text-lg text-neon-green">
                          {item.phase} —
                        </span>
                        <span className="font-pixel-heading text-base text-white font-bold group-hover:text-neon-green transition-colors">
                          {item.title}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-smoke-300 font-sans leading-relaxed">
                        {item.description}
                      </p>

                    </div>
                  </motion.div>

                  {/* Center Node Icon Circle */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-charcoal-900 border-2 border-neon-green rounded-full hidden md:flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,255,102,0.6)] z-10 transform hover:scale-125 transition-transform"
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

        {/* Icon-only Buttons under Roadmap Section */}
        <div className="mt-20 flex justify-center items-center space-x-6">
          {/* X Button */}
          <a
            href="https://x.com/potionpunks"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-charcoal-900 border-2 border-smoke-700 hover:border-neon-green text-white hover:text-neon-green flex items-center justify-center rounded-sm transition-all duration-300 shadow-pixel-black hover:shadow-neon-glow transform hover:-translate-y-1"
            aria-label="X / Twitter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* OpenSea Button */}
          <a
            href="https://opensea.io/collection/portion-punks"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-charcoal-900 border-2 border-smoke-700 hover:border-neon-green text-white hover:text-neon-green flex items-center justify-center rounded-sm transition-all duration-300 shadow-pixel-black hover:shadow-neon-glow transform hover:-translate-y-1"
            aria-label="OpenSea"
          >
            <svg viewBox="0 0 32 32" className="w-7 h-7">
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
