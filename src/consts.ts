import site, { siteOrigin } from '../site.config.mjs';

export const SITE_TITLE = site.title;
export const SITE_DESCRIPTION = site.description;
export const SITE_AUTHOR = site.author;
export const SITE_ORIGIN = siteOrigin(site);
export const GITHUB_URL = `https://github.com/${site.githubUser}`;

// The tag vocabulary for project cards. It also drives the filter bar on
// /projects. Edit freely; the schema in content.config.ts enforces it.
export const PROJECT_TAGS = [
	'data viz',
	'engineering',
	'finance',
	'health',
	'sports',
	'video games',
] as const;
