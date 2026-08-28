import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity, getClientIp } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'EDITOR']);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      const tokenNum = parseInt(search.replace('#', ''), 10);
      if (!isNaN(tokenNum)) {
        where.OR = [{ name: { contains: search } }, { tokenId: tokenNum }];
      } else {
        where.name = { contains: search };
      }
    }

    const [total, nfts] = await Promise.all([
      db.nFT.count({ where }),
      db.nFT.findMany({
        where,
        skip,
        take: limit,
        orderBy: { tokenId: 'asc' },
        include: { traits: true },
      }),
    ]);

    return NextResponse.json({
      nfts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN']);
    const body = await req.json();

    const { tokenId, name, description, imageUrl, rarityRank, rarityScore, rarityCategory, status, traits } = body;

    if (!tokenId || !name || !imageUrl) {
      return NextResponse.json({ error: 'Token ID, Name, and Image URL are required.' }, { status: 400 });
    }

    const existing = await db.nFT.findUnique({ where: { tokenId: parseInt(tokenId, 10) } });
    if (existing) {
      return NextResponse.json({ error: `Token ID #${tokenId} already exists.` }, { status: 400 });
    }

    const nft = await db.nFT.create({
      data: {
        tokenId: parseInt(tokenId, 10),
        name,
        description: description || `Unique Potion Punk #${tokenId}`,
        imageUrl,
        rarityRank: parseInt(rarityRank || '0', 10),
        rarityScore: parseFloat(rarityScore || '0.0'),
        rarityCategory: rarityCategory || 'COMMON',
        status: status || 'PUBLISHED',
        traits: {
          create: Array.isArray(traits)
            ? traits
                .filter((t: any) => t.traitType && t.traitValue)
                .map((t: any) => ({
                  traitType: String(t.traitType).trim(),
                  traitValue: String(t.traitValue).trim(),
                }))
            : [],
        },
      },
      include: { traits: true },
    });

    await logActivity({
      userId: user.userId,
      userEmail: user.email,
      action: 'NFT_CREATE',
      resource: 'NFT',
      resourceId: nft.id,
      details: `Created NFT #${nft.tokenId} (${nft.name})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json(nft, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create NFT' }, { status: 500 });
  }
}
