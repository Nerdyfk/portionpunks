'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import NftDetailModal, { NFTItem } from './NftDetailModal';
import { getRarityBadgeColor } from '@/lib/utils';

export default function CollectionGallery() {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedNft, setSelectedNft] = useState<NFTItem | null>(null);

  const categories = ['ALL', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY'];

  const fetchNfts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        category: selectedCategory,
        search: searchQuery,
      });

      const res = await fetch(`/api/public/nfts?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNfts(data.nfts || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error('Failed to load gallery NFTs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNfts();
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchNfts();
  };

  return (
    <section id="collection" className="relative z-10 py-20 bg-charcoal-950/60 border-t border-smoke-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-pixel-display text-neon-green mb-2">
              <Sparkles className="w-4 h-4" />
              <span>THE COLLECTION</span>
            </div>
            <h2 className="font-pixel-heading text-2xl sm:text-4xl text-white font-bold tracking-tight">
              PORTION PUNKS GALLERY
            </h2>
            <p className="text-sm text-smoke-300 font-sans mt-1">
              3333 unique Potion Punks generated with distinct potion traits.
            </p>
          </div>

          <div className="mt-4 md:mt-0 font-pixel-display text-xs text-smoke-400">
            TOTAL SHOWING: <span className="text-neon-green">{totalCount}</span> PUNKS
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-charcoal-900 border border-smoke-800 p-4 rounded-sm">
          
          {/* Rarity Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`font-pixel-display text-[11px] px-3.5 py-2 transition-all border rounded-sm ${
                  selectedCategory === cat
                    ? 'bg-neon-green/20 text-neon-green border-neon-green shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                    : 'bg-charcoal-850 text-smoke-400 border-smoke-700 hover:text-white hover:border-smoke-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search #ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-850 border border-smoke-700 text-white placeholder-smoke-400 text-xs px-3.5 py-2.5 pl-9 font-sans focus:outline-none focus:border-neon-green rounded-sm"
            />
            <Search className="w-4 h-4 text-smoke-400 absolute left-3 top-3" />
          </form>
        </div>

        {/* NFT Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-charcoal-900 border border-smoke-800 p-3 animate-pulse rounded-sm">
                <div className="w-full aspect-square bg-charcoal-800 rounded-sm mb-3" />
                <div className="h-4 bg-charcoal-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-charcoal-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : nfts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                onClick={() => setSelectedNft(nft)}
                className="group bg-charcoal-900 border-2 border-smoke-800 hover:border-neon-green p-3 cursor-pointer transition-all duration-300 hover:shadow-neon-glow transform hover:-translate-y-1.5 rounded-sm relative"
              >
                {/* Artwork */}
                <div className="w-full aspect-square bg-charcoal-950 border border-smoke-800 relative overflow-hidden rounded-sm mb-3">
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-full object-contain pixelated group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/nfts/1.png';
                    }}
                  />
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 text-[9px] font-pixel-display border rounded-sm ${getRarityBadgeColor(nft.rarityCategory)}`}>
                      {nft.rarityCategory}
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="font-pixel-heading text-xs text-white group-hover:text-neon-green transition-colors truncate max-w-[140px]">
                      {nft.name}
                    </div>
                    <div className="text-[10px] font-pixel-display text-smoke-400 mt-1">
                      RANK #{nft.rarityRank || nft.tokenId}
                    </div>
                  </div>

                  <span className="text-[10px] font-pixel-display text-neon-green group-hover:underline">
                    VIEW →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-charcoal-900 border border-smoke-800 rounded-sm">
            <p className="font-pixel-display text-sm text-smoke-400">No Portion Punks found matching your filter.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2.5 bg-charcoal-900 border border-smoke-700 disabled:opacity-40 hover:border-neon-green text-white text-xs font-pixel-display rounded-sm flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREV</span>
            </button>

            <span className="font-pixel-display text-xs text-smoke-300">
              PAGE <span className="text-neon-green">{page}</span> OF {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2.5 bg-charcoal-900 border border-smoke-700 disabled:opacity-40 hover:border-neon-green text-white text-xs font-pixel-display rounded-sm flex items-center space-x-1"
            >
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      <NftDetailModal nft={selectedNft} onClose={() => setSelectedNft(null)} />
    </section>
  );
}
