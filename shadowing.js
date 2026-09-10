
const D=window.RIZU_DATA;
let activeLevel="N5",active=null,mediaRecorder=null,chunks=[],stream=null;
const list=document.querySelector("#shadowList");
function voices(){return speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.toLowerCase().startsWith("ja"))}
function renderList(){
  const items=D.shadowing.filter(x=>x.level===activeLevel); active=items[0];
  list.innerHTML=items.map((x,i)=>`<button class="shadow-item ${i===0?"active":""}" data-id="${x.id}"><b>${x.jp}</b><span>${x.reading}</span></button>`).join("");
  list.querySelectorAll("button").forEach(btn=>btn.onclick=()=>{list.querySelectorAll("button").forEach(x=>x.classList.remove("active"));btn.classList.add("active");active=D.shadowing.find(x=>x.id===btn.dataset.id);renderActive()});
  renderActive();
}
function renderActive(){document.querySelector("#shadowLevel").textContent=`JLPT ${active.level} · SHADOWING`;document.querySelector("#shadowJp").textContent=active.jp;document.querySelector("#shadowRomaji").textContent=active.reading}
document.querySelector("#playTts").onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(active.jp);u.lang="ja-JP";u.rate=0.85;const vs=voices();if(vs[0])u.voice=vs[0];speechSynthesis.speak(u)};
document.querySelector("#playSlow").onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(active.jp);u.lang="ja-JP";u.rate=0.62;const vs=voices();if(vs[0])u.voice=vs[0];speechSynthesis.speak(u)};
const recBtn=document.querySelector("#recordBtn"),status=document.querySelector("#recordStatus"),audio=document.querySelector("#audioPlayback");
recBtn.onclick=async()=>{
  if(mediaRecorder&&mediaRecorder.state==="recording"){mediaRecorder.stop();return}
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];mediaRecorder=new MediaRecorder(stream);
    mediaRecorder.ondataavailable=e=>chunks.push(e.data);
    mediaRecorder.onstop=()=>{const blob=new Blob(chunks,{type:mediaRecorder.mimeType});audio.src=URL.createObjectURL(blob);audio.classList.remove("hide");stream.getTracks().forEach(t=>t.stop());recBtn.textContent="● Rekam Ulang";status.textContent="Rekaman siap. Dengarkan dan bandingkan dengan contoh.";status.classList.remove("rec")};
    mediaRecorder.start();recBtn.textContent="■ Stop Rekaman";status.textContent="Sedang merekam… baca kalimat di atas.";status.classList.add("rec");
  }catch(e){status.textContent="Mikrofon tidak tersedia/izin ditolak. TTS tetap bisa digunakan."}
};
document.querySelectorAll("[data-shadow-level]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-shadow-level]").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeLevel=b.dataset.shadowLevel;renderList()});
renderList();
