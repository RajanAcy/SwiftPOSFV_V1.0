const CACHE_NAME = 'swift-pos-cache-v1';
const ASSETS = [
	'./',
	'./Deepseek_html_FV_22_SEP_PM.html',
	'./manifest.json'
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => Promise.all(
			keys.map(key => key !== CACHE_NAME && caches.delete(key))
		))
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(resp => resp || fetch(event.request).then(networkResp => {
			const cloned = networkResp.clone();
			caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
			return networkResp;
		}).catch(() => caches.match('./Deepseek_html_FV_22_SEP_PM.html')))
	);
});
