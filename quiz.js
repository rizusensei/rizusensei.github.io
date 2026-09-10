
const D=window.RIZU_DATA,R=window.RIZU;
const params=new URLSearchParams(location.search);
let level=params.get("level")||"N5",questions=[],i=0,score=0,answered=false;
function build(){
  const fromLessons=D.lessons.filter(x=>x.level===level).flatMap(x=>x.practice.map(q=>({...q,level})));
  questions=[...fromLessons,...D.extraQuiz.filter(x=>x.level===level)].sort(()=>Math.random()-.5).slice(0,10);
}
function render(){
  const box=document.querySelector("#quizBox");
  if(i>=questions.length){
    const pct=Math.round(score/questions.length*100); const s=R.getState();s.quizBest=s.quizBest||{};s.quizBest[level]=Math.max(s.quizBest[level]||0,pct);R.saveState(s);
    box.innerHTML=`<div class="quiz-card score-card"><span class="kicker">RESULT</span><strong>${pct}%</strong><h2>${score} dari ${questions.length} benar</h2><p>${pct>=80?"Bagus. Lanjutkan ke materi berikutnya atau ulang untuk menguatkan ingatan.":pct>=60?"Fondasi sudah ada. Review jawaban salah lalu coba lagi.":"Kembali ke lesson dan kuatkan bagian yang masih lemah."}</p><div style="display:flex;gap:8px;justify-content:center;margin-top:22px"><button class="btn red" id="retry">Ulang Quiz</button><a class="btn outline" href="learn.html?id=${R.nextIncomplete(level).id}">Kembali Belajar</a></div></div>`;
    document.querySelector("#retry").onclick=()=>{i=0;score=0;build();render()};return;
  }
  const q=questions[i]; answered=false;
  box.innerHTML=`<div class="quiz-card"><div class="quiz-progress"><span>JLPT ${level}</span><span>${i+1} / ${questions.length}</span></div><div class="progressbar"><span style="width:${i/questions.length*100}%"></span></div><h2>${q.q}</h2><div class="quiz-options">${q.choices.map((c,ci)=>`<button data-a="${ci}">${String.fromCharCode(65+ci)}. ${c}</button>`).join("")}</div><div class="quiz-feedback" id="feedback"></div><div class="quiz-next"><button class="btn dark hide" id="nextQ">${i===questions.length-1?"Lihat Hasil":"Soal Berikutnya →"}</button></div></div>`;
  document.querySelectorAll(".quiz-options button").forEach(btn=>btn.onclick=()=>{
    if(answered)return;answered=true;const a=Number(btn.dataset.a);if(a===q.answer)score++;
    document.querySelectorAll(".quiz-options button").forEach((b,bi)=>{if(bi===q.answer)b.classList.add("correct");else if(bi===a)b.classList.add("wrong")});
    document.querySelector("#feedback").textContent=(a===q.answer?"✓ Benar. ":"Belum tepat. ")+q.explain;
    document.querySelector("#nextQ").classList.remove("hide");
  });
  document.querySelector("#nextQ").onclick=()=>{i++;render()};
}
document.querySelectorAll("[data-quiz-level]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-quiz-level]").forEach(x=>x.classList.remove("active"));b.classList.add("active");level=b.dataset.quizLevel;i=0;score=0;build();render()}));
document.querySelector(`[data-quiz-level="${level}"]`)?.classList.add("active");
build();render();
