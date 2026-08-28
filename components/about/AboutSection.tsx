'use client';

import React from 'react';
import { Shield, Sparkles, Zap, Layers, Cpu } from 'lucide-react';

export default function AboutSection() {
  const highlights = [
    {
      title: 'PIXEL ART',
      desc: '3333 uniquely forged Potion Punks crafted with meticulous pixel perfection.',
      icon: <Sparkles className="w-5 h-5 text-neon-green" />,
    },
    {
      title: 'ROBINHOOD ECOSYSTEM',
      desc: 'Built specifically for the Robinhood Crypto web3 layer with zero friction and low fees.',
      icon: <Cpu className="w-5 h-5 text-neon-green" />,
    },
    {
      title: 'COMMUNITY & UTILITY',
      desc: 'Exclusive access to holder potions, community treasury voting, and ecosystem drops.',
      icon: <Zap className="w-5 h-5 text-neon-green" />,
    },
  ];

  return (
    <section id="about" className="relative z-10 py-24 bg-charcoal-900/80 border-t border-smoke-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square bg-charcoal-950 border-2 border-smoke-700 p-4 shadow-2xl rounded-sm group overflow-hidden">
              <img
                src="/8.png"
                alt="Portion Punk Lab Artwork #8"
                className="w-full h-full object-contain pixelated group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/nfts/8.png';
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-charcoal-900/90 backdrop-blur-md border border-smoke-700 text-xs font-pixel-display">
                <span className="text-neon-green block">POTIONS. PUNKS. PROGRESS.</span>
                <span className="text-smoke-400 text-[10px]">Same Chain. Bigger Punks.</span>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs font-pixel-display text-neon-green mb-2">ABOUT THE PROJECT</div>
              <h2 className="font-pixel-heading text-2xl sm:text-4xl text-white font-bold tracking-tight">
                WHAT ARE PORTION PUNKS?
              </h2>
            </div>

            <p className="text-smoke-200 text-sm sm:text-base leading-relaxed font-sans">
              Portion Punks is an exclusive Web3 NFT collection floating inside a futuristic, smoke-filled laboratory environment. Each Punk is uniquely generated from handcrafted pixel assets, rare potion vials, distinct hairstyles, visors, and accessories.
            </p>

            <p className="text-smoke-300 text-sm leading-relaxed font-sans">
              Forged on the Robinhood Crypto ecosystem, Portion Punks represents true digital ownership, community innovation, and decentralized utility for modern NFT collectors.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {highlights.map((h, i) => (
                <div key={i} className="p-4 bg-charcoal-850 border border-smoke-800 rounded-sm">
                  <div className="mb-2">{h.icon}</div>
                  <h3 className="font-pixel-display text-xs text-white mb-1">{h.title}</h3>
                  <p className="text-[11px] text-smoke-400 font-sans leading-normal">{h.desc}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
