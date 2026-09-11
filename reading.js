
const C=window.RIZU_CONTENT,R=window.RIZU;let level=new URLSearchParams(location.search).get("level")||"ALL";if(![...C.levels,"ALL"].includes(level))level="ALL";
function render(){
 const list=C.reading.filter(x=>level==="ALL"||x.level===level),s=R.get();
 document.querySelector("#readDoneCount").textContent=s.readingDone.length;
 document.querySelector("#readingGrid").innerHTML=list.map(x=>`<article class="reading-card ${s.readingDone.includes(x.id)?"done":""}">
 <div class="read-meta"><span>${x.level}</span><span>± ${x.estimated} min</span></div><h2>${x.title}</h2><p class="preview">${x.text.slice(0,100)}${x.text.length>100?"…":""}</p>
 <footer><button class="chip ${R.isBookmarked("reading",x.id)?"active":""}" data-b="${x.id}">${R.isBookmarked("reading",x.id)?"★":"☆"} Bookmark</button><a href="reader.html?id=${x.id}">Baca →</a></footer></article>`).join("");
 document.querySelectorAll("[data-b]").forEach(b=>b.onclick=()=>{const x=C.reading.find(z=>z.id===b.dataset.b);R.toggleBookmark("reading",x.id,x.title,{level:x.level});render()});
}
document.querySelectorAll("[data-read-level]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-read-level]").forEach(x=>x.classList.remove("active"));b.classList.add("active");level=b.dataset.readLevel;if(level!=="ALL")R.setLevel(level);render()});document.querySelectorAll("[data-read-level]").forEach(b=>b.classList.toggle("active",b.dataset.readLevel===level));render();
