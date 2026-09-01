'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <section id="collection" className="relative z-10 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="section-kicker mb-3">02 — The Vault</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-smoke-100">
              Portion Punks <span className="italic text-gold-400">gallery</span>
            </h2>
            <p className="text-smoke-400 font-light mt-3">
              3,333 unique Punks, each with distinct potion traits.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-[11px] tracking-[0.2em] uppercase text-smoke-500">
            Showing <span className="text-gold-400">{totalCount}</span> punks
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 glass-panel p-4">
          
          {/* Rarity Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`text-[10px] tracking-[0.16em] uppercase px-3.5 py-2 transition-all border rounded-full ${
                  selectedCategory === cat
                    ? 'bg-gold-400 text-charcoal-950 border-gold-400'
                    : 'bg-transparent text-smoke-400 border-gold-400/20 hover:text-gold-400 hover:border-gold-400/50'
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
              className="w-full bg-charcoal-950/60 border border-gold-400/20 text-smoke-100 placeholder-smoke-500 text-sm px-3.5 py-2.5 pl-9 font-sans focus:outline-none focus:border-gold-400 rounded-full"
            />
            <Search className="w-4 h-4 text-smoke-400 absolute left-3 top-3" />
          </form>
        </div>

        {/* NFT Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-panel p-3 animate-pulse">
                <div className="w-full aspect-square bg-charcoal-800 mb-3" />
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
                className="group glass-panel p-3 cursor-pointer transition-all duration-300 hover:border-gold-400/50 hover:-translate-y-1 relative"
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
                    <div className="font-serif-display text-lg text-smoke-100 group-hover:text-gold-400 transition-colors truncate max-w-[140px]">
                      {nft.name}
                    </div>
                    <div className="text-[10px] tracking-widest uppercase text-smoke-500 mt-1">
                      Rank #{nft.rarityRank || nft.tokenId}
                    </div>
                  </div>

                  <span className="text-[10px] tracking-widest uppercase text-gold-400">
                    View →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-panel">
            <p className="text-smoke-400">No Portion Punks match this filter.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 glass-panel disabled:opacity-40 hover:border-gold-400 text-smoke-200 text-[11px] tracking-widest uppercase rounded-full flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREV</span>
            </button>

            <span className="text-[11px] tracking-widest uppercase text-smoke-400">
              Page <span className="text-gold-400">{page}</span> of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 glass-panel disabled:opacity-40 hover:border-gold-400 text-smoke-200 text-[11px] tracking-widest uppercase rounded-full flex items-center space-x-1"
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
