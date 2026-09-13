# personal-site-starter

An [Astro](https://astro.build/) index site for a personal domain on GitHub Pages: a blog, a grid of project cards, RSS, a sitemap, and the plumbing that lets every other public repo you own serve under the same domain at `https://<domain>/<repo>/`. It is the stripped-down source of [drewhoover.com](https://drewhoover.com).

**It ships ugly on purpose.** `src/styles/global.css` is magenta, lime, Comic Sans, and Papyrus, and the header rocks back and forth. Every color and font is a custom property at the top of that file, and the components only reference the variables. Your second commit is the redesign, and it is a swap of those values. The sane palette this started from is in the comment at the top of the file.

## The offramp

If you would rather start from a clean Astro project than strip this one, do that. Five things here are worth copying over:

1. `src/content.config.ts` and one file from `src/content/projects/`: the projects collection schema and a card.
2. `src/components/ProjectCard.astro` and `ProjectGrid.astro`: the card grid.
3. `.github/workflows/deploy.yml`: build with Actions, deploy to Pages.
4. `src/embeds/` and `scripts/prebuild.mjs`: the back bar, comments, and analytics scripts that project sites load, generated from one config file.
5. The sibling-site block in `astro.config.mjs`: puts the project sites in your sitemap.

Everything else is replaceable. `npm create astro@latest` and go.

## Setup

1. **Use this template** on GitHub. The repo name must be `<your-github-username>.github.io`, exactly. That is what makes it a User Site, and a User Site is what owns the domain. Make it public.
2. Clone it. `npm install`.
3. Edit `site.config.mjs`: your GitHub username, title, description, author, initials. Leave `domain` as `example.com` until you have one; the site serves at `https://<username>.github.io/` in the meantime.
4. `npm run gen:favicon`, commit the outputs in `public/`.
5. In the repo's Settings, Pages, set the source to **GitHub Actions**. Or:

   ```sh
   gh api -X POST repos/<username>/<username>.github.io/pages -f build_type=workflow
   ```

6. Push. The workflow builds and deploys. `npm run dev` runs it locally at `localhost:4321`.

### Custom domain

1. Buy the domain at any registrar.
2. At the registrar, add four `A` records on the apex pointing at GitHub Pages:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   and a `CNAME` record for `www` pointing at `<username>.github.io`.
3. Set `domain` in `site.config.mjs` and push. The build writes `public/CNAME`, and the deploy sets the domain on the repo.
4. In Settings, Pages, wait for the DNS check, then turn on **Enforce HTTPS**.
5. In your GitHub account settings under Pages, **verify the domain**, so nobody else can claim it on their own Pages site.

From then on, every public repo you own with Pages enabled appears at `https://<domain>/<repo>/`. No per-project DNS, ever. Build those with [`dataviz-project-template`](https://github.com/DrewHoo/dataviz-project-template) and the [`dataviz-pages-site`](https://github.com/DrewHoo/dataviz-pages-site) skill.

### Comments and analytics

Both are optional and both are off until `site.config.mjs` has the ids.

- **Comments** use [giscus](https://giscus.app/), which stores threads in this repo's GitHub Discussions. Enable Discussions on the repo, install the giscus app on it, create a category called Comments, then paste the repo id and category id from giscus.app into the config. Posts get a thread each, and so does every project site that loads the embed.
- **Analytics** use Mixpanel. Create a free project, paste the token. The token is public by design (write-only, no PII). The embed filters known crawlers and headless browsers before sending anything.

## Adding a project card

Create `src/content/projects/<slug>.md` with the frontmatter from the two cards already there (`src/content.config.ts` has the schema). Put the cover at `public/projects/<slug>.png`, 1200x750. The project template generates that file as `card.png`.

## Writing a post

Create `src/content/blog/<slug>.md`. The placeholder post documents every field. Posts list on the front page and at `/rss.xml`; each renders at `/blog/<slug>/`.

## Structure

```
site.config.mjs        The only file with your name in it.
scripts/prebuild.mjs   Writes public/CNAME, robots.txt, embed/*.js from the config before each build.
scripts/gen-favicon.mjs
src/
  components/          BaseHead, Header, Footer, ProjectCard, ProjectGrid, Divider, FormattedDate
  content/blog/        One markdown file per post.
  content/projects/    One markdown file per project card.
  embeds/              Sources for the scripts project sites load: back-bar, giscus, analytics.
  layouts/BlogPost.astro
  pages/               index (posts), about, projects/, blog/[slug], rss.xml
  scripts/             This site's own analytics.
  styles/global.css    The dare.
public/                Favicons, project covers, post images.
GUIDE.md               The longer guide: workflow, skills, design, viz libraries, SEO.
```

## License

MIT for the code. Your content is yours.
