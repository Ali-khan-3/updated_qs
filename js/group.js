/* QS Realty group page: the two upcoming companies answer with a short "in progress" message. */
(() => {
  "use strict";
  document.querySelectorAll(".js-year").forEach(el => (el.textContent = new Date().getFullYear()));
  const status = document.querySelector(".group-status");
  const upcoming = [...document.querySelectorAll(".group-tab.is-upcoming")];
  if (!status || !upcoming.length) return;
  let timer;
  const hide = () => {
    clearTimeout(timer);
    status.classList.remove("is-shown");
    upcoming.forEach(tab => tab.classList.remove("is-open"));
  };
  const show = tab => {
    const again = tab.classList.contains("is-open");
    hide();
    if (again) return;
    tab.classList.add("is-open");
    const note = document.createElement("span");
    note.textContent = tab.dataset.upcoming;
    status.replaceChildren(note);
    // next frame, so the message fades in rather than appearing at once
    requestAnimationFrame(() => status.classList.add("is-shown"));
    timer = setTimeout(hide, 7000);
  };
  upcoming.forEach(tab => tab.addEventListener("click", () => show(tab)));
  document.addEventListener("keydown", event => { if (event.key === "Escape") hide(); });
  // Arriving on a link to an upcoming company shows its message straight away.
  const target = upcoming.find(tab => "#" + tab.id === location.hash);
  if (target) show(target);
})();
