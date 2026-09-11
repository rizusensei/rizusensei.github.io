
const C=window.RIZU_CONTENT,R=window.RIZU;let level=R.level(),qs=[],i=0,score=0;
function build(){
 const gs=C.grammar[level].slice().sort(()=>Math.random()-.5).slice(0,6).map(g=>{if(g.quiz)return {...g.quiz};const pool=C.grammar[level].filter(x=>x.pattern!==g.pattern).sort(()=>Math.random()-.5).slice(0,3),choices=[g.meaning_id,...pool.map(x=>x.meaning_id)].sort(()=>Math.random()-.5);return{q:`Apa fungsi utama pola ${g.pattern}?`,choices,answer:choices.indexOf(g.meaning_id),explain:`${g.pattern}: ${g.meaning_id}`}});
 const rs=C.reading.filter(x=>x.level===level).sort(()=>Math.random()-.5).slice(0,4).map(x=>({...x.questions[0],passage:x.text,q:`【${x.title}】 ${x.questions[0].q}`}));
 qs=[...gs,...rs].sort(()=>Math.random()-.5);i=0;score=0;render();
}
function render(){
 const box=document.querySelector("#quizBox");
 if(i>=qs.length){const pct=Math.round(score/qs.length*100),s=R.get();s.quizBest[level]=Math.max(s.quizBest[level]||0,pct);R.save(s);R.activity("quiz");box.innerHTML=`<div class="quiz-card score-card"><span class="kicker">RESULT</span><strong>${pct}%</strong><h2>${score}/${qs.length} benar</h2><p>Best score ${level}: ${s.quizBest[level]}%</p><button class="btn red" id="again">Ulang Quiz</button></div>`;document.querySelector("#again").onclick=build;return}
 const q=qs[i];box.innerHTML=`<div class="quiz-card"><div class="quiz-progress"><span>${level}</span><span>${i+1}/${qs.length}</span></div><div class="progressbar"><span style="width:${i/qs.length*100}%"></span></div>${q.passage?`<div class="reading-passage">${R.escape(q.passage)}</div>`:""}<h2>${R.escape(q.q)}</h2><div class="quiz-options">${q.choices.map((c,a)=>`<button data-a="${a}">${String.fromCharCode(65+a)}. ${R.escape(c)}</button>`).join("")}</div><div class="quiz-feedback" id="fb"></div><div class="quiz-next"><button class="btn dark hide" id="next">Berikutnya →</button></div></div>`;
 let answered=false;document.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{if(answered)return;answered=true;const a=+b.dataset.a;if(a===q.answer)score++;document.querySelectorAll("[data-a]").forEach((x,j)=>{if(j===q.answer)x.classList.add("correct");else if(j===a)x.classList.add("wrong")});document.querySelector("#fb").textContent=q.explain;document.querySelector("#next").classList.remove("hide")});document.querySelector("#next").onclick=()=>{i++;render()};
}
document.querySelectorAll("[data-ql]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-ql]").forEach(x=>x.classList.remove("active"));b.classList.add("active");level=b.dataset.ql;R.setLevel(level);build()});document.querySelectorAll("[data-ql]").forEach(b=>b.classList.toggle("active",b.dataset.ql===level));build();
