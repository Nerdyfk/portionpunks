'use client';

import React from 'react';

export default function AboutSection() {
  const highlights = [
    {
      title: 'Pixel Atelier',
      desc: 'Every Punk is hand-composed from rare vials, visors, and alchemical traits.',
    },
    {
      title: 'Robinhood Layer',
      desc: 'Settled on Robinhood Crypto — quiet fees, instant ownership, no friction.',
    },
    {
      title: 'Holder Utility',
      desc: 'Private brew access, treasury voice, and drops reserved for the inner circle.',
    },
  ];


  return (
    <section id="about" className="relative z-10 py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="ornate-frame bg-charcoal-900/80 p-4">
              <img
                src="/8.png"
                alt="Portion Punk Lab Artwork #8"
                className="w-full aspect-square object-contain pixelated"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/nfts/8.png';
                }}
              />
              <div className="mt-4 flex justify-between text-[10px] tracking-[0.2em] uppercase text-gold-400/80">
                <span>Laboratory study</span>
                <span>No. 008</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-7 space-y-8">
            <div>
              <p className="section-kicker mb-3">01 — The House</p>
              <h2 className="font-serif-display text-4xl sm:text-5xl text-smoke-100 leading-tight">
                What are <span className="italic text-gold-400">Portion Punks</span>?
              </h2>
            </div>

            <p className="text-smoke-300 text-lg leading-relaxed font-light max-w-2xl">
              A discreet Web3 collection drifting inside a smoke-filled laboratory. Each Punk is
              uniquely generated from crafted pixel assets — potion vials, silhouettes, and
              accessories that read as both street and ceremonial.
            </p>

            <p className="text-smoke-400 leading-relaxed max-w-2xl">
              Forged for the Robinhood Crypto ecosystem, the house stands for true digital
              ownership, quiet luxury, and utility that compounds with the community.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {highlights.map((h) => (
                <div key={h.title} className="glass-panel p-5">
                  <h3 className="font-serif-display text-xl text-gold-400 mb-2">{h.title}</h3>
                  <p className="text-sm text-smoke-400 leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
