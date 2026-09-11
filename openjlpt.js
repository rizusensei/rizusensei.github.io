window.OpenJLPT=(()=>{
 const C=window.RIZU_CONTENT,VER=C.datasetRevision,BASE=`https://raw.githubusercontent.com/evanclan/OpenJLPT/${VER}/data/json`;
 const urls=Object.fromEntries(['vocab','kanji','grammar'].map(t=>[t,Object.fromEntries(C.levels.map(l=>[l,`${BASE}/${t}/${l.toLowerCase()}.json`]))]));
 let dbp;const memory=new Map();
 function db(){if(dbp)return dbp;dbp=new Promise((ok,no)=>{if(!window.indexedDB)return no(Error('IndexedDB tidak tersedia'));const r=indexedDB.open('rizu-openjlpt',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('datasets'))r.result.createObjectStore('datasets')};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);r.onblocked=()=>no(Error('Tutup tab lama untuk membuka cache'))});return dbp}
 async function get(k){try{const d=await db();return await new Promise((ok,no)=>{const r=d.transaction('datasets','readonly').objectStore('datasets').get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}catch{return null}}
 async function put(k,v){try{const d=await db();await new Promise((ok,no)=>{const t=d.transaction('datasets','readwrite');t.objectStore('datasets').put(v,k);t.oncomplete=ok;t.onerror=()=>no(t.error);t.onabort=()=>no(t.error)});return true}catch{return false}}
 async function fetchJSON(url){const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),8000);try{const r=await fetch(url,{signal:ctl.signal});if(!r.ok)throw Error(`HTTP ${r.status}`);const data=await r.json();if(!Array.isArray(data)||!data.length)throw Error('Dataset kosong');return data}finally{clearTimeout(timer)}}
 async function load(type,level,{refresh=false}={}){
  if(!urls[type]?.[level])throw Error('Level atau tipe database tidak valid');
  const k=`${VER}:${type}:${level}`;
  if(!refresh){if(memory.has(k))return memory.get(k);const cached=await get(k);if(cached?.data?.length){const r={data:cached.data,source:'cache',cachedAt:cached.at,persisted:true};memory.set(k,r);return r}}
  for(const [source,url] of [['bundle',`data/openjlpt/${type}/${level.toLowerCase()}.json`],['network',urls[type][level]]]){
   if(location.protocol==='file:'&&source==='bundle')continue;
   try{const data=await fetchJSON(url),at=Date.now(),persisted=await put(k,{data,at});const r={data,source,cachedAt:at,persisted};memory.set(k,r);return r}catch{}
  }
  const cached=await get(k);if(cached?.data?.length)return{data:cached.data,source:'cache',persisted:true,cachedAt:cached.at};
  throw Error('Dataset tidak dapat dimuat; gunakan paket lengkap melalui localhost atau HTTPS.');
 }
 async function cacheAll(cb){let done=0,ok=0;const jobs=['vocab','kanji','grammar'].flatMap(t=>C.levels.map(l=>[t,l]));for(const [t,l] of jobs){try{if((await load(t,l,{refresh:true})).persisted)ok++}catch{}cb?.({done:++done,total:jobs.length,ok,label:`${t} ${l}`})}return{done,ok,total:jobs.length}}
 async function status(){const out={};for(const t of ['vocab','kanji','grammar'])for(const l of C.levels){const x=await get(`${VER}:${t}:${l}`);out[`${t}-${l}`]=x?.data?.length||0}return out}
 return{load,cacheAll,status,urls,BASE};
})();
