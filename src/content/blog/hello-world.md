---
title: "Hello, world"
description: "A placeholder post that documents the frontmatter. Delete it once you have a real one."
pubDate: 2026-09-13
tags:
  - meta
aiWritten: false
---

Posts are Markdown or MDX files in `src/content/blog/`. The file name is the URL: this one is `/blog/hello-world/`.

The frontmatter fields, from `src/content.config.ts`:

- `title` and `description` are required. The description is the card subtitle on the front page and the meta description in search results, so its first 155 characters should say why a reader would care.
- `pubDate` is required. `updatedDate` is optional and shows next to it.
- `heroImage` is optional. It renders at the top of the post and doubles as the `og:image` for social shares. Put images in `public/blog/<slug>/` and reference them as `/blog/<slug>/name.png`. `cardImage` overrides the front-page thumbnail when it should differ from the share image.
- `tags` is a free list.
- `aiWritten: true` puts a "written by my agent" badge on the front page card. That is the disclosure convention for agent-written posts; the body should say so too.

Comments appear under each post once `site.config.mjs` has giscus ids.
