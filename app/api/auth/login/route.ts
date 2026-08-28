import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, hashPassword, createSessionToken, COOKIE_NAME } from '@/lib/auth';
import { getClientIp, logActivity } from '@/lib/security';

const DEFAULT_ADMIN_EMAIL = 'admin@portionpunks.com';
const DEFAULT_ADMIN_PASS = 'PortionPunks2026!';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Attempt to find user in DB
    let user: any = null;

    try {
      user = await db.adminUser.findUnique({
        where: { email: cleanEmail },
      });
    } catch (dbErr) {
      console.warn('DB lookup during admin login:', dbErr);
    }

    // 2. Auto-seed or pure fallback if user is missing and credentials match default dev seed
    if (!user) {
      if (cleanEmail === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASS) {
        try {
          const hashedPassword = await hashPassword(DEFAULT_ADMIN_PASS);
          user = await db.adminUser.create({
            data: {
              email: DEFAULT_ADMIN_EMAIL,
              passwordHash: hashedPassword,
              name: 'Master Admin',
              role: 'ADMIN',
            },
          });
          console.log('Auto-created default admin user in database.');
        } catch (seedErr) {
          console.warn('Auto-seed fallback admin user object created:', seedErr);
          user = {
            id: 'admin_default_seed_id',
            email: DEFAULT_ADMIN_EMAIL,
            name: 'Master Admin',
            role: 'ADMIN',
          };
        }
      } else {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
      }
    } else {
      // 3. User exists -> verify password hash or default check
      if (user.passwordHash) {
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
          return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
        }
      } else if (password !== DEFAULT_ADMIN_PASS) {
        return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
      }
    }

    // 4. Create JWT session token
    const token = await createSessionToken({
      userId: user.id || 'admin_default_seed_id',
      email: user.email,
      name: user.name || 'Master Admin',
      role: user.role || 'ADMIN',
    });

    // 5. Construct Response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id || 'admin_default_seed_id',
        email: user.email,
        name: user.name || 'Master Admin',
        role: user.role || 'ADMIN',
      },
    });

    // 6. Set HTTP-Only Cookie directly on NextResponse
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // 7. Log activity safely
    try {
      await logActivity({
        userId: user.id,
        userEmail: user.email,
        action: 'LOGIN',
        resource: 'AdminUser',
        resourceId: user.id,
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
