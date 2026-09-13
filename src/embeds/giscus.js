/*
  giscus comments for the project sites. Mounts a GitHub Discussions thread
  keyed by pathname, so each project page gets its own. Every thread lives in
  this repo's Discussions: one moderation queue for every site.

  Built by scripts/prebuild.mjs with the site config inlined as __SITE__. If
  site.config.mjs has no giscus ids, this script does nothing.
  Usage in a project site's <head>:
    <script src="https://<domain>/embed/giscus.js" async></script>
  Placement: mounts in <div id="comments"> if present, else at the end of <body>.
  Opt out on a page: data-dhv-giscus="off" on <html> or <body>.
*/
/* global __SITE__ */
(function () {
	if (typeof document === 'undefined') return;
	var g = __SITE__.giscus || {};
	if (!g.repoId || !g.categoryId) return;

	var optOut =
		document.documentElement.getAttribute('data-dhv-giscus') === 'off' ||
		(document.body && document.body.getAttribute('data-dhv-giscus') === 'off');
	if (optOut) return;
	if (document.getElementById('dhv-giscus')) return;

	var container = document.createElement('div');
	container.id = 'dhv-giscus';
	container.style.cssText = 'margin:2rem auto;max-width:860px;padding:0 1rem;box-sizing:border-box';

	var s = document.createElement('script');
	s.src = 'https://giscus.app/client.js';
	s.async = true;
	s.crossOrigin = 'anonymous';
	var attrs = {
		'data-repo': __SITE__.githubUser + '/' + __SITE__.githubUser + '.github.io',
		'data-repo-id': g.repoId,
		'data-category': g.category || 'Comments',
		'data-category-id': g.categoryId,
		'data-mapping': 'pathname',
		'data-strict': '0',
		'data-reactions-enabled': '1',
		'data-emit-metadata': '0',
		'data-input-position': 'bottom',
		'data-theme': 'preferred_color_scheme',
		'data-lang': 'en',
	};
	for (var k in attrs) s.setAttribute(k, attrs[k]);
	container.appendChild(s);

	var insert = function () {
		if (!document.body) return;
		var slot = document.getElementById('comments');
		(slot || document.body).appendChild(container);
	};
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', insert);
	else insert();
})();
