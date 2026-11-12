/* Eight aligned architectural states, a gold path and accessible stage selection. */
(() => {
 'use strict';
 const root=document.querySelector('.expertise-atelier');if(!root)return;
 const tabs=[...root.querySelectorAll('[data-atelier-step]')],nodes=[...root.querySelectorAll('[data-atelier-node]')],panels=[...root.querySelectorAll('.atelier-panel')],images=[...root.querySelectorAll('.atelier-scene')];
 const rail=root.querySelector('.atelier-tabs'),canvas=root.querySelector('.atelier-canvas'),play=root.querySelector('.atelier-play');
 const track=root.querySelector('.atelier-route__track'),gold=root.querySelector('.atelier-route__gold'),light=root.querySelector('.atelier-route__light');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:649px)');
 const points=[[180,516],[290,486],[400,492],[510,516],[620,510],[730,498],[840,480],[940,456]],stops=[0];
 let d=`M ${points[0].join(' ')}`;
 points.slice(1).forEach((p,i)=>{const a=points[i],x=(a[0]+p[0])/2;d+=` C ${x} ${a[1]} ${x} ${p[1]} ${p[0]} ${p[1]}`;track.setAttribute('d',d);stops.push(track.getTotalLength());});
 const length=track.getTotalLength();gold.setAttribute('d',d);gold.style.strokeDasharray=String(length);
 let active=0,direction=1,elapsed=0,last=0,raf=0,visible=false,paused=reduced.matches||mobile.matches;
 const duration=2400;
 const visual=root.querySelector('.atelier-visual'),sceneStack=document.createElement('div');
 sceneStack.className='atelier-scene-stack';sceneStack.setAttribute('aria-hidden','true');visual.append(sceneStack);
 let sceneRequest=0;
 async function blendScene(index){
  const request=++sceneRequest,source=images[index];
  source.loading='eager';
  try{await source.decode();}catch{return;}
  if(request!==sceneRequest)return;
  const layer=source.cloneNode();
  layer.className='atelier-scene atelier-blend-layer';layer.removeAttribute('data-scene');layer.alt='';layer.setAttribute('aria-hidden','true');
  const first=!sceneStack.children.length;
  sceneStack.append(layer);visual.classList.add('has-scene-layers');
  // Fade only the incoming image. Keep the complete previous composite underneath
  // until the new image is opaque, including when users quickly select stages.
  const animation=layer.animate([{opacity:0},{opacity:1}],{duration:first||reduced.matches?0:1100,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'});
  animation.finished.then(()=>{
   if(request!==sceneRequest)return;
   [...sceneStack.children].forEach(old=>{if(old!==layer){old.getAnimations().forEach(a=>a.cancel());old.remove();}});
   layer.style.opacity='1';animation.cancel();
  }).catch(()=>{});
 }
 // Warm the scenes before arrival so crossfades do not wait for lazy image decoding.
 const sceneLoader=new IntersectionObserver(entries=>{
  if(!entries.some(entry=>entry.isIntersecting))return;
  images.forEach(img=>{img.loading='eager';img.decode?.().catch(()=>{});});
  sceneLoader.disconnect();
 },{rootMargin:'700px 0px'});
 sceneLoader.observe(root);
 function path(value){const a=Math.floor(value),b=Math.min(7,a+1),distance=stops[a]+(stops[b]-stops[a])*(value-a);gold.style.strokeDashoffset=String(length-distance);const p=track.getPointAtLength(distance);light.setAttribute('cx',p.x);light.setAttribute('cy',p.y);}
 function select(index,manual=false){
  active=index;elapsed=0;
  if(manual||index===0)direction=1;
  if(index===7)direction=-1;
  tabs.forEach((t,i)=>{t.classList.toggle('is-active',i===index);t.setAttribute('aria-selected',String(i===index));t.tabIndex=i===index?0:-1;t.style.removeProperty('--atelier-progress');});
  nodes.forEach((n,i)=>{n.classList.toggle('is-active',i===index);n.setAttribute('aria-pressed',String(i===index));});
  panels.forEach((p,i)=>{p.classList.toggle('is-active',i===index);p.inert=i!==index;p.setAttribute('aria-hidden',String(i!==index));});
  images.forEach((img,i)=>{img.classList.toggle('is-active',i===index);img.setAttribute('aria-hidden',String(i!==index));});
  blendScene(index);
  root.querySelector('[data-atelier-count]').textContent=String(index+1).padStart(2,'0');path(index);
  if(manual){paused=true;stop();sync();}
 }
 function sync(){play.querySelector('[data-atelier-play-label]').textContent=paused?'Play sequence':'Pause sequence';play.querySelector('[data-atelier-symbol]').textContent=paused?'▶':'Ⅱ';play.setAttribute('aria-label',`${paused?'Play':'Pause'} expertise sequence`);play.hidden=reduced.matches;}
 function stop(){cancelAnimationFrame(raf);raf=0;last=0;}
 function frame(time){
  if(paused||!visible||document.hidden||reduced.matches){stop();return;}
  if(last)elapsed+=Math.min(time-last,100);last=time;
  // Arrive, change the scene, and immediately continue along the next segment.
  // Retrace the open route at either end rather than jumping from 08 to 01.
  if(elapsed>=duration){const remainder=elapsed-duration;select(active+direction);elapsed=remainder;}
  tabs[active].style.setProperty('--atelier-progress',String(elapsed/duration));
  path(active+direction*Math.min(1,elapsed/duration));
  raf=requestAnimationFrame(frame);
 }
 function resume(){if(!raf&&!paused&&visible&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(frame);}
 rail.setAttribute('role','tablist');
 tabs.forEach((tab,i)=>{
  tab.setAttribute('role','tab');panels[i].setAttribute('role','tabpanel');
  tab.addEventListener('click',event=>{select(i,true);if(mobile.matches&&event.detail>0)window.scrollTo({top:Math.max(0,root.querySelector('.atelier-panels').getBoundingClientRect().top+scrollY-90),behavior:reduced.matches?'instant':'smooth'});});
  tab.addEventListener('keydown',e=>{const columns=getComputedStyle(rail).gridTemplateColumns.split(' ').length;const next={ArrowRight:(i+1)%8,ArrowLeft:(i+7)%8,ArrowDown:(i+columns)%8,ArrowUp:(i-columns+8)%8,Home:0,End:7};if(!(e.key in next))return;e.preventDefault();select(next[e.key],true);tabs[next[e.key]].focus();});
 });
 nodes.forEach((n,i)=>n.addEventListener('click',()=>select(i,true)));
 play.addEventListener('click',()=>{paused=!paused;sync();if(paused)stop();else{if(mobile.matches)window.scrollTo({top:Math.max(0,root.querySelector('.atelier-panels').getBoundingClientRect().top+scrollY-90),behavior:'smooth'});resume();}});
 root.addEventListener('focusin',e=>{if(e.target!==play){paused=true;stop();sync();}});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else stop();},{threshold:.2}).observe(canvas);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else resume();});
 function preferences(){paused=true;stop();sync();if(reduced.matches)blendScene(active);}
 reduced.addEventListener('change',preferences);mobile.addEventListener('change',preferences);
 root.classList.add('is-ready');root.querySelector('.atelier-controls').hidden=false;root.querySelector('.atelier-route').hidden=false;select(0);sync();
})();
