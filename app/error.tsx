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
    <div className="min-h-screen bg-charcoal-950 text-smoke-100 flex flex-col items-center justify-center p-6 text-center">
      <p className="section-kicker mb-4">System</p>
      <h1 className="font-serif-display text-5xl text-smoke-100 mb-4">
        Brew <span className="italic text-gold-400">interrupted</span>
      </h1>
      <p className="text-sm text-smoke-400 max-w-md mb-8 font-mono glass-panel p-4">
        {error.message || 'An unexpected server error occurred.'}
      </p>
      <button onClick={() => reset()} className="btn-gold text-[11px] px-7 py-3.5 rounded-full">
        Try again
      </button>
    </div>
  );
}
