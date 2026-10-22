// network-first for pages, cache-first for icons. Version 17
var C='ponzi-winter-17';
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return c.addAll(['./','icon-192.png','icon-512.png']);}).catch(function(){}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);if(u.origin!==location.origin)return;
  if(/version\.json$/.test(u.pathname))return;
  if(/\.(png|webmanifest)$/.test(u.pathname)){e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp);});return res;});}));return;}
  e.respondWith(fetch(r,{cache:'no-cache'}).then(function(res){if(res.ok&&(r.mode==='navigate'||/\/$|index\.html$/.test(u.pathname))){var cp=res.clone();caches.open(C).then(function(c){c.put('./',cp);});}return res;}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('./');});}));
});
