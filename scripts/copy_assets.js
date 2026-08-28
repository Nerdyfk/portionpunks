const fs = require('fs');
const path = require('path');

const websiteDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(websiteDir, '../output/images');
const publicDir = path.resolve(websiteDir, 'public');
const publicNftsDir = path.resolve(publicDir, 'images/nfts');

if (!fs.existsSync(publicNftsDir)) {
  fs.mkdirSync(publicNftsDir, { recursive: true });
}

// Copy cover.png to public/cover.png if needed
const coverSrc = path.join(websiteDir, 'cover.png');
const coverDst = path.join(publicDir, 'cover.png');
if (fs.existsSync(coverSrc) && !fs.existsSync(coverDst)) {
  fs.copyFileSync(coverSrc, coverDst);
  console.log('Copied cover.png to public/cover.png');
}

// Copy sample images from output/images to public/images/nfts
if (fs.existsSync(outputDir)) {
  const files = fs.readdirSync(outputDir).slice(0, 100); // copy first 100 sample images
  let copiedCount = 0;
  files.forEach((file) => {
    if (file.endsWith('.png')) {
      const src = path.join(outputDir, file);
      const dst = path.join(publicNftsDir, file);
      fs.copyFileSync(src, dst);
      copiedCount++;
    }
  });
  console.log(`Copied ${copiedCount} sample NFT images to public/images/nfts/`);
} else {
  // Copy sample images from website folder
  ['26.png', '30.png', '46.png', '58.png', '8.png'].forEach((file) => {
    const src = path.join(websiteDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(publicNftsDir, file));
    }
  });
}
