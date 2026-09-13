// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import site, { siteOrigin } from './site.config.mjs';

const ORIGIN = siteOrigin(site);

// The project sites (<origin>/<slug>/) are separate GitHub Pages deployments.
// Astro never builds them, so nothing would put them in the sitemap. Harvest
// the live URLs off the project cards so they ride along in this one.
//
// A card may point at <user>.github.io/<slug>/, which serves the same content
// once a custom domain is set. A sitemap may only list URLs on its own host,
// so those are normalised rather than dropped.
const projectDir = new URL('./src/content/projects/', import.meta.url);
const siblingSites = [
	...new Set(
		fs
			.readdirSync(projectDir)
			.filter((f) => /\.mdx?$/.test(f))
			.map(
				(f) => fs.readFileSync(new URL(f, projectDir), 'utf8').match(/^liveUrl:\s*(\S+)/m)?.[1],
			)
			.filter((u) => typeof u === 'string')
			.map((u) => u.replace(`https://${site.githubUser}.github.io/`, `${ORIGIN}/`))
			.filter((u) => u.startsWith(`${ORIGIN}/`))
			// skip anything Astro already emits: the root and /blog/*
			.filter((u) => u !== `${ORIGIN}/` && !u.includes('/blog/')),
	),
];

// https://astro.build/config
export default defineConfig({
	site: ORIGIN,
	redirects: {
		// The blog listing is the site root.
		'/blog': '/',
	},
	integrations: [mdx(), sitemap({ customPages: siblingSites })],
});
