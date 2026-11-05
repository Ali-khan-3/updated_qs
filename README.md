# QS Realty — website

Static site with no build step. Every push to `main` deploys to Vercel automatically.

```
index.html            home page and most copy
project.html          one page per featured venture (project.html?p=<slug>)
js/projects-data.js   all project content: the 4 featured ventures and the 20 completed works
js/projects-render.js builds the project cards, the completed list and the project pages from that data
js/main.js            preloader, smooth scroll, scroll animations, cursor, menu, contact form
css/style.css         design tokens (top of file) and section styles
assets/img/           photography
vercel.json           caching and security headers
```

GSAP 3.12.5, ScrollTrigger and Lenis 1.1.13 load from CDNs. If they fail to load, or the visitor has "reduce motion" turned on, the page falls back to a static layout.

## Common edits

- **Projects:** edit `js/projects-data.js`. Add or remove a featured venture or a completed work there and both pages update.
- **Enquiry destination:** the WhatsApp number and the email address are set at the top of `js/main.js`.
- **Overall size:** desktop is scaled to 85% by one rule near the top of `css/style.css` (`html { font-size: 85%; }`).

## Before or soon after launch

- **Photos:** all photography is stock. Replace it with real QS Realty project, site and team photos, keeping the same filenames. To add a portrait, put `<img src="…" alt="Name">` inside `.leader__portrait`.
- **Night skyline (Development partners section):** `assets/img/mumbai-night.jpg` is a stock photo whose location isn't confirmed. Replace it with the client's own night drone shot.
- **Social preview:** set `og:image` in `index.html` to a full URL (`https://<domain>/assets/img/hero-towers.jpg`) once the domain is final.
- **Business hours:** the contact panel says "Mon–Sat, 10am–8pm". Confirm this with the client.
