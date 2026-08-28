'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Settings,
  Layers,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [whitelistCount, setWhitelistCount] = useState<number>(0);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/whitelist').then((r) => r.json()),
      fetch('/api/admin/logs').then((r) => r.json()),
    ])
      .then(([wlData, logsData]) => {
        if (wlData.entries) {
          setWhitelistCount(wlData.entries.length);
        }
        if (logsData.logs) {
          setRecentLogs(logsData.logs.slice(0, 5));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-pixel-display text-neon-green mb-1">
            <Sparkles className="w-4 h-4" />
            <span>PORTION PUNKS CONTROL PANEL</span>
          </div>
          <h1 className="font-pixel-heading text-xl sm:text-2xl text-white font-bold">PORTION PUNKS DASHBOARD</h1>
          <p className="text-xs text-smoke-400 font-sans mt-1">
            Whitelist management, roadmap progression, site atmosphere settings, and security audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/whitelist"
            className="font-pixel-display text-xs px-4 py-2.5 bg-neon-green text-charcoal-950 font-bold border-2 border-black shadow-pixel-black hover:bg-neon-darkgreen transition-all rounded-sm flex items-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>WHITELIST BOARD</span>
          </Link>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Whitelist Registrations */}
        <div className="bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm space-y-4 hover:border-neon-green/50 transition-colors group">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-neon-green/10 border border-neon-green/30 text-neon-green rounded-sm">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="px-2 py-0.5 text-[9px] font-pixel-display bg-neon-green/20 text-neon-green border border-neon-green/40 rounded-sm">
              ACTIVE
            </span>
          </div>

          <div>
            <div className="font-pixel-display text-xs text-smoke-400">WHITELIST REGISTRATIONS</div>
            <div className="font-pixel-heading text-3xl text-white font-bold mt-1 group-hover:text-neon-green transition-colors">
              {loading ? '...' : whitelistCount}
            </div>
            <p className="text-xs text-smoke-400 mt-2 font-sans">
              Reserved genesis mint slots verified with 45-second Math CAPTCHA.
            </p>
          </div>

          <Link
            href="/admin/whitelist"
            className="inline-flex items-center space-x-1.5 text-xs font-pixel-display text-neon-green hover:underline pt-2"
          >
            <span>MANAGE WHITELIST BOARD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Roadmap Progression */}
        <div className="bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm space-y-4 hover:border-neon-green/50 transition-colors group">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="px-2 py-0.5 text-[9px] font-pixel-display bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-sm">
              5 PHASES
            </span>
          </div>

          <div>
            <div className="font-pixel-display text-xs text-smoke-400">ROADMAP MILESTONES</div>
            <div className="font-pixel-heading text-3xl text-white font-bold mt-1 group-hover:text-neon-green transition-colors">
              5 / 5
            </div>
            <p className="text-xs text-smoke-400 mt-2 font-sans">
              Potions. Punks. Progress. Animated scroll reveal & un-reveal timeline.
            </p>
          </div>

          <Link
            href="/admin/roadmap"
            className="inline-flex items-center space-x-1.5 text-xs font-pixel-display text-neon-green hover:underline pt-2"
          >
            <span>EDIT ROADMAP PHASES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Collection & Theme Status */}
        <div className="bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm space-y-4 hover:border-neon-green/50 transition-colors group">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-sm">
              <Layers className="w-6 h-6" />
            </div>
            <span className="px-2 py-0.5 text-[9px] font-pixel-display bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-sm">
              GREY SMOKE
            </span>
          </div>

          <div>
            <div className="font-pixel-display text-xs text-smoke-400">TOTAL NFT SUPPLY</div>
            <div className="font-pixel-heading text-3xl text-white font-bold mt-1 group-hover:text-neon-green transition-colors">
              3333
            </div>
            <p className="text-xs text-smoke-400 mt-2 font-sans">
              Robinhood Crypto chain • OpenSea Marketplace • X @potionpunks
            </p>
          </div>

          <Link
            href="/admin/settings"
            className="inline-flex items-center space-x-1.5 text-xs font-pixel-display text-neon-green hover:underline pt-2"
          >
            <span>CONFIGURE SITE SETTINGS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Recent Activity Audit Logs */}
      <div className="bg-charcoal-900 border-2 border-smoke-800 p-6 rounded-sm space-y-4">
        <div className="flex justify-between items-center border-b border-smoke-800 pb-4">
          <div>
            <h3 className="font-pixel-heading text-sm text-white">RECENT ADMIN ACTIVITY LOGS</h3>
            <p className="text-xs text-smoke-400 font-sans mt-0.5">Audit trail of administrative logins and system actions</p>
          </div>
          <Link
            href="/admin/logs"
            className="text-xs font-pixel-display text-neon-green hover:underline flex items-center space-x-1"
          >
            <span>VIEW ALL LOGS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="py-8 text-center text-xs font-pixel-display text-smoke-500">
            NO RECENT SECURITY LOGS RECORDED.
          </div>
        ) : (
          <div className="divide-y divide-smoke-850">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="py-3 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 text-[9px] font-pixel-display bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-sm">
                    {log.action}
                  </span>
                  <div>
                    <div className="text-white font-mono">{log.userEmail}</div>
                    <div className="text-[11px] text-smoke-400 font-sans">{log.details}</div>
                  </div>
                </div>
                <div className="text-smoke-500 text-[10px] font-mono">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
