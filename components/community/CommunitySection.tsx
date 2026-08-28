'use client';

import React from 'react';
import { Twitter, Sparkles } from 'lucide-react';

interface CommunitySectionProps {
  onOpenWhitelist: () => void;
}

export default function CommunitySection({ onOpenWhitelist }: CommunitySectionProps) {
  return (
    <section className="relative z-10 py-20 bg-charcoal-900/90 border-t border-smoke-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Card Box */}
        <div className="bg-gradient-to-b from-charcoal-850 to-charcoal-900 border-2 border-smoke-700 p-8 sm:p-12 relative rounded-sm shadow-2xl overflow-hidden">
          
          {/* Accent Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-neon-green/10 filter blur-3xl" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-pixel-display text-neon-green bg-neon-green/10 border border-neon-green/30 px-3 py-1 rounded-sm">
              <Sparkles className="w-4 h-4" />
              <span>JOIN THE BREW</span>
            </div>

            <h2 className="font-pixel-heading text-3xl sm:text-5xl text-white font-bold tracking-tight">
              STEP INTO THE WORLD OF PORTION PUNKS
            </h2>

            <p className="text-smoke-200 text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed">
              Connect with digital collectors, potion alchemists, and Web3 builders. Get early access to whitelist spots and ecosystem updates.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <a
                href="https://x.com/potionpunks"
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel-display text-xs px-6 py-3.5 bg-charcoal-800 hover:bg-charcoal-700 text-white font-bold border-2 border-black hover:border-neon-green shadow-pixel-black transition-all flex items-center space-x-2 rounded-sm"
              >
                <Twitter className="w-4 h-4 text-neon-green" />
                <span>FOLLOW ON X (@POTIONPUNKS)</span>
              </a>

              <button
                onClick={onOpenWhitelist}
                className="font-pixel-display text-xs px-6 py-3.5 bg-neon-green hover:bg-neon-darkgreen text-charcoal-950 font-bold border-2 border-black shadow-pixel-black transition-all flex items-center space-x-2 rounded-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>WHITELIST MINT</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
