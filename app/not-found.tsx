'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-charcoal-950 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="font-pixel-heading text-6xl text-neon-green mb-4 animate-pulse">404</div>
      <h1 className="font-pixel-heading text-xl text-white mb-2">PUNK NOT FOUND IN BREW</h1>
      <p className="text-xs text-smoke-400 font-sans max-w-md mb-6">
        The portion or page you are searching for has drifted into the dark smoke.
      </p>
      <Link
        href="/"
        className="font-pixel-display text-xs px-6 py-3 bg-neon-green text-charcoal-950 font-bold border-2 border-black shadow-pixel-black rounded-sm"
      >
        RETURN TO PORTION PUNKS
      </Link>
    </div>
  );
}
