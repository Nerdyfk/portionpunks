'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
        } else {
          setFaqs([
            {
              id: '1',
              question: 'What are Portion Punks?',
              answer: 'Portion Punks is a premiere collection of 3333 pixel-art NFT Punks infused with potion lore, built specifically for digital collectors in the Robinhood Crypto ecosystem.',
            },
            {
              id: '2',
              question: 'How many NFTs are in the collection?',
              answer: 'The collection consists of exactly 3333 unique pixel Punks with distinct potion traits and rarity scores.',
            },
            {
              id: '3',
              question: 'Which blockchain is Portion Punks built on?',
              answer: 'Portion Punks is built around the Robinhood Crypto web3 infrastructure, offering near-zero gas fees and ultra-fast transactions.',
            },
            {
              id: '4',
              question: 'Where can I mint?',
              answer: 'Minting will take place directly on our official website whitelist launcher. Slots are reserved via our security whitelist process.',
            },
            {
              id: '5',
              question: 'Where can I trade?',
              answer: 'After the mint completes, trading will be active on OpenSea.',
            },
            {
              id: '6',
              question: 'What utility will holders receive?',
              answer: 'Holders receive exclusive access to The Brew private community, future potion ecosystem drops, staking rewards, and voting power in community initiatives.',
            },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative z-10 py-24 bg-charcoal-950/70 border-t border-smoke-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-pixel-display text-neon-green mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-pixel-heading text-2xl sm:text-4xl text-white font-bold tracking-tight">
            GOT QUESTIONS?
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="bg-charcoal-900 border-2 border-smoke-800 hover:border-smoke-700 transition-colors rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 sm:p-5 text-left font-pixel-display text-xs sm:text-sm text-white flex justify-between items-center space-x-4 hover:text-neon-green transition-colors focus:outline-none"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neon-green shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 pt-1 text-xs sm:text-sm text-smoke-300 font-sans border-t border-smoke-850 leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Icon-only Buttons under FAQ Section */}
        <div className="mt-12 flex justify-center items-center space-x-6">
          {/* 1. X Button */}
          <a
            href="https://x.com/potionpunks"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-charcoal-900 border-2 border-smoke-700 hover:border-neon-green text-white hover:text-neon-green flex items-center justify-center rounded-sm transition-all duration-300 shadow-pixel-black hover:shadow-neon-glow transform hover:-translate-y-1"
            aria-label="X / Twitter"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* 2. OpenSea Button */}
          <a
            href="https://opensea.io/collection/portion-punks"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-charcoal-900 border-2 border-smoke-700 hover:border-neon-green text-white hover:text-neon-green flex items-center justify-center rounded-sm transition-all duration-300 shadow-pixel-black hover:shadow-neon-glow transform hover:-translate-y-1"
            aria-label="OpenSea"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" opacity="0" />
              <path d="M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19zM6.5 16.5c1.5-2.5 4.5-4 5.5-4s4 1.5 5.5 4M12 7.5a2 2 0 110 4 2 2 0 010-4z" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
