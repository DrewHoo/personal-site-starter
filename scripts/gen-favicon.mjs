// Generate the favicon set. Run: npm run gen:favicon
// Outputs are committed; CI does not regenerate them.
//   public/favicon.svg          modern browsers
//   public/favicon.ico          16/32/48 for anything probing the root .ico
//   public/favicon-32.png       small-pixel fallback
//   public/favicon-192.png      Android / PWA
//   public/apple-touch-icon.png iOS home screen (180x180)
//
// favicon.ico and apple-touch-icon.png are fetched at those exact paths by
// clients that never read the HTML, so a redesigned mark reuses the URLs and
// Safari keeps its cached bitmap for months. After changing the mark, bump the
// ?v= on the icon links in src/components/BaseHead.astro.
//
// The mark is your initials on a plate. The letters are rendered with whatever
// sans-serif the machine running this has, so re-run it on one machine.
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import site from '../site.config.mjs';

const pub = fileURLToPath(new URL('../public/', import.meta.url));
const PLATE = '#141210';
const INK = '#f2ead3';
const ACCENT = '#ff4a1c';
const text = site.initials.slice(0, 3);
const size = text.length > 2 ? 26 : 34;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${PLATE}"/>
  <text x="32" y="38" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="${size}" fill="${INK}">${text}</text>
  <rect x="14" y="46" width="36" height="5" fill="${ACCENT}"/>
</svg>
`;

writeFileSync(`${pub}favicon.svg`, svg);
console.log('wrote favicon.svg');

const png = (s) => sharp(Buffer.from(svg)).resize(s, s).png({ compressionLevel: 9 });
for (const { name, s } of [
	{ name: 'favicon-32.png', s: 32 },
	{ name: 'favicon-192.png', s: 192 },
	{ name: 'apple-touch-icon.png', s: 180 },
]) {
	await png(s).toFile(`${pub}${name}`);
	console.log(`wrote ${name}`);
}
writeFileSync(`${pub}favicon.ico`, await pngToIco(await Promise.all([16, 32, 48].map((s) => png(s).toBuffer()))));
console.log('wrote favicon.ico');
