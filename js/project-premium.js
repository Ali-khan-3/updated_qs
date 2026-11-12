/* Shared image story on all project pages; native flow on small screens. */
(() => {
  if (!window.gsap || !window.ScrollTrigger || !window.QSProjectStory) return;
  gsap.matchMedia().add("(min-width: 1000px) and (prefers-reduced-motion: no-preference)", () => {
    const cleanups = window.QSProjectStory.roots.map(root => window.QSProjectStory.mount(root));
    return () => cleanups.forEach(cleanup => cleanup());
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
