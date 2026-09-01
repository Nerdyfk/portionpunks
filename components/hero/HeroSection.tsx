'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenWhitelist: () => void;
}

export default function HeroSection({ onOpenWhitelist }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-10 flex justify-between items-center text-[11px] tracking-[0.22em] uppercase text-gold-400/80 z-10">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-1.5 h-1.5 bg-neon-green rounded-full" />
          <span>Robinhood Crypto</span>
        </div>
        <div className="hidden sm:block text-smoke-400">
          A private collection of 3,333
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10">
        <div className="lg:col-span-7 flex flex-col items-start space-y-8 z-10">
          <p className="section-kicker">Limited genesis drop</p>

          <h1 className="font-serif-display text-[3.4rem] sm:text-7xl md:text-8xl leading-[0.9] text-smoke-100">
            Portion
            <span className="block italic text-gold-400 mt-1">Punks</span>
          </h1>

          <p className="font-serif-display italic text-xl sm:text-2xl text-smoke-200/90 max-w-lg">
            Potions fuel a brighter tomorrow.
          </p>

          <p className="text-smoke-400 text-base max-w-xl leading-relaxed font-light">
            An atelier of pixel-crafted Punks — rare vials, visors, and alchemical traits —
            forged for collectors on the Robinhood Crypto ecosystem.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenWhitelist}
              className="btn-gold text-[11px] px-7 py-3.5 rounded-full"
            >
              Reserve whitelist
            </button>

            <a
              href="#collection"
              className="btn-ghost text-[11px] px-7 py-3.5 rounded-full inline-flex items-center gap-2"
            >
              View collection
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </a>
          </div>

          <div className="pt-2 text-[11px] tracking-[0.28em] uppercase text-smoke-500 flex items-center gap-5">
            <span>Collect</span>
            <span className="text-gold-400">·</span>
            <span>Brew</span>
            <span className="text-gold-400">·</span>
            <span>Belong</span>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex justify-center items-center z-10">
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            <div className="absolute inset-6 rounded-full bg-gold-400/10 blur-3xl" />
            <div className="ornate-frame relative w-[88%] aspect-square bg-charcoal-900/70 p-5 rounded-sm">
              <img
                src="/46.png"
                alt="Portion Punk Character #46"
                className="w-full h-full object-contain pixelated animate-character-float"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/nfts/46.png';
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] tracking-[0.2em] uppercase text-gold-400/80">
                <span>Punk 046</span>
                <span>Genesis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
