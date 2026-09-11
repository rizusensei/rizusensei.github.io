const C=window.RIZU_CONTENT,R=window.RIZU,id=new URLSearchParams(location.search).get('id'),x=C.reading.find(z=>z.id===id)||C.reading.find(z=>z.level===R.level());
R.setLevel(x.level);document.title=`${x.title} · ${x.level} — Rizu Sensei`;
function render(){
 const done=R.get().readingDone.includes(x.id),book=R.isBookmarked('reading',x.id),root=document.querySelector('#reader');
 root.innerHTML=`<article><span class="kicker">${x.level} · READING</span><h1 class="section-title">${R.escape(x.title)}</h1>${x.focus?`<p>${R.escape(x.focus)}</p>`:''}<div class="jptext" lang="ja">${R.escape(x.text)}</div><details class="summary"><summary>Ringkasan Indonesia</summary><p>${R.escape(x.summary_id)}</p></details>${x.questions.map(R.questionHTML).join('')}<div class="lesson-tools"><button id="doneRead" class="${done?'on':''}">${done?'✓ Sudah dibaca':'Tandai Selesai'}</button><button id="bookRead" class="${book?'on':''}">${book?'★ Bookmarked':'☆ Bookmark'}</button><button id="readTts">▶ Dengarkan teks</button><a class="btn outline" href="reading.html?level=${x.level}">← Library ${x.level}</a></div><p id="audioStatus" role="status"></p></article>`;
 R.bindQuestions(root,x.questions);
 document.querySelector('#doneRead').onclick=()=>{R.readingDone(x.id);render()};document.querySelector('#bookRead').onclick=()=>{R.toggleBookmark('reading',x.id,x.title,{level:x.level});render()};
 document.querySelector('#readTts').onclick=()=>R.speak(x.text,.85,m=>document.querySelector('#audioStatus').textContent=m);
}
render();
