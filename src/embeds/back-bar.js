/*
  Back bar for the project sites. Adds a sticky strip at the top with a link
  home, so visitors who land on a project can find the rest.

  Built by scripts/prebuild.mjs into public/embed/back-bar.js with the site
  config inlined as __SITE__. Usage in a project site's <head>:
    <script src="https://<domain>/embed/back-bar.js" async></script>
  Opt out on a page: data-dhv-back-bar="off" on <html> or <body>.
*/
/* global __SITE__ */
(function () {
	if (typeof document === 'undefined') return;

	var optOut =
		document.documentElement.getAttribute('data-dhv-back-bar') === 'off' ||
		(document.body && document.body.getAttribute('data-dhv-back-bar') === 'off');
	if (optOut) return;
	if (document.getElementById('dhv-back-bar')) return;

	var home = __SITE__.origin + '/';
	var label = __SITE__.title;

	var bar = document.createElement('div');
	bar.id = 'dhv-back-bar';
	bar.setAttribute('role', 'navigation');
	bar.setAttribute('aria-label', 'back to ' + label);
	// Literal colors, not CSS variables: this runs on other sites. Match your
	// palette here after you redesign.
	bar.style.cssText = [
		'position:sticky', 'top:0', 'left:0', 'right:0', 'z-index:2147483000', 'width:100%',
		'margin:0', 'padding:6px 14px', 'background:#ffffff', 'color:#111111',
		'border-bottom:2px solid #111111',
		'font-family:ui-monospace, SFMono-Regular, Menlo, monospace', 'font-size:13px',
		'line-height:1.4', 'text-align:left', 'box-sizing:border-box',
	].join(';');

	var link = document.createElement('a');
	link.href = home;
	link.textContent = '← ' + label;
	link.style.cssText = [
		'color:#111111', 'text-decoration:underline', 'text-decoration-thickness:2px',
		'text-underline-offset:3px', 'font-weight:700',
	].join(';');
	bar.appendChild(link);

	var insert = function () {
		if (!document.body) return;
		document.body.insertBefore(bar, document.body.firstChild);
	};
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', insert);
	else insert();
})();
