// Pure exam logic, shared by the UI and regression checks.
(function(host){
 function shuffle(items,random=Math.random){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
 function options(correct,pool,random){const alternatives=shuffle([...new Set(pool.filter(x=>x&&x!==correct))],random).slice(0,3);const choices=shuffle([correct,...alternatives],random);return{choices,answer:choices.indexOf(correct)}}
 function timerGroup(level,skill){return ['N2','N1'].includes(level)?skill==='Listening'?'Listening':'Language & Reading':skill==='Vocabulary'?'Vocabulary':skill==='Listening'?'Listening':'Grammar & Reading'}
 function scoringGroup(level,skill){if(['N5','N4'].includes(level))return skill==='Listening'?'Listening':'Language & Reading';return ['Vocabulary','Grammar'].includes(skill)?'Language Knowledge':skill}
 function build(C,level,mode,vocab,random=Math.random){
  if(!C.levels.includes(level))throw Error('Level tidak valid');
  const full=mode==='full',qs=[];
  const add=(skill,q)=>{const order=shuffle(q.choices.map((_,i)=>i),random);qs.push({...q,choices:order.map(i=>q.choices[i]),answer:order.indexOf(q.answer),skill,section:timerGroup(level,skill),scoring:scoringGroup(level,skill)})};
  const pool=vocab.filter(v=>v.word&&(v.meanings||[v.meaning_id]).some(Boolean));
  shuffle(pool,random).slice(0,full?20:5).forEach((v,i)=>{const reading=i%3===0&&v.reading,correct=reading?v.reading:(v.meanings||[v.meaning_id])[0],all=reading?pool.map(x=>x.reading):pool.flatMap(x=>x.meanings||[x.meaning_id]);add('Vocabulary',{q:reading?`読み方を選んでください：${v.word}`:`Arti paling dekat dari 「${v.word}」（${v.reading||''}）?`,...options(correct,all,random),explain:`${v.word}（${v.reading||''}）: ${(v.meanings||[v.meaning_id]).join('; ')}`})});
  shuffle(C.grammar[level],random).slice(0,full?15:4).forEach(g=>add('Grammar',g.quiz?{...g.quiz}:{q:`Fungsi pola 「${g.pattern}」?`,...options(g.meaning_id,C.grammar[level].map(g=>g.meaning_id),random),explain:`${g.pattern}: ${g.meaning_id}. ${g.ja} — ${g.id}`}));
  shuffle(C.reading.filter(x=>x.level===level),random).slice(0,full?8:3).forEach(r=>{const q=shuffle(r.questions,random)[0];add('Reading',{...q,passage:r.text,q:`【${r.title}】 ${q.q}`})});
  const scripts=C.shadowing.filter(x=>x.level===level);shuffle(scripts,random).slice(0,full?10:3).forEach(s=>add('Listening',{...(s.question?{...s.question}:{q:'Dengarkan kalimat. Makna yang paling dekat?',...options(s.meaning_id,scripts.map(x=>x.meaning_id),random),explain:s.meaning_id}),audio:s.ja}));
  if(qs.some(q=>q.choices.length<2))throw Error('Bank soal belum memadai');return qs;
 }
 function seconds(C,level,section){const t=C.officialExam2026[level];return (section==='Language & Reading'?t.combined:section==='Vocabulary'?t.vocab:section==='Listening'?t.listening:t.grammarReading)*60}
 function session(C,level,mode,questions,now=Date.now()){return{level,mode,questions,answers:Array(questions.length).fill(null),i:0,started:now,deadline:now+(mode==='quick'?900:seconds(C,level,questions[0].section))*1000,finished:false}}
 function advance(C,e,now=Date.now(),timeout=false){if(e.finished)return;const old=e.questions[e.i]?.section;if(timeout&&e.mode==='quick')e.i=e.questions.length;else if(timeout){while(e.i<e.questions.length&&e.questions[e.i].section===old)e.i++}else e.i++;if(e.i>=e.questions.length){e.finished=true;return}if(e.mode==='full'&&e.questions[e.i].section!==old)e.deadline=now+seconds(C,e.level,e.questions[e.i].section)*1000}
 function result(e,now=Date.now()){let ok=0;const sections={};e.questions.forEach((q,i)=>{sections[q.scoring]||={ok:0,total:0};sections[q.scoring].total++;if(e.answers[i]===q.answer){ok++;sections[q.scoring].ok++}});const pct=Math.round(ok/e.questions.length*100);return{at:now,level:e.level,mode:e.mode,pct,sim:Math.round(pct*1.8),total:e.questions.length,sections,durationMin:Math.max(1,Math.round((now-e.started)/60000))}}
 host.RIZU_EXAM={build,seconds,session,advance,result,timerGroup,scoringGroup};
})(typeof window!=='undefined'?window:globalThis);
