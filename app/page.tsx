'use client';

import React, { useState } from 'react';
import SmokeBackground from '@/components/background/SmokeBackground';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import HeroStatBar from '@/components/hero/HeroStatBar';
import AboutSection from '@/components/about/AboutSection';
import RoadmapSection from '@/components/roadmap/RoadmapSection';
import Footer from '@/components/layout/Footer';
import WhitelistForm from '@/components/whitelist/WhitelistForm';

export default function HomePage() {
  const [whitelistModalOpen, setWhitelistModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#1c212b] text-white overflow-hidden">
      {/* Global Layered Smoke Background */}
      <SmokeBackground />

      {/* Navigation */}
      <Navbar onOpenWhitelist={() => setWhitelistModalOpen(true)} />

      {/* Main Page Sections */}
      <div className="relative z-10">
        <HeroSection onOpenWhitelist={() => setWhitelistModalOpen(true)} />
        <HeroStatBar />
        <AboutSection />
        <RoadmapSection />
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
