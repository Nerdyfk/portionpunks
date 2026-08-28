import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const nft = await db.nFT.findFirst({
      where: {
        OR: [{ id }, { tokenId: parseInt(id, 10) || -1 }],
      },
      include: {
        traits: true,
      },
    });

    if (!nft) {
      return NextResponse.json({ error: 'NFT not found' }, { status: 404 });
    }

    return NextResponse.json(nft);
  } catch (error) {
    console.error('Error fetching NFT details:', error);
    return NextResponse.json({ error: 'Failed to fetch NFT' }, { status: 500 });
  }
}
