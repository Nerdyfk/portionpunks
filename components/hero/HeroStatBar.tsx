'use client';

import React from 'react';
import { Users, BarChart3 } from 'lucide-react';

export default function HeroStatBar() {
  const stats = [
    {
      label: 'UNIQUE PUNKS',
      value: '3333',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-neon-green">
          <path d="M9 2H15V6H9V2Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2" />
          <path d="M6 7H18V11L21 16V22H3V16L6 11V7Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: 'BUILT ON',
      value: 'ROBINHOOD',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-neon-green">
          <path d="M12 2C6 8 4 16 12 22C20 16 18 8 12 2Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
        </svg>
      ),
    },
    {
      label: 'STRONG',
      value: 'COMMUNITY',
      icon: <Users className="w-5 h-5 text-neon-green" />,
    },
    {
      label: 'REAL',
      value: 'UTILITY',
      icon: <BarChart3 className="w-5 h-5 text-neon-green" />,
    },
  ];

  // Duplicate items array twice to create seamless right-to-left marquee loop
  const tickerItems = [...stats, ...stats, ...stats, ...stats];

  return (
    <section className="relative z-10 my-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal-900/90 border-2 border-smoke-800 shadow-2xl rounded-sm backdrop-blur-md overflow-hidden py-3">
          
          {/* Continuous Right-to-Left Ticker Banner */}
          <div className="flex overflow-hidden relative">
            <div className="animate-marquee flex items-center space-x-8 sm:space-x-12 shrink-0">
              {tickerItems.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 px-4 sm:px-6 py-1 shrink-0 border-r border-smoke-800/80 group hover:bg-charcoal-850/50 transition-colors rounded-sm"
                >
                  <div className="p-2.5 bg-neon-green/10 border border-neon-green/30 rounded-sm group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="whitespace-nowrap">
                    <div className="font-pixel-display text-[10px] sm:text-xs text-smoke-400 tracking-wider">
                      {stat.label}
                    </div>
                    <div className="font-pixel-heading text-xs sm:text-sm md:text-base text-white font-bold group-hover:text-neon-green transition-colors mt-0.5">
                      {stat.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
