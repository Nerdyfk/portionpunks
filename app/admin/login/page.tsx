'use client';

import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@portionpunks.com');
  const [password, setPassword] = useState('PortionPunks2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const responseText = await res.text();
      let data: any = {};

      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        // If server response was not JSON (e.g. Next.js HTML error page during server init)
        if (res.ok) {
          window.location.href = '/admin';
          return;
        } else {
          console.warn('Server response non-JSON:', responseText);
          setError('Invalid credentials or server initializing. Please try again.');
          setLoading(false);
          return;
        }
      }

      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please check credentials.');
      } else {
        // Login Success -> Direct Navigation to Admin Dashboard
        window.location.href = '/admin';
      }
    } catch (err: any) {
      setError(err?.message || 'Network error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c212b] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-charcoal-900 border-2 border-smoke-800 p-8 shadow-2xl rounded-sm text-white">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-neon-green/10 border border-neon-green/40 text-neon-green rounded-sm flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
            <Lock className="w-6 h-6" />
          </div>
          <div className="font-pixel-heading text-lg text-white font-bold">
            PORTION PUNKS
          </div>
          <div className="font-pixel-display text-xs text-smoke-400 mt-1">
            ADMINISTRATOR PORTAL
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-pixel-display flex items-start space-x-2 rounded-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
              ADMIN EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portionpunks.com"
              className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs px-3.5 py-2.5 focus:outline-none focus:border-neon-green rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-charcoal-850 border border-smoke-700 text-white text-xs px-3.5 py-2.5 focus:outline-none focus:border-neon-green rounded-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-neon-green text-charcoal-950 font-pixel-display text-xs font-bold border-2 border-black shadow-pixel-black hover:bg-neon-darkgreen transition-all flex items-center justify-center space-x-2 rounded-sm disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">AUTHENTICATING...</span>
              ) : (
                <span>LOGIN TO DASHBOARD →</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-smoke-850 text-[10px] font-pixel-display text-smoke-400 text-center">
          DEFAULT DEV SEED: <span className="text-neon-green">admin@portionpunks.com</span> / <span className="text-neon-green">PortionPunks2026!</span>
        </div>

      </div>
    </div>
  );
}
