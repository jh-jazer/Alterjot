const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const iconsDir = path.resolve(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Create beautiful Master SVG Icon
const masterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="brandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c2593f" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#e88a38" />
    </linearGradient>
    <radialGradient id="featherGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#5c2612" flood-opacity="0.35" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.2" />
    </filter>
  </defs>

  <!-- Background container with rounded corners and gradient -->
  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#brandGrad)" filter="url(#shadow)" />
  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#featherGlow)" />
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#ffffff" stroke-width="4" stroke-opacity="0.2" />

  <!-- Center Decorative Editorial Parchment Accent -->
  <g transform="translate(256, 256) scale(14) translate(-12, -12)">
    <!-- Lucide Feather with Manuscript Quill Styling -->
    <path
      d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"
      fill="rgba(255, 255, 255, 0.96)"
      stroke="#ffffff"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <line
      x1="16" y1="8"
      x2="2" y2="22"
      stroke="#c2593f"
      stroke-width="1.8"
      stroke-linecap="round"
    />
    <line
      x1="17.5" y1="15"
      x2="9" y2="15"
      stroke="rgba(194, 89, 63, 0.7)"
      stroke-width="1.2"
      stroke-linecap="round"
    />
  </g>
</svg>`;

// 2. Create Maskable SVG Icon (Safe zone for Android adaptive icons)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="brandGradMask" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b84d34" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#ea9042" />
    </linearGradient>
    <radialGradient id="featherGlowMask" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Full bleed for maskable safe zone -->
  <rect width="512" height="512" fill="url(#brandGradMask)" />
  <rect width="512" height="512" fill="url(#featherGlowMask)" />

  <!-- Safe Zone Graphic (padded inside 80% circle) -->
  <g transform="translate(256, 256) scale(11) translate(-12, -12)">
    <path
      d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"
      fill="rgba(255, 255, 255, 0.98)"
      stroke="#ffffff"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <line
      x1="16" y1="8"
      x2="2" y2="22"
      stroke="#b84d34"
      stroke-width="1.8"
      stroke-linecap="round"
    />
    <line
      x1="17.5" y1="15"
      x2="9" y2="15"
      stroke="rgba(184, 77, 52, 0.7)"
      stroke-width="1.2"
      stroke-linecap="round"
    />
  </g>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), masterSvg, 'utf8');
fs.writeFileSync(path.join(iconsDir, 'icon-maskable.svg'), maskableSvg, 'utf8');

// Function to generate raw RGBA buffer and encode to PNG with zlib
function createPng(size, isMaskable = false) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (1 + width * 4));

  // Center & Radius
  const cx = width / 2;
  const cy = height / 2;
  const cornerRadius = isMaskable ? 0 : width * 0.22;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte 0 (None)

    for (let x = 0; x < width; x++) {
      // Check rounded rect boundaries if not maskable
      let inside = true;
      if (!isMaskable) {
        const inset = width * 0.04;
        const left = inset;
        const top = inset;
        const right = width - inset;
        const bottom = height - inset;

        if (x < left || x > right || y < top || y > bottom) {
          inside = false;
        } else {
          // Check corners
          const checkCorner = (cornerX, cornerY) => {
            const dx = Math.abs(x - cornerX);
            const dy = Math.abs(y - cornerY);
            return (dx * dx + dy * dy) <= (cornerRadius * cornerRadius);
          };

          if (x < left + cornerRadius && y < top + cornerRadius) {
            inside = checkCorner(left + cornerRadius, top + cornerRadius);
          } else if (x > right - cornerRadius && y < top + cornerRadius) {
            inside = checkCorner(right - cornerRadius, top + cornerRadius);
          } else if (x < left + cornerRadius && y > bottom - cornerRadius) {
            inside = checkCorner(left + cornerRadius, bottom - cornerRadius);
          } else if (x > right - cornerRadius && y > bottom - cornerRadius) {
            inside = checkCorner(right - cornerRadius, bottom - cornerRadius);
          }
        }
      }

      if (!inside) {
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        continue;
      }

      // Compute gradient color from bottom-left (#c2593f) to top-right (#d97706)
      const t = (x / width * 0.5) + ((height - y) / height * 0.5);
      const rGrad = Math.round(194 + (217 - 194) * t);
      const gGrad = Math.round(89 + (119 - 89) * t);
      const bGrad = Math.round(63 + (6 - 63) * t);

      // Feather Quill Icon Silhouette in the center
      const nx = (x - cx) / (width * (isMaskable ? 0.35 : 0.42));
      const ny = (y - cy) / (height * (isMaskable ? 0.35 : 0.42));

      // Quill shape approximation: tilted leaf/feather
      // Rotate 45 degrees
      const cos45 = 0.7071;
      const sin45 = 0.7071;
      const rx = nx * cos45 + ny * sin45;
      const ry = -nx * sin45 + ny * cos45;

      const stemDist = Math.abs(rx);
      const inStem = stemDist < 0.05 && ry > -0.85 && ry < 0.85;

      // Feather vanes
      const vaneWidth = Math.max(0, 0.42 * (1 - ry * ry * 1.3));
      const inFeather = ry > -0.75 && ry < 0.75 && Math.abs(rx) < vaneWidth;

      if (inStem) {
        // Terracotta stem
        rawData[offset++] = 194;
        rawData[offset++] = 89;
        rawData[offset++] = 63;
        rawData[offset++] = 255;
      } else if (inFeather) {
        // Parchment white feather vane
        rawData[offset++] = 251;
        rawData[offset++] = 249;
        rawData[offset++] = 244;
        rawData[offset++] = 255;
      } else {
        // Background gradient
        rawData[offset++] = rGrad;
        rawData[offset++] = gGrad;
        rawData[offset++] = bGrad;
        rawData[offset++] = 255;
      }
    }
  }

  // Construct PNG chunks
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT Chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(typeStr, data) {
  const type = Buffer.from(typeStr, 'ascii');
  const len = data.length;
  const chunkHeader = Buffer.alloc(4);
  chunkHeader.writeUInt32BE(len, 0);

  const crcInput = Buffer.concat([type, data]);
  const crc = zlib.crc32(crcInput);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc >>> 0, 0);

  return Buffer.concat([chunkHeader, type, data, crcBuf]);
}

// Generate all standard icon sizes
const sizes = [
  { name: 'icon-192x192.png', size: 192, maskable: false },
  { name: 'icon-512x512.png', size: 512, maskable: false },
  { name: 'icon-maskable-192x192.png', size: 192, maskable: true },
  { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'favicon-32x32.png', size: 32, maskable: false },
  { name: 'favicon-16x16.png', size: 16, maskable: false },
];

for (const s of sizes) {
  const pngBuf = createPng(s.size, s.maskable);
  fs.writeFileSync(path.join(iconsDir, s.name), pngBuf);
  // Also put apple-touch-icon.png in root of client/public
  if (s.name === 'apple-touch-icon.png') {
    fs.writeFileSync(path.resolve(__dirname, '..', 'public', s.name), pngBuf);
  }
}

console.log('Successfully generated all PWA icons (SVG & PNG)!');
