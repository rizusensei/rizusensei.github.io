const CACHE="rizu-v2.0.0";
const ASSETS=["./","./index.html","./learn.html","./flashcards.html","./quiz.html","./shadowing.html","./products.html","./styles.css","./data.js","./core.js","./home.js","./learn.js","./flashcards.js","./quiz.js","./shadowing.js","./products.js","./assets/favicon.svg","./assets/hero-learning.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return res}).catch(()=>caches.match("./index.html"))))});
