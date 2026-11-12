/* QS Realty homepage: progressive enhancement, one scroll clock, responsive motion contexts. */
(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const hasMotion = !!(window.gsap && window.ScrollTrigger);
  let lenis = null, projectTrigger = null, activeProject = 0;
  let entryDone = false, entryTimeline = null, entryTimer;
  const cards = $$(".venture"), dots = $$("[data-project]");
  const loader = $(".preloader"), hero = $(".hero"), video = $(".hero__video");
  const moveTo = (target, options = {}) => {
    const expertise = target?.id === "services";
    const offset = expertise ? -100 : -25;
    if (lenis) lenis.scrollTo(target, { duration: 1.15, offset, ...options });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: motion.matches ? "instant" : "smooth" });
    else target?.scrollIntoView({ behavior: motion.matches ? "instant" : "smooth" });
  };
  $$(".js-year").forEach(el => el.textContent = new Date().getFullYear());
  setupForm();
  setupNavCurrent();
  setupHeader();
  setupVideo();
  setupMenuAccess();
  setupMap();
  setupContactTabs();
  $$(".js-counter").forEach(el => el.textContent = formatNumber(+el.dataset.to, el.dataset.format));
  $$('a[href^="#"]').forEach(link => link.addEventListener("click", event => {
    const hash = link.getAttribute("href");
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    history.replaceState(null, "", hash);
    moveTo(hash === "#top" ? 0 : target);
  }));
  dots.forEach(dot => dot.addEventListener("click", () => {
    const i = Number(dot.dataset.project);
    if (projectTrigger) {
      moveTo(projectTrigger.labelToScroll("project-" + i), { offset: 0, duration: .85 });
    } else moveTo(cards[i]);
  }));
  function setActive(index, enhanced) {
    activeProject = index;
    cards.forEach((card, i) => {
      card.inert = enhanced && i !== index;
      if (enhanced) card.setAttribute("aria-hidden", String(i !== index));
      else card.removeAttribute("aria-hidden");
    });
    dots.forEach(dot => {
      const selected = enhanced ? index : cards.indexOf(dot.closest(".venture"));
      dot.setAttribute("aria-pressed", String(Number(dot.dataset.project) === selected));
    });
  }
  function releaseEntry() {
    if (entryDone) return;
    entryDone = true;
    clearTimeout(entryTimer);
    loader.hidden = true;
    document.body.classList.remove("is-loading");
    $("main").inert = false;
    $(".header").inert = false;
    lenis?.start();
    if (hasMotion) {
      gsap.set([".hero__media", ".hero__title .line > span", ".hero__bottom", ".header"], { clearProps: "all" });
      ScrollTrigger.refresh();
    }
    requestAnimationFrame(() => {
      const target = document.getElementById(location.hash.slice(1));
      if (target && location.hash !== "#top") moveTo(target, { immediate: true });
    });
  }
  if (!hasMotion) {
    document.documentElement.classList.add("no-motion");
    releaseEntry();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const responsive = gsap.matchMedia();
  responsive.add({ desktop: "(min-width: 1000px)", motion: "(prefers-reduced-motion: no-preference)" }, context => {
    const { desktop, motion: animate } = context.conditions;
    if (!animate) {
      document.documentElement.classList.add("no-motion");
      entryTimeline?.kill();
      releaseEntry();
      return;
    }
    document.documentElement.classList.remove("no-motion");
    let tick;
    if (desktop && window.Lenis) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
      lenis.on("scroll", ScrollTrigger.update);
      tick = time => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      if (!entryDone) lenis.stop();
    }
    const storyCleanups = [];
    if (desktop) {
      collageMotion();
      storyCleanups.push(projectMotion());
      window.QSProjectStory?.roots.forEach(root => storyCleanups.push(window.QSProjectStory.mount(root, moveTo)));
    } else {
      cards.forEach(card => {
        gsap.from(card.querySelector(".venture__image"), {
          y: 35, opacity: .35, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 93%", once: true }
        });
      });
    }
    gsap.to(".project-marquee > div", { xPercent: -17, ease: "none",
      scrollTrigger: { trigger: ".project-marquee", start: "top bottom", end: "bottom top", scrub: .8 } });
    gsap.to(".hero__title", { y: desktop ? -65 : -25, opacity: .35, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .5 } });
    const revealTargets = $$(".about-copy > *, .numbers .section-head, .stat, .team__intro, .leader, .counsel, .crew, .partner__title, .partner__lede, .partner__grid li, .ethos-heading, .ethos__vision, .ethos__value, .footprint__copy, .footprint__map, .verticals__intro, .vertical-card, .contact__visual-inner, .contact__panel-inner");
    revealTargets.forEach(el => {
      gsap.from(el, { y: 32, autoAlpha: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 94%", once: true } });
    });
    $$(".js-counter").forEach(el => {
      const count = { value: 0 };
      gsap.to(count, { value: +el.dataset.to, duration: 1.8, ease: "power2.out",
        onUpdate: () => el.textContent = formatNumber(Math.round(count.value), el.dataset.format),
        scrollTrigger: { trigger: el, start: "top 92%", once: true } });
    });
    if (desktop) {
      $$(".ethos-photo img, .partner__media img, .vertical-card__image img").forEach(img => {
        gsap.fromTo(img, { scale: 1.1, yPercent: -3 }, { yPercent: 3, ease: "none",
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: .7 } });
      });
      gsap.from(".footer__word", { yPercent: 20, opacity: .4, ease: "none",
        scrollTrigger: { trigger: ".footer", start: "top 95%", end: "bottom bottom", scrub: .7 } });
    }
    return () => {
      storyCleanups.forEach(cleanup => cleanup());
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy(); lenis = null;
      projectTrigger = null;
      $(".project-stage").classList.remove("is-enhanced");
      $(".project-deck").inert = false;
      setActive(0, false);
      $$(".js-counter").forEach(el => el.textContent = formatNumber(+el.dataset.to, el.dataset.format));
    };
  });
  function collageMotion() {
    const stage = $(".collage"), main = $(".collage__main"), inline = $(".inline-image");
    const relative = axis => {
      const r = inline.getBoundingClientRect(), parent = stage.getBoundingClientRect();
      return axis === "x" ? r.left - parent.left : r.top - parent.top;
    };
    gsap.timeline({ scrollTrigger: { trigger: stage, start: "top top", end: "+=180%", pin: true, scrub: .75, invalidateOnRefresh: true, anticipatePin: 1 } })
      .to(".collage__heading, .collage__caption", { y: -65, autoAlpha: 0, duration: .55 }, .15)
      .to(".collage__satellite--one, .collage__satellite--three", { xPercent: -180, rotation: -12, autoAlpha: 0, duration: .8 }, .1)
      .to(".collage__satellite--two", { xPercent: 180, rotation: 14, autoAlpha: 0, duration: .8 }, .1)
      .to(main, { left: "3%", top: "5%", width: "94%", height: "90%", borderRadius: 12, duration: 1.1, ease: "power2.inOut" }, 0)
      .to({}, { duration: .3 })
      .to(main, { left: () => relative("x"), top: () => relative("y"), width: () => inline.offsetWidth, height: () => inline.offsetHeight, borderRadius: 4, duration: 1.2, ease: "power2.inOut" }, 1.4)
      .fromTo(".collage__statement", { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: .8 }, 1.8)
      .to({}, { duration: .45 });
  }
  function projectMotion() {
    const stage = $(".project-stage"), deck = $(".project-deck");
    const copies = cards.map(card => $(".venture__copy", card));
    const portal = document.createElement("div");
    portal.className = "project-portal";
    // A single clipped window changes sides; its full-size images roll vertically.
    // Original card images stay in the document for mobile and reduced motion.
    const slides = cards.map(card => {
      const slide = $(".venture__image", card).cloneNode(true);
      slide.className = "project-portal__slide";
      $(".venture__arrow", slide)?.remove();
      $("img", slide).loading = "eager";
      portal.append(slide);
      return slide;
    });
    deck.append(portal);
    stage.classList.add("is-enhanced");
    let refreshFrame = 0;
    const step = 2.15, hold = .8, travel = 1.25;
    const exitStart = (cards.length - 1) * step + 1.35;
    const side = i => i % 2 ? 0 : deck.clientWidth / 2 + 6;
    const switches = cards.slice(1).map((_, i) => i * step + hold + .12 + travel / 2);
    const update = time => {
      if (!stage.classList.contains("is-enhanced")) return;
      const index = switches.filter(value => time >= value).length;
      if (index !== activeProject) setActive(index, true);
      const covered = time > exitStart + .8;
      deck.inert = covered;
      slides.forEach((slide, i) => {
        slide.inert = covered || i !== index;
        slide.setAttribute("aria-hidden", String(i !== index));
      });
    };
    setActive(0, true);
    gsap.set(copies, { yPercent: 105, autoAlpha: 0 });
    gsap.set(copies[0], { yPercent: 0, autoAlpha: 1 });
    gsap.set(slides, { yPercent: -100 });
    gsap.set(slides[0], { yPercent: 0 });
    gsap.set(portal, { x: side(0) });
    const timeline = gsap.timeline({
      onUpdate() { update(this.time()); },
      scrollTrigger: {
        id: "project-cards", trigger: stage, start: "top 90px",
        end: () => "+=" + innerHeight * (cards.length * 1.25 + 1),
        pin: true, scrub: .42, anticipatePin: 1, invalidateOnRefresh: true,
        onRefresh: self => {
          cancelAnimationFrame(refreshFrame);
          refreshFrame = requestAnimationFrame(() => update(self.animation.time()));
        }
      }
    });
    // Function-based endpoints recompute the horizontal travel after resizing.
    timeline.fromTo(portal, { x: () => side(0) }, { x: () => side(0), duration: hold }, 0);
    timeline.addLabel("project-0", .4);
    cards.slice(1).forEach((card, offset) => {
      const i = offset + 1, at = offset * step + hold;
      const incomingText = $$(":scope > *", copies[i]);
      timeline.set(copies[i], { autoAlpha: 1 }, at + .1)
        .fromTo(copies[i], { yPercent: 105 }, { yPercent: 0, duration: travel, ease: "power3.inOut", immediateRender: false }, at + .12)
        .fromTo(portal, { x: () => side(i - 1) }, { x: () => side(i), duration: travel, ease: "power3.inOut", immediateRender: false }, at + .12)
        .to(slides[i - 1], { yPercent: 100, duration: travel, ease: "power3.inOut" }, at + .12)
        .fromTo(slides[i], { yPercent: -100 }, { yPercent: 0, duration: travel, ease: "power3.inOut", immediateRender: false }, at + .12)
        .fromTo(incomingText, { y: 20, opacity: 0, filter: "blur(4px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: .45, stagger: .035, immediateRender: false }, at + .92)
        .set(copies[i - 1], { autoAlpha: 0 }, at + travel + .15)
        .addLabel("project-" + i, i * step + .4);
    });
    // The recording ends with a soft upward white veil into the next section.
    timeline.to({}, { duration: .4 }, exitStart - .4)
      .fromTo($(".project-mist", stage), { autoAlpha: 0, yPercent: 100 },
        { autoAlpha: 1, yPercent: 0, duration: 1.45, ease: "none" }, exitStart)
      .fromTo($$(".project-mist__cloud", stage), { xPercent: -3 },
        { xPercent: 3, duration: 1.45, ease: "none" }, exitStart)
      .fromTo($(".project-mist__veil", stage), { backgroundColor: "rgba(243,240,233,0)" },
        { backgroundColor: "rgba(243,240,233,1)", duration: .55 }, exitStart + .95)
      .to(".project-dots", { autoAlpha: 0, duration: .4 }, exitStart + .15)
      .to({}, { duration: .15 });
    projectTrigger = timeline.scrollTrigger;
    update(0);
    return () => {
      cancelAnimationFrame(refreshFrame);
      stage.classList.remove("is-enhanced");
      portal.remove();
      deck.inert = false;
      setActive(0, false);
    };
  }
  function playEntry() {
    if (motion.matches || scrollY > 80 || location.hash) return releaseEntry();
    document.body.classList.add("is-loading");
    $("main").inert = true; $(".header").inert = true;
    lenis?.stop();
    gsap.set(".hero__media", { clipPath: "inset(35% 39% 35% 39% round 9999px)" });
    gsap.set(".hero__title .line > span", { yPercent: 115 });
    gsap.set(".hero__bottom, .header", { opacity: 0, y: 16 });
    gsap.fromTo(".preloader__mark", { filter: "blur(12px)", opacity: .3 }, { filter: "blur(0px)", opacity: 1, duration: 1.15, ease: "power2.out" });
    const progress = { value: 0 };
    const paint = () => {
      $(".js-count").textContent = Math.round(progress.value);
      gsap.set(".preloader__rule span", { scaleX: progress.value / 100 });
    };
    let readyCount = 0, started = false;
    const start = () => {
      if (started || entryDone) return;
      started = true;
      entryTimeline = gsap.timeline({ onComplete: releaseEntry })
        .to(progress, { value: 100, duration: .35, onUpdate: paint })
        .to(".preloader__lockup", { opacity: 0, y: -15, duration: .45 }, "+=.15")
        .to(loader, { autoAlpha: 0, duration: .45 }, "-=.15")
        // Keep semicircular ends throughout. Grow beyond the viewport so the
        // capsule fills the hero before its mask is cleared, without squaring off.
        .fromTo(".hero__media", { clipPath: "inset(35% 39% 35% 39% round 9999px)" },
          { clipPath: "inset(-50% -50% -50% -50% round 9999px)", duration: 1.65, ease: "power3.inOut", immediateRender: false }, "-=.15")
        .to(".hero__title .line > span", { yPercent: 0, duration: 1.15, stagger: .12, ease: "power3.out" }, "-=.75")
        .to(".hero__bottom, .header", { opacity: 1, y: 0, duration: .8, stagger: .06 }, "-=.8");
    };
    const poster = new Image(); poster.src = video.poster;
    const imageReady = poster.decode ? poster.decode().catch(() => {}) : Promise.resolve();
    const fontReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const videoReady = new Promise(resolve => {
      if (video.readyState >= 2 || video.error) resolve();
      else {
        const done = () => { video.removeEventListener("loadeddata", done); video.removeEventListener("error", done); resolve(); };
        video.addEventListener("loadeddata", done); video.addEventListener("error", done);
        setTimeout(done, 3000);
      }
    });
    [imageReady, fontReady, videoReady].forEach(p => p.then(() => {
      if (started || entryDone) return;
      readyCount++;
      gsap.to(progress, { value: readyCount / 3 * 90, duration: .4, onUpdate: paint, overwrite: true });
    }));
    Promise.race([Promise.all([imageReady, fontReady, videoReady]), new Promise(r => setTimeout(r, 3300))]).then(() => {
      gsap.delayedCall(.45, start);
    });
    // Fail open even if a media request or an animation is interrupted.
    entryTimer = setTimeout(() => { entryTimeline?.kill(); releaseEntry(); }, 8500);
  }
  playEntry();
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("pageshow", event => {
    if (event.persisted) { entryTimeline?.kill(); releaseEntry(); ScrollTrigger.refresh(); }
  });
  motion.addEventListener("change", event => { if (event.matches) { entryTimeline?.kill(); releaseEntry(); } });
  function setupMenuAccess() {
    const toggle = $(".menu-toggle"), menu = $("#menu");
    const outside = [$("main"), $(".footer")];
    const setOpen = open => {
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.setAttribute("aria-hidden", String(!open)); menu.inert = !open;
      outside.forEach(el => el.inert = open);
      if (open) { lenis?.stop(); requestAnimationFrame(() => $("a", menu)?.focus({ preventScroll: true })); }
      else { lenis?.start(); toggle.focus({ preventScroll: true }); }
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    $$("a", menu).forEach(a => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", e => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
      if (e.key === "Tab") {
        const focusables = [toggle, ...$$("a[href]", menu)];
        const index = focusables.indexOf(document.activeElement);
        e.preventDefault();
        focusables[(index + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length].focus();
      }
    });
    matchMedia("(min-width: 1280px)").addEventListener("change", e => { if (e.matches && document.body.classList.contains("menu-open")) setOpen(false); });
  }
  function setupMap() {
    const items = $$(".footprint__areas li"), pins = $$(".pin");
    const select = key => {
      items.forEach(el => { const on = el.dataset.pin === key; el.classList.toggle("is-active", on); $("button", el)?.setAttribute("aria-pressed", String(on)); });
      pins.forEach(el => el.classList.toggle("is-active", el.dataset.pin === key));
    };
    items.forEach(item => {
      const button = document.createElement("button"); button.type = "button"; button.innerHTML = item.innerHTML; button.setAttribute("aria-pressed", "false");
      item.replaceChildren(button);
      button.addEventListener("click", () => select(item.dataset.pin));
      button.addEventListener("focus", () => select(item.dataset.pin));
      button.addEventListener("mouseenter", () => select(item.dataset.pin));
    });
    select("kurla");
  }
  function setupContactTabs() {
    const tabs = $$(".ctabs__tab");
    tabs.forEach((tab, index) => {
      tab.tabIndex = index ? -1 : 0;
      tab.addEventListener("click", () => tabs.forEach(t => t.tabIndex = t === tab ? 0 : -1));
      tab.addEventListener("keydown", e => {
        const map = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault(); tabs[map[e.key]].click(); tabs[map[e.key]].focus();
      });
    });
  }
  function setupVideo() {
    const button = $(".hero__video-toggle");
    let userPaused = motion.matches, visible = true;
    const update = () => { button.textContent = video.paused ? "Play background video" : "Pause background video"; button.setAttribute("aria-pressed", String(!video.paused)); };
    const play = () => video.play().catch(update);
    button.hidden = false;
    button.addEventListener("click", () => { userPaused = !video.paused; if (userPaused) video.pause(); else play(); });
    video.addEventListener("play", update); video.addEventListener("pause", update);
    video.addEventListener("error", () => button.hidden = true);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) video.pause();
      else if (!userPaused && !document.hidden) play();
    }, { threshold: .05 }).observe(hero);
    document.addEventListener("visibilitychange", () => { if (document.hidden) video.pause(); else if (visible && !userPaused) play(); });
    motion.addEventListener("change", e => { if (e.matches) { userPaused = true; video.pause(); } });
    update(); if (!userPaused) play();
  }
})();
