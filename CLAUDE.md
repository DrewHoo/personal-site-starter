# Project notes for the agent

- This is the index site: an Astro static site deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`. The repo is the GitHub User Site (`<user>/<user>.github.io`), so it owns the custom domain and every other public repo with Pages enabled serves under it at `/<repo>/`.
- `site.config.mjs` is the only place owner-specific values live: domain, GitHub user, title, author, Mixpanel token, giscus ids. `scripts/prebuild.mjs` reads it and writes `public/CNAME`, `public/robots.txt`, and `public/embed/*.js` before `astro build`. Those three outputs are gitignored.
- Content collections (`src/content.config.ts`): `blog` (posts, `src/content/blog/<slug>.md`, served at `/blog/<slug>/`) and `projects` (one card per file in `src/content/projects/`, grid at `/projects`). Card covers go in `public/projects/<slug>.png` at 1200x750.
- The post list is the site root. `/blog` redirects to `/`.
- `src/styles/global.css` ships deliberately ugly. Every color and font is a custom property at the top of the file; a redesign is a swap of those values, and components only reference the variables.
- The three embeds in `src/embeds/` are what project sites load with one script tag each. Changing one here changes every project site on the next deploy.
- Dev server: `npm run dev` (port 4321). `npm run build` runs prebuild first.
- The `dataviz-pages-site` skill covers building the project sites and registering their cards here.
