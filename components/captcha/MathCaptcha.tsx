'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

interface MathCaptchaProps {
  onCaptchaReady: (captchaId: string, captchaAnswer: string) => void;
  onStateChange: (isValid: boolean) => void;
  errorMessage?: string | null;
  onClearError?: () => void;
}

interface CaptchaData {
  captchaId: string;
  question: string;
  expiresAt: number; // Unix timestamp ms
}

export default function MathCaptcha({
  onCaptchaReady,
  onStateChange,
  errorMessage,
  onClearError,
}: MathCaptchaProps) {
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear running countdown timer
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Generate fallback math question client-side if API fails
  const generateClientFallbackCaptcha = () => {
    const num1 = Math.floor(Math.random() * 85) + 12;
    const num2 = Math.floor(Math.random() * 85) + 12;
    const question = `${num1} + ${num2} = ?`;
    const expiresAt = Date.now() + 45 * 1000;
    const captchaId = `fallback_${Date.now()}_${num1 + num2}`;
    
    const fallbackData = { captchaId, question, expiresAt };
    setCaptchaData(fallbackData);
    startCountdown(expiresAt);
  };

  // Fetch new CAPTCHA via API with automatic client fallback
  const fetchCaptcha = async (oldId?: string) => {
    setLoading(true);
    clearTimer();
    setIsExpired(false);
    setUserAnswer('');
    onCaptchaReady('', '');
    onStateChange(false);
    if (onClearError) onClearError();

    try {
      const url = oldId ? `/api/captcha?refreshId=${oldId}` : '/api/captcha';
      const res = await fetch(url);
      if (res.ok) {
        const data: CaptchaData = await res.json();
        if (data && data.question) {
          setCaptchaData(data);
          startCountdown(data.expiresAt);
        } else {
          generateClientFallbackCaptcha();
        }
      } else {
        generateClientFallbackCaptcha();
      }
    } catch (err) {
      console.warn('API CAPTCHA load warning, using fallback math prompt:', err);
      generateClientFallbackCaptcha();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Start exact 45-second countdown timer
  const startCountdown = (expiresAtMs: number) => {
    clearTimer();

    const updateTimer = () => {
      const remainingMs = expiresAtMs - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      setSecondsRemaining(remainingSec);

      if (remainingSec <= 0) {
        clearTimer();
        setIsExpired(true);
        onStateChange(false);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);
  };

  // Initial load
  useEffect(() => {
    fetchCaptcha();
    return () => clearTimer();
  }, []);

  // Whenever user answer changes
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserAnswer(val);

    if (captchaData && !isExpired && val.trim().length > 0) {
      onCaptchaReady(captchaData.captchaId, val.trim());
      onStateChange(true);
    } else {
      onStateChange(false);
    }
  };

  // Manual refresh click handler
  const handleManualRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    fetchCaptcha(captchaData?.captchaId);
  };

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between mb-3 border-b border-gold-400/15 pb-2">
        <div className="flex items-center space-x-2 text-[11px] tracking-[0.18em] uppercase text-smoke-200">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <span>Security check</span>
        </div>

        {/* Timer display */}
        {!loading && captchaData && (
          <div
            className={`flex items-center space-x-1 text-[11px] px-2 py-0.5 border rounded-full ${
              isExpired
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : secondsRemaining <= 10
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                : 'bg-gold-400/10 text-gold-400 border-gold-400/30'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{isExpired ? 'EXPIRED' : `Expires in: ${secondsRemaining}s`}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-4 text-center text-xs font-pixel-display text-smoke-400 animate-pulse">
          GENERATING SECURE CAPTCHA...
        </div>
      ) : (
        <div className="space-y-3">
          {/* Question Display */}
          <div className="flex items-center justify-between bg-charcoal-950 p-3 border border-smoke-800 rounded-sm">
            <div className="font-serif-display text-xl text-gold-400 tracking-wider">
              {captchaData?.question || '28 + 43 = ?'}
            </div>

            {/* Manual Refresh Button */}
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="text-[10px] tracking-widest uppercase px-2.5 py-1 btn-ghost rounded-full flex items-center space-x-1.5"
              title="Refresh CAPTCHA prompt"
            >
              <RotateCw className={`w-3 h-3 text-neon-green ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh CAPTCHA</span>
            </button>
          </div>

          {/* Input Answer Field */}
          <div>
            <input
              type="number"
              placeholder="Enter numerical answer"
              value={userAnswer}
              onChange={handleAnswerChange}
              disabled={isExpired}
              className={`w-full bg-charcoal-950/70 border text-smoke-100 text-sm px-3.5 py-2.5 focus:outline-none font-mono rounded-sm ${
                isExpired
                  ? 'border-red-500/50 bg-red-950/20 cursor-not-allowed text-smoke-500'
                  : 'border-gold-400/20 focus:border-gold-400'
              }`}
            />
          </div>

          {/* Error / Warning Alert */}
          {(errorMessage || isExpired) && (
            <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2.5 rounded-sm animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {isExpired
                  ? 'CAPTCHA expired after 45 seconds. Click Refresh CAPTCHA to try again.'
                  : errorMessage}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
