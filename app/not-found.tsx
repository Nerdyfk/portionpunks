'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-charcoal-950 text-smoke-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="font-serif-display text-7xl text-gold-400 mb-4 italic">404</div>
      <h1 className="font-serif-display text-3xl text-smoke-100 mb-3">Punk not found</h1>
      <p className="text-smoke-400 max-w-md mb-8 font-light">
        The portion you are searching for has drifted into the smoke.
      </p>
      <Link href="/" className="btn-gold text-[11px] px-7 py-3.5 rounded-full">
        Return home
      </Link>
    </div>
  );
}
