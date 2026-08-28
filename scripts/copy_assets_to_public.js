const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
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
    // Copy to public/
    fs.copyFileSync(srcPath, path.join(publicDir, filename));
    // Copy to public/images/nfts/
    fs.copyFileSync(srcPath, path.join(publicNftsDir, filename));
    console.log(`Successfully copied ${filename} to public/ and public/images/nfts/`);
  } else {
    console.warn(`File not found: ${srcPath}`);
  }
});
