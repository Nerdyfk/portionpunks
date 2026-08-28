'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Lock, ExternalLink, PauseCircle } from 'lucide-react';
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

export default function WhitelistForm({ isOpen = true, onClose }: WhitelistFormProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  
  const [isLive, setIsLive] = useState(true);
  const [tasks, setTasks] = useState<WhitelistTask[]>([
    {
      id: 'task_1',
      title: 'Follow @potionpunks on X',
      url: 'https://x.com/potionpunks',
      proofPlaceholder: 'Enter your @username',
      required: true,
    },
    {
      id: 'task_2',
      title: 'Like & Retweet Pinned Post',
      url: 'https://x.com/potionpunks',
      proofPlaceholder: 'Enter Retweet proof URL',
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
        if (data.tasks && data.tasks.length > 0) setTasks(data.tasks);
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
      setErrorMessage('Please enter a valid wallet address (e.g. 0x...)');
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
          twitterHandle,
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
      <div className="bg-charcoal-900 border-2 border-smoke-700 w-full max-w-lg p-6 relative shadow-2xl rounded-sm text-white max-h-[95vh] overflow-y-auto">
        
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
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-neon-green/10 border border-neon-green/40 text-neon-green rounded-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-sm text-white">PORTION PUNKS WHITELIST</h3>
            <p className="text-xs text-smoke-400 font-sans">Reserve your guaranteed genesis mint slot</p>
          </div>
        </div>

        {!isLive ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <PauseCircle className="w-8 h-8" />
            </div>
            <h4 className="font-pixel-heading text-base text-white">WHITELIST PAUSED</h4>
            <p className="text-xs text-smoke-300 font-sans leading-relaxed max-w-md mx-auto">
              Whitelist registrations are currently PAUSED by administration. Check back soon or follow @potionpunks on X for updates.
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
                className="w-full py-3 bg-neon-green text-charcoal-950 font-pixel-display text-xs font-bold border-2 border-black shadow-pixel-black rounded-sm"
              >
                RETURN TO WEBSITE
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            
            {/* Wallet Address */}
            <div>
              <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
                WALLET ADDRESS <span className="text-neon-green">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full bg-charcoal-850 border border-smoke-700 text-white placeholder-smoke-500 text-xs px-3.5 py-2.5 focus:outline-none focus:border-neon-green font-mono rounded-sm"
              />
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-pixel-display text-smoke-300 mb-1.5">
                EMAIL ADDRESS <span className="text-smoke-500">(OPTIONAL)</span>
              </label>
              <input
                type="email"
                placeholder="collector@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal-850 border border-smoke-700 text-white placeholder-smoke-500 text-xs px-3.5 py-2.5 focus:outline-none focus:border-neon-green font-sans rounded-sm"
              />
            </div>

            {/* Dynamic Admin Whitelist Tasks & User Proof Submission Boxes */}
            {tasks.length > 0 && (
              <div className="pt-2 space-y-3 border-t border-smoke-850">
                <div className="text-xs font-pixel-display text-neon-green flex items-center justify-between">
                  <span>REQUIRED WHITELIST TASKS</span>
                  <span className="text-[10px] text-smoke-400">Complete tasks & submit proofs</span>
                </div>

                {tasks.map((task) => (
                  <div key={task.id} className="bg-charcoal-950 border border-smoke-800 p-3 rounded-sm space-y-2">
                    <div className="flex justify-between items-center text-xs font-pixel-display">
                      <span className="text-white">{task.title}</span>
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-neon-green hover:underline flex items-center space-x-1"
                      >
                        <span>GO TO TASK</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div>
                      <input
                        type="text"
                        required={task.required}
                        placeholder={task.proofPlaceholder || 'Enter task proof or handle'}
                        value={taskProofs[task.id] || ''}
                        onChange={(e) => handleProofChange(task.id, e.target.value)}
                        className="w-full bg-charcoal-850 border border-smoke-700 text-white placeholder-smoke-500 text-xs px-3 py-2 focus:outline-none focus:border-neon-green font-sans rounded-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

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
            <div className="pt-3">
              <button
                type="submit"
                disabled={!captchaValid || submitting}
                className={`w-full py-3.5 font-pixel-display text-xs font-bold border-2 border-black rounded-sm shadow-pixel-black transition-all flex items-center justify-center space-x-2 ${
                  captchaValid && !submitting
                    ? 'bg-neon-green text-charcoal-950 hover:bg-neon-darkgreen cursor-pointer'
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
