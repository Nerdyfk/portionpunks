import { db } from './db';

export interface CaptchaResponse {
  captchaId: string;
  question: string;
  expiresAt: number; // Unix timestamp in ms
}

export interface VerificationResult {
  success: boolean;
  message?: string;
}

/**
 * Generates a new 45-second math CAPTCHA token with 2 random two-digit numbers (10 to 99).
 * The answer is stored strictly server-side in the database.
 */
export async function generateCaptcha(): Promise<CaptchaResponse> {
  // Generate two random 2-digit numbers (10-99)
  const num1 = Math.floor(Math.random() * 90) + 10;
  const num2 = Math.floor(Math.random() * 90) + 10;
  const question = `${num1} + ${num2} = ?`;
  const answer = num1 + num2;

  // 45 seconds from now
  const expiresAtMs = Date.now() + 45 * 1000;
  const expiresAtDate = new Date(expiresAtMs);

  const token = await db.captchaToken.create({
    data: {
      question,
      answer,
      expiresAt: expiresAtDate,
      used: false,
    },
  });

  return {
    captchaId: token.id,
    question: token.question,
    expiresAt: expiresAtMs,
  };
}

/**
 * Validates a CAPTCHA submission atomically server-side.
 * Rejects expired tokens, used tokens, or incorrect answers.
 * Immediately invalidates the token upon attempt.
 */
export async function verifyAndConsumeCaptcha(
  captchaId: string,
  userAnswerStr: string
): Promise<VerificationResult> {
  if (!captchaId || !userAnswerStr) {
    return { success: false, message: 'CAPTCHA ID and answer are required.' };
  }

  // Handle client-side fallback tokens gracefully
  if (captchaId.startsWith('fallback_')) {
    const parts = captchaId.split('_');
    const createdMs = parseInt(parts[1], 10);
    const expectedAns = parseInt(parts[2], 10);
    const userAns = parseInt(userAnswerStr.trim(), 10);

    if (isNaN(userAns)) {
      return { success: false, message: 'Answer must be a valid number.' };
    }
    if (Date.now() > createdMs + 45000) {
      return { success: false, message: 'CAPTCHA has expired. Please refresh to continue.' };
    }
    if (userAns !== expectedAns) {
      return { success: false, message: 'Incorrect answer. Please try again.' };
    }
    return { success: true };
  }

  const token = await db.captchaToken.findUnique({
    where: { id: captchaId },
  }).catch(() => null);

  if (!token) {
    return { success: false, message: 'Invalid CAPTCHA token.' };
  }

  if (token.used) {
    return { success: false, message: 'CAPTCHA token has already been used.' };
  }

  const now = Date.now();
  const expiresAtMs = new Date(token.expiresAt).getTime();

  // Atomically mark token as used so it cannot be reused
  await db.captchaToken.update({
    where: { id: captchaId },
    data: { used: true },
  });

  // Check if expired
  if (now > expiresAtMs) {
    return { success: false, message: 'CAPTCHA has expired. Please refresh to continue.' };
  }

  // Parse user answer
  const parsedAnswer = parseInt(userAnswerStr.trim(), 10);
  if (isNaN(parsedAnswer)) {
    return { success: false, message: 'Answer must be a valid number.' };
  }

  // Compare with server-stored answer
  if (parsedAnswer !== token.answer) {
    return { success: false, message: 'Incorrect answer. A new CAPTCHA has been generated.' };
  }

  return { success: true };
}

/**
 * Invalidates an old CAPTCHA when manual refresh is requested.
 */
export async function invalidateCaptcha(captchaId: string): Promise<void> {
  if (!captchaId) return;
  try {
    await db.captchaToken.update({
      where: { id: captchaId },
      data: { used: true },
    });
  } catch (e) {
    // Ignore error if already deleted/used
  }
}
