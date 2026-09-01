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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-xl">
      <div className="glass-panel w-full max-w-xl p-7 relative text-smoke-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-smoke-400 hover:text-gold-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="mb-6 border-b border-gold-400/15 pb-4">
          <h2 className="font-serif-display text-3xl text-smoke-100 mb-2">
            Whitelist <span className="italic text-gold-400">quests</span>
          </h2>
          <p className="text-sm text-smoke-400 font-light">
            Complete the quests and enter proof to reserve your placement.
          </p>
        </div>

        {!isLive ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <PauseCircle className="w-8 h-8" />
            </div>
            <h4 className="font-serif-display text-2xl text-smoke-100">Whitelist paused</h4>
            <p className="text-xs text-smoke-300 font-sans leading-relaxed max-w-md mx-auto">
              Whitelist registrations are currently PAUSED by administration. Check back soon or follow @portionpunks on X for updates.
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-3 btn-ghost rounded-full text-[11px]"
              >
                CLOSE WINDOW
              </button>
            )}
          </div>
        ) : successMessage ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-gold-400/15 border border-gold-400 text-gold-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif-display text-2xl text-smoke-100">Whitelist confirmed</h4>
            <p className="text-xs text-smoke-300 font-sans leading-relaxed max-w-md mx-auto">
              {successMessage}
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-3.5 btn-gold rounded-full text-[11px]"
              >
                RETURN TO WEBSITE
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="text-[11px] tracking-[0.22em] uppercase text-gold-400 mb-1">
              Whitelist quests
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
                    className="glass-panel p-4 space-y-3"
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
                          className="text-sm text-smoke-100 hover:text-gold-400 underline underline-offset-4 cursor-pointer uppercase transition-colors tracking-wide"
                        >
                          {task.title}
                        </a>
                      </div>

                      {task.required ? (
                        <span className="border border-gold-400/40 text-gold-400 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ml-2">
                          Required
                        </span>
                      ) : (
                        <span className="border border-smoke-700 text-smoke-400 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ml-2">
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
                        className={`w-full bg-charcoal-950/70 border text-smoke-100 text-sm px-3.5 py-2.5 focus:outline-none font-mono rounded-sm ${
                          hasError
                            ? 'border-red-500/80 focus:border-red-400 bg-red-950/20'
                            : 'border-gold-400/20 focus:border-gold-400'
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
              <div className="glass-panel p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 border border-gold-400/20 rounded-full flex items-center justify-center text-gold-400 shrink-0">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-smoke-100 uppercase tracking-wide">
                      Submit EVM wallet address
                    </span>
                  </div>

                  <span className="border border-gold-400/40 text-gold-400 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    Required
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="0x1234567890abcdef1234567890abcdef12345678"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full bg-charcoal-950/70 border border-gold-400/20 focus:border-gold-400 text-smoke-100 placeholder-smoke-500 text-sm px-3.5 py-2.5 focus:outline-none font-mono rounded-sm"
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
                className={`w-full py-3.5 text-[11px] tracking-[0.16em] uppercase rounded-full transition-all flex items-center justify-center space-x-2 ${
                  captchaValid && !submitting
                    ? 'btn-gold cursor-pointer'
                    : 'bg-charcoal-800 text-smoke-500 border border-smoke-700 cursor-not-allowed opacity-60'
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
