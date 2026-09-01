'use client';

import React from 'react';

interface CommunitySectionProps {
  onOpenWhitelist: () => void;
}

export default function CommunitySection({ onOpenWhitelist }: CommunitySectionProps) {
  return (
    <section className="relative z-10 py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel px-8 py-16 sm:px-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[28rem] h-32 bg-gold-400/10 blur-3xl" />
          <div className="relative z-10 space-y-6">
            <p className="section-kicker">The inner circle</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-smoke-100">
              Step into the world of <span className="italic text-gold-400">Portion Punks</span>
            </h2>
            <p className="text-smoke-400 max-w-xl mx-auto font-light leading-relaxed">
              Collectors, alchemists, and builders. Early access is reserved for those who join the brew.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <a
                href="https://x.com/potionpunks"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-[11px] px-7 py-3.5 rounded-full"
              >
                Follow on X
              </a>
              <button
                onClick={onOpenWhitelist}
                className="btn-gold text-[11px] px-7 py-3.5 rounded-full"
              >
                Reserve whitelist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
