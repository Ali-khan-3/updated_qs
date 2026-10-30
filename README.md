# QS Realty — website

A static one-page site with no build step. Open `index.html` in a browser, or upload the folder to any static host (Netlify, Vercel, cPanel, GitHub Pages).

```
index.html        page markup and all copy
css/style.css     design tokens (top of file) and section styles
js/main.js        preloader, smooth scroll, scroll animations, cursor, enquiry form
assets/img/       photography (stock placeholders, see below)
assets/favicon.svg
```

Libraries load from CDNs: GSAP 3.12.5, ScrollTrigger and Lenis 1.1.13. If they fail to load, or the visitor has "reduce motion" turned on, the page falls back to a static layout.

## Before launch

- **Photography:** every image in `assets/img/` is an Unsplash stock placeholder. Replace them with real QS Realty project and site photos, keeping the same filenames, or update the `src` attributes.
- **Team portraits:** the two Managing Director cards show initials. To use a photo, add `<img src="assets/img/fahad.jpg" alt="Fahad Quraishi">` inside `.leader__portrait`.
- **Enquiry form:** the form opens WhatsApp with the message filled in, or an email. The receiving number and address are set at the top of `js/main.js`.
- **Map:** the contact map embeds a Google Maps search for the Kurla (W) office. Check that the pin lands on the right building.
