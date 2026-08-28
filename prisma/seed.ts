import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Portion Punks Seeding ---');

  // 1. Create Default Super Admin
  const adminEmail = 'admin@portionpunks.com';
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('PortionPunks2026!', 10);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Master Brewer',
        role: 'SUPER_ADMIN',
      },
    });
    console.log('Created Super Admin user: admin@portionpunks.com / PortionPunks2026!');
  }

  // 2. Create Collection Details
  const existingCollection = await prisma.collection.findFirst();
  if (!existingCollection) {
    await prisma.collection.create({
      data: {
        name: 'Portion Punks',
        description:
          '3333 unique Potion Punks forged for the next generation of digital collectors on the Robinhood Crypto ecosystem.',
        totalSupply: 3333,
        chain: 'Robinhood Crypto',
        platform: 'OpenSea',
        contractAddress: '0x3333777788889999aaaabbbbccccddddeeeeffff',
        mintDate: 'Q4 2026',
        mintStatus: 'UPCOMING',
        mintPrice: 'FREE MINT',
        openSeaUrl: 'https://opensea.io/collection/portion-punks',
      },
    });
    console.log('Seeded Collection settings.');
  }

  // 3. Create Roadmap Items
  const existingRoadmap = await prisma.roadmapItem.findMany();
  if (existingRoadmap.length === 0) {
    await prisma.roadmapItem.createMany({
      data: [
        {
          phase: '01',
          title: 'THE FIRST BREW',
          description: 'Launch the 3,333 Punks, website, community & holder verification.',
          status: 'COMPLETED',
          displayOrder: 1,
        },
        {
          phase: '02',
          title: 'POTION LAB',
          description: 'Holder hub with quests, XP, badges & Potion crafting.',
          status: 'IN_PROGRESS',
          displayOrder: 2,
        },
        {
          phase: '03',
          title: 'PUNK PASS',
          description: 'Exclusive events, content, drops & early access for holders.',
          status: 'UPCOMING',
          displayOrder: 3,
        },
        {
          phase: '04',
          title: 'PUNK ARCADE',
          description: 'Pixel-art games, challenges, leaderboards & community rewards.',
          status: 'UPCOMING',
          displayOrder: 4,
        },
        {
          phase: '05',
          title: 'THE NEXT BREW',
          description: 'New collectibles, collaborations, experiences & community-driven utilities.',
          status: 'UPCOMING',
          displayOrder: 5,
        },
      ],
    });
    console.log('Seeded Roadmap phases.');
  }

  // 4. Create FAQ Items
  const existingFaq = await prisma.fAQ.findMany();
  if (existingFaq.length === 0) {
    await prisma.fAQ.createMany({
      data: [
        {
          question: 'What are Portion Punks?',
          answer: 'Portion Punks is a premiere collection of 3333 pixel-art NFT Punks infused with potion lore, built specifically for digital collectors in the Robinhood Crypto ecosystem.',
          category: 'General',
          displayOrder: 1,
        },
        {
          question: 'How many NFTs are in the collection?',
          answer: 'The collection consists of exactly 3333 unique pixel Punks with programmatically generated traits and rarity scores.',
          category: 'Collection',
          displayOrder: 2,
        },
        {
          question: 'Which blockchain is Portion Punks built on?',
          answer: 'Portion Punks is built around the Robinhood Crypto web3 infrastructure, offering near-zero gas fees and ultra-fast transactions.',
          category: 'Blockchain',
          displayOrder: 3,
        },
        {
          question: 'Where can I mint or trade Portion Punks?',
          answer: 'Minting will take place directly on our website whitelist launcher. Post-mint trading will be available on OpenSea.',
          category: 'Trading',
          displayOrder: 4,
        },
        {
          question: 'What utility do holders receive?',
          answer: 'Holders receive exclusive access to The Brew private community, future potion ecosystem drops, staking rewards, and voting power in community initiatives.',
          category: 'Utility',
          displayOrder: 5,
        },
      ],
    });
    console.log('Seeded FAQ items.');
  }

  // 5. Create Social Links
  const existingSocials = await prisma.socialLink.findMany();
  if (existingSocials.length === 0) {
    await prisma.socialLink.createMany({
      data: [
        {
          platform: 'TWITTER',
          title: 'Follow on X',
          url: 'https://x.com/potionpunks',
          iconName: 'Twitter',
          displayOrder: 1,
          active: true,
        },
        {
          platform: 'OPENSEA',
          title: 'OpenSea Collection',
          url: 'https://opensea.io/collection/portion-punks',
          iconName: 'ExternalLink',
          displayOrder: 2,
          active: true,
        },
      ],
    });
    console.log('Seeded Social links.');
  }

  // 6. Seed Sample NFTs from Manifest if available or fallback
  const existingNfts = await prisma.nFT.count();
  if (existingNfts === 0) {
    console.log('Seeding initial NFTs...');
    
    // Check if manifest exists in d:/Punks/output/collection_manifest.json
    const manifestPath = path.resolve(__dirname, '../../output/collection_manifest.json');
    let manifestData: any[] = [];
    
    if (fs.existsSync(manifestPath)) {
      try {
        const content = fs.readFileSync(manifestPath, 'utf8');
        manifestData = JSON.parse(content);
      } catch (err) {
        console.log('Could not read manifest file, generating fallback sample NFTs');
      }
    }

    const nftsToCreate = manifestData.length > 0 ? manifestData.slice(0, 48) : [];
    
    if (nftsToCreate.length > 0) {
      for (const item of nftsToCreate) {
        const id = item.id;
        const rarityRank = item.rarity_rank || Math.floor(Math.random() * 3333) + 1;
        const rarityScore = item.rarity_score || parseFloat((Math.random() * 50 + 50).toFixed(2));
        
        let category = 'COMMON';
        if (rarityRank <= 50) category = 'LEGENDARY';
        else if (rarityRank <= 300) category = 'EPIC';
        else if (rarityRank <= 1000) category = 'RARE';

        // Check metadata file for traits
        const metadataFile = path.resolve(__dirname, `../../output/metadata/${id}.json`);
        let traits: { traitType: string; traitValue: string }[] = [];

        if (fs.existsSync(metadataFile)) {
          try {
            const metaContent = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
            if (metaContent.attributes && Array.isArray(metaContent.attributes)) {
              traits = metaContent.attributes
                .filter((attr: any) => attr.trait_type !== 'Rarity Rank' && attr.trait_type !== 'Rarity Score')
                .map((attr: any) => ({
                  traitType: String(attr.trait_type),
                  traitValue: String(attr.value),
                }));
            }
          } catch (e) {}
        }

        if (traits.length === 0) {
          traits = [
            { traitType: 'Gender', traitValue: id % 2 === 0 ? 'Female' : 'Male' },
            { traitType: 'Background', traitValue: ['Red', 'Smoke Charcoal', 'Mint', 'Cyber Dark'][id % 4] },
            { traitType: 'Eyes', traitValue: ['Sunglasses Purple', 'Laser Green', 'VR Visor', 'Normal'][id % 4] },
            { traitType: 'Hat', traitValue: ['Red Potion Hat', 'Captain Cap', 'Beanie', 'None'][id % 4] },
          ];
        }

        await prisma.nFT.create({
          data: {
            tokenId: id,
            name: item.name || `Potion Punk #${id}`,
            description: `Unique Potion Punk #${id} forged for digital collectors on Robinhood Crypto.`,
            imageUrl: `/images/nfts/${id}.png`,
            rarityRank,
            rarityScore,
            rarityCategory: category,
            status: 'PUBLISHED',
            traits: {
              create: traits,
            },
          },
        });
      }
    } else {
      // Fallback 12 sample NFTs
      for (let i = 1; i <= 12; i++) {
        let category = 'COMMON';
        if (i === 1) category = 'LEGENDARY';
        else if (i <= 3) category = 'EPIC';
        else if (i <= 6) category = 'RARE';

        await prisma.nFT.create({
          data: {
            tokenId: i,
            name: `Potion Punk #${String(i).padStart(3, '0')}`,
            description: `Unique Potion Punk #${i} forged with rare potion traits on Robinhood Crypto.`,
            imageUrl: `/images/nfts/${i}.png`,
            rarityRank: i * 15,
            rarityScore: 95.5 - i * 2,
            rarityCategory: category,
            status: 'PUBLISHED',
            traits: {
              create: [
                { traitType: 'Background', traitValue: 'Dark Smoke' },
                { traitType: 'Skin', traitValue: i % 2 === 0 ? 'Mint Green' : 'Cyber Charcoal' },
                { traitType: 'Eyes', traitValue: 'Purple Sunglasses' },
                { traitType: 'Hat', traitValue: 'Red Potion Cap' },
                { traitType: 'Accessory', traitValue: 'Potion Vial' },
              ],
            },
          },
        });
      }
    }
    console.log('Seeded sample NFTs and traits successfully.');
  }

  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
