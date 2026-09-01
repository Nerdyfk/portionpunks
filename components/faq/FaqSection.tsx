'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <section id="faq" className="relative z-10 py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-kicker mb-4">04 — Inquiries</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-smoke-100">
            Frequently asked <span className="italic text-gold-400">questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="glass-panel overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left font-serif-display text-xl text-smoke-100 flex justify-between items-center gap-4 hover:text-gold-400 transition-colors focus:outline-none"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gold-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-sm text-smoke-400 font-light leading-relaxed border-t border-gold-400/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
