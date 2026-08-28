import { NextRequest, NextResponse } from 'next/server';
import { generateCaptcha, invalidateCaptcha } from '@/lib/captcha';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const oldCaptchaId = searchParams.get('refreshId');

    if (oldCaptchaId) {
      await invalidateCaptcha(oldCaptchaId);
    }

    const captcha = await generateCaptcha();
    return NextResponse.json(captcha, { status: 200 });
  } catch (error) {
    console.error('Error generating CAPTCHA:', error);
    return NextResponse.json({ error: 'Failed to generate CAPTCHA token' }, { status: 500 });
  }
}
