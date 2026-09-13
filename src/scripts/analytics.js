// Lazy-loaded Mixpanel for this site. The project sites use the same token
// through public/embed/analytics.js (source: src/embeds/analytics.js).
// The token is public by design: write-only event ingestion, no PII. An
// empty token in site.config.mjs turns analytics off.
import site from '../../site.config.mjs';
import { isAutomated, clientProps, trackPageviews } from './analytics-common.js';

const TOKEN = site.mixpanelToken;

let mp = null;
const queue = [];

function flush() {
	for (const args of queue) {
		try {
			mp.track(...args);
		} catch {}
	}
	queue.length = 0;
}

if (TOKEN && typeof window !== 'undefined' && !isAutomated()) {
	import('mixpanel-browser')
		.then((m) => {
			mp = m.default;
			mp.init(TOKEN, {
				// Pageviews are fired by trackPageviews() below, after register().
				track_pageview: false,
			});
			mp.register(clientProps());
			trackPageviews(mp);
			flush();
		})
		.catch(() => {
			// Adblockers commonly block scripts with 'mixpanel' in the URL.
			// Analytics failure must never break the page.
			queue.length = 0;
		});
}

export function track(name, props) {
	if (mp) {
		try {
			mp.track(name, props);
		} catch {}
	} else {
		queue.push([name, props]);
	}
}
