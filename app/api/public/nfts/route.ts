import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 48);
    const category = searchParams.get('category')?.toUpperCase() || 'ALL';
    const search = searchParams.get('search')?.trim() || '';

    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (category !== 'ALL') {
      where.rarityCategory = category;
    }

    if (search) {
      const tokenIdNum = parseInt(search.replace('#', ''), 10);
      if (!isNaN(tokenIdNum)) {
        where.OR = [{ name: { contains: search } }, { tokenId: tokenIdNum }];
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
        include: {
          traits: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      nfts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching public NFTs:', error);
    return NextResponse.json({ error: 'Failed to load NFTs' }, { status: 500 });
  }
}
