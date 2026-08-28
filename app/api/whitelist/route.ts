import { NextRequest, NextResponse } from 'next/server';
import { verifyAndConsumeCaptcha } from '@/lib/captcha';
import { getClientIp } from '@/lib/security';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    let isLive = true;
    let tasks = [
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
    ];

    try {
      const liveSetting = await db.siteSetting.findUnique({
        where: { key: 'whitelist_live' },
      });
      if (liveSetting) isLive = liveSetting.value === 'true';

      const tasksSetting = await db.siteSetting.findUnique({
        where: { key: 'whitelist_tasks' },
      });
      if (tasksSetting) tasks = JSON.parse(tasksSetting.value);
    } catch (e) {}

    return NextResponse.json({ isLive, tasks });
  } catch (err) {
    return NextResponse.json({
      isLive: true,
      tasks: [
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
      ],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, email, twitterHandle, taskProofs, captchaId, captchaAnswer } = body;

    // Check if Whitelist is live
    try {
      const liveSetting = await db.siteSetting.findUnique({
        where: { key: 'whitelist_live' },
      });
      if (liveSetting && liveSetting.value === 'false') {
        return NextResponse.json(
          { error: 'Whitelist registration is currently PAUSED by administration.' },
          { status: 400 }
        );
      }
    } catch (e) {}

    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim().length < 10) {
      return NextResponse.json({ error: 'Please provide a valid Web3 wallet address.' }, { status: 400 });
    }

    if (!captchaId || !captchaAnswer) {
      return NextResponse.json({ error: 'CAPTCHA verification is required.' }, { status: 400 });
    }

    // Server-side atomic validation of 45-second CAPTCHA
    const verification = await verifyAndConsumeCaptcha(captchaId, captchaAnswer);

    if (!verification.success) {
      return NextResponse.json(
        {
          error: verification.message || 'CAPTCHA verification failed.',
          captchaFailed: true,
        },
        { status: 400 }
      );
    }

    const ipAddress = getClientIp(req);
    const cleanWallet = walletAddress.trim().toLowerCase();

    // Store task proofs as formatted handle/string
    const proofSummary = taskProofs ? JSON.stringify(taskProofs) : twitterHandle || null;

    // Check if wallet already submitted
    try {
      const existing = await db.whitelistSubmission.findUnique({
        where: { walletAddress: cleanWallet },
      });

      if (existing) {
        return NextResponse.json(
          { message: 'Wallet address is already registered on the Portion Punks Whitelist!', success: true },
          { status: 200 }
        );
      }

      await db.whitelistSubmission.create({
        data: {
          walletAddress: cleanWallet,
          email: email ? String(email).trim() : null,
          twitterHandle: proofSummary || (twitterHandle ? String(twitterHandle).trim() : null),
          ipAddress,
        },
      });
    } catch (dbErr) {
      console.warn('DB submission fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'CONGRATULATIONS! You are officially Whitelisted for the Portion Punks mint!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Submission failed. Please try again.' },
      { status: 500 }
    );
  }
}
