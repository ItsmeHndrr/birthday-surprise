// PERSONALISASI CEPAT: ubah nilai di bawah sebelum deploy.
const DEFAULTS = {
  recipient: "kamu",
  sender: "someone who cares",
  message: "Semoga hari-harimu selalu dipenuhi hal-hal baik, tawa yang tulus, dan orang-orang yang menyayangimu. Terima kasih sudah menjadi seseorang yang begitu berarti.",
  birthday: "" // Format YYYY-MM-DD, contoh: 2026-11-15
};

const $ = (id) => document.getElementById(id);
const state = { heroPhoto: "", galleryPhotos: [] };

function applyText(data) {
  const name = (data.recipient || DEFAULTS.recipient).trim();
  $("heroName").textContent = name;
  $("messageName").textContent = name === "kamu" ? "orang hebat!" : name + "!";
  $("senderName").textContent = data.sender || DEFAULTS.sender;
  $("birthdayMessage").textContent = data.message || DEFAULTS.message;
  if (data.birthday) $("countdownTitle").textContent = "Menuju hari ulang tahun " + name + ".";
}
function readImage(file, maxSize=1100, quality=.78) {
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1,maxSize/Math.max(img.width,img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width*scale); canvas.height = Math.round(img.height*scale);
        canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL("image/jpeg",quality));
      };
      img.onerror = reject; img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function setPhoto(target, src) {
  const node = $(target);
  node.innerHTML = "";
  if (src) { const img = document.createElement("img"); img.src=src; img.alt="Foto kenangan"; node.appendChild(img); }
}
function renderGallery(photos) {
  const gallery = $("gallery");
  gallery.innerHTML = "";
  const defaults = [
    ["✧","your favorite moment","little moments, big memories"],
    ["♡","smile a little more","keep this memory close"],
    ["✿","one for the album","the best is yet to come"]
  ];
  const list = photos.length ? photos.slice(0,3) : ["","",""];
  list.forEach((photo,i)=>{
    const figure=document.createElement("figure");
    figure.className="memory "+["memory-tall","memory-offset","memory-small"][i];
    const frame=document.createElement("div"); frame.className="memory-placeholder "+["placeholder-one","placeholder-two","placeholder-three"][i];
    if(photo){const img=document.createElement("img");img.src=photo;img.alt="Foto kenangan "+(i+1);frame.appendChild(img);}
    else {const icon=document.createElement("span");icon.textContent=defaults[i][0];const small=document.createElement("small");small.textContent=defaults[i][1];frame.append(icon,small);}
    const cap=document.createElement("figcaption");cap.textContent=defaults[i][2];
    const num=document.createElement("b");num.textContent=String(i+1).padStart(2,"0");cap.appendChild(num);
    figure.append(frame,cap);gallery.appendChild(figure);
  });
  $("photoCount").textContent="01 — "+String(photos.length || 3).padStart(2,"0");
}
function countdownTick() {
  const date = localStorage.getItem("bs_birthday") || DEFAULTS.birthday;
  if (!date) { ["days","hours","minutes","seconds"].forEach(id=>$(id).textContent="00"); return; }
  const now=new Date(), parts=date.split("-").map(Number);
  let target=new Date(now.getFullYear(),parts[1]-1,parts[2],0,0,0);
  if(target<now) target.setFullYear(target.getFullYear()+1);
  let diff=Math.max(0,target-now);
  const d=Math.floor(diff/86400000); diff%=86400000;
  const h=Math.floor(diff/3600000); diff%=3600000;
  const m=Math.floor(diff/60000); const s=Math.floor((diff%60000)/1000);
  $("days").textContent=String(d).padStart(2,"0");
  $("hours").textContent=String(h).padStart(2,"0");
  $("minutes").textContent=String(m).padStart(2,"0");
  $("seconds").textContent=String(s).padStart(2,"0");
}
function loadSaved() {
  try {
    const saved=JSON.parse(localStorage.getItem("bs_custom")||"{}");
    applyText({...DEFAULTS,...saved});
    const hero=localStorage.getItem("bs_hero")||"";
    state.heroPhoto=hero; if(hero)setPhoto("heroPhoto",hero);
    state.galleryPhotos=JSON.parse(localStorage.getItem("bs_gallery")||"[]");
    renderGallery(state.galleryPhotos);
    $("recipientInput").value=saved.recipient||"";
    $("senderInput").value=saved.sender||"";
    $("messageInput").value=saved.message||"";
    $("dateInput").value=localStorage.getItem("bs_birthday")||DEFAULTS.birthday;
  } catch(e) { console.warn("Tidak dapat membaca personalisasi tersimpan",e); }
}
$("startBtn").addEventListener("click",()=>{ $("message").scrollIntoView({behavior:"smooth"}); });
$("wishBtn").addEventListener("click",()=>{
  $("wishResponse").textContent="Aamiin. Semoga satu per satu harapanmu menemukan jalannya. ✨";
  for(let i=0;i<18;i++){const bit=document.createElement("i");bit.className="confetti";bit.textContent=["✦","♡","✧"][i%3];bit.style.left=Math.random()*100+"vw";bit.style.animationDelay=Math.random()*.7+"s";document.body.appendChild(bit);setTimeout(()=>bit.remove(),2200);}
});
$("editOpen").addEventListener("click",()=>{$("editModal").classList.add("open");$("editModal").setAttribute("aria-hidden","false");});
function closeModal(){$("editModal").classList.remove("open");$("editModal").setAttribute("aria-hidden","true");}
$("editClose").addEventListener("click",closeModal);
$("editModal").addEventListener("click",e=>{if(e.target===$("editModal"))closeModal();});
$("heroUpload").addEventListener("change",async e=>{if(e.target.files[0]){try{state.heroPhoto=await readImage(e.target.files[0]);setPhoto("heroPhoto",state.heroPhoto);}catch{alert("Foto tidak bisa dibaca.");}}});
$("galleryUpload").addEventListener("change",async e=>{try{state.galleryPhotos=await Promise.all([...e.target.files].slice(0,3).map(f=>readImage(f,900,.72)));renderGallery(state.galleryPhotos);}catch{alert("Salah satu foto tidak bisa dibaca.");}});
$("personalForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data={recipient:$("recipientInput").value.trim()||DEFAULTS.recipient,sender:$("senderInput").value.trim()||DEFAULTS.sender,message:$("messageInput").value.trim()||DEFAULTS.message};
  try {
    localStorage.setItem("bs_custom",JSON.stringify(data));
    if($("dateInput").value)localStorage.setItem("bs_birthday",$("dateInput").value);else localStorage.removeItem("bs_birthday");
    if(state.heroPhoto)localStorage.setItem("bs_hero",state.heroPhoto);
    localStorage.setItem("bs_gallery",JSON.stringify(state.galleryPhotos));
    applyText(data);countdownTick();renderGallery(state.galleryPhotos);closeModal();
  } catch(err) { alert("Penyimpanan browser penuh. Coba gunakan foto yang lebih kecil atau kurangi jumlah foto."); }
});
$("resetBtn").addEventListener("click",()=>{
  ["bs_custom","bs_hero","bs_gallery","bs_birthday"].forEach(k=>localStorage.removeItem(k));
  state.heroPhoto="";state.galleryPhotos=[];applyText(DEFAULTS);setPhoto("heroPhoto","");renderGallery([]);$("personalForm").reset();countdownTick();
});
$("musicBtn").addEventListener("click",()=>{
  const audio=$("birthdayAudio");
  if(!audio.src){alert("Musik belum ditambahkan. Baca README untuk memasang file musik milikmu di assets/birthday-music.mp3.");return;}
  if(audio.paused){audio.play().then(()=>{$("musicIcon").textContent="Ⅱ";$("musicLabel").textContent="Jeda musik";}).catch(()=>alert("Browser tidak dapat memutar musik."));}
  else{audio.pause();$("musicIcon").textContent="♫";$("musicLabel").textContent="Putar musik";}
});
$("year").textContent=new Date().getFullYear();
loadSaved();
countdownTick();setInterval(countdownTick,1000);
// Aktifkan musik jika file assets/birthday-music.mp3 sudah ditambahkan.
$("birthdayAudio").src="assets/birthday-music.mp3";
