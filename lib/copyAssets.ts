import fs from 'fs';
import path from 'path';

export function ensurePublicAssets() {
  try {
    const rootDir = process.cwd();
    const publicDir = path.join(rootDir, 'public');
    const publicNftsDir = path.join(publicDir, 'images', 'nfts');

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    if (!fs.existsSync(publicNftsDir)) {
      fs.mkdirSync(publicNftsDir, { recursive: true });
    }

    const filesToCopy = ['8.png', '26.png', '30.png', '46.png', '58.png', 'cover.png'];

    filesToCopy.forEach((filename) => {
      const srcPath = path.join(rootDir, filename);
      if (fs.existsSync(srcPath)) {
        const dest1 = path.join(publicDir, filename);
        const dest2 = path.join(publicNftsDir, filename);
        if (!fs.existsSync(dest1)) fs.copyFileSync(srcPath, dest1);
        if (!fs.existsSync(dest2)) fs.copyFileSync(srcPath, dest2);
        
        // Also copy 46.png to 1.png fallback if 1.png missing
        const dest1Fallback = path.join(publicNftsDir, '1.png');
        if (!fs.existsSync(dest1Fallback) && filename === '46.png') {
          fs.copyFileSync(srcPath, dest1Fallback);
        }
      }
    });
  } catch (err) {
    console.error('ensurePublicAssets error:', err);
  }
}

// Run immediately on server init
ensurePublicAssets();
