import type { Metadata } from 'next';
import './globals.css';
import '@/lib/copyAssets';

export const metadata: Metadata = {
  title: 'Portion Punks — Potions Fuel a Brighter Tomorrow',
  description: 'Portion Punks is a collection of 3333 unique pixel-art Punks built for the next generation of digital collectors on Robinhood Crypto.',
  openGraph: {
    title: 'Portion Punks — Potions Fuel a Brighter Tomorrow',
    description: '3333 unique Potion Punks forged for digital collectors.',
    url: 'https://portionpunks.com',
    siteName: 'Portion Punks',
    images: [
      {
        url: '/cover.png',
        width: 1200,
        height: 630,
        alt: 'Portion Punks Reference Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portion Punks',
    description: '3333 unique Potion Punks forged for digital collectors.',
    images: ['/cover.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-charcoal-950 text-smoke-100 min-h-screen flex flex-col font-sans selection:bg-gold-400 selection:text-charcoal-950 antialiased">
        {children}
      </body>
    </html>
  );
}
