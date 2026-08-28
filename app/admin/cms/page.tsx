'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, MapPin, HelpCircle, Save } from 'lucide-react';

export default function AdminCmsPage() {
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Roadmap Form Modal
  const [roadmapModal, setRoadmapModal] = useState(false);
  const [roadmapData, setRoadmapData] = useState({ id: '', phase: 'PHASE 01', title: '', description: '', status: 'UPCOMING', displayOrder: 1 });

  // FAQ Form Modal
  const [faqModal, setFaqModal] = useState(false);
  const [faqData, setFaqData] = useState({ id: '', question: '', answer: '', category: 'General', displayOrder: 1 });

  const loadCmsData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/public/settings');
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap || []);
        setFaqs(data.faqs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  const handleSaveRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = roadmapData.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/roadmap', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roadmapData),
      });
      if (res.ok) {
        setRoadmapModal(false);
        loadCmsData();
      }
    } catch (e) {
      alert('Error saving roadmap item');
    }
  };

  const handleDeleteRoadmap = async (id: string) => {
    if (!confirm('Delete this roadmap phase?')) return;
    await fetch(`/api/admin/roadmap?id=${id}`, { method: 'DELETE' });
    loadCmsData();
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = faqData.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/faq', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqData),
      });
      if (res.ok) {
        setFaqModal(false);
        loadCmsData();
      }
    } catch (e) {
      alert('Error saving FAQ item');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ item?')) return;
    await fetch(`/api/admin/faq?id=${id}`, { method: 'DELETE' });
    loadCmsData();
  };

  return (
    <div className="space-y-10 font-sans">
      
      {/* Header */}
      <div className="bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm">
        <h1 className="font-pixel-heading text-lg text-white font-bold">CMS CONTENT MANAGER</h1>
        <p className="text-xs text-smoke-400 font-sans mt-1">
          Manage dynamic roadmap milestones and frequently asked questions without touching code.
        </p>
      </div>

      {/* ROADMAP MANAGER */}
      <div className="bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-smoke-800">
          <div>
            <h3 className="font-pixel-heading text-sm text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-neon-green" />
              <span>ROADMAP PHASES ({roadmap.length})</span>
            </h3>
          </div>
          <button
            onClick={() => {
              setRoadmapData({ id: '', phase: `PHASE 0${roadmap.length + 1}`, title: '', description: '', status: 'UPCOMING', displayOrder: roadmap.length + 1 });
              setRoadmapModal(true);
            }}
            className="font-pixel-display text-xs px-3 py-2 bg-neon-green text-charcoal-950 font-bold border-2 border-black rounded-sm"
          >
            + ADD PHASE
          </button>
        </div>

        <div className="space-y-3">
          {roadmap.map((rm) => (
            <div key={rm.id} className="p-4 bg-charcoal-850 border border-smoke-800 flex justify-between items-start rounded-sm">
              <div>
                <span className="font-pixel-display text-[10px] text-neon-green">{rm.phase} [{rm.status}]</span>
                <h4 className="font-pixel-heading text-sm text-white mt-0.5">{rm.title}</h4>
                <p className="text-xs text-smoke-300 mt-1">{rm.description}</p>
              </div>
              <div className="flex space-x-2 shrink-0 ml-4">
                <button
                  onClick={() => {
                    setRoadmapData(rm);
                    setRoadmapModal(true);
                  }}
                  className="p-1.5 bg-charcoal-800 text-neon-green border border-smoke-700 rounded-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteRoadmap(rm.id)}
                  className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ MANAGER */}
      <div className="bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-smoke-800">
          <div>
            <h3 className="font-pixel-heading text-sm text-white flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-neon-green" />
              <span>FAQ ITEMS ({faqs.length})</span>
            </h3>
          </div>
          <button
            onClick={() => {
              setFaqData({ id: '', question: '', answer: '', category: 'General', displayOrder: faqs.length + 1 });
              setFaqModal(true);
            }}
            className="font-pixel-display text-xs px-3 py-2 bg-neon-green text-charcoal-950 font-bold border-2 border-black rounded-sm"
          >
            + ADD FAQ
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-4 bg-charcoal-850 border border-smoke-800 flex justify-between items-start rounded-sm">
              <div>
                <h4 className="font-pixel-display text-xs text-white">{faq.question}</h4>
                <p className="text-xs text-smoke-300 mt-1">{faq.answer}</p>
              </div>
              <div className="flex space-x-2 shrink-0 ml-4">
                <button
                  onClick={() => {
                    setFaqData(faq);
                    setFaqModal(true);
                  }}
                  className="p-1.5 bg-charcoal-800 text-neon-green border border-smoke-700 rounded-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap Modal */}
      {roadmapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-md">
          <div className="bg-charcoal-900 border-2 border-smoke-700 w-full max-w-md p-6 rounded-sm">
            <h3 className="font-pixel-heading text-sm text-white mb-4">ROADMAP ITEM FORM</h3>
            <form onSubmit={handleSaveRoadmap} className="space-y-3">
              <div>
                <label className="text-[11px] font-pixel-display text-smoke-300">PHASE LABEL</label>
                <input
                  type="text"
                  required
                  value={roadmapData.phase}
                  onChange={(e) => setRoadmapData({ ...roadmapData, phase: e.target.value })}
                  className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2 rounded-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-pixel-display text-smoke-300">TITLE</label>
                <input
                  type="text"
                  required
                  value={roadmapData.title}
                  onChange={(e) => setRoadmapData({ ...roadmapData, title: e.target.value })}
                  className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2 rounded-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-pixel-display text-smoke-300">DESCRIPTION</label>
                <textarea
                  rows={3}
                  required
                  value={roadmapData.description}
                  onChange={(e) => setRoadmapData({ ...roadmapData, description: e.target.value })}
                  className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2 rounded-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-pixel-display text-smoke-300">STATUS</label>
                <select
                  value={roadmapData.status}
                  onChange={(e) => setRoadmapData({ ...roadmapData, status: e.target.value })}
                  className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2 rounded-sm"
                >
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="UPCOMING">UPCOMING</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRoadmapModal(false)}
                  className="px-3 py-1.5 bg-charcoal-800 text-xs text-smoke-300 font-pixel-display rounded-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neon-green text-charcoal-950 font-bold text-xs font-pixel-display border-2 border-black rounded-sm"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {faqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-md">
          <div className="bg-charcoal-900 border-2 border-smoke-700 w-full max-w-md p-6 rounded-sm">
            <h3 className="font-pixel-heading text-sm text-white mb-4">FAQ ITEM FORM</h3>
            <form onSubmit={handleSaveFaq} className="space-y-3">
              <div>
                <label className="text-[11px] font-pixel-display text-smoke-300">QUESTION</label>
                <input
                  type="text"
                  required
                  value={faqData.question}
                  onChange={(e) => setFaqData({ ...faqData, question: e.target.value })}
                  className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2 rounded-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-pixel-display text-smoke-300">ANSWER</label>
                <textarea
                  rows={4}
                  required
                  value={faqData.answer}
                  onChange={(e) => setFaqData({ ...faqData, answer: e.target.value })}
                  className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs p-2 rounded-sm"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setFaqModal(false)}
                  className="px-3 py-1.5 bg-charcoal-800 text-xs text-smoke-300 font-pixel-display rounded-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neon-green text-charcoal-950 font-bold text-xs font-pixel-display border-2 border-black rounded-sm"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
