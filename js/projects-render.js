/* =========================================================
   QS REALTY — renders project content from projects-data.js
   Runs before main.js so the scroll animations pick up the
   rendered elements.
   ========================================================= */
(() => {
  "use strict";
  const data = window.QS_PROJECTS;
  if (!data) return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>';
  const meta = (p) =>
    [["Type", p.type], ["Location", p.location]]
      .filter(([, v]) => v)
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`)
      .join("");

  /* ---------- home page: featured ventures ---------- */
  const featuredEl = document.querySelector('[data-render="featured"]');
  if (featuredEl) {
    featuredEl.innerHTML = data.featured.map((p, i) => {
      const m = meta(p);
      return `
        <a class="project" href="project.html?p=${esc(p.slug)}" data-cursor="View project" data-transition>
          <div class="project__media"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" loading="lazy" decoding="async" /></div>
          <div class="project__info">
            <span class="tag tag--live">${esc(p.status)}</span>
            <span class="project__index">${pad(i + 1)} / ${pad(data.featured.length)}</span>
            <h3 class="project__title">${esc(p.name)}</h3>
            <p class="project__summary">${esc(p.summary)}</p>
            ${m ? `<dl class="project__meta">${m}</dl>` : ""}
            <span class="btn-arrow"><span>View project</span>${arrow}</span>
          </div>
        </a>`;
    }).join("");
  }

  /* ---------- home page: quick index beside the ongoing cards ---------- */
  const indexEl = document.querySelector('[data-render="featured-index"]');
  if (indexEl) {
    indexEl.innerHTML = data.featured.map((p, i) => `
      <li><a href="project.html?p=${esc(p.slug)}" data-transition>
        <span class="ongoing__index-num">${pad(i + 1)}</span>
        <span class="ongoing__index-name">${esc(p.name)}</span>
        <span class="ongoing__index-loc">${esc(p.location || p.type || "")}</span>
        ${arrow}
      </a></li>`).join("");
  }

  /* ---------- home page: completed works ---------- */
  const completedEl = document.querySelector('[data-render="completed"]');
  if (completedEl) {
    completedEl.innerHTML = data.completed.map((p) => `
      <li class="done">
        <div>
          <h4 class="done__name">${esc(p.name)}</h4>
          <p class="done__desc">${esc(p.desc)}</p>
        </div>
      </li>`).join("");
    document.querySelectorAll("[data-completed-count]").forEach((el) => (el.textContent = data.completed.length));
  }

  /* ---------- project page ---------- */
  const root = document.getElementById("project-root");
  if (root) {
    const slug = new URLSearchParams(location.search).get("p");
    const i = Math.max(0, data.featured.findIndex((p) => p.slug === slug));
    const p = data.featured[i];
    const next = data.featured[(i + 1) % data.featured.length];
    const m = meta({ ...p, status: "" });
    const enquiry = encodeURIComponent(`Hello QS Realty, I'd like to know more about ${p.name}.`);

    document.title = `${p.name} — QS Realty`;

    root.innerHTML = `
      <section class="pj-hero" data-cursor-dark>
        <div class="pj-hero__media"><a href="${esc(p.image)}" target="_blank" rel="noopener" aria-label="Open ${esc(p.name)} rendering at full size (opens in a new tab)"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" width="${p.imageWidth}" height="${p.imageHeight}" fetchpriority="high" /></a></div>
        <div class="pj-hero__inner container">
          <a href="index.html#projects" class="pj-back link-u" data-transition>← All ventures</a>
          <p class="eyebrow eyebrow--light"><span class="num">(${pad(i + 1)})</span> Development venture</p>
          <h1 class="pj-hero__title"><span class="line"><span>${esc(p.name)}</span></span></h1>
          <div class="pj-hero__facts">
            <span class="tag tag--live tag--light">${esc(p.status)}</span>
            ${m ? `<dl class="pj-facts">${m}</dl>` : ""}
          </div>
        </div>
      </section>

      <section class="pj-intro section">
        <div class="container pj-intro__grid">
          <p class="pj-intro__lead js-words">${esc(p.lead)}</p>
          <div class="pj-intro__body">
            ${p.body.map((t) => `<p class="reveal-up">${esc(t)}</p>`).join("")}
          </div>
        </div>
      </section>

      <section class="pj-gallery" aria-label="Project renderings">
        <div class="container"><h2 class="h2 pj-gallery__title">Project <em>views.</em></h2></div>
        <div class="container pj-gallery__grid">
          ${p.gallery.map((g, k) => `
            <figure class="pj-gallery__item pj-gallery__item--${k + 1}">
              <a href="${esc(g.src)}" target="_blank" rel="noopener" aria-label="Open ${esc(g.alt)} at full size (opens in a new tab)">
                <img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy" decoding="async" width="${g.width}" height="${g.height}" />
              </a>
              <figcaption>${esc(g.alt)}</figcaption>
            </figure>`).join("")}
        </div>
      </section>

      <section class="pj-process section section--dark" data-cursor-dark>
        <div class="container">
          <div class="section-head section-head--split">
            <p class="eyebrow eyebrow--light">Delivered under one roof</p>
            <h2 class="h2 reveal-lines"><span class="line"><span>Every stage,</span></span><span class="line"><span><em>one team.</em></span></span></h2>
          </div>
          <ol class="pj-process__list">
            ${data.process.map((s, k) => `
              <li class="reveal-up"><span>${pad(k + 1)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}
          </ol>
        </div>
      </section>

      <section class="pj-cta section section--sage" data-cursor-dark>
        <div class="container pj-cta__inner">
          <h2 class="pj-cta__title reveal-lines"><span class="line"><span>Interested in</span></span><span class="line"><span><em>${esc(p.name)}?</em></span></span></h2>
          <div class="pj-cta__actions reveal-up">
            <a href="https://wa.me/919820299042?text=${enquiry}" class="btn btn--pill btn--light btn--lg" target="_blank" rel="noopener" data-magnetic><span>Enquire on WhatsApp</span></a>
            <a href="tel:+918888141899" class="btn-arrow btn-arrow--light"><span>+91 8888 141 899</span>${arrow}</a>
          </div>
        </div>
      </section>

      <a class="pj-next" href="project.html?p=${esc(next.slug)}" data-transition data-cursor="Next venture" data-cursor-dark>
        <img src="${esc(next.image)}" alt="" loading="lazy" />
        <span class="pj-next__shade"></span>
        <span class="pj-next__inner container">
          <span class="eyebrow eyebrow--light">Next venture</span>
          <span class="pj-next__title">${esc(next.name)} ${arrow}</span>
        </span>
      </a>`;
  }
})();
