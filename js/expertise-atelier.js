/* Eight aligned architectural states, a gold path and accessible stage selection. */
(() => {
 'use strict';
 const root=document.querySelector('.expertise-atelier');if(!root)return;
 const tabs=[...root.querySelectorAll('[data-atelier-step]')],nodes=[...root.querySelectorAll('[data-atelier-node]')],panels=[...root.querySelectorAll('.atelier-panel')],images=[...root.querySelectorAll('.atelier-scene')];
 const rail=root.querySelector('.atelier-tabs'),canvas=root.querySelector('.atelier-canvas');
 const track=root.querySelector('.atelier-route__track'),gold=root.querySelector('.atelier-route__gold'),light=root.querySelector('.atelier-route__light');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:649px)');
 const desktopPoints=[[180,516],[290,486],[400,492],[510,516],[620,510],[730,498],[840,480],[940,456]];
 const phonePoints=[[50,76],[180,60],[310,70],[440,82],[570,76],[700,62],[830,70],[950,54]];
 const route=root.querySelector('.atelier-route');let stops=[],length=0;
 function buildRoute(){
  const points=mobile.matches?phonePoints:desktopPoints,height=mobile.matches?140:600;
  route.querySelector('svg').setAttribute('viewBox',`0 0 1000 ${height}`);
  // Phone nodes are visual milestones; the full-sized stage tabs remain the touch controls.
  if(mobile.matches)route.setAttribute('aria-hidden','true');else route.removeAttribute('aria-hidden');
  light.setAttribute('r',mobile.matches?'7':'4');
  stops=[0];let d=`M ${points[0].join(' ')}`;
  points.slice(1).forEach((p,i)=>{const a=points[i],x=(a[0]+p[0])/2;d+=` C ${x} ${a[1]} ${x} ${p[1]} ${p[0]} ${p[1]}`;track.setAttribute('d',d);stops.push(track.getTotalLength());});
  length=track.getTotalLength();gold.setAttribute('d',d);gold.style.strokeDasharray=String(length);
  nodes.forEach((node,i)=>{node.style.setProperty('--node-x',`${points[i][0]/10}%`);node.style.setProperty('--node-y',`${points[i][1]/height*100}%`);});
 }
 buildRoute();
 // The sequence always runs. It only stays still for reduced-motion or data-saver visitors,
 // and holds while someone is moving through the stages with the keyboard.
 const saveData=navigator.connection?.saveData===true;
 let active=0,elapsed=0,last=0,raf=0,visible=false,off=reduced.matches||saveData,keyboard=false;
 const duration=2400,chosenDuration=6000;let dwell=duration; // a stage someone picked stays a little longer
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
 function path(value){const a=Math.min(7,Math.floor(value)),b=Math.min(7,a+1),distance=stops[a]+(stops[b]-stops[a])*(value-a);gold.style.strokeDashoffset=String(length-distance);const p=track.getPointAtLength(distance);light.setAttribute('cx',p.x);light.setAttribute('cy',p.y);}
 function select(index,manual=false){
  active=index;elapsed=0;dwell=manual?chosenDuration:duration;
  route.classList.remove('is-looping');
  tabs.forEach((t,i)=>{t.classList.toggle('is-active',i===index);t.setAttribute('aria-selected',String(i===index));t.tabIndex=i===index?0:-1;t.style.removeProperty('--atelier-progress');});
  if(mobile.matches)rail.scrollTo({left:rail.scrollLeft+tabs[index].getBoundingClientRect().left-rail.getBoundingClientRect().left,behavior:reduced.matches?'instant':'smooth'});
  nodes.forEach((n,i)=>{n.classList.toggle('is-active',i===index);n.setAttribute('aria-pressed',String(i===index));});
  panels.forEach((p,i)=>{p.classList.toggle('is-active',i===index);p.inert=i!==index;p.setAttribute('aria-hidden',String(i!==index));});
  images.forEach((img,i)=>{img.classList.toggle('is-active',i===index);img.setAttribute('aria-hidden',String(i!==index));});
  blendScene(index);
  root.querySelector('[data-atelier-count]').textContent=String(index+1).padStart(2,'0');path(index);
  if(manual)resume();
 }
 function stop(){cancelAnimationFrame(raf);raf=0;last=0;}
 function frame(time){
  if(off||keyboard||!visible||document.hidden){stop();return;}
  if(last)elapsed+=Math.min(time-last,100);last=time;
  // Arrive, change the scene, and immediately continue along the next segment.
  // After stage 08 the sequence starts again at 01: the gold line fades out, then redraws from the start.
  if(elapsed>=dwell){const remainder=elapsed-dwell;select((active+1)%8);elapsed=remainder;}
  tabs[active].style.setProperty('--atelier-progress',String(elapsed/dwell));
  route.classList.toggle('is-looping',active===7&&dwell-elapsed<450);
  path(active+Math.min(1,elapsed/dwell));
  raf=requestAnimationFrame(frame);
 }
 function resume(){if(!raf&&!off&&!keyboard&&visible&&!document.hidden)raf=requestAnimationFrame(frame);}
 rail.setAttribute('role','tablist');
 // Touching the stage strip on a phone restarts the current stage's time, so it does not move under the finger.
 rail.addEventListener('pointerdown',()=>{if(mobile.matches){elapsed=0;dwell=chosenDuration;}},{passive:true});
 tabs.forEach((tab,i)=>{
  tab.setAttribute('role','tab');panels[i].setAttribute('role','tabpanel');
  tab.addEventListener('click',()=>select(i,true));
  tab.addEventListener('keydown',e=>{const columns=getComputedStyle(rail).gridTemplateColumns.split(' ').length;const next={ArrowRight:(i+1)%8,ArrowLeft:(i+7)%8,ArrowDown:(i+columns)%8,ArrowUp:(i-columns+8)%8,Home:0,End:7};if(!(e.key in next))return;e.preventDefault();select(next[e.key],true);tabs[next[e.key]].focus();});
 });
 nodes.forEach((n,i)=>n.addEventListener('click',()=>select(i,true)));
 // Keyboard focus inside the section holds the sequence so the focused stage is not swapped away; it continues when focus leaves.
 root.addEventListener('focusin',e=>{keyboard=e.target.matches(':focus-visible');if(keyboard)stop();else resume();});
 root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget)){keyboard=false;resume();}});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else stop();},{threshold:.2}).observe(visual);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else resume();});
 function preferences(){off=reduced.matches||saveData;if(off){stop();route.classList.remove('is-looping');tabs[active].style.removeProperty('--atelier-progress');path(active);if(reduced.matches)blendScene(active);}else resume();}
 reduced.addEventListener('change',preferences);
 // Keep the image, stage choices and description together on phones.
 const railAnchor=document.createComment('Desktop stage navigation');rail.before(railAnchor);
 const mobileHint=document.createElement('p');mobileHint.className='atelier-mobile-hint';mobileHint.textContent='Swipe to explore all eight stages';
 function arrangeMobile(){
  buildRoute();path(active);
  if(mobile.matches){canvas.append(mobileHint,rail);}
  else{railAnchor.after(rail);mobileHint.remove();rail.scrollLeft=0;}
 }
 mobile.addEventListener('change',arrangeMobile);arrangeMobile();
 root.classList.add('is-ready');root.querySelector('.atelier-controls').hidden=false;root.querySelector('.atelier-route').hidden=false;select(0);
})();
