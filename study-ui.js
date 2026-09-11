(()=>{
 const C=window.RIZU_CONTENT,R=window.RIZU;
 R.escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 R.level=()=>{const p=new URLSearchParams(location.search).get('level');return C.levels.includes(p)?p:C.levels.includes(R.get().settings.activeLevel)?R.get().settings.activeLevel:'N5'};
 R.setLevel=level=>{if(C.levels.includes(level)){const s=R.get();s.settings.activeLevel=level;R.save(s)}};
 R.shuffle=items=>{const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 R.speak=(text,rate=.9,onError)=>{if(!('speechSynthesis' in window)){onError?.('Browser ini tidak mendukung TTS. Gunakan transkrip untuk latihan.');return false}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ja-JP';u.rate=rate;const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('ja'));if(v)u.voice=v;u.onerror=()=>onError?.('Audio tidak dapat diputar. Pastikan voice Jepang tersedia di perangkat.');speechSynthesis.speak(u);return true};
 R.questionHTML=(q,index)=>`<div class="reader-question" data-question="${index}"><h3>${R.escape(q.q)}</h3><div class="reader-options">${q.choices.map((v,i)=>`<button type="button" data-choice="${i}">${R.escape(v)}</button>`).join('')}</div><p class="feedback" aria-live="polite"></p></div>`;
 R.bindQuestions=(root,questions)=>root.querySelectorAll('[data-question]').forEach(block=>{const q=questions[+block.dataset.question];let answered=false;block.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{if(answered)return;answered=true;const chosen=+b.dataset.choice;block.querySelectorAll('[data-choice]').forEach(z=>{z.disabled=true;z.classList.toggle('correct',+z.dataset.choice===q.answer);z.classList.toggle('wrong',z===b&&chosen!==q.answer)});block.querySelector('.feedback').textContent=(chosen===q.answer?'Benar. ':'Belum tepat. ')+q.explain})});
 window.addEventListener('pagehide',()=>{if('speechSynthesis' in window)speechSynthesis.cancel()});
})();
