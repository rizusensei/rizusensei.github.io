
const D=window.RIZU_DATA,R=window.RIZU;
const params=new URLSearchParams(location.search);
let lesson=D.lessons.find(x=>x.id===params.get("id"))||D.lessons[0];

function renderSidebar(){
  const wrap=document.querySelector("#courseSidebar");
  wrap.innerHTML=`<div class="sidebar-head"><span class="kicker">COURSE MAP</span><h2>N5 → N3</h2><p>Progress tersimpan di browser ini.</p></div>`+
  ["N5","N4","N3"].map(level=>{
    const list=D.lessons.filter(x=>x.level===level),p=R.levelProgress(level);
    return `<div class="course-level"><button type="button"><span>JLPT ${level}</span><span>${p.pct}%</span></button><div class="lesson-list">${
      list.map((x,i)=>`<a class="lesson-link ${x.id===lesson.id?"active":""} ${R.isDone(x.id)?"done":""}" href="learn.html?id=${x.id}"><span class="num">${R.isDone(x.id)?"✓":String(i+1).padStart(2,"0")}</span><span>${x.title}<small class="cat">${x.category}</small></span><span class="arrow">→</span></a>`).join("")
    }</div></div>`
  }).join("");
}
function promoForLesson(){
  const mapping={Reading:"situasi-premium",Vocabulary:"situasi-free",Grammar:"mensetsu-trial",Kanji:"mensetsu-premium"};
  if(lesson.level==="N3"&&lesson.category==="Reading")return D.products.find(x=>x.id==="situasi-premium");
  return D.products.find(x=>x.id===mapping[lesson.category])||D.products[0];
}
function renderLesson(){
  R.setLevel(lesson.level); renderSidebar();
  const idx=D.lessons.findIndex(x=>x.id===lesson.id),prev=D.lessons[idx-1],next=D.lessons[idx+1],done=R.isDone(lesson.id),promo=promoForLesson();
  document.title=`${lesson.title} — Rizu Sensei`;
  const main=document.querySelector("#lessonContent");
  main.innerHTML=`
    <div class="lesson-topline"><div class="lesson-breadcrumb">Belajar / ${lesson.level} / ${lesson.category}</div><div class="lesson-status">${done?"✓ SUDAH SELESAI":"BELUM SELESAI"}</div></div>
    <section class="lesson-hero"><span class="jp">${lesson.jpTitle}</span><h1>${lesson.title}</h1><p>${lesson.summary}</p><div class="lesson-meta"><span>${lesson.level}</span><span>${lesson.category}</span><span>${lesson.duration}</span></div></section>
    <section class="objectives"><h3>Target Lesson</h3><ul>${lesson.outcomes.map(x=>`<li>✓ ${x}</li>`).join("")}</ul></section>
    ${lesson.sections.map(s=>`<section class="lesson-section"><h2>${s.heading}</h2><p>${s.body}</p>${s.examples?`<div class="example-list">${s.examples.map(e=>`<div class="example"><b>${e[0]}</b><span>${e[1]}</span></div>`).join("")}</div>`:""}</section>`).join("")}
    <section class="practice-box"><span class="kicker light">QUICK CHECK</span><h2>Cek pemahaman.</h2><p>Jawab tanpa melihat bagian materi di atas jika bisa.</p>${lesson.practice.map((q,qi)=>`
      <div class="practice-q" data-q="${qi}"><strong>${qi+1}. ${q.q}</strong><div class="practice-options">${q.choices.map((c,ci)=>`<button type="button" data-answer="${ci}">${c}</button>`).join("")}</div><div class="explain">${q.explain}</div></div>`).join("")}</section>
    <section class="complete-card"><div><h3>${done?"Lesson sudah selesai.":"Selesai belajar?"}</h3><p>${done?"Progress ini sudah tersimpan di perangkat Anda.":"Tandai selesai agar dashboard dan navigasi ikut ter-update."}</p></div><button id="completeBtn" class="btn ${done?"completed":"red"}" type="button">${done?"✓ Selesai":"Tandai Selesai"}</button></section>
    <aside class="inline-promo"><div class="promo-symbol">${promo.symbol}</div><div><small>REKOMENDASI DARI ARIEFANOISME · ${promo.badge}</small><h3>${promo.title}</h3><p>${promo.tagline}</p></div><a href="${promo.url}" target="_blank" rel="noopener">Lihat di Lynk.id ↗</a></aside>
    <nav class="lesson-nav">${prev?`<a href="learn.html?id=${prev.id}"><small>← SEBELUMNYA</small>${prev.title}</a>`:"<span></span>"}${next?`<a href="learn.html?id=${next.id}"><small>BERIKUTNYA →</small>${next.title}</a>`:`<a href="quiz.html?level=${lesson.level}"><small>SELANJUTNYA →</small>Quiz ${lesson.level}</a>`}</nav>
  `;
  document.querySelectorAll(".practice-q").forEach(box=>{
    const qi=Number(box.dataset.q),q=lesson.practice[qi];
    box.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
      if(box.dataset.answered)return; box.dataset.answered="1";
      const chosen=Number(btn.dataset.answer);
      box.querySelectorAll("button").forEach((b,i)=>{if(i===q.answer)b.classList.add("correct");else if(i===chosen)b.classList.add("wrong")});
      box.querySelector(".explain").classList.add("show");
    }));
  });
  document.querySelector("#completeBtn").addEventListener("click",()=>{
    const now=R.toggleDone(lesson.id);
    renderLesson();
    if(now&&next)setTimeout(()=>{document.querySelector(".complete-card").scrollIntoView({behavior:"smooth",block:"center"})},10);
  });
}
renderLesson();
