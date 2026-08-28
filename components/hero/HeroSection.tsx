'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onOpenWhitelist: () => void;
}

export default function HeroSection({ onOpenWhitelist }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex flex-col justify-center overflow-hidden">
      {/* HUD Decorative Labels */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-4 flex justify-between items-center text-[10px] sm:text-xs font-pixel-display text-smoke-400 opacity-80 z-10">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 bg-neon-green rounded-full animate-ping" />
          <span>ON ROBINHOOD CHAIN</span>
        </div>
        <div className="hidden sm:block text-right tracking-widest text-smoke-400">
          POTIONS. PUNKS. PROGRESS.
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Side Column (Title, Tagline, Description, CTAs) */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 z-10">
          
          {/* Main Pixel Title with integrated Potion Bottle 'o' */}
          <div className="relative">
            <div className="flex flex-col select-none">
              {/* Word 1: PORTION */}
              <div className="flex items-center font-pixel-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-extrabold tracking-tight leading-none drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
                <span>P</span>
                <span>O</span>
                <span>R</span>
                <span>T</span>
                <span>I</span>
                {/* Integrated Potion Bottle in title */}
                <div className="inline-flex items-center justify-center mx-1 sm:mx-2 w-8 h-10 sm:w-14 sm:h-16 md:w-16 md:h-20 relative animate-pulse">
                  <svg viewBox="0 0 40 48" fill="none" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(255,42,133,0.8)]">
                    {/* Cork */}
                    <rect x="15" y="0" width="10" height="6" fill="#8B4513" stroke="#000" strokeWidth="2" />
                    {/* Bottle Neck */}
                    <rect x="13" y="6" width="14" height="8" fill="#D1D5DB" opacity="0.8" stroke="#000" strokeWidth="2" />
                    {/* Bottle Body */}
                    <path d="M7 14 H33 L39 26 V44 H1 V26 Z" fill="#111827" stroke="#000" strokeWidth="2" />
                    {/* Liquid Fill */}
                    <path d="M8 24 H32 L38 30 V43 H2 V30 Z" fill="#ff2a85" />
                    {/* Liquid Glow Accent */}
                    <rect x="12" y="32" width="16" height="6" fill="#00ff66" opacity="0.8" />
                  </svg>
                </div>
                <span>n</span>
              </div>

              {/* Word 2: PUNKS */}
              <div className="font-pixel-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-neon-green font-extrabold tracking-tight leading-none drop-shadow-[0_4px_0_rgba(0,0,0,1)] mt-1 sm:mt-2">
                PUNKS
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="font-pixel-display text-sm sm:text-base md:text-lg text-white tracking-widest border-l-2 border-neon-green pl-3 py-0.5">
            "POTIONS FUEL A BRIGHTER TOMORROW"
          </div>

          {/* Description */}
          <p className="text-smoke-200 text-sm sm:text-base max-w-xl leading-relaxed font-sans font-normal">
            3333 unique Potion Punks forged for the next generation of digital collectors on Robinhood Crypto ecosystem.
          </p>

          {/* CTA Buttons & HUD Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onOpenWhitelist}
              className="font-pixel-display text-xs sm:text-sm px-6 py-3.5 bg-neon-green text-charcoal-950 font-bold border-2 border-black shadow-pixel-black hover:shadow-neon-glow hover:bg-neon-darkgreen transition-all flex items-center space-x-2 rounded-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>WHITELIST MINT</span>
            </button>

            <a
              href="#about"
              className="font-pixel-display text-xs sm:text-sm px-6 py-3.5 bg-charcoal-850 text-white border-2 border-neon-green hover:bg-neon-green/10 shadow-pixel-black transition-all flex items-center space-x-2 rounded-sm"
            >
              <span>ABOUT PORTION PUNKS</span>
              <ArrowRight className="w-4 h-4 text-neon-green" />
            </a>
          </div>

          {/* Supporting phrases HUD */}
          <div className="pt-4 text-xs font-pixel-display text-smoke-400 flex items-center space-x-6 opacity-75">
            <span>COLLECT</span>
            <span>•</span>
            <span>BREW</span>
            <span>•</span>
            <span>BELONG</span>
          </div>

        </div>

        {/* Right Side Column (Potion Punk Character Emerging from Atmospheric Smoke) */}
        <div className="lg:col-span-5 relative flex justify-center items-center z-10 mt-6 lg:mt-0">
          
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            
            {/* Volumetric Smoke Glow behind character */}
            <div className="absolute inset-0 bg-neon-green/15 rounded-full filter blur-3xl animate-pulse-glow" />
            
            {/* Atmospheric Character Container */}
            <div className="relative w-full h-full flex items-center justify-center group">
              
              {/* Crisp Pixel Character Image */}
              <div className="relative w-full h-full animate-character-float flex items-center justify-center z-10">
                <img
                  src="/46.png"
                  alt="Portion Punk Character #46"
                  className="w-full h-full object-contain pixelated drop-shadow-[0_12px_16px_rgba(0,0,0,0.95)] transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/nfts/46.png';
                  }}
                />
              </div>

              {/* Foreground Fog Overlap at Character Feet/Base */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#16191f] via-[#16191f]/60 to-transparent filter blur-md z-20 pointer-events-none" />
            </div>

            {/* Floating leaf motif drifting near character */}
            <div className="absolute -top-4 -right-4 w-10 h-10 text-neon-green animate-bounce opacity-80 pointer-events-none z-30">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full filter drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]">
                <path d="M12 2C6 8 4 16 12 22C20 16 18 8 12 2Z" fill="#00ff66" fillOpacity="0.4" stroke="#000" strokeWidth="2" />
              </svg>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
