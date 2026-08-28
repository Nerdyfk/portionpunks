'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';

interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  description: string;
  status: string;
}

export default function AdminRoadmapPage() {
  const [phases, setPhases] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.roadmap && data.roadmap.length > 0) {
          setPhases(data.roadmap);
        } else {
          setPhases([
            { id: '1', phase: '01', title: 'THE FIRST BREW', description: 'Launch the 3,333 Punks, website, community & holder verification.', status: 'COMPLETED' },
            { id: '2', phase: '02', title: 'POTION LAB', description: 'Holder hub with quests, XP, badges & Potion crafting.', status: 'IN_PROGRESS' },
            { id: '3', phase: '03', title: 'PUNK PASS', description: 'Exclusive events, content, drops & early access for holders.', status: 'UPCOMING' },
            { id: '4', phase: '04', title: 'PUNK ARCADE', description: 'Pixel-art games, challenges, leaderboards & community rewards.', status: 'UPCOMING' },
            { id: '5', phase: '05', title: 'THE NEXT BREW', description: 'New collectibles, collaborations, experiences & community-driven utilities.', status: 'UPCOMING' },
          ]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index: number, field: keyof RoadmapItem, value: string) => {
    const updated = [...phases];
    updated[index] = { ...updated[index], [field]: value };
    setPhases(updated);
  };

  const handleAddPhase = () => {
    const nextNum = String(phases.length + 1).padStart(2, '0');
    setPhases([
      ...phases,
      {
        id: String(Date.now()),
        phase: nextNum,
        title: 'NEW PHASE',
        description: 'Description of the new milestone phase.',
        status: 'UPCOMING',
      },
    ]);
  };

  const handleRemovePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ROADMAP', data: phases }),
      });
      if (res.ok) {
        setMessage('Roadmap phases updated successfully!');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage('Failed to save roadmap phases.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-smoke-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-pixel-display text-neon-green mb-1">
            <MapPin className="w-4 h-4" />
            <span>ROADMAP CONTENT EDITOR</span>
          </div>
          <h1 className="font-pixel-heading text-2xl text-white font-bold tracking-tight">
            PROJECT ROADMAP PHASES
          </h1>
          <p className="text-xs text-smoke-400 font-sans mt-1">
            Customize the 5 milestone phases displayed on the animated public roadmap.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-neon-green text-charcoal-950 font-pixel-display text-xs font-bold border-2 border-black shadow-pixel-black hover:bg-neon-darkgreen transition-all flex items-center space-x-2 rounded-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SAVING...' : 'SAVE ROADMAP'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-neon-green/15 border border-neon-green/40 text-neon-green text-xs font-pixel-display rounded-sm animate-fadeIn">
          {message}
        </div>
      )}

      {/* Phases Form List */}
      <div className="space-y-6">
        {phases.map((item, idx) => (
          <div key={item.id || idx} className="bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm space-y-4 relative">
            <div className="flex justify-between items-center border-b border-smoke-850 pb-3">
              <span className="font-pixel-display text-xs text-neon-green">
                PHASE {String(idx + 1).padStart(2, '0')}
              </span>
              <button
                onClick={() => handleRemovePhase(idx)}
                className="text-red-400 hover:text-red-300 p-1"
                title="Remove Phase"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-pixel-display text-smoke-300 mb-1">
                  PHASE NUMBER / CODE
                </label>
                <input
                  type="text"
                  value={item.phase}
                  onChange={(e) => handleChange(idx, 'phase', e.target.value)}
                  className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs px-3 py-2 focus:outline-none focus:border-neon-green font-mono rounded-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-pixel-display text-smoke-300 mb-1">
                  TITLE
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleChange(idx, 'title', e.target.value)}
                  className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs px-3 py-2 focus:outline-none focus:border-neon-green font-pixel-heading rounded-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-pixel-display text-smoke-300 mb-1">
                DESCRIPTION
              </label>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => handleChange(idx, 'description', e.target.value)}
                className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-3 focus:outline-none focus:border-neon-green font-sans rounded-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddPhase}
        className="w-full py-3 bg-charcoal-850 hover:bg-charcoal-800 border-2 border-dashed border-smoke-700 text-smoke-300 font-pixel-display text-xs flex items-center justify-center space-x-2 rounded-sm transition-colors"
      >
        <Plus className="w-4 h-4 text-neon-green" />
        <span>ADD NEW ROADMAP PHASE</span>
      </button>

    </div>
  );
}
