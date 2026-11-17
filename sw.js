// Service worker: o app abre sem internet (mercado com sinal ruim).
// build.py troca 8a4a012a97 pelo hash do build; versão nova = cache novo, o antigo é apagado.
const CACHE = 'cardapio-8a4a012a97';
const FONTS = 'cardapio-fontes';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/claro-180.png', './icons/icon-192.png', './icons/icon-512.png', './icons/preto-180.png', './icons/rosa-180.png', './icons/verde-180.png', './img/B1.jpg', './img/B2.jpg', './img/B3.jpg', './img/B4.jpg', './img/C1.jpg', './img/C2.jpg', './img/C3.jpg', './img/C4.jpg', './img/C5.jpg', './img/E1.jpg', './img/E2.jpg', './img/E3.jpg', './img/E4.jpg', './img/L1.jpg', './img/L2.jpg', './img/L3.jpg', './img/L4.jpg', './img/M1.jpg', './img/M2.jpg', './img/M3.jpg', './img/M4.jpg', './img/M5.jpg', './img/M6.jpg', './img/M7.jpg', './img/M8.jpg', './img/M9.jpg'];
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap';

// Baixa o CSS das fontes e os arquivos .woff2 que ele aponta. Melhor esforço: sem rede, segue sem fonte.
async function cacheFonts() {
  try {
    const c = await caches.open(FONTS);
    if (await c.match(FONT_CSS)) return;
    const res = await fetch(FONT_CSS, { mode: 'cors' });
    if (!res.ok) return;
    const css = await res.clone().text();
    const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m => m[1]);
    await Promise.all(urls.map(u => fetch(u, { mode: 'cors' }).then(r => r.ok && c.put(u, r))));
    await c.put(FONT_CSS, res);
  } catch (e) {}
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(cacheFonts).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Fontes do Google: cache primeiro, rede só se faltar.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(c => c.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') c.put(req, r.clone());
      return r;
    }))));
    return;
  }
  if (url.origin !== location.origin) return;
  // Página: sempre do cache (abre na hora, sem rede). Atualização chega com o próximo service worker.
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(hit => hit || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
