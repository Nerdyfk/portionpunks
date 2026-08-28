'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, CheckCircle, XCircle, X, ShieldAlert } from 'lucide-react';
import { getRarityBadgeColor } from '@/lib/utils';

export default function AdminNftsPage() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNft, setEditingNft] = useState<any | null>(null);
  const [deleteConfirmNft, setDeleteConfirmNft] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    tokenId: '',
    name: '',
    description: '',
    imageUrl: '',
    rarityRank: '',
    rarityScore: '',
    rarityCategory: 'COMMON',
    status: 'PUBLISHED',
    traits: [{ traitType: 'Background', traitValue: 'Dark Smoke' }],
  });

  const fetchNfts = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        search,
        status: statusFilter,
      });
      const res = await fetch(`/api/admin/nfts?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNfts(data.nfts || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNfts();
  }, [page, statusFilter]);

  const openCreateModal = () => {
    setEditingNft(null);
    setFormData({
      tokenId: (nfts.length + 1).toString(),
      name: `Potion Punk #${String(nfts.length + 1).padStart(3, '0')}`,
      description: 'Unique Potion Punk forged for digital collectors.',
      imageUrl: '/images/nfts/1.png',
      rarityRank: '100',
      rarityScore: '75.0',
      rarityCategory: 'COMMON',
      status: 'PUBLISHED',
      traits: [
        { traitType: 'Background', traitValue: 'Dark Smoke' },
        { traitType: 'Skin', traitValue: 'Mint Green' },
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (nft: any) => {
    setEditingNft(nft);
    setFormData({
      tokenId: nft.tokenId.toString(),
      name: nft.name,
      description: nft.description || '',
      imageUrl: nft.imageUrl,
      rarityRank: nft.rarityRank.toString(),
      rarityScore: nft.rarityScore.toString(),
      rarityCategory: nft.rarityCategory || 'COMMON',
      status: nft.status || 'PUBLISHED',
      traits: nft.traits?.length > 0 ? nft.traits : [{ traitType: '', traitValue: '' }],
    });
    setModalOpen(true);
  };

  const handleAddTrait = () => {
    setFormData((prev) => ({
      ...prev,
      traits: [...prev.traits, { traitType: '', traitValue: '' }],
    }));
  };

  const handleRemoveTrait = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      traits: prev.traits.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveNft = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingNft ? `/api/admin/nfts/${editingNft.id}` : '/api/admin/nfts';
      const method = editingNft ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchNfts();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save NFT');
      }
    } catch (err) {
      alert('Error saving NFT');
    }
  };

  const handleDeleteNft = async () => {
    if (!deleteConfirmNft) return;
    try {
      const res = await fetch(`/api/admin/nfts/${deleteConfirmNft.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteConfirmNft(null);
        fetchNfts();
      }
    } catch (e) {
      alert('Failed to delete NFT');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm">
        <div>
          <h1 className="font-pixel-heading text-lg text-white font-bold">NFT COLLECTION MANAGER</h1>
          <p className="text-xs text-smoke-400 font-sans mt-1">
            Create, edit, publish, or delete Portion Punks artwork and traits.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="font-pixel-display text-xs px-4 py-2.5 bg-neon-green text-charcoal-950 font-bold border-2 border-black shadow-pixel-black hover:bg-neon-darkgreen transition-all flex items-center space-x-2 rounded-sm"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW NFT</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-charcoal-900 border border-smoke-800 p-4 rounded-sm">
        <div className="flex space-x-2">
          {['ALL', 'PUBLISHED', 'DRAFT'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`font-pixel-display text-xs px-3 py-1.5 border rounded-sm ${
                statusFilter === st
                  ? 'bg-neon-green/20 text-neon-green border-neon-green'
                  : 'bg-charcoal-850 text-smoke-400 border-smoke-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchNfts();
          }}
          className="relative w-full sm:w-64"
        >
          <input
            type="text"
            placeholder="Search #ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs px-3.5 py-2 pl-9 font-sans focus:outline-none focus:border-neon-green rounded-sm"
          />
          <Search className="w-4 h-4 text-smoke-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* NFT Table */}
      <div className="bg-charcoal-900 border-2 border-smoke-800 rounded-sm overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-charcoal-850 font-pixel-display text-[10px] text-smoke-400 border-b border-smoke-800">
            <tr>
              <th className="p-3.5">NFT</th>
              <th className="p-3.5">TOKEN ID</th>
              <th className="p-3.5">NAME</th>
              <th className="p-3.5">RARITY</th>
              <th className="p-3.5">TRAITS</th>
              <th className="p-3.5">STATUS</th>
              <th className="p-3.5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-smoke-850">
            {nfts.map((nft) => (
              <tr key={nft.id} className="hover:bg-charcoal-850/50">
                <td className="p-3.5">
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-10 h-10 object-contain pixelated bg-charcoal-950 border border-smoke-700 rounded-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/nfts/1.png';
                    }}
                  />
                </td>
                <td className="p-3.5 font-pixel-display text-neon-green">#{nft.tokenId}</td>
                <td className="p-3.5 font-bold text-white">{nft.name}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 text-[9px] font-pixel-display border rounded-sm ${getRarityBadgeColor(nft.rarityCategory)}`}>
                    {nft.rarityCategory}
                  </span>
                </td>
                <td className="p-3.5 text-smoke-300">
                  {nft.traits?.length || 0} traits
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-pixel-display border rounded-sm ${
                      nft.status === 'PUBLISHED'
                        ? 'bg-neon-green/10 text-neon-green border-neon-green/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {nft.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(nft)}
                    className="p-1.5 bg-charcoal-800 hover:bg-charcoal-700 text-smoke-200 border border-smoke-700 rounded-sm"
                    title="Edit NFT"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-neon-green" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmNft(nft)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-sm"
                    title="Delete NFT"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-md">
          <div className="bg-charcoal-900 border-2 border-smoke-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl rounded-sm">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-smoke-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-pixel-heading text-sm text-white mb-6">
              {editingNft ? `EDIT NFT #${editingNft.tokenId}` : 'CREATE NEW NFT'}
            </h3>

            <form onSubmit={handleSaveNft} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-pixel-display text-smoke-300 mb-1">TOKEN ID</label>
                  <input
                    type="number"
                    required
                    value={formData.tokenId}
                    onChange={(e) => setFormData({ ...formData, tokenId: e.target.value })}
                    className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-pixel-display text-smoke-300 mb-1">NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-pixel-display text-smoke-300 mb-1">IMAGE URL</label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-pixel-display text-smoke-300 mb-1">RARITY CATEGORY</label>
                  <select
                    value={formData.rarityCategory}
                    onChange={(e) => setFormData({ ...formData, rarityCategory: e.target.value })}
                    className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
                  >
                    <option value="COMMON">COMMON</option>
                    <option value="RARE">RARE</option>
                    <option value="EPIC">EPIC</option>
                    <option value="LEGENDARY">LEGENDARY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-pixel-display text-smoke-300 mb-1">RARITY RANK</label>
                  <input
                    type="number"
                    value={formData.rarityRank}
                    onChange={(e) => setFormData({ ...formData, rarityRank: e.target.value })}
                    className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-pixel-display text-smoke-300 mb-1">STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Traits Editor */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-pixel-display text-smoke-300">ATTRIBUTES & TRAITS</label>
                  <button
                    type="button"
                    onClick={handleAddTrait}
                    className="font-pixel-display text-[10px] text-neon-green hover:underline"
                  >
                    + ADD TRAIT
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.traits.map((trait, idx) => (
                    <div key={idx} className="flex space-x-2 items-center">
                      <input
                        type="text"
                        placeholder="Trait Type (e.g. Background)"
                        value={trait.traitType}
                        onChange={(e) => {
                          const updated = [...formData.traits];
                          updated[idx].traitType = e.target.value;
                          setFormData({ ...formData, traits: updated });
                        }}
                        className="w-1/2 bg-charcoal-850 border border-smoke-700 text-white text-xs p-2 focus:outline-none focus:border-neon-green rounded-sm"
                      />
                      <input
                        type="text"
                        placeholder="Trait Value (e.g. Laser Green)"
                        value={trait.traitValue}
                        onChange={(e) => {
                          const updated = [...formData.traits];
                          updated[idx].traitValue = e.target.value;
                          setFormData({ ...formData, traits: updated });
                        }}
                        className="w-1/2 bg-charcoal-850 border border-smoke-700 text-white text-xs p-2 focus:outline-none focus:border-neon-green rounded-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTrait(idx)}
                        className="p-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-sm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="font-pixel-display text-xs px-4 py-2.5 bg-charcoal-800 text-smoke-300 border border-smoke-700 rounded-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="font-pixel-display text-xs px-6 py-2.5 bg-neon-green text-charcoal-950 font-bold border-2 border-black shadow-pixel-black rounded-sm"
                >
                  SAVE NFT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmNft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-md">
          <div className="bg-charcoal-900 border-2 border-red-500/50 w-full max-w-md p-6 rounded-sm text-center">
            <ShieldAlert className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h4 className="font-pixel-heading text-sm text-white mb-2">CONFIRM DELETION</h4>
            <p className="text-xs text-smoke-300 font-sans mb-6">
              Are you sure you want to delete <strong className="text-white">#{deleteConfirmNft.tokenId} {deleteConfirmNft.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmNft(null)}
                className="font-pixel-display text-xs px-4 py-2 bg-charcoal-800 text-smoke-300 border border-smoke-700 rounded-sm"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteNft}
                className="font-pixel-display text-xs px-6 py-2 bg-red-500 text-white font-bold border-2 border-black shadow-pixel-black rounded-sm"
              >
                DELETE PERMANENTLY
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
