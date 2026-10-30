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
  setupForm();
  setupFootprint();

  if (!hasGsap || reduceMotion) {
    root.classList.add("no-motion");
    setupMenu(null);
    setupHeader();
    $$(".js-counter").forEach((el) => (el.textContent = formatNumber(+el.dataset.to, el.dataset.format)));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */
  let lenis = null;
  if (typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
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
     PRELOADER
     ========================================================= */
  const preloader = $(".preloader");
  document.body.classList.add("is-loading");
  lenis && lenis.stop();

  const counter = { v: 0 };
  const countEl = $(".js-count");
  const intro = gsap.timeline({ defaults: { ease: "expo.out" } });

  intro
    .to(".preloader__frame rect", { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, 0)
    .from(".preloader__qs", { yPercent: 40, autoAlpha: 0, duration: 1.4 }, 0.2)
    .from(".preloader__realty", { y: 16, autoAlpha: 0, duration: 1.2 }, 0.6)
    .from(".preloader__tag", { autoAlpha: 0, duration: 1 }, 0.6)
    .to(counter, {
      v: 100, duration: 2.1, ease: "power2.inOut",
      onUpdate: () => (countEl.textContent = String(Math.round(counter.v)).padStart(3, "0")),
    }, 0)
    .to(".preloader__inner, .preloader__count, .preloader__tag", { autoAlpha: 0, y: -30, duration: 0.6, ease: "power2.in" }, 2.3)
    .to(preloader, { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, 2.6)
    .to(".hero__img", { scale: 1, duration: 2.4, ease: "expo.out" }, 2.75)
    .to(".hero__title .line > span", { yPercent: 0, duration: 1.6, stagger: 0.12 }, 3.0)
    .to(".hero__top, .hero__bottom", { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 3.4)
    .to(".header", { autoAlpha: 1, y: 0, duration: 1.2 }, 3.5)
    .add(() => {
      preloader.style.display = "none";
      document.body.classList.remove("is-loading");
      lenis && lenis.start();
      ScrollTrigger.refresh();
    }, 3.6);

  /* =========================================================
     PINNED HORIZONTAL LIFECYCLE — created first so later
     triggers account for its pin spacing
     ========================================================= */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 900px)", () => {
    const track = $(".services__track");
    const distance = () => track.scrollWidth - window.innerWidth;
    const st = { trigger: ".services__pin", start: "top top", end: () => "+=" + distance(), invalidateOnRefresh: true };

    gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { ...st, pin: true, scrub: 1, anticipatePin: 1 } });
    gsap.to(".services__progress span", { scaleX: 1, ease: "none", scrollTrigger: { ...st, scrub: true } });
    gsap.to(".services__intro", {
      autoAlpha: 0, ease: "none",
      scrollTrigger: { trigger: ".services__pin", start: "top top", end: () => "+=" + window.innerWidth * 0.35, scrub: true },
    });
    gsap.from(".services__intro .line > span", {
      yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.1,
      scrollTrigger: { trigger: ".services", start: "top 70%" },
    });
  });
  mm.add("(max-width: 899px)", () => {
    $$(".phase").forEach((el) => {
      gsap.from(el, { y: 50, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });
  });

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

  gsap.fromTo(".philosophy__media img", { scale: 1.15 }, {
    scale: 1, ease: "none",
    scrollTrigger: { trigger: ".philosophy", start: "top bottom", end: "bottom bottom", scrub: true },
  });

  // value rows
  gsap.from(".value", {
    y: 40, autoAlpha: 0, duration: 1.2, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: ".values__list", start: "top 80%" },
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
     CURSOR + MAGNETIC
     ========================================================= */
  if (finePointer) setupCursor();

  window.addEventListener("load", () => ScrollTrigger.refresh());

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

  function setupCursor() {
    const cursor = $(".cursor");
    const label = $(".cursor__label");
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3" });
    let lastX = 0, lastY = 0;

    const updateTone = () => {
      const under = document.elementFromPoint(lastX, lastY);
      cursor.classList.toggle("is-on-dark", !!(under && under.closest("[data-cursor-dark], .header, .menu")));
    };

    window.addEventListener("mousemove", (e) => {
      lastX = e.clientX; lastY = e.clientY;
      xTo(lastX); yTo(lastY);
      cursor.style.opacity = 1;
      updateTone();
    });
    window.addEventListener("scroll", updateTone, { passive: true });
    document.addEventListener("mouseleave", () => (cursor.style.opacity = 0));

    $$("a, button, .chips label, .footprint__areas li").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
    $$("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => { label.textContent = el.dataset.cursor; cursor.classList.add("is-label"); });
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-label"));
    });

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

function setupForm() {
  const form = document.getElementById("enquiry");
  if (!form) return;
  const note = form.querySelector(".form__note");

  const collect = () => {
    const data = new FormData(form);
    const name = (data.get("name") || "").trim();
    const phone = (data.get("phone") || "").trim();
    let ok = true;
    [["name", name.length > 1], ["phone", /^[+\d][\d\s-]{7,}$/.test(phone)]].forEach(([field, valid]) => {
      form.querySelector(`[name="${field}"]`).parentElement.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) { note.textContent = "Please add your name and a valid phone number."; return null; }
    note.textContent = "";
    const lines = [
      "Hello QS Realty,",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      data.get("email") ? `Email: ${data.get("email")}` : null,
      `Interested in: ${data.get("type")}`,
      data.get("message") ? `\n${data.get("message")}` : null,
    ].filter((l) => l !== null);
    return { name, type: data.get("type"), text: lines.join("\n") };
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = collect();
    if (!msg) return;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg.text)}`, "_blank", "noopener");
    note.textContent = "Opening WhatsApp — we usually reply within a working day.";
  });

  form.querySelector(".js-mail").addEventListener("click", () => {
    const msg = collect();
    if (!msg) return;
    const subject = `Project enquiry — ${msg.type} — ${msg.name}`;
    window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg.text)}`;
  });
}
