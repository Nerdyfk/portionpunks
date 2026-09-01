'use client';

import React, { useEffect, useState, useRef } from 'react';
import { defaultAtmosphereConfig, AtmosphereConfig } from '@/lib/atmosphereConfig';

interface PortionPunksAtmosphereProps {
  config?: Partial<AtmosphereConfig>;
}

interface LeafParticle {
  id: number;
  startX: number; // percentage
  startY: number; // percentage
  scale: number;
  opacity: number;
  rotation: number;
  duration: number;
  delay: number;
  direction: 'left-right' | 'right-left' | 'upward';
}

interface AmbientParticle {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  color: 'green' | 'pink' | 'white';
  opacity: number;
  duration: number;
  delay: number;
}

export default function PortionPunksAtmosphere({ config: customConfig }: PortionPunksAtmosphereProps) {
  const config = { ...defaultAtmosphereConfig, ...customConfig };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [leaves, setLeaves] = useState<LeafParticle[]>([]);
  const [particles, setParticles] = useState<AmbientParticle[]>([]);

  // Mobile detection & Reduced Motion check
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobile);
    };

    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    };

    checkMobile();
    checkReducedMotion();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop Mouse Parallax Tracker
  useEffect(() => {
    if (isMobile || !config.parallaxEnabled || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const my = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setMousePos({ x: mx, y: my });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, config.parallaxEnabled, prefersReducedMotion]);

  // Scroll Parallax Tracker
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  // Generate Leaf Particles
  useEffect(() => {
    if (!config.leafParticlesEnabled) return;

    const count = isMobile ? config.leafCountMobile : config.leafCountDesktop;
    const generatedLeaves: LeafParticle[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      startX: Math.random() * 100,
      startY: Math.random() * 90,
      scale: 0.5 + Math.random() * 0.7,
      opacity: 0.1 + Math.random() * 0.35,
      rotation: Math.random() * 360,
      duration: 18 + Math.random() * 22,
      delay: Math.random() * 10,
      direction: i % 3 === 0 ? 'left-right' : i % 3 === 1 ? 'right-left' : 'upward',
    }));

    setLeaves(generatedLeaves);
  }, [isMobile, config.leafParticlesEnabled, config.leafCountDesktop, config.leafCountMobile]);

  // Generate Ambient Particles (potion energy sparks & dust)
  useEffect(() => {
    if (!config.ambientParticlesEnabled) return;

    const count = isMobile ? config.particleCountMobile : config.particleCountDesktop;
    const generatedParticles: AmbientParticle[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      color: i % 5 === 0 ? 'pink' : i % 6 === 0 ? 'white' : 'green',
      opacity: 0.2 + Math.random() * 0.6,
      duration: 6 + Math.random() * 12,
      delay: Math.random() * 8,
    }));

    setParticles(generatedParticles);
  }, [isMobile, config.ambientParticlesEnabled, config.particleCountDesktop, config.particleCountMobile]);

  // Parallax offsets based on layer depth
  const pStr = config.parallaxStrength;
  const backSmokeX = mousePos.x * 3 * pStr;
  const backSmokeY = mousePos.y * 3 * pStr + scrollY * 0.05;

  const middleSmokeX = mousePos.x * 6 * pStr;
  const middleSmokeY = mousePos.y * 6 * pStr + scrollY * 0.12;

  const leafX = mousePos.x * 10 * pStr;
  const leafY = mousePos.y * 10 * pStr + scrollY * 0.18;

  const frontSmokeX = mousePos.x * 4 * pStr;
  const frontSmokeY = mousePos.y * 4 * pStr + scrollY * 0.25;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#07080c]">
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#07080c] via-[#10131a] to-[#07080c]" />

      {/* LAYER 0.5: Giant Robinhood Feather Watermark Motif */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.12] filter blur-[1px] pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-gold-400">
          <path
            d="M50 5 C 20 30, 10 70, 50 95 C 90 70, 80 30, 50 5 Z M 50 95 L 50 25"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* LAYER 1: Deep Back Smoke Cloud Layer */}
      {config.smokeEnabled && (
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out transform-gpu"
          style={{
            transform: `translate3d(${backSmokeX}px, ${-backSmokeY}px, 0)`,
          }}
        >
          {/* Cloud 1 - Top Right */}
          <div
            className="absolute -top-30 -right-30 w-[1300px] h-[950px] rounded-full bg-gradient-to-bl from-[#4a5568]/60 via-[#2d3542]/40 to-transparent filter blur-3xl opacity-85 animate-smoke-slow transform-gpu"
            style={{ animationDuration: '60s' }}
          />
          {/* Cloud 2 - Bottom Left */}
          <div
            className="absolute -bottom-30 -left-30 w-[1200px] h-[900px] rounded-full bg-gradient-to-tr from-[#3a4454]/55 via-[#232933]/30 to-transparent filter blur-3xl opacity-80 animate-smoke-fast transform-gpu"
            style={{ animationDuration: '50s' }}
          />
        </div>
      )}

      {/* LAYER 2: Digital Pixel Grid Atmosphere */}
      {config.gridEnabled && (
        <div className="absolute inset-0 bg-[radial-gradient(#1e2430_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.035] pointer-events-none" />
      )}

      {/* LAYER 3: Middle Smoke Clouds Layer */}
      {config.smokeEnabled && (
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out transform-gpu"
          style={{
            transform: `translate3d(${middleSmokeX}px, ${-middleSmokeY}px, 0)`,
          }}
        >
          {/* Central Drifting Smog */}
          <div
            className="absolute top-1/4 left-1/6 w-[950px] h-[650px] rounded-full bg-gradient-to-r from-[#3e4756]/35 via-[#29303b]/20 to-transparent filter blur-3xl animate-smoke-slow transform-gpu opacity-65"
            style={{ animationDuration: '50s' }}
          />

          {/* Secondary Drifting Cloud */}
          <div
            className="absolute top-2/3 right-1/4 w-[850px] h-[550px] rounded-full bg-gradient-to-l from-[#363f4e]/30 via-[#1f2530]/15 to-transparent filter blur-3xl animate-smoke-fast transform-gpu opacity-60"
            style={{ animationDuration: '45s' }}
          />
        </div>
      )}

      {/* LAYER 4: Robinhood-inspired Leaf Motifs Layer */}
      {config.leafParticlesEnabled && (
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out transform-gpu"
          style={{
            transform: `translate3d(${leafX}px, ${-leafY}px, 0)`,
          }}
        >
          {leaves.map((leaf) => {
            const animClass =
              leaf.direction === 'left-right'
                ? 'animate-leaf-float-1'
                : leaf.direction === 'right-left'
                ? 'animate-leaf-float-2'
                : 'animate-leaf-float-1';

            return (
              <div
                key={leaf.id}
                className={`absolute ${prefersReducedMotion ? '' : animClass} transform-gpu`}
                style={{
                  left: `${leaf.startX}%`,
                  top: `${leaf.startY}%`,
                  opacity: leaf.opacity * config.smokeIntensity,
                  transform: `scale(${leaf.scale}) rotate(${leaf.rotation}deg)`,
                  animationDuration: `${leaf.duration}s`,
                  animationDelay: `${leaf.delay}s`,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-gold-400/70 filter drop-shadow-[0_0_8px_rgba(212,175,119,0.35)]">
                  <path
                    d="M12 2C6 8 4 16 12 22C20 16 18 8 12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="currentColor"
                    fillOpacity="0.35"
                  />
                  <path d="M12 22V6" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                </svg>
              </div>
            );
          })}
        </div>
      )}

      {/* LAYER 5: Ambient Neon Green & Potion Energy Particles */}
      {config.ambientParticlesEnabled && (
        <div className="absolute inset-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className={`absolute rounded-full transform-gpu ${
                prefersReducedMotion ? '' : 'animate-pulse'
              }`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor:
                  p.color === 'pink' ? '#e85a9b' : p.color === 'white' ? '#ece7dc' : '#d4af77',
                boxShadow:
                  p.color === 'pink'
                    ? '0 0 8px rgba(255, 42, 133, 0.8)'
                    : p.color === 'white'
                    ? '0 0 6px rgba(255, 255, 255, 0.8)'
                    : '0 0 8px rgba(212, 175, 119, 0.7)',
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* LAYER 6: Foreground Volumetric Fog Layer */}
      {config.smokeEnabled && (
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out transform-gpu"
          style={{
            transform: `translate3d(${frontSmokeX}px, ${-frontSmokeY}px, 0)`,
          }}
        >
          <div
            className="absolute bottom-0 inset-x-0 h-[480px] bg-gradient-to-t from-[#0a0b0d]/90 via-[#272e3a]/45 to-transparent filter blur-2xl opacity-80 transform-gpu"
            style={{ animationDuration: '30s' }}
          />
        </div>
      )}

      {/* LAYER 7: Scanline / Film Grain Overlay */}
      <div className="absolute inset-0 scanline-bg opacity-20 mix-blend-overlay pointer-events-none" />

      {/* LAYER 8: Subtle Radial Vignette */}
      {config.vignetteEnabled && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(6,7,9,0.85)_100%)] pointer-events-none" />
      )}

    </div>
  );
}
