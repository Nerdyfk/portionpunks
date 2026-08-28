'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Lock, PauseCircle, Wallet, AlertTriangle } from 'lucide-react';
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
      title: 'FOLLOW @POTIONPUNKS ON X',
      url: 'https://x.com/potionpunks',
      proofPlaceholder: 'Enter your @username',
      required: true,
    },
    {
      id: 'task_2',
      title: 'LIKE, RETWEET & COMMENT ON PINNED POST',
      url: 'https://x.com/potionpunks',
      proofPlaceholder: 'Enter your comment link',
      required: true,
    },
  ]);
  const [taskProofs, setTaskProofs] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({});

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

  const handleProofChange = (taskId: string, val: string, isFollowTask: boolean) => {
    setTaskProofs((prev) => ({ ...prev, [taskId]: val }));

    // Instant validation check
    const trimmed = val.trim();
    if (trimmed.length > 0) {
      if (isFollowTask) {
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.includes('x.com/') || trimmed.includes('twitter.com/')) {
          setValidationErrors((prev) => ({
            ...prev,
            [taskId]: 'Follow task requires a Twitter/X username (e.g. @username), not a link.',
          }));
        } else {
          setValidationErrors((prev) => ({ ...prev, [taskId]: null }));
        }
      } else {
        // Comment / Link task validation
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.includes('x.com') && !trimmed.includes('twitter.com')) {
          setValidationErrors((prev) => ({
            ...prev,
            [taskId]: 'Like, Retweet & Comment task requires a valid link (e.g. https://x.com/...).',
          }));
        } else {
          setValidationErrors((prev) => ({ ...prev, [taskId]: null }));
        }
      }
    } else {
      setValidationErrors((prev) => ({ ...prev, [taskId]: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLive) {
      setErrorMessage('Whitelist registrations are currently paused by administration.');
      return;
    }

    // Validate inputs
    let hasValidationError = false;
    tasks.forEach((task) => {
      const isFollow = task.id === 'task_1' || task.title.toUpperCase().includes('FOLLOW');
      const proofVal = (taskProofs[task.id] || '').trim();

      if (task.required && !proofVal) {
        hasValidationError = true;
        setValidationErrors((prev) => ({
          ...prev,
          [task.id]: 'This quest proof is required.',
        }));
      } else if (proofVal) {
        if (isFollow) {
          if (proofVal.startsWith('http://') || proofVal.startsWith('https://') || proofVal.includes('x.com/') || proofVal.includes('twitter.com/')) {
            hasValidationError = true;
            setValidationErrors((prev) => ({
              ...prev,
              [task.id]: 'Follow task requires a Twitter/X username (e.g. @username), not a link.',
            }));
          }
        } else {
          if (!proofVal.startsWith('http://') && !proofVal.startsWith('https://') && !proofVal.includes('x.com') && !proofVal.includes('twitter.com')) {
            hasValidationError = true;
            setValidationErrors((prev) => ({
              ...prev,
              [task.id]: 'Like, Retweet & Comment task requires a valid link (e.g. https://x.com/...).',
            }));
          }
        }
      }
    });

    if (hasValidationError) {
      setErrorMessage('Please fix the validation errors on quest proofs before submitting.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-charcoal-900 border-2 border-smoke-800 w-full max-w-xl p-6 relative shadow-2xl rounded-sm text-white max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-smoke-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="mb-5 border-b border-smoke-800 pb-3">
          <h2 className="font-pixel-heading text-sm sm:text-base text-white tracking-wide mb-1 uppercase">
            PORTION PUNKS WHITELIST QUESTS
          </h2>
          <p className="text-xs text-smoke-400 font-sans">
            Complete the quests and enter proof details to reserve your placement.
          </p>
        </div>

        {!isLive ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <PauseCircle className="w-8 h-8" />
            </div>
            <h4 className="font-pixel-heading text-base text-white">WHITELIST PAUSED</h4>
            <p className="text-xs text-smoke-300 font-sans leading-relaxed max-w-md mx-auto">
              Whitelist registrations are currently PAUSED by administration. Check back soon or follow @portionpunks on X for updates.
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-3 bg-charcoal-800 hover:bg-charcoal-700 text-white font-pixel-display text-xs border border-smoke-700 rounded-sm"
              >
                CLOSE WINDOW
              </button>
            )}
          </div>
        ) : successMessage ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-neon-green/20 border-2 border-neon-green text-neon-green rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,255,102,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-pixel-heading text-base text-white">WHITELIST CONFIRMED</h4>
            <p className="text-xs text-smoke-300 font-sans leading-relaxed max-w-md mx-auto">
              {successMessage}
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#f3c246] text-charcoal-950 font-pixel-display text-xs font-bold border-2 border-black rounded-sm shadow-pixel-black hover:bg-[#e2b135] transition-colors"
              >
                RETURN TO WEBSITE
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="text-xs font-pixel-display text-white tracking-wider uppercase mb-1">
              WHITELIST QUESTS
            </div>

            {/* Dynamic Tasks / Quests */}
            <div className="space-y-3.5">
              {tasks.map((task) => {
                const isFollowTask = task.id === 'task_1' || task.title.toUpperCase().includes('FOLLOW');
                const placeholderText = task.proofPlaceholder || (isFollowTask ? 'Enter your @username' : 'Enter your comment link');
                const hasError = validationErrors[task.id];

                return (
                  <div 
                    key={task.id} 
                    className="bg-charcoal-900 border-2 border-smoke-800 p-4 rounded-sm shadow-md font-sans space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-charcoal-950 border border-smoke-800 rounded-sm flex items-center justify-center text-smoke-300 shrink-0">
                          <XTwitterIcon className="w-4 h-4" />
                        </div>
                        
                        {/* Linked Title text in White with Underline */}
                        <a
                          href={task.url || 'https://x.com/potionpunks'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-pixel-display text-xs text-white hover:text-neon-green underline underline-offset-4 cursor-pointer uppercase transition-colors"
                        >
                          {task.title}
                        </a>
                      </div>

                      {task.required ? (
                        <span className="bg-[#332811] border border-[#947629] text-[#f59e0b] text-[9px] font-pixel-display px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0 ml-2">
                          REQUIRED
                        </span>
                      ) : (
                        <span className="bg-charcoal-850 border border-smoke-700 text-smoke-400 text-[9px] font-pixel-display px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0 ml-2">
                          OPTIONAL
                        </span>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        required={task.required}
                        placeholder={placeholderText}
                        value={taskProofs[task.id] || ''}
                        onChange={(e) => handleProofChange(task.id, e.target.value, isFollowTask)}
                        className={`w-full bg-charcoal-850 border text-white text-xs px-3.5 py-2.5 focus:outline-none font-mono rounded-sm ${
                          hasError
                            ? 'border-red-500/80 focus:border-red-400 bg-red-950/20'
                            : 'border-smoke-700 focus:border-neon-green'
                        }`}
                      />
                      {hasError && (
                        <div className="flex items-center space-x-1.5 text-[11px] text-red-400 mt-1.5 font-sans">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{hasError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Wallet Address Quest Card */}
              <div className="bg-charcoal-900 border-2 border-smoke-800 p-4 rounded-sm shadow-md font-sans space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-charcoal-950 border border-smoke-800 rounded-sm flex items-center justify-center text-smoke-300 shrink-0">
                      <Wallet className="w-4 h-4 text-neon-green" />
                    </div>
                    <span className="font-pixel-display text-xs text-white uppercase">
                      SUBMIT EVM WALLET ADDRESS
                    </span>
                  </div>

                  <span className="bg-[#332811] border border-[#947629] text-[#f59e0b] text-[9px] font-pixel-display px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0">
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
                    className="w-full bg-charcoal-850 border border-smoke-700 focus:border-neon-green text-white placeholder-smoke-500 text-xs px-3.5 py-2.5 focus:outline-none font-mono rounded-sm"
                  />
                </div>
              </div>
            </div>

            {/* Integrated 45-Second Math CAPTCHA Component */}
            <div className="pt-1">
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
                className={`w-full py-3.5 font-pixel-display text-xs font-bold uppercase rounded-sm border-2 border-black shadow-pixel-black transition-all flex items-center justify-center space-x-2 ${
                  captchaValid && !submitting
                    ? 'bg-[#f3c246] text-charcoal-950 hover:bg-[#e2b135] cursor-pointer'
                    : 'bg-smoke-800 text-smoke-500 border-smoke-700 cursor-not-allowed opacity-60'
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
