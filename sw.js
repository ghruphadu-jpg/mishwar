/* مشاوير — Service Worker: يفتح التطبيق فوراً من الذاكرة ثم يحدّثها بالخلفية */
const V='mishwar-v5',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const swr=(req,key)=>caches.open(V).then(c=>c.match(key||req,{ignoreSearch:true}).then(hit=>{
  const net=fetch(req).then(r=>{if(r&&(r.ok||r.type=='opaque'))c.put(key||req,r.clone());return r}).catch(()=>null);
  return hit?(net,hit):net.then(r=>r||new Response('',{status:504}))}));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!='GET')return;
  if(u.origin==location.origin){
    if(r.mode=='navigate'){e.respondWith(swr(r,'index.html'));return}
    e.respondWith(swr(r));return}
  if(/(gstatic\.com|jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com|fonts\.googleapis\.com)$/.test(u.hostname)&&r.destination!='document')e.respondWith(swr(r));
});
