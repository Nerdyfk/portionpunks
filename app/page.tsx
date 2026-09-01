'use client';

import React, { useState } from 'react';
import SmokeBackground from '@/components/background/SmokeBackground';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import HeroStatBar from '@/components/hero/HeroStatBar';
import AboutSection from '@/components/about/AboutSection';
import RoadmapSection from '@/components/roadmap/RoadmapSection';
import CommunitySection from '@/components/community/CommunitySection';
import FaqSection from '@/components/faq/FaqSection';
import Footer from '@/components/layout/Footer';
import WhitelistForm from '@/components/whitelist/WhitelistForm';

export default function HomePage() {
  const [whitelistModalOpen, setWhitelistModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-charcoal-950 text-smoke-100 overflow-hidden">
      <SmokeBackground />
      <div className="film-grain" />

      <Navbar onOpenWhitelist={() => setWhitelistModalOpen(true)} />

      <div className="relative z-10">
        <HeroSection onOpenWhitelist={() => setWhitelistModalOpen(true)} />
        <HeroStatBar />
        <AboutSection />
        <RoadmapSection />
        <CommunitySection onOpenWhitelist={() => setWhitelistModalOpen(true)} />
        <FaqSection />
        <Footer />
      </div>

      {/* Whitelist Modal with 45-Second Math CAPTCHA */}
      {whitelistModalOpen && (
        <WhitelistForm
          isOpen={whitelistModalOpen}
          onClose={() => setWhitelistModalOpen(false)}
        />
      )}
    </main>
  );
}
