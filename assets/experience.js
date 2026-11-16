/* Sartor Digital. Product assembly, scroll response and deliberate section choreography. */
(()=>{'use strict';
const html=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
const motion=()=>!reduced.matches&&!html.classList.contains('motion-paused');
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const hero=document.querySelector('.hero'),visual=document.querySelector('.hero-visual');
let scheduled=0,animations=[],heroTop=0,heroHeight=1;
function refresh(){if(hero){heroTop=hero.getBoundingClientRect().top+scrollY;heroHeight=hero.offsetHeight}queue()}
function update(){scheduled=0;if(!motion())return;
 if(visual){const p=clamp((scrollY-heroTop)/(heroHeight*.65));visual.style.setProperty('--spread',p.toFixed(3))}
 document.querySelectorAll('.proc-card').forEach(card=>{const r=card.getBoundingClientRect();card.classList.toggle('is-current',r.top<innerHeight*.75&&r.bottom>innerHeight*.2)});
 const selected=[...document.querySelectorAll('main>section[id]')].find(el=>{const r=el.getBoundingClientRect();return r.top<=innerHeight*.4&&r.bottom>=innerHeight*.4});
 document.querySelectorAll('.nav-links a[href^="#"]').forEach(a=>{if(selected&&a.hash==='#'+selected.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
}
function queue(){if(!scheduled)scheduled=requestAnimationFrame(update)}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',refresh,{passive:true});
if(hero){new ResizeObserver(refresh).observe(hero);if(fine.matches)hero.addEventListener('pointermove',e=>{if(motion()&&visual)visual.style.setProperty('--scene-ry',`${(e.clientX/innerWidth-.5)*5}deg`)});hero.addEventListener('pointerleave',()=>visual?.style.setProperty('--scene-ry','0deg'))}
function run(el,frames,opts){if(!motion())return;const a=el.animate(frames,opts);animations.push(a);a.addEventListener('finish',()=>{animations=animations.filter(x=>x!==a)},{once:true})}
const ease='cubic-bezier(.16,1,.3,1)';
if(hero&&motion()){
 const parts=[hero.querySelector('.eyebrow'),hero.querySelector('h1'),hero.querySelector('.hero-sub'),hero.querySelector('.hero-btns')];
 parts.filter(Boolean).forEach((el,i)=>run(el,[{opacity:0,filter:'blur(8px)',transform:'translateY(24px)'},{opacity:1,filter:'blur(0px)',transform:'translateY(0)'}],{duration:1100,delay:80+i*110,easing:ease,fill:'backwards'}));
}
const sections=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;sections.unobserve(target);if(!motion())return;
 if(target.matches('.explorer-stage'))run(target,[{transform:'perspective(1200px) rotateX(12deg) scale(.92)',opacity:.4},{transform:'perspective(1200px) rotateX(0) scale(1)',opacity:1}],{duration:1200,easing:ease});
 else if(target.matches('.stack-layer'))run(target,[{opacity:.1,transform:'translateX(35px)'},{opacity:1,transform:'translateX(0)'}],{duration:800,easing:ease});
 else run(target,[{opacity:0,transform:'translateY(35px)',clipPath:'inset(0 0 30% 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0 0 0 0)'}],{duration:1000,easing:ease});
}),{threshold:.15});
document.querySelectorAll('.section-head,.explorer-heading,#servicos .svc-card h3,.stack-layer,.explorer-stage,.about-text h2').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight)sections.observe(el)});
function sync(){if(!motion()){animations.forEach(a=>a.cancel());animations=[];visual?.style.setProperty('--spread','0');visual?.style.setProperty('--scene-ry','0deg')}else queue()}
new MutationObserver(sync).observe(html,{attributes:true,attributeFilter:['class']});reduced.addEventListener('change',sync);
// Prevent native anchor scrolling from moving focus behind the fixed header.
document.querySelectorAll('.nav-links a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#nav')?.classList.remove('nav-open');document.querySelector('#mobToggle')?.setAttribute('aria-expanded','false')}));
// The project preview responds to the visitor's pointer, reusing the real capture.
const projectData=document.querySelector('#explorer-data');
if(fine.matches&&projectData){
 const projects=JSON.parse(projectData.textContent).projects;
 const preview=document.createElement('div');preview.className='project-hover-preview';preview.setAttribute('aria-hidden','true');
 const image=document.createElement('img');image.alt='';preview.append(image);document.body.append(preview);
 let px=-500,py=-500,tx=-500,ty=-500,hoverFrame=0,active=false;
 const glide=()=>{hoverFrame=0;if(!active||!motion()){preview.classList.remove('is-visible');return}px+=(tx-px)*.14;py+=(ty-py)*.14;preview.style.transform=`translate3d(${px}px,${py}px,0) rotate(${clamp((tx-px)*.03,-5,5)}deg)`;if(Math.abs(tx-px)+Math.abs(ty-py)>.2)hoverFrame=requestAnimationFrame(glide)};
 const move=e=>{tx=clamp(e.clientX+25,12,innerWidth-285);ty=clamp(e.clientY-190,90,innerHeight-190);if(!hoverFrame)hoverFrame=requestAnimationFrame(glide)};
 document.querySelectorAll('.project-choice').forEach(button=>{
  button.addEventListener('pointerenter',e=>{if(!motion())return;image.src=projects[Number(button.dataset.project)].image;active=true;px=e.clientX+20;py=e.clientY-180;preview.classList.add('is-visible');move(e)});
  button.addEventListener('pointermove',move);
  button.addEventListener('pointerleave',()=>{active=false;preview.classList.remove('is-visible');cancelAnimationFrame(hoverFrame);hoverFrame=0});
  button.addEventListener('click',()=>{active=false;preview.classList.remove('is-visible')});
 });
 new MutationObserver(()=>{if(!motion()){active=false;preview.classList.remove('is-visible');cancelAnimationFrame(hoverFrame);hoverFrame=0}}).observe(html,{attributes:true,attributeFilter:['class']});
 addEventListener('scroll',()=>{active=false;preview.classList.remove('is-visible')},{passive:true});
}
refresh();document.fonts?.ready.then(refresh);
})();
