'use client';

import React, { useState } from 'react';
import { X, Wallet, CheckCircle, ExternalLink } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
  connectedAddress: string | null;
}

export default function WalletModal({ isOpen, onClose, onConnect, connectedAddress }: WalletModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);

  if (!isOpen) return null;

  const mockWallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊', desc: 'Connect to your MetaMask Wallet' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', desc: 'Connect to Coinbase Wallet' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🌐', desc: 'Scan with WalletConnect' },
    { id: 'robinhood', name: 'Robinhood Wallet', icon: '🏹', desc: 'Robinhood Crypto Official' },
  ];

  const handleSelectWallet = (walletId: string) => {
    setConnecting(walletId);
    setTimeout(() => {
      // Mock generated wallet address
      const randomAddr = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      onConnect(randomAddr);
      setConnecting(null);
      onClose();
    }, 1000);
  };

  const handleDisconnect = () => {
    onConnect('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-charcoal-900 border-2 border-smoke-700 w-full max-w-md p-6 relative shadow-2xl rounded-sm">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-smoke-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-neon-green/10 border border-neon-green/30 text-neon-green rounded-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-sm text-white">CONNECT WALLET</h3>
            <p className="text-xs text-smoke-400 font-sans">Robinhood Crypto & Web3 Ecosystem</p>
          </div>
        </div>

        {connectedAddress ? (
          <div className="space-y-4">
            <div className="p-4 bg-charcoal-850 border border-neon-green/40 rounded-sm">
              <div className="flex items-center space-x-2 text-neon-green text-xs font-pixel-display mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>WALLET CONNECTED</span>
              </div>
              <p className="font-mono text-sm text-white break-all">{connectedAddress}</p>
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full py-2.5 bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20 font-pixel-display text-xs transition-colors rounded-sm"
            >
              DISCONNECT WALLET
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {mockWallets.map((w) => (
              <button
                key={w.id}
                onClick={() => handleSelectWallet(w.id)}
                disabled={connecting !== null}
                className="w-full p-3.5 bg-charcoal-850 hover:bg-charcoal-800 border border-smoke-700 hover:border-neon-green/60 text-left transition-all flex items-center justify-between group rounded-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{w.icon}</span>
                  <div>
                    <div className="font-pixel-display text-xs text-white group-hover:text-neon-green transition-colors">
                      {w.name}
                    </div>
                    <div className="text-[11px] text-smoke-400 font-sans">{w.desc}</div>
                  </div>
                </div>
                {connecting === w.id ? (
                  <span className="text-xs text-neon-green animate-pulse font-pixel-display">CONNECTING...</span>
                ) : (
                  <ExternalLink className="w-4 h-4 text-smoke-400 group-hover:text-neon-green transition-colors" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
