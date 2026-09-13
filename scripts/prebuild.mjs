// Runs before `astro build` (npm's `prebuild` hook). Writes the files that
// depend on site.config.mjs but have to exist as static assets:
//   public/CNAME       the custom domain, when one is set
//   public/robots.txt  points crawlers at the sitemap index
//   public/embed/*.js  the scripts project sites load, bundled with the
//                      config inlined as __SITE__
// All three are gitignored; CI regenerates them on every deploy.
import { build } from 'esbuild';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import site, { siteOrigin } from '../site.config.mjs';

const pub = fileURLToPath(new URL('../public/', import.meta.url));
const root = fileURLToPath(new URL('../', import.meta.url));
fs.mkdirSync(`${pub}embed`, { recursive: true });

const hasDomain = site.domain && site.domain !== 'example.com';
if (hasDomain) {
	fs.writeFileSync(`${pub}CNAME`, `${site.domain}\n`);
} else {
	fs.rmSync(`${pub}CNAME`, { force: true });
	console.warn(`prebuild: no custom domain in site.config.mjs; building for ${siteOrigin(site)}`);
}
if (site.githubUser === 'octocat') {
	console.warn('prebuild: site.config.mjs still says githubUser: octocat');
}

// @astrojs/sitemap emits sitemap-index.xml, not sitemap.xml.
fs.writeFileSync(`${pub}robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin(site)}/sitemap-index.xml\n`);

for (const name of ['back-bar', 'giscus', 'analytics']) {
	await build({
		entryPoints: [`${root}src/embeds/${name}.js`],
		bundle: true,
		minify: name === 'analytics',
		format: 'iife',
		target: 'es2019',
		outfile: `${pub}embed/${name}.js`,
		define: { __SITE__: JSON.stringify({ ...site, origin: siteOrigin(site) }) },
		logLevel: 'warning',
	});
}
console.log('prebuild: wrote robots.txt, embed/{back-bar,giscus,analytics}.js' + (hasDomain ? ', CNAME' : ''));
