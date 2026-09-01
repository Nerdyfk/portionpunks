'use client';

import React, { useState } from 'react';

export default function Footer() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  return (
    <footer className="relative z-10 border-t border-gold-400/15 pt-16 pb-12 text-smoke-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-gold-400/10">
          <div className="md:col-span-5 space-y-4">
            <div className="font-serif-display text-2xl text-smoke-100">
              Portion <span className="italic text-gold-400">Punks</span>
            </div>
            <p className="font-serif-display italic text-gold-400">
              Potions fuel a brighter tomorrow.
            </p>
            <p className="text-smoke-400 max-w-sm leading-relaxed font-light">
              A collection of 3,333 unique pixel Punks on the Robinhood Crypto ecosystem.
            </p>
            <div className="text-[11px] tracking-[0.18em] uppercase text-smoke-500 pt-1">
              Chain <span className="text-gold-400">Robinhood Crypto</span>
              <span className="mx-2">·</span>
              Market <span className="text-gold-400">OpenSea</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold-400">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-gold-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-gold-400 transition-colors">About</a></li>
              <li><a href="#collection" className="hover:text-gold-400 transition-colors">Collection</a></li>
              <li><a href="#roadmap" className="hover:text-gold-400 transition-colors">Roadmap</a></li>
              <li><a href="#faq" className="hover:text-gold-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold-400">Ecosystem</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://x.com/potionpunks" target="_blank" rel="noreferrer" className="hover:text-gold-400 transition-colors">
                  X — @potionpunks
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setShowComingSoon(true);
                    setTimeout(() => setShowComingSoon(false), 2500);
                  }}
                  className="hover:text-gold-400 transition-colors flex items-center gap-2 cursor-pointer text-left"
                >
                  <span>OpenSea collection</span>
                  <span className="text-[10px] tracking-wider uppercase text-gold-400/90 bg-gold-400/10 border border-gold-400/30 px-1.5 py-0.5 rounded">
                    {showComingSoon ? 'Coming Soon!' : 'Coming Soon'}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] tracking-[0.16em] uppercase text-smoke-500 space-y-4 sm:space-y-0">
          <div>© {new Date().getFullYear()} Portion Punks. All rights reserved.</div>
          <div className="flex space-x-6">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
