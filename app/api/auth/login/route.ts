import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword, createSessionToken, COOKIE_NAME } from '@/lib/auth';
import { getClientIp, logActivity } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@portionpunks.com').trim().toLowerCase();
    const envAdminPass = process.env.ADMIN_PASSWORD || 'PortionPunks2026!';

    // 1. Attempt to find user in DB
    let user: any = null;

    try {
      if (db?.adminUser?.findUnique) {
        user = await db.adminUser.findUnique({
          where: { email: cleanEmail },
        });
      }
    } catch (dbErr) {
      console.warn('DB lookup during admin login:', dbErr);
    }

    // 2. If user not in DB, allow login if credentials match env variables (and auto-seed DB)
    if (!user) {
      if (cleanEmail === envAdminEmail && password === envAdminPass) {
        try {
          if (db?.adminUser?.create) {
            const hashedPassword = await hashPassword(envAdminPass);
            user = await db.adminUser.create({
              data: {
                email: envAdminEmail,
                passwordHash: hashedPassword,
                name: 'Master Admin',
                role: 'ADMIN',
              },
            });
          } else {
            user = {
              id: 'admin_default_seed_id',
              email: envAdminEmail,
              name: 'Master Admin',
              role: 'ADMIN',
            };
          }
        } catch (seedErr) {
          user = {
            id: 'admin_default_seed_id',
            email: envAdminEmail,
            name: 'Master Admin',
            role: 'ADMIN',
          };
        }
      } else {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
      }
    } else {
      // 3. User exists -> verify password hash or check against env password
      let isValid = false;
      if (user.passwordHash) {
        isValid = await verifyPassword(password, user.passwordHash);
      }

      // Allow env password fallback if hash match fails or if matching configured env credentials
      if (!isValid) {
        if (cleanEmail === envAdminEmail && password === envAdminPass) {
          isValid = true;
        } else {
          return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
        }
      }
    }

    // 4. Create JWT session token
    const token = await createSessionToken({
      userId: user.id || 'admin_default_seed_id',
      email: user.email || envAdminEmail,
      name: user.name || 'Master Admin',
      role: user.role || 'ADMIN',
    });

    // 5. Construct Response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id || 'admin_default_seed_id',
        email: user.email || envAdminEmail,
        name: user.name || 'Master Admin',
        role: user.role || 'ADMIN',
      },
    });

    // 6. Set HTTP-Only Cookie directly on NextResponse
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // 7. Log activity safely
    try {
      await logActivity({
        userId: user.id || 'admin_seed_id',
        userEmail: user.email || envAdminEmail,
        action: 'LOGIN',
        resource: 'AdminUser',
        resourceId: user.id || 'admin_seed_id',
        details: 'Admin logged in successfully',
        ipAddress: getClientIp(req),
      });
    } catch (e) {}

    return response;
  } catch (error: any) {
    console.error('Admin login API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Authentication failed. Please check credentials.' },
      { status: 500 }
    );
  }
}
