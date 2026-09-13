# Guide

The README covers setting this repo up. This file covers everything around it: the workflow for a new project, how to give your agent skills, how to use Claude Design, which chart library to pick, and how to get found. It assumes you use [Claude Code](https://claude.com/claude-code); the ideas transfer to any coding agent.

## One-time setup

- A GitHub account. The username becomes `<username>.github.io` and the URL prefix before you have a domain, so pick it with that in mind.
- `gh auth login`, Node 22 or later, Claude Code with a Pro or Max subscription.
- A domain, from any registrar. Not required on day one.
- Optional: a free Mixpanel project, and the giscus app on this repo. Both are one config value each.
- The [`dataviz-pages-site`](https://github.com/DrewHoo/dataviz-pages-site) skill, cloned into `~/.claude/skills/`. Edit the Config table at the top of its `SKILL.md`: your username, your domain, and where this repo is cloned.

## How the hosting works

The repo named `<username>.github.io` is a GitHub User Site. It owns the custom domain. Every other public repo you own with Pages enabled is served under that domain at `/<repo>/`, with no extra DNS and no per-project domain. So a project is a repo, the repo name is the URL, and the index site is the front door. The one rule that bites: a project's build has to know its own path (`/<repo>/`), which is why the project template derives it from the package name.

## A new project, start to finish

1. Open Claude Code anywhere and say: "new dataviz project called `<slug>`". The skill creates the repo from the template, sets the name and config, generates the images, enables Pages, and pushes.
2. Supply the three things the skill cannot guess: the question the page answers, where the data comes from (a file, an API, a scrape, or "it has to be researched"), and taste.
3. Before sharing the URL, run the pre-launch checklist in the skill. Two items catch most of the broken launches: the deployed HTML must contain the page (`curl -s <url> | grep -c '<div id="root"></div>'` prints `0`), and the OG card must look right in a card validator.
4. Register the card here: `src/content/projects/<slug>.md` plus the cover in `public/projects/`.

## Writing your own skills

A skill is a markdown file of instructions the agent loads when a task matches its description. The dataviz skill is one. The method for making them is the same for every skill:

1. Work normally. Notice when you correct the agent, or explain the same thing twice, or fix the same mistake in the second project that you fixed in the first.
2. Say: "write that into a skill." Ask for the before and after verbatim, and the rule that turns one into the other.
3. The `description` in the frontmatter decides when the skill loads, so it has to name the phrases you actually say ("new dataviz project", "why isn't my site serving").
4. Reference files hold one concern each, and the skill says which one to read when. The agent should not preload all of them.
5. Every real breakage becomes a troubleshooting entry. The dataviz skill's troubleshooting section is a changelog of one person's mistakes, and it is the most useful part.
6. The maintenance prompt is one line, after any session where you changed something by hand: "here's what I changed, see if there's anything you should add to the skill."

Keep each skill in its own git repo and symlink it into `~/.claude/skills/`. Unpushed skills exist on one laptop. [`skills-manager`](https://github.com/DrewHoo/skills-manager) is a small script for that layout.

A voice skill is a skill like any other, and the post [Teach your agent your voice](https://drewhoover.com/blog/teach-your-agent-your-voice/) walks through building one from the diff between the agent's draft and what you actually sent. Build your own rather than copying someone else's: the file is a map of where one person's prose disagrees with the agent's defaults, and yours disagrees in different places.

## Claude Design

Claude Code has a `design` skill that drafts a page as artboards on a canvas you can edit by hand. Use it before writing code:

1. Describe the page. Get a mockup on the canvas.
2. Move things around, change copy, try a palette. Export a PNG.
3. Back in the terminal: "implement this mockup", with the PNG attached.

It is also the fastest way to make the OG image and the project-card cover for a site whose chart doesn't make a good thumbnail. Two things to know: it is an early preview, and hand-editing on the canvas depends on the account having saving enabled.

Separately, an Anthropic `dataviz` skill governs chart form and color, and loads itself whenever the agent is about to draw a chart. You do not have to invoke it. You should know it exists so you can override it ("ignore the palette skill, use these colors").

## Choosing a chart library

The project template uses D3 for scales and shapes with React drawing the SVG. That is the default, for one reason: the prerender step calls `renderToString`, so the chart has to produce SVG or DOM on the server, or the page ships empty to crawlers. Canvas and WebGL libraries fail that test.

| When | Use | Example |
| --- | --- | --- |
| One bespoke chart, full control | Hand-rolled SVG in React, `d3-scale` for the math | [and-juliet](https://github.com/DrewHoo/and-juliet) |
| Touch interaction, scrubbing, custom tooltips | D3 scales and shapes, React owns the DOM | [buy-it-now-or-never](https://github.com/DrewHoo/buy-it-now-or-never) |
| Many small faceted charts, little code | Observable Plot | [space-rock](https://github.com/DrewHoo/space-rock) |
| A standard chart, speed over control | Recharts | [shivering-deckbuilder](https://github.com/DrewHoo/shivering-deckbuilder) |
| Tens of MB of data queried in the browser | DuckDB-WASM plus one of the above | space-rock |

Avoid Plotly (3 MB, canvas, no prerender), Chart.js (canvas), and deck.gl (WebGL) for these pages.

## SEO

The dataviz skill's `seo.md` reference is the full version. The short version:

- **Prerender.** A Vite app deploys an empty `<div id="root">`. The template's build step bakes the rendered page into the HTML. Never remove it.
- **One `h1`** that names the subject, not a section.
- **The title is a typed query, in typed order.** Product, platform, constraint, the way a person would type it. Check candidates against autocomplete before publishing: `curl -s 'https://suggestqueries.google.com/complete/search?client=firefox&q=YOUR+TITLE'`. Ten suggestions means people type it. Suggestions from a different market mean the nouns are homonyms.
- **Use the searcher's nouns.** They type "mac" and "M1"; you wrote "Apple Silicon". Product names, file names, and error strings in the body are what long-tail queries match.
- **The first 155 characters of the description are the snippet.** The reader's payoff goes there.
- **Headings phrase the question** the way it gets asked.
- **Name the artifact.** A repo, a dataset, a skill. They rank on their own and pull the page up with them.
- **Pick a query you can win.** These pages do not outrank Wikipedia on the head term. They win on the angle nobody else bothered with.
- One-time: add the domain to Google Search Console and Bing Webmaster Tools and submit `/sitemap-index.xml`. The index site's sitemap already lists the project sites.

## Analytics

Project sites are separate deployments and inherit nothing from this site. A project reports events only if it loads the embed, which the template does with one script tag. Reports split by the `site` property. Known crawlers are filtered before sending. If a site shows nothing in Mixpanel, check for the script tag before debugging anything else.

## Where to ask

If you use the dataviz skill and something in it is wrong or missing, open a PR on it. Fixes flow both ways.
