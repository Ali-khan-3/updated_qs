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
    const order = [0, 2, 1, 3].map(i => data.featured[i]).filter(Boolean);
    featuredEl.innerHTML = order.map((p,i) => `
      <article class="venture ${i%2 ? 'venture--reverse' : ''}" id="venture-${p.slug}" aria-label="${esc(p.name)}">
        <div class="venture__copy" data-href="project.html?p=${esc(p.slug)}"><div class="venture__heading"><p class="venture__location">${esc(p.location)}</p><h3>${esc(p.name)}</h3><span class="venture__status">${esc(p.status)}</span></div>
        <div class="venture__bottom"><nav class="project-dots" aria-label="Select a development">${order.map((item,k)=>`<button type="button" data-project="${k}" aria-label="Show ${esc(item.name)}" aria-pressed="${k===i}">${pad(k+1)}</button>`).join("")}</nav>
        <div class="venture__details"><p class="venture__summary">${esc(p.summary)}</p><a href="project.html?p=${esc(p.slug)}" target="_blank" rel="noopener" class="btn-arrow"><span>View project</span>${arrow}</a></div></div></div>
        <a class="venture__image" href="project.html?p=${esc(p.slug)}" target="_blank" rel="noopener" aria-label="Explore ${esc(p.name)} (opens in a new tab)"><picture>${p.mobileImage ? `<source media="(max-width: 999px)" srcset="${esc(p.mobileImage)}">` : ""}<img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" width="${p.imageWidth}" height="${p.imageHeight}" loading="lazy" decoding="async"></picture><span class="venture__arrow" aria-hidden="true">↗</span></a>
      </article>`).join("");
    // The whole details panel opens the project in a new tab (links and the 01–04 buttons keep their own behaviour).
    featuredEl.addEventListener("click", (e) => {
      const copy = e.target.closest(".venture__copy");
      if (!copy || e.target.closest("a, button")) return;
      window.open(copy.dataset.href, "_blank", "noopener");
    });
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
    const m = meta(p);
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

      <section id="project-enquiry" class="pj-cta section section--sage" data-cursor-dark>
        <div class="container pj-cta__inner">
          <h2 class="pj-cta__title reveal-lines"><span class="line"><span>Interested in</span></span><span class="line"><span><em>${esc(p.name)}?</em></span></span></h2>
          <div class="pj-cta__actions reveal-up">
            <a href="https://wa.me/919820299042?text=${enquiry}" class="btn btn--pill btn--light btn--lg" target="_blank" rel="noopener" data-magnetic><span>Enquire on WhatsApp</span></a>
            <a href="tel:+918888141899" class="btn-arrow btn-arrow--light"><span>+91 8888 141 899</span>${arrow}</a>
          </div>
        </div>
      </section>`;
  }
})();
