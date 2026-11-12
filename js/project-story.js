/* Shared project story: static markup first, motion owned by each page's matchMedia context. */
(() => {
  "use strict";
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const roots = [...document.querySelectorAll("[data-project-story]")], data = window.QS_PROJECTS;
  if (!data) return;
  roots.forEach(root => {
    const featured = root.dataset.projectStory === "featured";
    const project = data.featured.find(p => p.slug === root.dataset.projectStory) || data.featured[0];
    const items = featured
      ? [0, 2, 1, 3].map(i => data.featured[i]).filter(Boolean).map(p => ({
        image:p.image, mobileImage:p.mobileImage, alt:p.imageAlt, width:p.imageWidth, height:p.imageHeight, title:p.name,
        eyebrow:p.location, text:p.summary, link:"project.html?p=" + p.slug, cta:"Explore the project"
      }))
      : project.gallery.map((g,i) => ({
        image:g.src, alt:g.alt, width:g.width, height:g.height, title:i ? "A new perspective." : "Considered in every detail.",
        eyebrow:project.name + " / View " + String(i+1).padStart(2,"0"), text:g.alt, link:g.src, cta:"View full rendering", newTab:true
      }));
    root.innerHTML = `<div class="story-stage">
      <div class="story-intro"><p class="eyebrow">${featured ? "A closer look" : esc(project.name)}</p><h2>${featured ? "Every address.<br><em>A different perspective.</em>" : "Good design.<br><em>In every detail.</em>"}</h2></div>
      <div class="story-items">${items.map((item,i)=>`<article class="story-item">
        <figure class="story-frame" data-story-frame="${i}"><picture>${item.mobileImage ? `<source media="(max-width: 999px)" srcset="${esc(item.mobileImage)}">` : ""}<img src="${esc(item.image)}" alt="${esc(item.alt)}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async"></picture><button type="button" class="story-thumb-hit" data-story-go="${i}" aria-label="Show ${esc(item.title)}"></button></figure>
        <div class="story-copy"><p class="eyebrow">${esc(item.eyebrow)}</p><h3>${esc(item.title)}</h3><p class="story-description">${esc(item.text)}</p><a class="btn-arrow" href="${esc(item.link)}"${item.newTab ? ' target="_blank" rel="noopener"' : ""}><span>${item.cta}</span><span aria-hidden="true">↗</span></a></div>
      </article>`).join("")}</div>
      <p class="story-cinema-caption" aria-hidden="true">${featured ? "A different<br><em>point of view.</em>" : "Every detail.<br><em>Considered.</em>"}</p>
      <div class="story-chrome"><span>Scroll to discover</span><nav aria-label="Project image gallery">${items.map((item,i)=>`<button type="button" data-story-go="${i}" aria-label="Gallery view ${i+1}: ${esc(item.eyebrow)}" aria-pressed="${i===0}">${String(i+1).padStart(2,"0")}</button>`).join("")}</nav><span class="story-count">01 / ${String(items.length).padStart(2,"0")}</span></div>
    </div>`;
    if (featured) {
      const mobile = matchMedia('(max-width:999px)'), rail = root.querySelector('.story-items');
      const slides = [...rail.children], controls = [...root.querySelectorAll('.story-chrome button')];
      const reduced = matchMedia('(prefers-reduced-motion:reduce)');
      root.addEventListener('click', event => {
        const button = event.target.closest('.story-chrome button');
        if (!mobile.matches || !button) return;
        const slide = slides[+button.dataset.storyGo];
        rail.scrollTo({left: rail.scrollLeft + slide.getBoundingClientRect().left - rail.getBoundingClientRect().left,
          behavior: reduced.matches ? 'instant' : 'smooth'});
      });
      let pending = 0;
      rail.addEventListener('scroll', () => {
        if (!mobile.matches || pending) return;
        pending = requestAnimationFrame(() => {
          pending = 0;
          const left = rail.getBoundingClientRect().left;
          const index = slides.reduce((best, slide, i) => Math.abs(slide.getBoundingClientRect().left-left) < Math.abs(slides[best].getBoundingClientRect().left-left) ? i : best, 0);
          controls.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
          root.querySelector('.story-count').textContent = String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
        });
      }, {passive:true});
    }
  });
  function mount(root, navigate) {
    const stage=root.querySelector(".story-stage"), frames=[...root.querySelectorAll(".story-frame")], copies=[...root.querySelectorAll(".story-copy")];
    const buttons=[...root.querySelectorAll("[data-story-go]")], intro=root.querySelector(".story-intro"), chrome=root.querySelector(".story-chrome"), caption=root.querySelector(".story-cinema-caption");
    let current=-1, refreshFrame=0;
    root.classList.add("is-story-enhanced");
    const main={left:"29%",top:"11%",width:"38%",height:"77%"};
    const next={left:"71%",top:"68%",width:"10%",height:"19%"};
    const previous={left:"18%",top:"11%",width:"8%",height:"15%"};
    const select=index=>{
      current=index;
      root.querySelector(".story-count").textContent=String(index+1).padStart(2,"0")+" / "+String(frames.length).padStart(2,"0");
      copies.forEach((copy,i)=>{copy.inert=i!==index;copy.setAttribute("aria-hidden",String(i!==index));});
      frames.forEach((frame,i)=>{const button=frame.querySelector("button");button.tabIndex=Math.abs(i-index)===1?0:-1;button.disabled=i===index||Math.abs(i-index)>1;});
      buttons.filter(button=>!button.classList.contains("story-thumb-hit")).forEach(button=>button.setAttribute("aria-pressed",String(+button.dataset.storyGo===index)));
    };
    const timeline=gsap.timeline({scrollTrigger:{
      id:"story-"+root.dataset.projectStory,trigger:stage,start:"top top",end:()=>"+="+innerHeight*(3.2+(frames.length-1)*1.35),
      pin:true,scrub:.65,anticipatePin:1,invalidateOnRefresh:true
    }});
    gsap.set(frames,{...next,autoAlpha:0,borderRadius:12});
    gsap.set(frames[0],{left:"40%",top:"38%",width:"20%",height:"25%",zIndex:2});
    gsap.set(copies,{autoAlpha:0,y:24});
    gsap.set([chrome,caption],{autoAlpha:0});
    timeline.fromTo(intro,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.65,ease:"power2.out"},0)
      .to(intro,{autoAlpha:0,y:-55,duration:.5},1.05)
      .to(frames[0],{autoAlpha:1,duration:.4},1.25)
      .fromTo(frames[0],{left:"40%",top:"38%",width:"20%",height:"25%",borderRadius:12},
        {left:"1.5%",top:"3%",width:"97%",height:"94%",borderRadius:18,duration:1.25,ease:"power3.inOut"},1.75)
      .fromTo(caption,{autoAlpha:0,y:35},{autoAlpha:1,y:0,duration:.5},2.55)
      .to(caption,{autoAlpha:0,y:-20,duration:.35},3.5)
      .to(frames[0],{...main,duration:1.15,ease:"power3.inOut"},3.6)
      .fromTo(copies[0],{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.65},4.15)
      .to(chrome,{autoAlpha:1,duration:.5},4.15);
    if(frames[1])timeline.to(frames[1],{autoAlpha:1,duration:.5},4.25);
    timeline.addLabel("view-0",4.85);
    frames.slice(1).forEach((frame,offset)=>{
      const i=offset+1,start=5.4+offset*1.8;
      timeline.to(copies[i-1],{autoAlpha:0,y:-20,duration:.3},start)
        .to(frames[i-1],{...previous,zIndex:1,duration:.95,ease:"power3.inOut"},start)
        .fromTo(frame,{...next,autoAlpha:1},{...main,autoAlpha:1,zIndex:2,duration:.95,ease:"power3.inOut",immediateRender:false},start)
        .fromTo(copies[i],{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.55},start+.55);
      if(i>1)timeline.to(frames[i-2],{autoAlpha:0,scale:.8,duration:.4},start);
      if(frames[i+1])timeline.to(frames[i+1],{autoAlpha:1,duration:.45},start+.55);
      timeline.addLabel("view-"+i,start+1.2);
    });
    const lastView=timeline.duration();
    timeline.to({},{duration:.65});
    timeline.to(copies[copies.length-1],{autoAlpha:0,duration:.3},">");
    if(frames.length>1)timeline.to(frames.slice(0,-1),{autoAlpha:0,duration:.35},"<");
    timeline.to(frames[frames.length-1],{left:"1.5%",top:"3%",width:"97%",height:"94%",borderRadius:18,duration:1.15,ease:"power3.inOut"},"<")
      .fromTo(caption,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.5},"-=.4")
      .to(chrome,{autoAlpha:0,duration:.3},"<").to({},{duration:.5});
    const update=()=>{
      const time=timeline.time();
      const index=time<5.7?0:Math.min(frames.length-1,Math.floor((time-5.7)/1.8)+1);
      if(index!==current)select(index);
      const galleryVisible=time>=4.15&&time<=lastView+.95;
      chrome.inert=!galleryVisible;copies[index].inert=!galleryVisible;
    };
    timeline.eventCallback("onUpdate",update);select(0);update();
    // ScrollTrigger suppresses timeline callbacks while restoring a refresh. Restore DOM access state too.
    timeline.scrollTrigger.vars.onRefresh=()=>{cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(update);};
    const onClick=event=>{
      const button=event.target.closest("[data-story-go]");if(!button)return;
      const target=timeline.scrollTrigger.labelToScroll("view-"+button.dataset.storyGo);
      if(navigate)navigate(target,{offset:0,duration:.9});else window.scrollTo({top:target,behavior:"smooth"});
    };
    root.addEventListener("click",onClick);
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      frames.forEach(frame=>frame.querySelector("img").loading="eager");observer.disconnect();
    },{rootMargin:"1200px"});
    observer.observe(root);
    return()=>{
      cancelAnimationFrame(refreshFrame);
      observer.disconnect();root.removeEventListener("click",onClick);root.classList.remove("is-story-enhanced");
      copies.forEach(copy=>{copy.inert=false;copy.removeAttribute("aria-hidden");});chrome.inert=false;
      frames.forEach(frame=>{const button=frame.querySelector("button");button.disabled=false;button.tabIndex=-1;});
    };
  }
  window.QSProjectStory={roots,mount};
})();
