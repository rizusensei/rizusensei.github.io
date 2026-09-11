
const C=window.RIZU_CONTENT,R=window.RIZU,O=window.OpenJLPT;
const params=new URLSearchParams(location.search);
let lesson=C.curriculum.find(x=>x.id===params.get("id"))||C.curriculum.find(x=>x.level===R.level()&&!R.completed(x.id))||C.curriculum.find(x=>x.level===R.level()),sideType="all";
R.setLevel(lesson.level);let sideSearch="";const opened=new Set([lesson.level]);
const TL=t=>({grammar:"Grammar",vocab:"Vocabulary",kanji:"Kanji",reading:"Reading",listening:"Listening",strategy:"Strategy"}[t]||t);

function renderSidebar(){
 const aside=document.querySelector("#courseSidebar");
 aside.innerHTML=`<div class="sidebar-head"><span class="kicker">250 LESSON</span><h2>N5 → N1</h2><p>50 lesson per level · progress tersimpan di browser.</p></div>
 <input class="lesson-search" id="lessonSearch" type="search" aria-label="Cari lesson" placeholder="Cari lesson…" value="${safe(sideSearch)}"><div class="sidebar-filter">${["all","grammar","vocab","kanji","reading","listening","strategy"].map(t=>`<button class="${sideType===t?"active":""}" data-st="${t}">${t==="all"?"Semua":TL(t)}</button>`).join("")}</div>`+
 C.levels.map(l=>{
   const p=R.lessonProgress(l),list=C.curriculum.filter(x=>x.level===l&&(sideType==="all"||x.type===sideType)&&(!sideSearch||x.title.toLowerCase().includes(sideSearch.toLowerCase())));
   return `<div class="course-level"><button type="button" data-collapse="${l}" aria-expanded="${opened.has(l)||!!sideSearch}"><span>JLPT ${l} · ${p.done}/${p.total}</span><span>${p.pct}%</span></button>
   <div class="sidebar-progress"><span style="width:${p.pct}%"></span></div><div class="lesson-list" ${opened.has(l)||sideSearch?"":"hidden"}>${
    list.map(x=>`<a class="lesson-link ${x.id===lesson.id?"active":""} ${R.completed(x.id)?"done":""}" href="learn.html?id=${x.id}">
    <span class="num">${R.completed(x.id)?"✓":String(x.order).padStart(2,"0")}</span><span>${x.title}<small class="cat">${TL(x.type)} · ${x.duration}m</small></span><span class="arrow">→</span></a>`).join("")
   }</div></div>`;
 }).join("");
 aside.querySelector("#lessonSearch").oninput=e=>{sideSearch=e.target.value;const pos=e.target.selectionStart;renderSidebar();const input=aside.querySelector("#lessonSearch");input.focus();input.setSelectionRange(pos,pos)};aside.querySelectorAll("[data-collapse]").forEach(b=>b.onclick=()=>{const l=b.dataset.collapse;if(opened.has(l))opened.delete(l);else opened.add(l);renderSidebar()});
 aside.querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>{sideType=b.dataset.st;renderSidebar()});
}

function promo(){
 const map={grammar:"mensetsu-trial",vocab:"situasi-free",kanji:"mensetsu-premium",reading:"situasi-premium",listening:"situasi-premium",strategy:"planner-premium"};
 return C.products.find(x=>x.id===map[lesson.type])||C.products[0];
}
function safe(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function top(summary){
 const done=R.completed(lesson.id),book=R.isBookmarked("lesson",lesson.id);
 return `<div class="lesson-topline"><div class="lesson-breadcrumb">250 Lesson / ${lesson.level} / ${TL(lesson.type)} / ${lesson.order}</div><div class="lesson-status">${done?"✓ SELESAI":"BELUM SELESAI"}</div></div>
 <section class="lesson-hero"><span class="jp">${TL(lesson.type).toUpperCase()} · ${lesson.level}</span><h1>${lesson.title}</h1><p>${summary||"Lesson terstruktur untuk membangun kemampuan secara bertahap."}</p>
 <div class="lesson-meta"><span>${lesson.level}</span><span>${TL(lesson.type)}</span><span>± ${lesson.duration} menit</span></div>
 <div class="lesson-tools"><button id="bookmarkLesson" class="${book?"on":""}">${book?"★ Bookmarked":"☆ Bookmark"}</button><a class="btn outline" href="dashboard.html#notes">Lihat Notes</a></div></section>`;
}
function noteBlock(){return `<section class="lesson-note"><h3>Catatan pribadi</h3><textarea id="lessonNote" placeholder="Tulis ringkasan, contoh buatan sendiri, atau bagian yang ingin direview…">${safe(R.getNote(lesson.id))}</textarea><div class="note-status" id="noteStatus">Tersimpan otomatis di browser.</div></section>`}
function bottom(){
 const idx=C.curriculum.findIndex(x=>x.id===lesson.id),prev=C.curriculum[idx-1],next=C.curriculum[idx+1],p=promo(),done=R.completed(lesson.id);
 return `${noteBlock()}
 <section class="complete-card"><div><h3>${done?"Lesson sudah selesai.":"Selesai belajar?"}</h3><p>Progress langsung masuk ke dashboard, statistik level, dan kalender aktivitas.</p></div><button id="completeBtn" class="btn ${done?"completed":"red"}">${done?"✓ Selesai":"Tandai Selesai"}</button></section>
 <aside class="context-promo"><span class="sym">${p.symbol}</span><div><small>ARIEFANOISME · ${p.badge}</small><b>${p.title}</b></div><a href="${p.url}" target="_blank" rel="noopener">${p.price} ↗</a></aside>
 <nav class="lesson-nav">${prev?`<a href="learn.html?id=${prev.id}"><small>← SEBELUMNYA</small>${prev.title}</a>`:"<span></span>"}${next?`<a href="learn.html?id=${next.id}"><small>BERIKUTNYA →</small>${next.title}</a>`:`<a href="mock.html?level=${lesson.level}"><small>FINISH →</small>Mock JLPT</a>`}</nav>`;
}
async function getVocab(){
 try{return (await O.load("vocab",lesson.level)).data}
 catch(e){return C.fallbackVocab.filter(x=>x.level===lesson.level)}
}
async function getKanji(){
 try{return (await O.load("kanji",lesson.level)).data}
 catch(e){return C.fallbackKanji.filter(x=>x.level===lesson.level)}
}

async function content(){
 let body="";
 if(lesson.type==="grammar"){
   const g=C.grammar[lesson.level][lesson.ref];
   body=top(g.meaning_id)+`<section class="objectives"><h3>Target Lesson</h3><ul><li>Memahami fungsi: ${g.meaning_id}</li><li>Mengenali pola: ${g.formation}</li><li>Membuat minimal 2 contoh sendiri</li></ul></section>
   <section class="lesson-section"><h2>${g.pattern}</h2><p>${g.meaning_id}. Fokus pada fungsi pola dan bentuk yang muncul sebelum/sesudahnya, bukan hanya satu terjemahan Indonesia.</p>
   <div class="example-list"><div class="example"><b>${g.ja}</b><span>${g.id}</span></div><div class="example"><b>Formation</b><span>${g.formation}</span></div></div></section>
   <section class="practice-box"><span class="kicker light">ACTIVE RECALL</span><h2>Gunakan pola ini.</h2><p>Buat dua kalimat: satu tentang kehidupan sehari-hari dan satu tentang kerja/belajar. Simpan di Notes agar bisa direview lagi.</p></section>`;
 }else if(lesson.type==="vocab"){
   const data=await getVocab(),chunk=Math.ceil(data.length/12),start=lesson.ref*chunk,words=data.slice(start,start+chunk);
   body=top("Database vocabulary level ini dibagi ke 12 lesson sehingga seluruh inventory dapat ditelusuri. Tambahkan kata sulit ke SRS.");
   body+=`<section class="lesson-section"><h2>Vocabulary Set ${String(lesson.ref+1).padStart(2,"0")}</h2><p>${words.length} item · bagian ${lesson.ref+1}/12 dari ${data.length.toLocaleString("id-ID")} item level ${lesson.level}. Full OpenJLPT memakai definisi sumber berbahasa Inggris; fallback lokal memakai Indonesia.</p>
   <div class="vocab-lesson-grid">${words.map((w,i)=>`<div class="mini-word"><button data-add-vocab="${i}" title="Tambah ke SRS">＋</button><b>${safe(w.word||"")}</b><i>${safe(w.reading||"")}</i><span>${safe((w.meanings||[w.meaning_id||""]).slice(0,3).join("; "))}</span></div>`).join("")}</div></section>`;
   setTimeout(()=>document.querySelectorAll("[data-add-vocab]").forEach(b=>b.onclick=()=>{const w=words[+b.dataset.addVocab];R.addSRS({type:"vocab",id:`${lesson.level}:${w.word}:${w.reading||""}`,level:lesson.level,front:w.word,reading:w.reading||"",back:(w.meanings||[w.meaning_id||""]).join("; ")});b.textContent="✓"}),0);
 }else if(lesson.type==="kanji"){
   const data=await getKanji(),chunk=Math.ceil(data.length/8),start=lesson.ref*chunk,ks=data.slice(start,start+chunk);
   body=top("Inventory kanji level ini dibagi ke 8 lesson. Belajar sebagai bagian dari kata; reading lengkap muncul bila OpenJLPT sudah dimuat.");
   body+=`<section class="lesson-section"><h2>Kanji Set ${String(lesson.ref+1).padStart(2,"0")}</h2><p>${ks.length} karakter · bagian ${lesson.ref+1}/8 dari ${data.length.toLocaleString("id-ID")} kanji level ${lesson.level}.</p>
   <div class="kanji-lesson-grid">${ks.map((k,i)=>`<div class="mini-word"><button data-add-kanji="${i}" title="Tambah ke SRS">＋</button><b style="font-size:30px">${safe(k.character)}</b><i>${safe([...(k.onyomi||[]),...(k.kunyomi||[])].join("・"))}</i><span>${safe((k.meanings||[]).slice(0,4).join("; "))}</span></div>`).join("")}</div></section>`;
   setTimeout(()=>document.querySelectorAll("[data-add-kanji]").forEach(b=>b.onclick=()=>{const k=ks[+b.dataset.addKanji];R.addSRS({type:"kanji",id:`${lesson.level}:${k.character}`,level:lesson.level,front:k.character,reading:[...(k.onyomi||[]),...(k.kunyomi||[])].join("・"),back:(k.meanings||[]).join("; ")});b.textContent="✓"}),0);
 }else if(lesson.type==="reading"){
   const x=C.reading.filter(r=>r.level===lesson.level)[lesson.ref];
   if(!x)return top("Buka Reading Library untuk materi tambahan.")+`<section class="lesson-section"><a class="btn red" href="reading.html">Reading Library →</a></section>`;
   const q=x.questions[0];
   body=top(x.summary_id)+`<section class="lesson-section"><h2>${x.title}</h2><p style="font-family:Georgia,'Yu Mincho',serif;font-size:17px;line-height:2">${x.text}</p><div class="example-list"><div class="example"><b>Ringkasan</b><span>${x.summary_id}</span></div></div></section>
   <section class="practice-box"><span class="kicker light">COMPREHENSION</span><h2>${q.q}</h2><div class="practice-options">${q.choices.map((c,i)=>`<button data-read-answer="${i}">${c}</button>`).join("")}</div><div class="explain" id="readExplain">${q.explain}</div></section>`;
   setTimeout(()=>document.querySelectorAll("[data-read-answer]").forEach(b=>b.onclick=()=>{const a=q.answer;document.querySelectorAll("[data-read-answer]").forEach((z,i)=>z.classList.toggle("correct",i===a));if(+b.dataset.readAnswer!==a)b.classList.add("wrong");document.querySelector("#readExplain").classList.add("show")}),0);
 }else if(lesson.type==="listening"){
   const lines=C.shadowing.filter(x=>x.level===lesson.level).slice(lesson.ref*7,lesson.ref*7+7);
   body=top("Dengarkan lebih dulu tanpa membaca arti. Setelah itu tirukan dengan ritme yang sama.");
   body+=`<section class="lesson-section"><h2>Shadowing Pack ${lesson.ref+1}</h2><p>Japanese TTS memakai voice yang tersedia di browser/OS.</p>
   <div class="example-list">${lines.map((x,i)=>`<div class="example"><b>${x.ja}</b><span>${x.meaning_id}<br><button class="btn outline" data-tts="${i}" style="margin-top:5px">▶ Play</button></span></div>`).join("")}</div><div style="margin-top:12px"><a class="btn dark" href="shadowing.html?level=${lesson.level}">Buka Shadowing Lab →</a></div></section>`;
   setTimeout(()=>document.querySelectorAll("[data-tts]").forEach(b=>b.onclick=()=>{const x=lines[+b.dataset.tts];R.speak(x.ja,.85,message=>alert(message));R.activity()}),0);
 }else{
   const x=C.strategy[lesson.level][lesson.ref];
   body=top("Strategi belajar dan ujian yang bisa langsung diterapkan.");
   body+=`<section class="lesson-section"><h2>${x.title}</h2><div class="example-list">${x.points.map((p,i)=>`<div class="example"><b>${String(i+1).padStart(2,"0")}</b><span>${p}</span></div>`).join("")}</div></section>`;
 }
 if(lesson.type==="grammar"){
 const g=C.grammar[lesson.level][lesson.ref];
 if(g.explanation)body=top(g.meaning_id)+`<section class="objectives"><h3>Target belajar</h3><ul><li>Jelaskan fungsi pola dengan kata sendiri.</li><li>Bedakan pola ini dari bentuk yang mirip.</li><li>Jawab latihan lalu tulis dua contoh dalam catatan.</li></ul></section><section class="lesson-section"><h2>Fungsi & pembentukan</h2><p>${safe(g.explanation)}</p><div class="notice">${safe(g.formation)}</div><div class="example-list">${g.examples.map(e=>`<div class="example"><b lang="ja">${safe(e.ja)}</b><span>${safe(e.id)}</span></div>`).join("")}</div><h3>Perbedaan yang perlu diperhatikan</h3><p>${safe(g.contrast)}</p><button class="btn outline" id="grammarSrs">＋ Pola ini ke SRS</button></section><section class="lesson-section"><h2>Cek pemahaman</h2>${R.questionHTML(g.quiz,0)}</section>`;
 }else if(lesson.type==="reading"){
 const x=C.reading.filter(r=>r.level===lesson.level)[lesson.ref];
 if(x)body=top(x.focus||"Baca teks lebih dulu, kemudian jawab pertanyaan.")+`<section class="lesson-section"><h2>${safe(x.title)}</h2><div class="jptext" lang="ja">${safe(x.text)}</div><details><summary>Ringkasan Indonesia</summary><p>${safe(x.summary_id)}</p></details>${x.questions.map(R.questionHTML).join("")}<a class="btn outline" href="reader.html?id=${x.id}">Buka reader & tandai bacaan selesai</a><a class="btn outline" href="reading.html?level=${lesson.level}">Semua bacaan ${lesson.level}</a></section>`;
 }
 return body+bottom();
}

async function render(){
 renderSidebar();
 document.querySelector("#lessonContent").innerHTML=await content();
 const root=document.querySelector("#lessonContent");
 if(lesson.type==="grammar"){const g=C.grammar[lesson.level][lesson.ref];if(g.quiz)R.bindQuestions(root,[g.quiz]);const b=document.querySelector("#grammarSrs");if(b)b.onclick=()=>{R.addSRS({type:"grammar",id:lesson.id,level:lesson.level,front:g.pattern,reading:g.formation,back:g.meaning_id+" · "+g.ja});b.textContent="✓ Ditambahkan ke SRS"}}
 if(lesson.type==="reading"){const x=C.reading.filter(r=>r.level===lesson.level)[lesson.ref];if(x)R.bindQuestions(root,x.questions)}
 document.title=`${lesson.level} · ${lesson.title} — Rizu Sensei`;
 const bb=document.querySelector("#bookmarkLesson");
 if(bb)bb.onclick=()=>{const on=R.toggleBookmark("lesson",lesson.id,lesson.title,{level:lesson.level,type:lesson.type});bb.classList.toggle("on",on);bb.textContent=on?"★ Bookmarked":"☆ Bookmark"};
 const cb=document.querySelector("#completeBtn");
 if(cb)cb.onclick=()=>{R.toggleComplete(lesson.id);render()};
 const ta=document.querySelector("#lessonNote");
 if(ta){ta.oninput=()=>{R.note(lesson.id,ta.value);document.querySelector("#noteStatus").textContent="Tersimpan otomatis di browser."}}
}
render().catch(e=>{document.querySelector("#lessonContent").textContent="Lesson belum dapat dibuka: "+e.message});
