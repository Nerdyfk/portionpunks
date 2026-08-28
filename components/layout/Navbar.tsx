'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Wallet } from 'lucide-react';
import WalletModal from '../wallet/WalletModal';

interface NavbarProps {
  onOpenWhitelist?: () => void;
}

export default function Navbar({ onOpenWhitelist }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#hero' },
    { name: 'ABOUT', href: '#about' },
    { name: 'ROADMAP', href: '#roadmap' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-charcoal-950/85 backdrop-blur-md border-b border-smoke-800/80 py-3 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Left */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center space-x-1.5 font-pixel-heading text-lg sm:text-xl font-bold text-white tracking-tight">
              <span className="text-white drop-shadow-[0_2px_0_rgba(0,0,0,1)]">PORTION</span>
              {/* Integrated Potion Bottle Icon */}
              <div className="w-5 h-6 relative mx-0.5 inline-block align-middle transform group-hover:rotate-12 transition-transform">
                <svg viewBox="0 0 24 28" fill="none" className="w-full h-full">
                  <path d="M9 2H15V6H9V2Z" fill="#8B5CF6" stroke="#000" strokeWidth="2" />
                  <path d="M6 7H18V11L21 16V25H3V16L6 11V7Z" fill="#ff2a85" stroke="#000" strokeWidth="2" />
                  <path d="M8 15H16V22H8V15Z" fill="#00ff66" opacity="0.6" />
                </svg>
              </div>
              <span className="text-neon-green drop-shadow-[0_2px_0_rgba(0,0,0,1)]">PUNKS</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-pixel-display text-xs tracking-wider text-smoke-200 hover:text-neon-green transition-colors relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-green transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {onOpenWhitelist && (
              <button
                onClick={onOpenWhitelist}
                className="font-pixel-display text-xs px-4 py-2 bg-neon-green/10 text-neon-green border border-neon-green/40 hover:border-neon-green hover:bg-neon-green/20 transition-all rounded-sm shadow-[0_0_10px_rgba(0,255,102,0.2)]"
              >
                WHITELIST
              </button>
            )}

            <button
              onClick={() => setWalletModalOpen(true)}
              className="font-pixel-display text-xs px-4 py-2 bg-charcoal-800 text-white border-2 border-black hover:border-neon-green shadow-pixel-black hover:shadow-neon-glow transition-all flex items-center space-x-2 rounded-sm"
            >
              <Wallet className="w-3.5 h-3.5 text-neon-green" />
              <span>{connectedWallet ? `${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}` : 'CONNECT WALLET'}</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white bg-charcoal-800 border border-smoke-700 rounded-sm focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-neon-green" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-charcoal-950/95 backdrop-blur-xl md:hidden flex flex-col justify-center px-8 py-20 border-b border-smoke-800 animate-fadeIn">
          <div className="flex flex-col space-y-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-pixel-display text-sm text-white hover:text-neon-green transition-colors py-2 border-b border-smoke-850"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-6 flex flex-col space-y-4">
              {onOpenWhitelist && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWhitelist();
                  }}
                  className="font-pixel-display text-xs w-full py-3 bg-neon-green text-charcoal-950 font-bold border-2 border-black shadow-pixel-black"
                >
                  JOIN WHITELIST
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setWalletModalOpen(true);
                }}
                className="font-pixel-display text-xs w-full py-3 bg-charcoal-800 text-white border-2 border-black hover:border-neon-green flex items-center justify-center space-x-2"
              >
                <Wallet className="w-4 h-4 text-neon-green" />
                <span>{connectedWallet ? `${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}` : 'CONNECT WALLET'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Connectivity Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnect={(addr) => setConnectedWallet(addr)}
        connectedAddress={connectedWallet}
      />
    </>
  );
}
