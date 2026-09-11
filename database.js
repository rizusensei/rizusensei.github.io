
const C=window.RIZU_CONTENT,R=window.RIZU,O=window.OpenJLPT;
const kind=location.pathname.includes("kanji")?"kanji":"vocab";
let all=[],filtered=[],page=1,loadToken=0;
const search=document.querySelector("#dbSearch"),levelSel=document.querySelector("#dbLevel"),sizeSel=document.querySelector("#dbPageSize"),grid=document.querySelector("#dbGrid"),statusEl=document.querySelector("#dbStatus");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

async function load(){
 const token=++loadToken;const levels=levelSel.value==="ALL"?C.levels:[levelSel.value];
 let loaded=[],sources=new Set();grid.innerHTML="";statusEl.textContent="Memuat database…";
 for(const lv of levels){
   try{
     const r=await O.load(kind,lv);if(token!==loadToken)return;sources.add(r.source);loaded.push(...r.data.map(x=>({...x,level:x.level||lv})));
     statusEl.textContent=`${loaded.length.toLocaleString("id-ID")} item dimuat`;
   }catch(e){
     const fb=kind==="vocab"?C.fallbackVocab:C.fallbackKanji;
     if(token!==loadToken)return;sources.add("fallback");loaded.push(...fb.filter(x=>x.level===lv));
     statusEl.textContent="OpenJLPT belum dapat dimuat; fallback lokal sedang ditampilkan. Hubungkan internet dan pilih Cache Semua Data.";
   }
 }
 if(token!==loadToken)return;all=loaded;statusEl.textContent=`${all.length.toLocaleString("id-ID")} item · ${[...sources].map(s=>({bundle:"paket lokal",cache:"cache browser",network:"OpenJLPT",fallback:"data cadangan"}[s])).join(", ")}`;page=1;apply();
}
function searchable(x){
 if(kind==="vocab")return [x.word,x.reading,...(x.meanings||[]),x.meaning_id||""].join(" ");
 return [x.character,...(x.meanings||[]),...(x.onyomi||[]),...(x.kunyomi||[])].join(" ");
}
function cardPayload(x){
 const id=kind==="vocab"?`${x.level}:${x.word}:${x.reading||""}`:`${x.level}:${x.character}`;
 return {type:kind,id,level:x.level,front:kind==="vocab"?x.word:x.character,reading:kind==="vocab"?(x.reading||""):[...(x.onyomi||[]),...(x.kunyomi||[])].join("・"),back:(x.meanings||[x.meaning_id||""]).join("; ")};
}
function card(x,i){
 const payload=cardPayload(x),key=R.srsKey(payload),inSrs=!!R.get().srs[key],book=R.isBookmarked(kind,payload.id);
 if(kind==="vocab")return `<article class="db-card"><div class="word">${esc(x.word)}</div><div class="reading">${esc(x.reading||"")}</div><div class="meaning">${esc((x.meanings||[x.meaning_id||""]).slice(0,4).join("; "))}</div>${x.examples?.length?`<details><summary>${x.examples.length} contoh sumber</summary>${x.examples.slice(0,3).map(e=>`<p lang="ja">${esc(e.ja)}</p><p>${esc(e.en)}</p>`).join("")}</details>`:""}<div class="db-meta"><span>${esc(x.level)}</span><span>${x.examples?.length||0} examples</span></div><div class="db-actions"><button data-srs="${i}" class="${inSrs?"on":""}">${inSrs?"✓ SRS":"＋ SRS"}</button><button data-book="${i}" class="${book?"on":""}">${book?"★":"☆"} Bookmark</button></div></article>`;
 return `<article class="db-card kanji-card"><a class="word" href="kanji-detail.html?char=${encodeURIComponent(x.character)}">${esc(x.character)}</a><div class="meaning">${esc((x.meanings||[]).slice(0,5).join("; "))}</div><div class="kanji-readings"><b>音:</b> ${esc((x.onyomi||[]).join("・")||"—")}<br><b>訓:</b> ${esc((x.kunyomi||[]).join("・")||"—")}</div><div class="db-meta"><span>${esc(x.level)}</span><span>${x.strokes||"?"} strokes</span></div><div class="db-actions"><button data-srs="${i}" class="${inSrs?"on":""}">${inSrs?"✓ SRS":"＋ SRS"}</button><button data-book="${i}" class="${book?"on":""}">${book?"★":"☆"} Bookmark</button></div></article>`;
}
function apply(){
 const q=search.value.trim().toLowerCase();
 filtered=all.filter(x=>!q||searchable(x).toLowerCase().includes(q));
 document.querySelector("#dbCount").textContent=filtered.length.toLocaleString("id-ID");page=1;render();
}
function render(){
 const size=+sizeSel.value,pages=Math.max(1,Math.ceil(filtered.length/size));page=Math.min(page,pages);
 const slice=filtered.slice((page-1)*size,page*size);
 grid.innerHTML=slice.length?slice.map((x,i)=>card(x,i)).join(""):`<div class="notice">Tidak ada hasil untuk filter ini.</div>`;
 grid.querySelectorAll("[data-srs]").forEach(b=>b.onclick=()=>{const x=slice[+b.dataset.srs],p=cardPayload(x),k=R.srsKey(p);if(R.get().srs[k])R.removeSRS(k);else R.addSRS(p);render()});
 grid.querySelectorAll("[data-book]").forEach(b=>b.onclick=()=>{const x=slice[+b.dataset.book],p=cardPayload(x);R.toggleBookmark(kind,p.id,p.front,{level:p.level,reading:p.reading,meaning:p.back});render()});
 const nums=[];for(let p=Math.max(1,page-2);p<=Math.min(pages,page+2);p++)nums.push(p);
 document.querySelector("#pagination").innerHTML=`<button data-p="${Math.max(1,page-1)}">←</button>${nums.map(p=>`<button data-p="${p}" class="${p===page?"active":""}">${p}</button>`).join("")}<button data-p="${Math.min(pages,page+1)}">→</button>`;
 document.querySelectorAll("#pagination button").forEach(b=>b.onclick=()=>{page=+b.dataset.p;render();document.querySelector(".data-toolbar").scrollIntoView({behavior:"smooth",block:"start"})});
}
search.oninput=apply;levelSel.value=R.level();levelSel.onchange=()=>{if(levelSel.value!=="ALL")R.setLevel(levelSel.value);load()};sizeSel.onchange=()=>{page=1;render()};
document.querySelector("#cacheAll").onclick=async()=>{
 const btn=document.querySelector("#cacheAll"),p=document.querySelector("#cacheProgress");btn.disabled=true;
 const out=await O.cacheAll(x=>p.textContent=`${x.done}/${x.total} · ${x.label} · ${x.ok} berhasil`);
 btn.disabled=false;p.textContent=`Cache selesai: ${out.ok}/${out.total} dataset berhasil.`;load();
};
O.status().then(s=>{const total=Object.values(s).reduce((a,b)=>a+b,0);document.querySelector("#cacheProgress").textContent=total?`${total.toLocaleString("id-ID")} record sudah tersimpan di browser.`:"Belum ada OpenJLPT dataset dalam cache browser."});
load();
