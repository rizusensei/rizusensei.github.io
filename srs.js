
const C=window.RIZU_CONTENT,R=window.RIZU,O=window.OpenJLPT;let level=R.level();const levelSel=document.querySelector("#srsLevel");levelSel.value=level;levelSel.onchange=()=>{level=levelSel.value;if(level!=="ALL")R.setLevel(level);refresh()};let queue=[],current=null,revealed=false;
function stats(){const x=R.srsStats();[["srsTotal",x.total],["srsDue",x.due],["srsLearning",x.learning],["srsMature",x.mature],["dueTop",x.due]].forEach(([id,v])=>document.querySelector("#"+id).textContent=v)}
function refresh(){queue=R.dueCards(Number.MAX_SAFE_INTEGER).filter(([,v])=>level==="ALL"||v.card.level===level).slice(0,200);current=queue[0]||null;revealed=false;stats();render()}
function render(){
 const box=document.querySelector("#srsStudy");
 if(!current){box.innerHTML=`<div class="empty-center"><span class="kicker light">ALL CLEAR</span><h2>Tidak ada kartu due pada filter ini.</h2><p>Tambahkan kata/kanji dari database atau kembali ketika interval review berikutnya tiba.</p><a class="btn light" href="vocabulary.html">Cari Vocabulary</a></div>`;return}
 const [key,x]=current,c=x.card;
 box.innerHTML=`<div class="srs-front"><span class="kicker light">${R.escape(c.type.toUpperCase())} · ${R.escape(c.level)}</span><div class="term">${R.escape(c.front)}</div><div class="sub">${revealed?R.escape(c.reading||""):"Ingat reading dan arti sebelum membuka jawaban."}</div></div>
 <div class="srs-answer ${revealed?"show":""}"><div class="meaning">${R.escape(c.back||"")}</div><p>Interval sebelumnya: ${Math.round((x.interval||0)*10)/10} hari · Ease ${(x.ease||2.5).toFixed(2)}</p></div>
 ${revealed?`<div class="srs-buttons"><button data-grade="1">Again<br><small>ulang cepat</small></button><button data-grade="2">Hard<br><small>lebih dekat</small></button><button data-grade="3">Good<br><small>normal</small></button><button data-grade="4">Easy<br><small>lebih jauh</small></button></div>`:`<button class="btn light" id="showAnswer">Tampilkan Jawaban</button>`}`;
 if(!revealed)document.querySelector("#showAnswer").onclick=()=>{revealed=true;render()};
 else document.querySelectorAll("[data-grade]").forEach(b=>b.onclick=()=>{R.reviewSRS(key,+b.dataset.grade);refresh()});
}
document.querySelector("#addStarter").onclick=async()=>{
 const selected=level==="ALL"?R.level():level;let data;try{data=(await O.load("vocab",selected)).data.slice(0,20)}catch(e){data=C.fallbackVocab.filter(x=>x.level===selected).slice(0,20)}
 data.forEach(w=>R.addSRS({type:"vocab",id:`${selected}:${w.word}:${w.reading||""}`,level:selected,front:w.word,reading:w.reading||"",back:(w.meanings||[w.meaning_id||""]).join("; ")}));refresh();
};
refresh();
