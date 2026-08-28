'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-charcoal-950 text-white flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="font-pixel-heading text-4xl text-red-500 mb-4">SYSTEM BREW ERROR</div>
      <p className="text-xs text-smoke-400 max-w-md mb-6 font-mono bg-charcoal-900 border border-smoke-800 p-3 rounded-sm">
        {error.message || 'An unexpected server error occurred.'}
      </p>
      <button
        onClick={() => reset()}
        className="font-pixel-display text-xs px-6 py-3 bg-neon-green text-charcoal-950 font-bold border-2 border-black shadow-pixel-black rounded-sm"
      >
        RETRY SYSTEM
      </button>
    </div>
  );
}
