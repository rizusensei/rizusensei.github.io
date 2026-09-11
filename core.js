
(function(){
 const C=window.RIZU_CONTENT,KEY="rizu_sensei_v3";
 const blank=()=>({version:5,completed:[],guideDone:[],bookmarks:[],notes:{},activity:{},srs:{},quizBest:{},mockHistory:[],readingDone:[],listeningDone:[],settings:{activeLevel:"N5",dailyNew:15,dailyReview:60}});
 function validate(x){
 if(!x||![3,4,5].includes(x.version))throw Error("Gunakan backup Rizu Sensei v3, v4, atau v5.");
 const object=v=>v&&typeof v==="object"&&!Array.isArray(v);
 const inspect=v=>{if(v&&typeof v==="object")for(const k of Object.keys(v)){if(["__proto__","constructor","prototype"].includes(k))throw Error("Kunci backup tidak valid.");inspect(v[k])}};inspect(x);
 for(const k of ["completed","readingDone","listeningDone","guideDone"])if(x[k]!==undefined&&(!Array.isArray(x[k])||x[k].some(v=>typeof v!=="string")))throw Error("Daftar progress tidak valid: "+k);
 for(const k of ["notes","activity","srs","quizBest","settings"])if(x[k]!==undefined&&!object(x[k]))throw Error("Bagian backup tidak valid: "+k);
 if(x.notes&&Object.values(x.notes).some(v=>typeof v!=="string"))throw Error("Catatan tidak valid.");
 if(x.bookmarks!==undefined&&(!Array.isArray(x.bookmarks)||x.bookmarks.some(b=>!object(b)||typeof b.id!=="string"||typeof b.kind!=="string"||typeof b.label!=="string")))throw Error("Bookmark tidak valid.");
 if(x.mockHistory!==undefined&&(!Array.isArray(x.mockHistory)||x.mockHistory.some(m=>!object(m)||!C.levels.includes(m.level)||typeof m.mode!=="string"||!Number.isFinite(m.pct)||!Number.isFinite(m.at))))throw Error("Riwayat mock tidak valid.");
 if(x.srs)for(const v of Object.values(x.srs)){if(!object(v)||!object(v.card)||typeof v.card.front!=="string"||typeof v.card.type!=="string"||!C.levels.includes(v.card.level))throw Error("Kartu SRS tidak valid.");for(const k of ["due","interval","ease","reps","lapses"])if(v[k]!==undefined&&(!Number.isFinite(v[k])||v[k]<0))throw Error("Jadwal SRS tidak valid.")}
 if(x.activity&&Object.values(x.activity).some(a=>!object(a)||Object.values(a).some(v=>!Number.isFinite(v)||v<0)))throw Error("Kalender aktivitas tidak valid.");
 const out=Object.assign(blank(),x,{version:5,settings:Object.assign(blank().settings,x.settings||{})});
 if(!C.levels.includes(out.settings.activeLevel))out.settings.activeLevel="N5";
 for(const k of ["completed","readingDone","listeningDone","guideDone"])out[k]=[...new Set(out[k])];return out;
 }
 function get(){try{const raw=localStorage.getItem(KEY),x=JSON.parse(raw||"null");if(!x)return blank();const next=validate(x);if(x.version===3){try{if(!localStorage.getItem(KEY+"_before_v4"))localStorage.setItem(KEY+"_before_v4",raw)}catch{}}return next}catch(e){return blank()}}
 function save(s){localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent("rizu:state",{detail:s}))}
 function today(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
 function activity(kind,amount=1){const s=get(),k=today();s.activity[k]||={events:0,reviews:0,lessons:0,quiz:0,mock:0,reading:0,minutes:0};s.activity[k].events++;if(kind&&s.activity[k][kind]!==undefined)s.activity[k][kind]+=amount;save(s)}
 function streak(){const s=get(),dates=Object.keys(s.activity).filter(k=>(s.activity[k]?.events||0)>0||(s.activity[k]?.minutes||0)>0).sort();let best=0,run=0,prev=null;for(const k of dates){const d=new Date(k+"T00:00:00");run=prev&&Math.round((d-prev)/86400000)===1?run+1:1;best=Math.max(best,run);prev=d}let current=0,d=new Date();if(!(s.activity[today(d)]?.events||s.activity[today(d)]?.minutes))d.setDate(d.getDate()-1);for(let i=0;i<10000;i++){const k=today(d);if((s.activity[k]?.events||0)>0||(s.activity[k]?.minutes||0)>0){current++;d.setDate(d.getDate()-1)}else break}return{current,best,days:dates.length}}
 const completed=id=>get().completed.includes(id);
 function toggleComplete(id){const s=get(),has=s.completed.includes(id);s.completed=has?s.completed.filter(x=>x!==id):[...new Set([...s.completed,id])];save(s);if(!has)activity("lessons");return!has}
 function toggleBookmark(kind,id,label,meta={}){const s=get(),i=s.bookmarks.findIndex(x=>x.kind===kind&&x.id===id);if(i>=0)s.bookmarks.splice(i,1);else s.bookmarks.unshift({kind,id,label,meta,at:Date.now()});save(s);return i<0}
 const isBookmarked=(kind,id)=>get().bookmarks.some(x=>x.kind===kind&&x.id===id);
 function note(id,v){const s=get();if(v.trim())s.notes[id]=v;else delete s.notes[id];save(s)}
 const getNote=id=>get().notes[id]||"";
 function readingDone(id,force){const s=get(),has=s.readingDone.includes(id),next=force===undefined?!has:force;s.readingDone=next?[...new Set([...s.readingDone,id])]:s.readingDone.filter(x=>x!==id);save(s);if(next&&!has)activity("reading");return next}
 function lessonProgress(level){const list=C.curriculum.filter(x=>x.level===level),done=list.filter(x=>completed(x.id)).length;return{done,total:list.length,pct:list.length?Math.round(done/list.length*100):0}}
 const srsKey=c=>`${c.type}:${c.level}:${c.id||c.front}`;
 function addSRS(card){const s=get(),k=srsKey(card);if(!s.srs[k])s.srs[k]={card,added:Date.now(),due:Date.now(),interval:0,ease:2.5,reps:0,lapses:0,last:null};save(s);return k}
 function removeSRS(k){const s=get();delete s.srs[k];save(s)}
 function dueCards(limit=200){const s=get(),now=Date.now();return Object.entries(s.srs).filter(([,v])=>(v.due||0)<=now).sort((a,b)=>(a[1].due||0)-(b[1].due||0)).slice(0,limit)}
 function reviewSRS(k,g){const s=get(),x=s.srs[k];if(!x)return;const DAY=86400000;g=+g;if(g<=1){x.reps=0;x.interval=.02;x.lapses=(x.lapses||0)+1;x.ease=Math.max(1.3,(x.ease||2.5)-.2)}else{if(x.reps===0)x.interval=g===2?.25:g===3?1:3;else if(x.reps===1)x.interval=g===2?1:g===3?3:6;else{x.ease=Math.max(1.3,(x.ease||2.5)+(g===4?.15:g===2?-.15:0));x.interval=Math.max(1,Math.round((x.interval||1)*x.ease*(g===2?.7:g===4?1.25:1)))}x.reps=(x.reps||0)+1}x.last=Date.now();x.due=Date.now()+x.interval*DAY;save(s);activity("reviews");return x}
 function srsStats(){const v=Object.values(get().srs),now=Date.now();return{total:v.length,due:v.filter(x=>(x.due||0)<=now).length,mature:v.filter(x=>(x.interval||0)>=21).length,learning:v.filter(x=>(x.interval||0)>0&&(x.interval||0)<21).length,new:v.filter(x=>(x.reps||0)===0).length}}
 function mockResult(r){const s=get();s.mockHistory.unshift(r);s.mockHistory=s.mockHistory.slice(0,30);save(s);activity("mock")}
 function exportData(){const blob=new Blob([JSON.stringify(get(),null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`rizu-sensei-backup-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 async function importData(file){const x=validate(JSON.parse(await file.text()));save(x)}
 function resetData(){localStorage.removeItem(KEY);localStorage.removeItem(KEY+"_before_v4")}
 function listeningDone(id){const s=get();if(s.listeningDone.includes(id))s.listeningDone=s.listeningDone.filter(x=>x!==id);else{s.listeningDone.push(id)}save(s);activity();return s.listeningDone.includes(id)}
 function guideDone(id){const s=get(),has=s.guideDone.includes(id);s.guideDone=has?s.guideDone.filter(x=>x!==id):[...s.guideDone,id];save(s);if(!has)activity();return !has}
 window.RIZU={guideDone,KEY,get,save,validate,listeningDone,today,activity,streak,completed,toggleComplete,toggleBookmark,isBookmarked,note,getNote,readingDone,lessonProgress,srsKey,addSRS,removeSRS,dueCards,reviewSRS,srsStats,mockResult,exportData,importData,resetData};
 const menu=document.querySelector(".menu"),nav=document.querySelector(".nav");if(menu&&nav){menu.onclick=()=>{const o=nav.classList.toggle("open");menu.setAttribute("aria-expanded",o);document.body.classList.toggle("drawer-open",o)};nav.querySelectorAll("a").forEach(a=>a.onclick=()=>{nav.classList.remove("open");document.body.classList.remove("drawer-open")})}
 document.querySelectorAll("[data-year]").forEach(x=>x.textContent=new Date().getFullYear());
 const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();document.querySelectorAll(".nav a").forEach(a=>{if((a.getAttribute("href")||"").split("?")[0]===page)a.classList.add("active")});
 let sec=0;setInterval(()=>{if(!document.hidden){sec+=30;if(sec%60===0){const s=get(),k=today();s.activity[k]||={events:0,reviews:0,lessons:0,quiz:0,mock:0,reading:0,minutes:0};s.activity[k].minutes=(s.activity[k].minutes||0)+1;save(s)}}},30000);
})();
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
