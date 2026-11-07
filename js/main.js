/* =========================================================
   QS REALTY — interactions & motion
   GSAP + ScrollTrigger + Lenis. Degrades to a static page if
   the libraries fail to load or the visitor prefers reduced motion.
   ========================================================= */
// WhatsApp number that receives enquiries (country code, no "+")
const WHATSAPP_NUMBER = "919820299042";
const ENQUIRY_EMAIL = "qsrealty@outlook.com";

(() => {
  "use strict";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const root = document.documentElement;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  $$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- forms work regardless of motion ---------- */
  setupHeroVideo();
  setupExpertise();
  setupForm();
  setupFootprint();
  setupNavCurrent();

  if (!hasGsap || reduceMotion) {
    root.classList.add("no-motion");
    const wipeEl = $(".page-wipe");
    if (wipeEl) wipeEl.classList.remove("is-covering");
    setupMenu(null);
    setupHeader();
    $$(".js-counter").forEach((el) => (el.textContent = formatNumber(+el.dataset.to, el.dataset.format)));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  // the same script runs on the home page and on project pages, so some targets won't exist
  gsap.config({ nullTargetWarn: false });

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */
  let lenis = null;
  if (typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
  }

  setupMenu(lenis);
  setupHeader();
  setupAnchors(lenis);

  /* =========================================================
     INITIAL STATES (set by JS so the page is readable without it)
     ========================================================= */
  gsap.set(".hero__title .line > span", { yPercent: 115 });
  gsap.set(".hero__top, .hero__bottom", { autoAlpha: 0, y: 24 });
  gsap.set(".header", { autoAlpha: 0, y: -20 });
  gsap.set(".hero__img", { scale: 1.3 });

  /* =========================================================
     PAGE ENTRY
     The full preloader plays once per visit on the home page.
     Project pages, and returning to the home page, get a quick
     wipe reveal instead.
     ========================================================= */
  const preloader = $(".preloader");
  const wipe = $(".page-wipe");
  document.body.classList.add("is-loading");
  lenis && lenis.stop();

  const onEntryDone = () => {
    document.body.classList.remove("is-loading");
    lenis && lenis.start();
    // default lag smoothing protects the intro from frame hitches; scrolling feels better without it
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();
    scrollToHash(lenis);
    // Back / reload can restore the scroll position while the entry is still running, so
    // fade-ins that are already on screen miss their trigger — reveal those right away.
    requestAnimationFrame(() => {
      $$(".reveal-up").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && +getComputedStyle(el).opacity < 0.99) {
          gsap.to(el, { y: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out", overwrite: true });
        }
      });
    });
  };

  const pageLoaded = new Promise((resolve) =>
    document.readyState === "complete" ? resolve() : window.addEventListener("load", resolve, { once: true })
  );
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const whenReady = (fn, maxWait) =>
    Promise.race([Promise.all([pageLoaded, fontsReady]), new Promise((r) => setTimeout(r, maxWait))])
      // one extra frame so the first tick doesn't absorb the last of the load work
      .then(() => requestAnimationFrame(fn));

  let introSeen = false;
  try { introSeen = sessionStorage.getItem("qs-intro") === "1"; } catch (e) { /* storage blocked */ }

  if (preloader && !introSeen) {
    try { sessionStorage.setItem("qs-intro", "1"); } catch (e) { /* storage blocked */ }
    playPreloader();
  } else {
    if (preloader) preloader.style.display = "none";
    gsap.set(wipe, { autoAlpha: 1, yPercent: 0 });
    wipe.classList.remove("is-covering");
    const entry = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } })
      .to(wipe, { yPercent: -100, duration: 1, ease: "expo.inOut" }, 0)
      .set(wipe, { autoAlpha: 0 })
      .to(".hero__img", { scale: 1, duration: 2 }, 0.2)
      .to(".hero__title .line > span", { yPercent: 0, duration: 1.4, stagger: 0.1 }, 0.35)
      .to(".hero__top, .hero__bottom", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.6)
      .from(".pj-hero__title .line > span", { yPercent: 110, duration: 1.4 }, 0.35)
      .from(".pj-back, .pj-hero .eyebrow, .pj-hero__facts", { autoAlpha: 0, y: 20, duration: 1, stagger: 0.08 }, 0.5)
      .to(".header", { autoAlpha: 1, y: 0, duration: 1 }, 0.5)
      .add(onEntryDone, 0.8);
    whenReady(() => entry.play(), 2500);
  }

  setupTransitions(wipe, lenis);

  function playPreloader() {
  const countEl = $(".js-count");
  const COUNT_STEPS = [50, 75, 100];
  // Paused until the page has loaded: while images and fonts are still decoding the
  // main thread stalls, and the count would jump ahead instead of ticking through.
  const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  const COUNT_DURATION = 3.6; // seconds for the 50 → 75 → 100 count
  const exit = COUNT_DURATION + 0.2; // preloader starts leaving just after the count lands

  intro
    .to(".preloader__frame rect", { strokeDashoffset: 0, duration: COUNT_DURATION, ease: "power1.inOut" }, 0)
    .from(".preloader__qs", { yPercent: 40, autoAlpha: 0, duration: 1.4 }, 0.2)
    .from(".preloader__realty", { y: 16, autoAlpha: 0, duration: 1.2 }, 0.6)
    .from(".preloader__tag", { autoAlpha: 0, duration: 1 }, 0.6)
    .to(".preloader__inner, .preloader__count, .preloader__tag", { autoAlpha: 0, y: -30, duration: 0.6, ease: "power2.in" }, exit)
    .to(preloader, { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, exit + 0.3)
    .to(".hero__img", { scale: 1, duration: 2.4, ease: "expo.out" }, exit + 0.45)
    .to(".hero__title .line > span", { yPercent: 0, duration: 1.6, stagger: 0.12 }, exit + 0.7)
    .to(".hero__top, .hero__bottom", { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, exit + 1.1)
    .to(".header", { autoAlpha: 1, y: 0, duration: 1.2 }, exit + 1.2)
    .add(() => {
      preloader.style.display = "none";
      onEntryDone();
    }, exit + 1.3);

  // count in three steps — 50, 75, 100 — each rolling up into place
  const stepGap = COUNT_DURATION / COUNT_STEPS.length;
  countEl.textContent = COUNT_STEPS[0];
  intro.fromTo(countEl, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, immediateRender: true }, 0.2);
  COUNT_STEPS.slice(1).forEach((n, i) => {
    const at = 0.2 + stepGap * (i + 1);
    intro
      .to(countEl, { yPercent: -100, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, at - 0.35)
      .call(() => (countEl.textContent = n), null, at)
      .fromTo(countEl, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, immediateRender: false }, at);
  });

  whenReady(() => intro.play(), 5000); // slow connections still get the intro
  }

  /* =========================================================
     HERO SCROLL
     ========================================================= */
  gsap.to(".hero__img", {
    yPercent: 12, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero__title", {
    yPercent: -25, autoAlpha: 0.2, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  /* =========================================================
     GENERIC REVEALS
     ========================================================= */
  $$(".reveal-lines").forEach((el) => {
    gsap.from($$(".line > span", el), {
      yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  gsap.set(".reveal-up", { autoAlpha: 0 });
  ScrollTrigger.batch(".reveal-up", {
    start: "top 90%",
    onEnter: (batch) => gsap.fromTo(batch, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out", stagger: 0.08, overwrite: true }),
  });

  $$(".reveal-clip").forEach((el) => {
    gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  // image parallax inside its frame
  $$("[data-parallax]").forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // project frames open up as they enter
  $$(".project").forEach((el) => {
    const media = $(".project__media", el);
    gsap.fromTo(media, { clipPath: "inset(12% 8% 12% 8%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", ease: "none",
      scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: true },
    });
    gsap.from($$(".project__info > *", el), {
      y: 30, autoAlpha: 0, duration: 1.2, ease: "expo.out", stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 70%" },
    });
  });

  gsap.fromTo(".partner__media img", { yPercent: -10 }, {
    yPercent: 10, ease: "none",
    scrollTrigger: { trigger: ".partner", start: "top bottom", end: "bottom top", scrub: true },
  });


  // map pins drop in
  // opacity only — the pins' own transform attribute holds their map position
  gsap.from(".pin", {
    autoAlpha: 0, duration: 0.9, ease: "power2.out", stagger: 0.1,
    scrollTrigger: { trigger: ".footprint__map", start: "top 75%" },
  });
  gsap.from(".map-coast, .map-road, .map-creek", {
    strokeDasharray: 1600, strokeDashoffset: 1600, duration: 2.4, ease: "power2.inOut",
    scrollTrigger: { trigger: ".footprint__map", start: "top 75%" },
  });

  // footer wordmark rises
  gsap.from(".footer__word", {
    yPercent: 40, autoAlpha: 0, ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true },
  });

  /* =========================================================
     WORD-BY-WORD STATEMENT
     ========================================================= */
  $$(".js-words").forEach((el) => {
    splitWords(el);
    gsap.to($$(".w", el), {
      opacity: 1, ease: "none", stagger: 0.05,
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
    });
  });

  /* =========================================================
     COUNTERS
     ========================================================= */
  $$(".js-counter").forEach((el) => {
    const to = +el.dataset.to;
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.to(obj, {
        v: to, duration: 2.2, ease: "power3.out",
        onUpdate: () => (el.textContent = formatNumber(Math.round(obj.v), el.dataset.format)),
      }),
    });
  });

  /* =========================================================
     CURSOR TRAIL + MAGNETIC
     ========================================================= */
  if (finePointer) {
    setupMagnetic();
    setupCursorTrail();
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());

  // Recalculate trigger positions whenever the page height changes (late-loading
  // images, font swaps, live CSS edits) — otherwise the pinned lifecycle section
  // can pin at a stale position and overlap the sections above it.
  let lastHeight = document.body.scrollHeight;
  let refreshTimer;
  new ResizeObserver(() => {
    const h = document.body.scrollHeight;
    if (Math.abs(h - lastHeight) < 2) return;
    lastHeight = h;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(document.body);

  /* =========================================================
     HELPERS
     ========================================================= */
  function splitWords(el) {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const span = document.createElement("span");
            span.className = "w";
            span.textContent = part;
            frag.appendChild(span);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
  }

  // Ribbon trail behind the normal pointer — same recipe as belgradearbor.rs: 10 spring
  // chains of 10 nodes drawn as 1px gold curves with additive blending on a fixed,
  // click-through canvas. Desktop only (≥1121px), and it waits for the first mouse move.
  function setupCursorTrail() {
    const canvas = document.querySelector(".cursor-trail");
    if (!canvas) return;
    const wide = window.matchMedia("(min-width: 1121px)");
    const ctx = canvas.getContext("2d");
    const CFG = { trails: 10, size: 10, friction: 0.5, dampening: 0.1, tension: 0.98 };
    const STROKE = "hsla(34.19, 34.96%, 48.24%, 0.2)";
    const mouse = { x: 0, y: 0 };
    let trails = [];
    let running = false;
    let started = false;

    const makeTrail = (spring) => ({
      spring: spring + 0.1 * Math.random() - 0.02,
      friction: CFG.friction + 0.01 * Math.random() - 0.002,
      nodes: Array.from({ length: CFG.size }, () => ({ x: mouse.x, y: mouse.y, vx: 0, vy: 0 })),
    });

    const update = (t) => {
      let spring = t.spring;
      const head = t.nodes[0];
      head.vx += (mouse.x - head.x) * spring;
      head.vy += (mouse.y - head.y) * spring;
      t.nodes.forEach((n, i) => {
        if (i > 0) {
          const prev = t.nodes[i - 1];
          n.vx += (prev.x - n.x) * spring + prev.vx * CFG.dampening;
          n.vy += (prev.y - n.y) * spring + prev.vy * CFG.dampening;
        }
        n.vx *= t.friction; n.vy *= t.friction;
        n.x += n.vx; n.y += n.vy;
        spring *= CFG.tension;
      });
    };

    const draw = (t) => {
      const n = t.nodes;
      ctx.beginPath();
      ctx.moveTo(n[0].x, n[0].y);
      let i = 1;
      for (; i < n.length - 2; i++) ctx.quadraticCurveTo(n[i].x, n[i].y, (n[i].x + n[i + 1].x) / 2, (n[i].y + n[i + 1].y) / 2);
      ctx.quadraticCurveTo(n[i].x, n[i].y, n[i + 1].x, n[i + 1].y);
      ctx.stroke();
    };

    const frame = () => {
      if (!running) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = STROKE;
      ctx.lineWidth = 1;
      trails.forEach((t) => { update(t); draw(t); });
      requestAnimationFrame(frame);
    };

    const resize = () => { canvas.width = document.documentElement.clientWidth; canvas.height = window.innerHeight; };
    const onMove = (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      if (!started) { // first move: spawn the chains at the pointer, then start drawing
        started = true;
        trails = Array.from({ length: CFG.trails }, (_, i) => makeTrail(0.4 + (i / CFG.trails) * 0.025));
        start();
      }
    };
    const start = () => { if (!running && started && wide.matches) { running = true; canvas.hidden = false; requestAnimationFrame(frame); } };
    const stop = () => { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    wide.addEventListener("change", () => { if (wide.matches) start(); else { stop(); canvas.hidden = true; } });
  }

  function setupMagnetic() {
    $$("[data-magnetic]").forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const my = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.25);
        my((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener("mouseleave", () => { mx(0); my(0); });
    });
  }
})();

/* ---------- shared (non-motion) helpers ---------- */
function formatNumber(n, format) {
  if (format === "in") return n.toLocaleString("en-IN");
  return String(n);
}

function setupMenu(lenis) {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");
  const close = () => {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.setAttribute("aria-hidden", "true");
    lenis && lenis.start();
  };
  toggle.addEventListener("click", () => {
    const open = !document.body.classList.contains("menu-open");
    if (!open) return close();
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    menu.setAttribute("aria-hidden", "false");
    lenis && lenis.stop();
  });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => e.key === "Escape" && close());
}

function setupExpertise() {
  const journey = document.querySelector(".journey");
  if (!journey) return;
  const map = journey.querySelector(".journey__map");
  const stops = Array.from(journey.querySelectorAll(".journey__stop"));
  const panels = Array.from(journey.querySelectorAll(".journey__panel"));
  const controls = journey.querySelector(".journey__controls");
  const count = journey.querySelector(".journey__count");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = 0;

  function selectStage(index, focusTab = false) {
    active = (index + stops.length) % stops.length;
    stops.forEach((stop, position) => {
      const selected = position === active;
      stop.setAttribute("aria-selected", String(selected));
      stop.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
    });
    count.textContent = String(active + 1).padStart(2, "0") + " / " + String(stops.length).padStart(2, "0");
    if (focusTab) stops[active].focus({ preventScroll: true });
    const track = journey.querySelector(".journey__stops");
    if (track.scrollWidth > track.clientWidth) {
      track.scrollTo({
        left: stops[active].offsetLeft - (track.clientWidth - stops[active].offsetWidth) / 2,
        behavior: reducedMotion ? "instant" : "smooth",
      });
    }
  }

  stops.forEach((stop, index) => {
    stop.addEventListener("click", () => selectStage(index));
    stop.addEventListener("keydown", (event) => {
      const destinations = {
        ArrowRight: active + 1,
        ArrowDown: active + 1,
        ArrowLeft: active - 1,
        ArrowUp: active - 1,
        Home: 0,
        End: stops.length - 1,
      };
      if (!(event.key in destinations)) return;
      event.preventDefault();
      selectStage(destinations[event.key], true);
    });
    panels[index].setAttribute("role", "tabpanel");
    panels[index].setAttribute("aria-labelledby", stop.id);
    panels[index].tabIndex = 0;
  });
  journey.querySelector("[data-journey-prev]").addEventListener("click", () => selectStage(active - 1));
  journey.querySelector("[data-journey-next]").addEventListener("click", () => selectStage(active + 1));
  map.hidden = false;
  controls.hidden = false;
  journey.classList.add("is-ready");
  selectStage(0);
}

function setupHeader() {
  const header = document.querySelector(".header");
  let last = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    const hide = y > last && y > window.innerHeight * 0.6 && !document.body.classList.contains("menu-open");
    header.classList.toggle("is-hidden", hide);
    last = y;
  }, { passive: true });
}

function setupAnchors(lenis) {
  if (!lenis) return; // native CSS smooth scrolling handles anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id === "#top" ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      // let the menu close before scrolling
      setTimeout(() => lenis.scrollTo(target, { duration: 1.6 }), document.body.classList.contains("menu-open") ? 350 : 0);
    });
  });
}

// After arriving from another page with a #section in the URL, land on that section
// once pins and spacers are in place (the browser's own jump happens too early).
function scrollToHash(lenis) {
  if (!location.hash || location.hash === "#top") return;
  const target = document.querySelector(location.hash);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { immediate: true });
  else target.scrollIntoView();
}

// Links marked data-transition to another page: cover the screen with the sage wipe,
// then navigate. The next page reveals itself by wiping the panel away.
function setupTransitions(wipe, lenis) {
  if (!wipe) return;
  document.querySelectorAll("a[data-transition]").forEach((a) => {
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const url = new URL(a.href, location.href);
      // same page + hash: just scroll there
      if (url.pathname === location.pathname && url.search === location.search && url.hash) {
        const target = url.hash === "#top" ? 0 : document.querySelector(url.hash);
        if (target === null) return;
        e.preventDefault();
        document.body.classList.remove("menu-open");
        if (lenis) lenis.scrollTo(target, { duration: 1.6 });
        else if (target === 0) window.scrollTo(0, 0);
        else target.scrollIntoView();
        return;
      }
      e.preventDefault();
      gsap.fromTo(wipe, { autoAlpha: 1, yPercent: 100 }, {
        yPercent: 0, duration: 0.7, ease: "expo.inOut",
        onComplete: () => (location.href = url.href),
      });
    });
  });
  // coming back via the browser's Back button restores the page with the wipe still covering it
  window.addEventListener("pageshow", (e) => { if (e.persisted) gsap.set(wipe, { autoAlpha: 0 }); });
}

// Header nav: underline the link whose section is crossing the middle of the screen.
// Home page only — on project pages the links point to another page.
function setupNavCurrent() {
  const links = Array.from(document.querySelectorAll('.header__nav a[href^="#"]'));
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (!sections.length) return;
  let queued = false;
  const update = () => {
    queued = false;
    const mid = window.innerHeight / 2;
    const current = sections.find((s) => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom >= mid; });
    links.forEach((a) => a.classList.toggle("is-current", !!current && a.getAttribute("href") === "#" + current.id));
  };
  window.addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

function setupFootprint() {
  const items = document.querySelectorAll(".footprint__areas li");
  const pins = document.querySelectorAll(".pin");
  const set = (key, on) => {
    items.forEach((li) => li.classList.toggle("is-active", on && li.dataset.pin === key));
    pins.forEach((p) => p.classList.toggle("is-active", on && p.dataset.pin === key));
  };
  [...items, ...pins].forEach((el) => {
    el.addEventListener("mouseenter", () => set(el.dataset.pin, true));
    el.addEventListener("mouseleave", () => set(el.dataset.pin, false));
  });
}

// Tabbed contact form: each tab shows its own fields, swaps the intro copy and the photo
// on the left, and builds its own WhatsApp / email message.
function setupForm() {
  const form = document.getElementById("enquiry");
  if (!form) return;
  const note = form.querySelector(".form__note");
  const panel = form.closest(".contact__panel-inner");
  const done = panel.querySelector(".cform__done");
  const intro = panel.querySelector(".cform__intro");
  const tabs = Array.from(panel.querySelectorAll(".ctabs__tab"));
  const pill = panel.querySelector(".ctabs__pill");
  const tabField = form.querySelector('[name="tab"]');

  const TABS = {
    enquiry: { label: "Project enquiry", submit: "Send on WhatsApp", heading: "Tell us about your project.", sub: "Share a few details and our team will come back with a clear next step." },
    callback: { label: "Callback request", submit: "Request a callback", heading: "Prefer to talk it through?", sub: "Leave your number and a good time — a project head will call you back." },
    visit: { label: "Site visit request", submit: "Book a site visit", heading: "Let's walk the site together.", sub: "Tell us where and when — we'll confirm the visit on WhatsApp." },
  };

  const setTab = (key) => {
    tabField.value = key;
    tabs.forEach((t, i) => {
      const on = t.dataset.tab === key;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
      if (on) pill.style.transform = `translateX(${i * 100}%)`;
    });
    // show only this tab's fields; hidden fields are disabled so they stay out of the message
    form.querySelectorAll("[data-for]").forEach((el) => {
      const on = el.dataset.for.split(" ").includes(key);
      el.hidden = !on;
      el.querySelectorAll("input, textarea").forEach((inp) => (inp.disabled = !on));
    });
    intro.querySelector('[data-copy="heading"]').textContent = TABS[key].heading;
    intro.querySelector('[data-copy="sub"]').textContent = TABS[key].sub;
    intro.classList.remove("is-swapping"); void intro.offsetWidth; intro.classList.add("is-swapping");
    form.querySelector(".cform__submit-label").textContent = TABS[key].submit;
    note.textContent = "";
  };
  tabs.forEach((t) => t.addEventListener("click", () => {
    done.hidden = true; form.hidden = false; intro.hidden = false;
    setTab(t.dataset.tab);
  }));
  setTab("enquiry");

  const collect = () => {
    const data = new FormData(form);
    const val = (k) => (data.get(k) || "").trim();
    const name = val("name");
    const phone = val("phone");
    const consent = form.querySelector('[name="consent"]');
    let ok = true;
    [["name", name.length > 1], ["phone", /^[+\d][\d\s-]{7,}$/.test(phone)]].forEach(([field, valid]) => {
      form.querySelector(`[name="${field}"]`).parentElement.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    consent.closest(".consent").classList.toggle("is-invalid", !consent.checked);
    if (!ok) { note.textContent = "Please add your name and a valid phone number."; return null; }
    if (!consent.checked) { note.textContent = "Please tick the box so we can contact you."; return null; }
    note.textContent = "";

    const tab = val("tab");
    const lines = [
      "Hello QS Realty,",
      "",
      `Request: ${TABS[tab].label}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      val("email") && `Email: ${val("email")}`,
      tab === "enquiry" && `Interested in: ${val("type")}`,
      tab === "callback" && `Best time to call: ${val("time")}`,
      val("site") && `Site: ${val("site")}`,
      val("date") && `Preferred date: ${val("date")}`,
      val("message") && `\n${val("message")}`,
    ].filter((l) => l !== false && l !== "");
    return { name, label: TABS[tab].label, text: lines.join("\n") };
  };

  const showDone = () => { form.hidden = true; intro.hidden = true; done.hidden = false; };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = collect();
    if (!msg) return;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg.text)}`, "_blank", "noopener");
    showDone();
  });

  form.querySelector(".js-mail").addEventListener("click", () => {
    const msg = collect();
    if (!msg) return;
    const subject = `${msg.label} — ${msg.name}`;
    window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg.text)}`;
    showDone();
  });

  done.querySelector(".js-again").addEventListener("click", () => {
    form.reset();
    done.hidden = true; form.hidden = false; intro.hidden = false;
    setTab(tabField.value || "enquiry");
  });
}

function setupHeroVideo() {
  const video = document.querySelector(".hero__video");
  const button = document.querySelector(".hero__video-toggle");
  if (!video || !button) return;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const update = () => {
    button.textContent = video.paused ? "Play background video" : "Pause background video";
  };
  const play = () => video.play().catch(update);
  video.addEventListener("play", update);
  video.addEventListener("pause", update);
  video.addEventListener("error", () => { button.hidden = true; });
  button.hidden = false;
  button.addEventListener("click", () => {
    if (video.paused) play();
    else video.pause();
  });
  motion.addEventListener("change", (event) => {
    if (event.matches) video.pause();
  });
  update();
  if (!motion.matches) play();
}
