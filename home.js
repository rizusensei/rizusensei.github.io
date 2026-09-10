
const D=window.RIZU_DATA,R=window.RIZU;
["N5","N4","N3"].forEach(level=>{
  const p=R.levelProgress(level),el=document.querySelector(`[data-summary="${level}"]`);
  if(el){el.querySelector("strong").textContent=`${p.done}/${p.total}`;el.querySelector(".progressbar span").style.width=p.pct+"%";el.querySelector("[data-pct]").textContent=p.pct+"% selesai";}
});
const next=R.nextIncomplete(R.getState().activeLevel);
const continueBtn=document.querySelector("#continueBtn");
if(continueBtn){continueBtn.href=`learn.html?id=${next.id}`;continueBtn.querySelector("span").textContent=`Lanjut ${next.level}: ${next.title}`;}
