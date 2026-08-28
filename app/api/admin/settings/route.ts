import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity, getClientIp } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'EDITOR']);

    const collection = await db.collection.findFirst();
    const settings = await db.siteSetting.findMany();

    return NextResponse.json({ collection, settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN']);
    const body = await req.json();

    const { collection, settings } = body;

    if (collection) {
      const firstColl = await db.collection.findFirst();
      if (firstColl) {
        await db.collection.update({
          where: { id: firstColl.id },
          data: {
            name: collection.name,
            description: collection.description,
            totalSupply: parseInt(collection.totalSupply, 10) || 3333,
            chain: collection.chain,
            platform: collection.platform,
            contractAddress: collection.contractAddress,
            mintDate: collection.mintDate,
            mintStatus: collection.mintStatus,
            mintPrice: collection.mintPrice,
            openSeaUrl: collection.openSeaUrl,
          },
        });
      } else {
        await db.collection.create({
          data: {
            name: collection.name,
            description: collection.description,
            totalSupply: parseInt(collection.totalSupply, 10) || 3333,
            chain: collection.chain,
            platform: collection.platform,
            contractAddress: collection.contractAddress,
            mintDate: collection.mintDate,
            mintStatus: collection.mintStatus,
            mintPrice: collection.mintPrice,
            openSeaUrl: collection.openSeaUrl,
          },
        });
      }
    }

    if (settings && typeof settings === 'object') {
      for (const [key, value] of Object.entries(settings)) {
        await db.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value), label: key },
        });
      }
    }

    await logActivity({
      userId: user.userId,
      userEmail: user.email,
      action: 'SETTINGS_UPDATE',
      resource: 'Collection/SiteSetting',
      details: 'Updated collection settings and site configuration',
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save settings' }, { status: 500 });
  }
}
