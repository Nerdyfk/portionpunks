'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  const [collection, setCollection] = useState({
    name: 'Portion Punks',
    description: '3333 unique Potion Punks forged for digital collectors.',
    totalSupply: 3333,
    chain: 'Robinhood Crypto',
    platform: 'OpenSea',
    contractAddress: '0x3333777788889999aaaabbbbccccddddeeeeffff',
    mintDate: 'Q4 2026',
    mintStatus: 'UPCOMING',
    mintPrice: 'FREE MINT',
    openSeaUrl: 'https://opensea.io/collection/portion-punks',
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.collection) {
          setCollection(data.collection);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection }),
      });

      if (res.ok) {
        setSavedSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      
      {/* Page Header */}
      <div className="bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm">
        <h1 className="font-pixel-heading text-lg text-white font-bold">COLLECTION & SITE SETTINGS</h1>
        <p className="text-xs text-smoke-400 font-sans mt-1">
          Configure smart contract metadata, marketplace links, supply, and mint status.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-neon-green/15 border border-neon-green/40 text-neon-green text-xs font-pixel-display flex items-center space-x-2 rounded-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span>Collection settings updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-pixel-display flex items-center space-x-2 rounded-sm">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-charcoal-900 border-2 border-smoke-800 p-6 space-y-6 rounded-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
              COLLECTION NAME
            </label>
            <input
              type="text"
              required
              value={collection.name}
              onChange={(e) => setCollection({ ...collection, name: e.target.value })}
              className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
              TOTAL SUPPLY
            </label>
            <input
              type="number"
              required
              value={collection.totalSupply}
              onChange={(e) => setCollection({ ...collection, totalSupply: parseInt(e.target.value, 10) })}
              className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
            COLLECTION DESCRIPTION
          </label>
          <textarea
            rows={3}
            value={collection.description}
            onChange={(e) => setCollection({ ...collection, description: e.target.value })}
            className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
              BLOCKCHAIN ECOSYSTEM
            </label>
            <input
              type="text"
              value={collection.chain}
              onChange={(e) => setCollection({ ...collection, chain: e.target.value })}
              className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
              PRIMARY MARKETPLACE
            </label>
            <input
              type="text"
              value={collection.platform}
              onChange={(e) => setCollection({ ...collection, platform: e.target.value })}
              className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
              MINT DATE
            </label>
            <input
              type="text"
              value={collection.mintDate}
              onChange={(e) => setCollection({ ...collection, mintDate: e.target.value })}
              className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
              MINT PRICE
            </label>
            <input
              type="text"
              value={collection.mintPrice}
              onChange={(e) => setCollection({ ...collection, mintPrice: e.target.value })}
              className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
              MINT STATUS
            </label>
            <select
              value={collection.mintStatus}
              onChange={(e) => setCollection({ ...collection, mintStatus: e.target.value })}
              className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
            >
              <option value="UPCOMING">UPCOMING</option>
              <option value="WHITELIST_LIVE">WHITELIST LIVE</option>
              <option value="PUBLIC_MINT">PUBLIC MINT LIVE</option>
              <option value="SOLD_OUT">SOLD OUT</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
            CONTRACT ADDRESS
          </label>
          <input
            type="text"
            value={collection.contractAddress}
            onChange={(e) => setCollection({ ...collection, contractAddress: e.target.value })}
            className="w-full bg-charcoal-850 border border-smoke-700 text-white font-mono text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
            OPENSEA COLLECTION URL
          </label>
          <input
            type="url"
            value={collection.openSeaUrl}
            onChange={(e) => setCollection({ ...collection, openSeaUrl: e.target.value })}
            className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2.5 focus:outline-none focus:border-neon-green rounded-sm"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="font-pixel-display text-xs px-6 py-3.5 bg-neon-green text-charcoal-950 font-bold border-2 border-black shadow-pixel-black hover:bg-neon-darkgreen transition-all flex items-center space-x-2 rounded-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING CHANGES...' : 'SAVE COLLECTION SETTINGS'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
