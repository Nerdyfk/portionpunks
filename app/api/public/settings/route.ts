import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [collection, roadmap, faqs, socials, settingsList] = await Promise.all([
      db.collection.findFirst(),
      db.roadmapItem.findMany({ orderBy: { displayOrder: 'asc' } }),
      db.fAQ.findMany({ orderBy: { displayOrder: 'asc' } }),
      db.socialLink.findMany({ where: { active: true }, orderBy: { displayOrder: 'asc' } }),
      db.siteSetting.findMany(),
    ]);

    const settingsMap: Record<string, string> = {};
    settingsList.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({
      collection: collection || {
        name: 'Portion Punks',
        description: '3333 unique Potion Punks forged for digital collectors on Robinhood Crypto.',
        totalSupply: 3333,
        chain: 'Robinhood Crypto',
        platform: 'OpenSea',
        contractAddress: '0x3333777788889999aaaabbbbccccddddeeeeffff',
        mintDate: 'TBA',
        mintStatus: 'UPCOMING',
        mintPrice: 'TBA',
        openSeaUrl: 'https://opensea.io/collection/portion-punks',
      },
      roadmap,
      faqs,
      socials,
      settings: settingsMap,
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json({ error: 'Failed to load site content' }, { status: 500 });
  }
}
