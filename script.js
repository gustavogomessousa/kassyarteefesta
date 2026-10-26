const config = window.SITE;
document.querySelectorAll('[data-whatsapp]').forEach(link => {const message=link.dataset.whatsappMessage||config.message;link.href=`https://wa.me/${config.phone}?text=${encodeURIComponent(message)}`;link.target='_blank';link.rel='noopener noreferrer';});
const menuButton=document.querySelector('.menu-toggle'), menu=document.querySelector('#menu');
function closeMenu(){menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menu.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.querySelector('.active')?.classList.remove('active');a.classList.add('active');closeMenu();}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const gallery=document.querySelector('#gallery');
const galleryWrap=document.querySelector('.gallery-wrap');
const lightbox=document.querySelector('#lightbox');
const dots=document.querySelector('#dots');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const fineHover=window.matchMedia('(hover: hover) and (pointer: fine)');
const slideCount=config.works.length;
let autoTimer;
let scrollEndTimer;
let galleryVisible=false;
let hovering=false;
let dragging=false;

function makeWorkCard(work,duplicate=false){
  const card=document.createElement('button');
  card.type='button';
  card.className='work';
  card.setAttribute('aria-label',`Ampliar: ${work.title}`);
  if(duplicate){card.setAttribute('aria-hidden','true');card.tabIndex=-1;}
  const img=new Image();
  img.src=work.src;
  img.alt=duplicate?'':work.alt;
  img.loading='lazy';
  img.width=600;
  img.height=400;
  card.append(img);
  card.addEventListener('click',()=>{
    stopAutoPlay();
    const large=document.querySelector('#lightbox-image');
    large.src=work.src;
    large.alt=work.alt;
    document.querySelector('#lightbox-caption').textContent=work.title;
    lightbox.showModal();
  });
  return card;
}

// A second set of photos allows the last slide to flow into the first one.
config.works.forEach(work=>gallery.append(makeWorkCard(work)));
config.works.forEach(work=>gallery.append(makeWorkCard(work,true)));
config.works.forEach((work,i)=>{
  const dot=document.createElement('button');
  dot.type='button';
  dot.setAttribute('aria-label',`Ver foto ${i+1}: ${work.title}`);
  dot.addEventListener('click',()=>{
    goToSlide(i);
    scheduleAutoPlay();
  });
  dots.append(dot);
});

function slideStep(){
  const first=gallery.children[0],second=gallery.children[1];
  return second.offsetLeft-first.offsetLeft;
}
function currentSlide(){return Math.round(gallery.scrollLeft/slideStep());}
function goToSlide(index,instant=false){
  gallery.scrollTo({left:index*slideStep(),behavior:instant||reducedMotion.matches?'instant':'smooth'});
  updateDots(index);
}
function updateDots(index=currentSlide()){
  const active=((index%slideCount)+slideCount)%slideCount;
  [...dots.children].forEach((dot,i)=>{
    dot.classList.toggle('active',i===active);
    if(i===active)dot.setAttribute('aria-current','true');
    else dot.removeAttribute('aria-current');
  });
}
function normalizeGallery(){
  const index=currentSlide();
  if(index>=slideCount)goToSlide(index-slideCount,true);
}
function moveGallery(direction){
  const index=currentSlide();
  if(direction<0&&index===0)goToSlide(slideCount-1,true);
  else goToSlide(index+direction);
}
function stopAutoPlay(){clearTimeout(autoTimer);}
function canAutoPlay(){
  return slideCount>1&&galleryVisible&&!document.hidden&&!reducedMotion.matches&&!hovering&&!dragging&&!lightbox.open&&!galleryWrap.querySelector(':focus-visible');
}
function scheduleAutoPlay(){
  stopAutoPlay();
  if(canAutoPlay())autoTimer=setTimeout(()=>{
    moveGallery(1);
    scheduleAutoPlay();
  },4500);
}

document.querySelector('#prev').addEventListener('click',()=>{moveGallery(-1);scheduleAutoPlay();});
document.querySelector('#next').addEventListener('click',()=>{moveGallery(1);scheduleAutoPlay();});
gallery.addEventListener('scroll',()=>{
  updateDots();
  clearTimeout(scrollEndTimer);
  scrollEndTimer=setTimeout(normalizeGallery,180);
},{passive:true});
gallery.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
    e.preventDefault();
    moveGallery(e.key==='ArrowRight'?1:-1);
    scheduleAutoPlay();
  }
});
gallery.addEventListener('pointerdown',()=>{dragging=true;stopAutoPlay();});
gallery.addEventListener('pointerup',()=>{dragging=false;scheduleAutoPlay();});
gallery.addEventListener('pointercancel',()=>{dragging=false;scheduleAutoPlay();});
galleryWrap.addEventListener('pointerenter',()=>{if(fineHover.matches){hovering=true;stopAutoPlay();}});
galleryWrap.addEventListener('pointerleave',()=>{hovering=false;scheduleAutoPlay();});
galleryWrap.addEventListener('focusin',()=>{setTimeout(scheduleAutoPlay,0);});
galleryWrap.addEventListener('focusout',()=>{setTimeout(scheduleAutoPlay,0);});
document.addEventListener('visibilitychange',scheduleAutoPlay);
reducedMotion.addEventListener('change',scheduleAutoPlay);
if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>{galleryVisible=entries[0].isIntersecting;scheduleAutoPlay();},{threshold:0.25});
  observer.observe(document.querySelector('.portfolio'));
}else{galleryVisible=true;scheduleAutoPlay();}
window.addEventListener('resize',()=>{normalizeGallery();updateDots();});
updateDots(0);

document.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});
lightbox.addEventListener('close',scheduleAutoPlay);
function renderFeed(posts){const grid=document.querySelector('#instagram-grid');grid.replaceChildren();posts.slice(0,6).forEach(post=>{const a=document.createElement('a');a.href=post.permalink||'https://www.instagram.com/kassyarteefesta/';a.target='_blank';a.rel='noopener noreferrer';const img=new Image();img.src=post.src;img.alt=post.alt||'Decoração Kassy Arte & Festa';img.loading='lazy';img.width=500;img.height=400;a.append(img);grid.append(a);});}
renderFeed([config.works[4],config.works[5],config.works[1],config.works[2],config.works[3],{src:'assets/azul.jpg',alt:'Decoração de príncipe com balões azuis, brancos e dourados'}]);
function safeUrl(value){try{return new URL(value).protocol==='https:';}catch{return false;}}
async function updateFeed(){if(location.protocol==='file:')return;try{const response=await fetch(config.instagramEndpoint,{signal:AbortSignal.timeout(7000)});if(!response.ok)return;const data=await response.json();const posts=(data.posts||[]).filter(p=>safeUrl(p.src)&&safeUrl(p.permalink));if(posts.length)renderFeed(posts);}catch{}}
updateFeed();setInterval(updateFeed,15*60*1000);
