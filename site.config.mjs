// The one file to edit. Everything owner-specific on the site comes from here:
// the Astro `site` URL, the <head>, the footer, the CNAME and robots.txt that
// the build writes into public/, and the three embed scripts the project sites
// load (back bar, comments, analytics).
export default {
  // Your GitHub username. This repo must be named <githubUser>.github.io.
  githubUser: 'octocat',

  // Your custom domain, once you have one. Leave 'example.com' until then and
  // the site serves at https://<githubUser>.github.io/ instead. When set, the
  // build writes public/CNAME and every project repo you own with Pages
  // enabled appears at https://<domain>/<repo>/.
  domain: 'example.com',

  title: 'example.com',
  description: 'Data visualization projects and occasional writing.',
  author: 'Your Name',

  // Two or three letters for the favicon (npm run gen:favicon).
  initials: 'yn',

  // Mixpanel project token. Public by design (write-only ingestion, no PII).
  // Empty string = no analytics anywhere, on this site or the project sites.
  mixpanelToken: '',

  // giscus comments, stored in this repo's GitHub Discussions. Enable
  // Discussions on the repo, install https://github.com/apps/giscus on it,
  // then paste the two ids from https://giscus.app. Empty = no comments.
  giscus: { category: 'Comments', repoId: '', categoryId: '' },
}

// https://<domain> when a domain is set, else the github.io address.
export function siteOrigin(site) {
  return site.domain && site.domain !== 'example.com'
    ? `https://${site.domain}`
    : `https://${site.githubUser}.github.io`
}
