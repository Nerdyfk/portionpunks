'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-charcoal-950 border-t border-smoke-800/80 pt-16 pb-12 overflow-hidden text-smoke-400 font-sans text-xs">
      
      {/* Subtle Smoke Footer Overlay */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-smoke-900/30 to-transparent pointer-events-none filter blur-xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-smoke-850">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-1.5 font-pixel-heading text-lg font-bold text-white tracking-tight">
              <span className="text-white">PORTION</span>
              <span className="text-neon-green">PUNKS</span>
            </div>

            <p className="font-pixel-display text-xs text-white tracking-wide">
              "POTIONS FUEL A BRIGHTER TOMORROW"
            </p>

            <p className="text-smoke-400 text-xs max-w-sm leading-relaxed">
              Portion Punks is a digital collection built on the Robinhood Crypto ecosystem. 3333 unique pixel punks.
            </p>

            <div className="text-[10px] font-pixel-display text-smoke-500 pt-1">
              CHAIN: <span className="text-neon-green">ROBINHOOD CRYPTO</span> | PLATFORM: <span className="text-neon-green">OPENSEA</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-pixel-display text-xs text-white">NAVIGATION</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-neon-green transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-neon-green transition-colors">About Portion Punks</a></li>
              <li><a href="#roadmap" className="hover:text-neon-green transition-colors">Roadmap Milestones</a></li>
            </ul>
          </div>

          {/* Socials & Marketplace Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-pixel-display text-xs text-white">ECOSYSTEM & LINKS</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://x.com/potionpunks"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-neon-green transition-colors"
                >
                  Follow on X (@potionpunks)
                </a>
              </li>
              <li>
                <a
                  href="https://opensea.io/collection/portion-punks"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-neon-green transition-colors"
                >
                  OpenSea Collection
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-smoke-500 space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} PORTION PUNKS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6">
            <span>TERMS</span>
            <span>PRIVACY</span>
            <span>DISCLAIMER</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
