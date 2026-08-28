const fs = require('fs');
const path = require('path');

const websiteDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(websiteDir, 'public');
const publicNftsDir = path.resolve(publicDir, 'images/nfts');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(publicNftsDir)) fs.mkdirSync(publicNftsDir, { recursive: true });

['8.png', '46.png', '26.png', '30.png', '58.png'].forEach((file) => {
  const src = path.join(websiteDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, file));
    fs.copyFileSync(src, path.join(publicNftsDir, file));
    console.log(`Copied ${file} to public/ and public/images/nfts/`);
  }
});
