const V='kabayan-v2',ASSETS=['./','index.html','offline.html','manifest.webmanifest','css/styles.css','js/app.js','js/currency.js','js/routes.js','favicon.svg','apple-touch-icon.png','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&r.ok&&new URL(e.request.url).origin===location.origin){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r}).catch(()=>null);
    return hit||net.then(r=>r||(e.request.mode==='navigate'?caches.match('offline.html'):Response.error()));
  }));
});
