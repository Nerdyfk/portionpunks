'use client';

import React from 'react';

export default function HeroStatBar() {
  const stats = [
    { label: 'Unique Punks', value: '3,333' },
    { label: 'Chain', value: 'Robinhood' },
    { label: 'Marketplace', value: 'OpenSea' },
    { label: 'Status', value: 'Whitelist' },
  ];

  const tickerItems = [...stats, ...stats, ...stats, ...stats];

  return (
    <section className="relative z-10 my-4 overflow-hidden">
      <div className="border-y border-gold-400/15 bg-charcoal-900/50 backdrop-blur-md">
        <div className="flex overflow-hidden relative py-5">
          <div className="animate-marquee flex items-center shrink-0">
            {tickerItems.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-baseline gap-3 px-10 shrink-0 border-r border-gold-400/15"
              >
                <span className="text-[10px] tracking-[0.22em] uppercase text-gold-400">
                  {stat.label}
                </span>
                <span className="font-serif-display text-2xl text-smoke-100 italic">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
