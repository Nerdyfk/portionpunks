'use client';

import React, { useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { getRarityBadgeColor } from '@/lib/utils';

export interface Trait {
  id?: string;
  traitType: string;
  traitValue: string;
}

export interface NFTItem {
  id: string;
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  rarityRank: number;
  rarityScore: number;
  rarityCategory: string;
  status: string;
  traits: Trait[];
}

interface NftDetailModalProps {
  nft: NFTItem | null;
  onClose: () => void;
  openSeaUrl?: string;
}

export default function NftDetailModal({ nft, onClose, openSeaUrl }: NftDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!nft) return null;

  const targetOpenSea = openSeaUrl || `https://opensea.io/assets/robinhood/${nft.tokenId}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative text-smoke-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-smoke-400 hover:text-white bg-charcoal-800 border border-smoke-700 rounded-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Artwork */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square bg-charcoal-950 border-2 border-smoke-700 p-3 rounded-sm relative group overflow-hidden shadow-pixel-black">
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full h-full object-contain pixelated"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/nfts/1.png';
                }}
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 text-[10px] font-pixel-display border rounded-sm ${getRarityBadgeColor(nft.rarityCategory)}`}>
                  {nft.rarityCategory}
                </span>
              </div>
            </div>

            <div className="mt-4 w-full flex items-center justify-between text-xs font-pixel-display text-smoke-400 bg-charcoal-850 p-2.5 border border-smoke-800 rounded-sm">
              <span>RANK: #{nft.rarityRank || 'N/A'}</span>
              <span>SCORE: {nft.rarityScore ? nft.rarityScore.toFixed(1) : 'N/A'}</span>
            </div>
          </div>

          {/* Right Column: Information & Traits */}
          <div className="md:col-span-7 flex flex-col space-y-6">
            <div>
              <div className="text-xs font-pixel-display text-neon-green mb-1">PORTION PUNKS COLLECTION</div>
              <h2 className="font-pixel-heading text-xl sm:text-2xl text-white font-bold">{nft.name}</h2>
              <p className="text-xs text-smoke-300 font-sans mt-2 leading-relaxed">{nft.description}</p>
            </div>

            {/* Blockchain Details */}
            <div className="grid grid-cols-2 gap-3 text-xs font-pixel-display bg-charcoal-850 p-3 border border-smoke-800 rounded-sm">
              <div>
                <span className="text-smoke-400 block text-[10px]">BLOCKCHAIN</span>
                <span className="text-white">Robinhood Crypto</span>
              </div>
              <div>
                <span className="text-smoke-400 block text-[10px]">TOKEN ID</span>
                <span className="text-neon-green">#{nft.tokenId}</span>
              </div>
            </div>

            {/* Traits Grid */}
            <div>
              <h4 className="font-pixel-display text-xs text-white mb-3 flex items-center space-x-2">
                <Award className="w-4 h-4 text-neon-green" />
                <span>TRAITS & ATTRIBUTES ({nft.traits?.length || 0})</span>
              </h4>

              {nft.traits && nft.traits.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {nft.traits.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-charcoal-850 border border-smoke-800 hover:border-neon-green/40 transition-colors rounded-sm"
                    >
                      <div className="text-[10px] font-pixel-display text-neon-green uppercase truncate">{t.traitType}</div>
                      <div className="text-xs font-sans text-white font-semibold mt-0.5 truncate">{t.traitValue}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-smoke-400 italic">No trait data available for this Punk.</p>
              )}
            </div>

            {/* OpenSea Button */}
            <div className="pt-2">
              <a
                href={targetOpenSea}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-neon-green text-charcoal-950 font-pixel-display text-xs font-bold border-2 border-black shadow-pixel-black hover:bg-neon-darkgreen transition-all flex items-center justify-center space-x-2 rounded-sm"
              >
                <span>VIEW ON OPENSEA</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
