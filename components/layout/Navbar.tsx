'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenWhitelist?: () => void;
}

export default function Navbar({ onOpenWhitelist }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-charcoal-950/70 backdrop-blur-xl border-b border-gold-400/15 py-3 shadow-gold'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-9 relative">
              <svg viewBox="0 0 24 28" fill="none" className="w-full h-full">
                <path d="M9 2H15V6H9V2Z" fill="#d4af77" stroke="#d4af77" strokeWidth="1.4" />
                <path d="M6 7H18V11L21 16V25H3V16L6 11V7Z" fill="#12141c" stroke="#d4af77" strokeWidth="1.4" />
                <path d="M8 15H16V22H8V15Z" fill="#3ee08a" opacity="0.75" />
              </svg>
            </div>
            <div className="leading-none">
              <div className="font-serif-display text-xl sm:text-2xl tracking-wide text-smoke-100 group-hover:text-gold-400 transition-colors">
                Portion <span className="italic text-gold-400">Punks</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[12px] tracking-[0.18em] uppercase text-smoke-400 hover:text-gold-400 transition-colors relative py-1 group"
              >
                {link.name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {onOpenWhitelist && (
              <button
                onClick={onOpenWhitelist}
                className="btn-gold text-[11px] px-5 py-2.5 rounded-full"
              >
                Join Whitelist
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gold-400 border border-gold-400/30 rounded-full"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-charcoal-950/96 backdrop-blur-2xl md:hidden flex flex-col justify-center px-8 py-20">
          <div className="flex flex-col space-y-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif-display text-3xl text-smoke-100 hover:text-gold-400 transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-8">
              {onOpenWhitelist && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWhitelist();
                  }}
                  className="btn-gold text-xs w-full py-3.5 rounded-full"
                >
                  Join Whitelist
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
