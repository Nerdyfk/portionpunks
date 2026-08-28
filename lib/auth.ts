import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'portion_punks_super_secret_jwt_key_2026_change_in_production'
);

export const COOKIE_NAME = 'portion_punks_admin_session';

export interface AdminPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function createSession(payload: AdminPayload): Promise<string> {
  const token = await createSessionToken(payload);
  try {
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  } catch (err) {
    // Next.js route handler cookie fallback handled in response
  }
  return token;
}

export async function removeSession() {
  try {
    cookies().delete(COOKIE_NAME);
  } catch (err) {}
}

export async function getSession(req?: NextRequest): Promise<AdminPayload | null> {
  try {
    let token: string | undefined;

    if (req) {
      token = req.cookies.get(COOKIE_NAME)?.value;
    } else {
      try {
        token = cookies().get(COOKIE_NAME)?.value;
      } catch (e) {}
    }

    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminPayload;
  } catch (error) {
    return null;
  }
}
