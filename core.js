
(function(){
  const D = window.RIZU_DATA;
  window.RIZU = {
    key:"rizu_sensei_v2",
    getState(){
      try{return JSON.parse(localStorage.getItem(this.key)||'{"completed":[],"activeLevel":"N5","quizBest":{}}')}
      catch(e){return {completed:[],activeLevel:"N5",quizBest:{}}}
    },
    saveState(s){localStorage.setItem(this.key,JSON.stringify(s));window.dispatchEvent(new CustomEvent("rizu:state",{detail:s}))},
    isDone(id){return this.getState().completed.includes(id)},
    toggleDone(id,force){
      const s=this.getState(); const has=s.completed.includes(id); const next=force===undefined?!has:force;
      s.completed=next?[...new Set([...s.completed,id])]:s.completed.filter(x=>x!==id); this.saveState(s); return next;
    },
    setLevel(level){const s=this.getState();s.activeLevel=level;this.saveState(s)},
    levelProgress(level){
      const list=D.lessons.filter(x=>x.level===level); const done=list.filter(x=>this.isDone(x.id)).length;
      return {done,total:list.length,pct:list.length?Math.round(done/list.length*100):0}
    },
    nextIncomplete(level){
      return D.lessons.filter(x=>x.level===level).find(x=>!this.isDone(x.id)) || D.lessons.find(x=>!this.isDone(x.id)) || D.lessons[0];
    }
  };

  const menu=document.querySelector(".menu"),nav=document.querySelector(".nav");
  if(menu&&nav){
    menu.addEventListener("click",()=>{const o=nav.classList.toggle("open");menu.setAttribute("aria-expanded",o);document.body.classList.toggle("drawer-open",o)});
    nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");document.body.classList.remove("drawer-open")}));
  }
  document.querySelectorAll("[data-year]").forEach(x=>x.textContent=new Date().getFullYear());

  // Active nav
  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  document.querySelectorAll(".nav a").forEach(a=>{
    const href=(a.getAttribute("href")||"").split("?")[0];
    if((page==="index.html"&&href==="index.html")||href===page)a.classList.add("active");
  });
})();

if("serviceWorker" in navigator && location.protocol.startsWith("http")) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
