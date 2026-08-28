import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getRarityBadgeColor(category: string): string {
  switch (category.toUpperCase()) {
    case 'LEGENDARY':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
    case 'EPIC':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]';
    case 'RARE':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
    default:
      return 'bg-neon-green/10 text-neon-green border-neon-green/40 shadow-[0_0_10px_rgba(0,255,102,0.2)]';
  }
}
