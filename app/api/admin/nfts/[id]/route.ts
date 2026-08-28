import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity, getClientIp } from '@/lib/security';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    const { id } = params;
    const body = await req.json();

    const { name, description, imageUrl, rarityRank, rarityScore, rarityCategory, status, traits } = body;

    // Delete existing traits if new ones provided
    if (Array.isArray(traits)) {
      await db.nFTTrait.deleteMany({ where: { nftId: id } });
    }

    const updatedNft = await db.nFT.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { imageUrl }),
        ...(rarityRank !== undefined && { rarityRank: parseInt(rarityRank, 10) }),
        ...(rarityScore !== undefined && { rarityScore: parseFloat(rarityScore) }),
        ...(rarityCategory && { rarityCategory }),
        ...(status && { status }),
        ...(Array.isArray(traits) && {
          traits: {
            create: traits
              .filter((t: any) => t.traitType && t.traitValue)
              .map((t: any) => ({
                traitType: String(t.traitType).trim(),
                traitValue: String(t.traitValue).trim(),
              })),
          },
        }),
      },
      include: { traits: true },
    });

    await logActivity({
      userId: user.userId,
      userEmail: user.email,
      action: 'NFT_UPDATE',
      resource: 'NFT',
      resourceId: id,
      details: `Updated NFT #${updatedNft.tokenId} (${updatedNft.name})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json(updatedNft);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update NFT' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN']);
    const { id } = params;

    const nft = await db.nFT.findUnique({ where: { id } });
    if (!nft) {
      return NextResponse.json({ error: 'NFT not found' }, { status: 404 });
    }

    await db.nFT.delete({ where: { id } });

    await logActivity({
      userId: user.userId,
      userEmail: user.email,
      action: 'NFT_DELETE',
      resource: 'NFT',
      resourceId: id,
      details: `Deleted NFT #${nft.tokenId} (${nft.name})`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: `NFT #${nft.tokenId} deleted` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete NFT' }, { status: 500 });
  }
}
