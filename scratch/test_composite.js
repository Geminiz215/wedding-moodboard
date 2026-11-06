const sharp = require('sharp');
const fs = require('fs');

async function testComposite() {
  const width = 480;
  const height = 643; // 480 * 1200 / 896

  // 1. Background
  const bg = await sharp('public/assets/wedding/drapery/pink-curtain-background.png')
    .resize(width, height, { fit: 'cover' })
    .toBuffer();

  // 2. Frame
  const frame = await sharp('public/assets/wedding/drapery/Wedding_frame_with_curtains_and_c7572db1.png')
    .resize(width, height, { fit: 'fill' })
    .toBuffer();

  // 3. Bottom left flower
  const flowerLeft = await sharp('public/assets/wedding/flowers/peony-corner-left.png')
    .resize(175, 175, { fit: 'contain' })
    .toBuffer();

  // 4. Bottom right flower
  const flowerRight = await sharp('public/assets/wedding/flowers/peony-corner-right.png')
    .resize(175, 175, { fit: 'contain' })
    .toBuffer();

  // 5. Ribbon divider
  const ribbon = await sharp('public/assets/wedding/ribbons/ribbon-divider.png')
    .resize(140, null, { fit: 'contain' })
    .toBuffer();

  // SVG overlay for text & inner stationery arch
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#493237" flood-opacity="0.14"/>
        </filter>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFDF9" stop-opacity="0.98"/>
          <stop offset="75%" stop-color="#FAF4EE" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#F5EAE1" stop-opacity="0.92"/>
        </linearGradient>
      </defs>

      <!-- Inner Arched Stationery Card - rounded top arch, softly rounded bottom corners -->
      <path d="
        M 124,575
        C 124,582 130,588 138,588
        L 342,588
        C 350,588 356,582 356,575
        L 356,290
        A 116,92 0 0,0 124,290
        Z"
        fill="url(#cardGrad)" filter="url(#cardShadow)" stroke="#D8C37B" stroke-width="1.8"
      />

      <!-- Delicate inner dashed gold hairline -->
      <path d="
        M 132,568
        C 132,574 136,580 142,580
        L 338,580
        C 344,580 348,574 348,568
        L 348,292
        A 108,84 0 0,0 132,292
        Z"
        fill="none" stroke="#D8C37B" stroke-width="1" stroke-dasharray="4 3" opacity="0.85"
      />

      <!-- Text inside stationery -->
      <text x="240" y="252" font-family="'Playfair Display', Georgia, serif" font-size="10.5" fill="#784653" font-weight="600" letter-spacing="3" text-anchor="middle">THE WEDDING OF</text>
      
      <text x="240" y="298" font-family="'Playfair Display', Georgia, serif" font-size="26" fill="#784653" letter-spacing="3" text-anchor="middle">ZAHRA</text>
      
      <text x="240" y="325" font-family="'Brush Script MT', cursive, sans-serif" font-size="21" fill="#9A7078" text-anchor="middle">and</text>
      
      <text x="240" y="360" font-family="'Playfair Display', Georgia, serif" font-size="26" fill="#784653" letter-spacing="3" text-anchor="middle">FACHRI</text>

      <text x="240" y="405" font-family="sans-serif" font-size="10.5" fill="#784653" font-weight="500" letter-spacing="2" text-anchor="middle">SATURDAY, 14 JUNE 2025</text>
      <text x="240" y="422" font-family="sans-serif" font-size="9.5" fill="#9A7078" letter-spacing="2.2" text-anchor="middle">AT 4 PM</text>
      
      <text x="240" y="444" font-family="sans-serif" font-size="10.5" fill="#784653" font-weight="600" letter-spacing="2" text-anchor="middle">THE GRAND SANTIKA</text>
      <text x="240" y="460" font-family="sans-serif" font-size="9.5" fill="#9A7078" letter-spacing="2.2" text-anchor="middle">JAKARTA</text>

      <!-- Candles Left (sitting at base) -->
      <g transform="translate(80, 485) scale(0.48)">
        <circle cx="20" cy="18" r="14" fill="#F7D794" opacity="0.4"/>
        <path d="M20 6 C16 14, 15 20, 20 24 C25 20, 24 14, 20 6 Z" fill="#FFF3B0"/>
        <rect x="17" y="24" width="6" height="56" rx="2" fill="#FFF9F5" stroke="#E7D8C9" stroke-width="0.8"/>
        <circle cx="42" cy="30" r="12" fill="#F7D794" opacity="0.35"/>
        <path d="M42 18 C38 26, 37 32, 42 36 C47 32, 46 26, 42 18 Z" fill="#FFF3B0"/>
        <rect x="39" y="36" width="6" height="48" rx="2" fill="#FFF9F5" stroke="#E7D8C9" stroke-width="0.8"/>
        <path d="M13 80 H27 L23 86 H17 Z M20 86 V135 M12 135 H28" stroke="#D8C37B" stroke-width="2.5" fill="#B89B4C"/>
        <path d="M35 84 H49 L45 90 H39 Z M42 90 V135 M34 135 H50" stroke="#D8C37B" stroke-width="2.5" fill="#B89B4C"/>
      </g>

      <!-- Candles Right (sitting at base) -->
      <g transform="translate(370, 485) scale(0.48)">
        <circle cx="20" cy="18" r="14" fill="#F7D794" opacity="0.4"/>
        <path d="M20 6 C16 14, 15 20, 20 24 C25 20, 24 14, 20 6 Z" fill="#FFF3B0"/>
        <rect x="17" y="24" width="6" height="56" rx="2" fill="#FFF9F5" stroke="#E7D8C9" stroke-width="0.8"/>
        <circle cx="42" cy="30" r="12" fill="#F7D794" opacity="0.35"/>
        <path d="M42 18 C38 26, 37 32, 42 36 C47 32, 46 26, 42 18 Z" fill="#FFF3B0"/>
        <rect x="39" y="36" width="6" height="48" rx="2" fill="#FFF9F5" stroke="#E7D8C9" stroke-width="0.8"/>
        <path d="M13 80 H27 L23 86 H17 Z M20 86 V135 M12 135 H28" stroke="#D8C37B" stroke-width="2.5" fill="#B89B4C"/>
        <path d="M35 84 H49 L45 90 H39 Z M42 90 V135 M34 135 H50" stroke="#D8C37B" stroke-width="2.5" fill="#B89B4C"/>
      </g>
    </svg>
  `);

  // Composite all
  await sharp(bg)
    .composite([
      { input: svgOverlay, top: 0, left: 0 },
      { input: ribbon, top: 480, left: Math.round((width - 140) / 2) },
      { input: frame, top: 0, left: 0 },
      { input: flowerLeft, top: height - 170, left: -25 },
      { input: flowerRight, top: height - 170, left: width - 150 }
    ])
    .toFile('preview_fix3.png');

  console.log('Preview generated successfully to preview_fix3.png');
}

testComposite().catch(console.error);
