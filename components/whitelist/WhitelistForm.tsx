'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Lock, ExternalLink, PauseCircle, Wallet } from 'lucide-react';
import MathCaptcha from '../captcha/MathCaptcha';

interface WhitelistTask {
  id: string;
  title: string;
  url: string;
  proofPlaceholder: string;
  required: boolean;
}

interface WhitelistFormProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// X / Twitter Custom SVG Icon
function XTwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function WhitelistForm({ isOpen = true, onClose }: WhitelistFormProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  
  const [isLive, setIsLive] = useState(true);
  const [tasks, setTasks] = useState<WhitelistTask[]>([
    {
      id: 'task_1',
      title: 'FOLLOW @PORTIONPUNKS AND @POTIONPUNKS',
      url: 'https://x.com/potionpunks',
      proofPlaceholder: '@yourusername (or profile link)',
      required: true,
    },
    {
      id: 'task_2',
      title: 'LIKE, REPOST & COMMENT ON PINNED POST',
      url: 'https://x.com/potionpunks',
      proofPlaceholder: 'https://x.com/.../status/... (comment link)',
      required: true,
    },
  ]);
  const [taskProofs, setTaskProofs] = useState<Record<string, string>>({});

  const [captchaId, setCaptchaId] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/whitelist')
      .then((res) => res.json())
      .then((data) => {
        if (data.isLive !== undefined) setIsLive(data.isLive);
        if (data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        }
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const handleProofChange = (taskId: string, val: string) => {
    setTaskProofs((prev) => ({ ...prev, [taskId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLive) {
      setErrorMessage('Whitelist registrations are currently paused by administration.');
      return;
    }

    if (!walletAddress || walletAddress.trim().length < 10) {
      setErrorMessage('Please enter a valid EVM wallet address (0x...)');
      return;
    }

    if (!captchaValid || !captchaId || !captchaAnswer) {
      setErrorMessage('Please complete the security CAPTCHA correctly.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          email,
          taskProofs,
          captchaId,
          captchaAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Submission failed. Please check your CAPTCHA.');
      } else {
        setSuccessMessage(data.message || 'You are registered for the Whitelist!');
      }
    } catch (err: any) {
      setErrorMessage('Network error during submission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090b10]/90 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-[#12141e] border border-[#232738] w-full max-w-xl p-6 relative shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-xl text-white max-h-[92vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="mb-6 border-b border-[#1f2334] pb-4">
          <h2 className="font-pixel-heading text-base sm:text-lg text-[#f3c246] tracking-wide mb-1 uppercase">
            PORTION PUNKS WHITELIST QUESTS
          </h2>
          <p className="text-xs text-[#8c94ad] font-sans">
            Complete the quests and enter proof details to reserve your placement.
          </p>
        </div>

        {!isLive ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <PauseCircle className="w-8 h-8" />
            </div>
            <h4 className="font-pixel-heading text-base text-white">WHITELIST PAUSED</h4>
            <p className="text-xs text-gray-300 font-sans leading-relaxed max-w-md mx-auto">
              Whitelist registrations are currently PAUSED by administration. Check back soon or follow @portionpunks on X for updates.
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#1a1d2b] hover:bg-[#25293c] text-white font-pixel-display text-xs border border-[#2b3044] rounded-lg"
              >
                CLOSE WINDOW
              </button>
            )}
          </div>
        ) : successMessage ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-pixel-heading text-base text-[#f3c246]">WHITELIST CONFIRMED</h4>
            <p className="text-xs text-gray-300 font-sans leading-relaxed max-w-md mx-auto">
              {successMessage}
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#f3c246] text-black font-pixel-display text-xs font-bold rounded-lg hover:bg-[#e2b135] transition-colors"
              >
                RETURN TO WEBSITE
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="text-xs font-pixel-display text-[#f3c246] tracking-wider uppercase mb-1">
              WHITELIST QUESTS
            </div>

            {/* Dynamic Tasks / Quests */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="bg-[#181a26] border border-[#262a3c] p-4 rounded-xl space-y-3 hover:border-[#383e58] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-[#11131c] border border-[#2b3044] rounded-lg flex items-center justify-center text-gray-300">
                        <XTwitterIcon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-pixel-display text-xs text-[#f3c246] uppercase">
                            {task.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {task.url && (
                        <a
                          href={task.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-gray-400 hover:text-[#f3c246] transition-colors p-1"
                          title="Open Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {task.required && (
                        <span className="bg-[#332811] border border-[#947629] text-[#f59e0b] text-[9px] font-pixel-display px-2 py-0.5 rounded-md uppercase tracking-wider">
                          REQUIRED
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      required={task.required}
                      placeholder={task.proofPlaceholder || '@yourusername (or profile link)'}
                      value={taskProofs[task.id] || ''}
                      onChange={(e) => handleProofChange(task.id, e.target.value)}
                      className="w-full bg-[#11131c] border border-[#cba23e]/50 focus:border-[#f3c246] text-white placeholder-[#5a6078] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f3c246]/40 transition-all font-mono shadow-inner"
                    />
                  </div>
                </div>
              ))}

              {/* Wallet Address Quest Card */}
              <div className="bg-[#181a26] border border-[#262a3c] p-4 rounded-xl space-y-3 hover:border-[#383e58] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-[#11131c] border border-[#2b3044] rounded-lg flex items-center justify-center text-gray-300">
                      <Wallet className="w-4 h-4 text-[#f3c246]" />
                    </div>
                    <span className="font-pixel-display text-xs text-[#f3c246] uppercase">
                      SUBMIT EVM WALLET ADDRESS
                    </span>
                  </div>

                  <span className="bg-[#332811] border border-[#947629] text-[#f59e0b] text-[9px] font-pixel-display px-2 py-0.5 rounded-md uppercase tracking-wider">
                    REQUIRED
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="0x1234567890abcdef1234567890abcdef12345678"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full bg-[#11131c] border border-[#cba23e]/50 focus:border-[#f3c246] text-white placeholder-[#5a6078] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f3c246]/40 transition-all font-mono shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Integrated 45-Second Math CAPTCHA Component */}
            <div className="pt-2">
              <MathCaptcha
                onCaptchaReady={(id, ans) => {
                  setCaptchaId(id);
                  setCaptchaAnswer(ans);
                }}
                onStateChange={(isValid) => setCaptchaValid(isValid)}
                errorMessage={errorMessage}
                onClearError={() => setErrorMessage(null)}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!captchaValid || submitting}
                className={`w-full py-3.5 font-pixel-display text-xs font-bold uppercase rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg ${
                  captchaValid && !submitting
                    ? 'bg-[#f3c246] text-black hover:bg-[#e2b135] cursor-pointer shadow-[0_0_15px_rgba(243,194,70,0.3)]'
                    : 'bg-[#252838] text-gray-500 border border-[#32364a] cursor-not-allowed opacity-60'
                }`}
              >
                {submitting ? (
                  <span className="animate-pulse">VERIFYING & SUBMITTING...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>SUBMIT WHITELIST ENTRY</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
