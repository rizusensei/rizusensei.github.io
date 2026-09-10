
const D=window.RIZU_DATA;
let level="N5",index=0,flipped=false;
const card=document.querySelector("#flashcard");
function deck(){return D.flashcards[level]}
function render(){
  const x=deck()[index];
  card.classList.toggle("flipped",flipped);
  document.querySelector("#fcKanji").textContent=x[0];
  document.querySelector("#fcReading").textContent=x[1];
  document.querySelector("#fcMeaning").textContent=x[2];
  document.querySelector("#fcCount").textContent=`${index+1} / ${deck().length}`;
  document.querySelector("#deckCount").textContent=deck().length;
}
function nav(delta){index=(index+delta+deck().length)%deck().length;flipped=false;render()}
card.addEventListener("click",()=>{flipped=!flipped;render()});
document.querySelector("#prevCard").addEventListener("click",()=>nav(-1));
document.querySelector("#nextCard").addEventListener("click",()=>nav(1));
document.querySelector("#flipCard").addEventListener("click",()=>{flipped=!flipped;render()});
document.querySelectorAll("[data-deck]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-deck]").forEach(x=>x.classList.remove("active"));b.classList.add("active");level=b.dataset.deck;index=0;flipped=false;render()}));
render();
