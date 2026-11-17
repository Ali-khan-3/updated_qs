# QS Realty — website

Static site with no build step. Every push to `main` deploys to Vercel automatically.

```
index.html            home page and most copy
project.html          one page per featured venture (project.html?p=<slug>)
js/projects-data.js   all project content: the 4 featured ventures and the 20 completed works
js/projects-render.js builds the project cards, the completed list and the project pages from that data
js/main.js            shared controls/forms and project-page entry, cursor and reveals
js/premium.js         homepage loader, responsive scroll choreography and controls
js/project-premium.js expanding project gallery
css/premium.css       approved homepage design and responsive layout
css/expertise-atelier.css expertise layout and image layers
js/expertise-atelier.js continuous gold route, stage controls and image blending
css/project-premium.css project-detail visual refinements
js/vendor/            pinned local GSAP, ScrollTrigger and Lenis distributions
css/style.css         design tokens (top of file) and section styles
assets/img/           photography
vercel.json           caching and security headers
```

The homepage and project pages load pinned local copies of GSAP 3.12.5, ScrollTrigger and Lenis 1.1.13 from js/vendor/. If they fail to load, or the visitor has "reduce motion" turned on, the page falls back to a static layout.

On desktop, the homepage opens with a horizontal gold brand mark and asset-readiness progress, then a rounded video aperture expands into the hero. Media readiness waits at most 3.3 seconds; an 8.5-second overall fail-open timer prevents a stalled entry. Direct section links and restored scroll positions skip the intro. Desktop scroll uses a collage-to-inline-image sequence and four alternating project panels. Phones use native scrolling, compact stacked project cards and a swipeable secondary gallery; reduced motion uses static content and a paused hero. Project pages add a full-image-to-editorial gallery transition. The Structure / Full View 3D section is intentionally excluded.

## Common edits

- **Projects:** edit `js/projects-data.js`. Add or remove a featured venture or a completed work there and both pages update.
- **Enquiry destination:** the WhatsApp number and the email address are set at the top of `js/main.js`.
- **Overall size:** the redesigned homepage and project pages use a 100% root font size with responsive component sizing. Their styles override the older 85% rule in css/style.css.
- **Hero video:** `assets/client/video/hero-marine-drive-ai-4k.mp4` is the selected Marine Drive-inspired AI concept (3840 × 2160, 24 fps, 10 seconds, about 17.4 MB, silent fast-start H.264 MP4). This is a Lanczos upscale with light sharpening of the retained Full HD file `hero-marine-drive-ai.mp4`, not native 4K footage. A generated still is animated with a looping camera glide; traffic and water do not move independently. Its matching poster is `hero-marine-drive-ai-poster.jpg`; update both the poster and its preload in `index.html` when replacing the video. Playback retains pause/play and reduced-motion support. The hero uses natural cover sizing without added CSS zoom, parallax oversizing, colour filtering, or the homepage grain overlay. Provenance and generation notes are in `output/previews/marine-drive/README.txt`.
- **Archived upscaled video previews:** `output/backups/unused-videos/assets/client/video/hero-mumbai-skyline-1080p.mp4` (1920 × 1080) and `hero-mumbai-skyline-4k.mp4` (3840 × 2160) use Lanczos resizing and light sharpening, with a small vertical crop to fit 16:9 without stretching. These are upscaled exports, not native HD/4K footage; both retain 24 fps, omit audio, and support fast-start playback. They are comparison files archived outside the live asset folders and are not selected by the homepage.

## Before or soon after launch

- **Photos:** featured projects and team portraits use supplied client assets. Supporting editorial images are illustrative; four AI photographs use optimized WebP files in `assets/img/editorial/`; their PNG masters are archived in `output/backups/unused-images/assets/img/editorial/`. Their exact prompts, purpose and built-in image-generation provenance are recorded in `assets/img/editorial/generation-notes.json`. They do not document completed QS Realty projects.
- **Coastline:** the partnership uses `assets/img/editorial/marine-drive-dusk.webp`. The contact section uses a lazy-loaded Google Maps embed for the QS Realty main office in Kurla West, with the existing directions link above it.
- **Social preview:** set `og:image` in `index.html` to a full URL (`https://<domain>/assets/client/projects/Pinnacle%2C%20Kurla%20west.png`) once the domain is final.
- **Business hours:** the contact panel says "Mon–Sat, 10am–8pm". Confirm this with the client.

## Redesign implementation review

The approved visual boards remain in output/previews/redesign-review-v1/. Browser screenshots and the QA result are in output/previews/. Source snapshots taken immediately before the homepage implementation are in output/backups/before-premium-redesign/. No deployment or Git push was performed.

Motion contexts are scoped with GSAP matchMedia; resizing and reduced-motion changes revert pin spacers and animated inline styles. A single GSAP ticker drives desktop Lenis. The video pauses outside the hero and when the tab is hidden. Project selectors are keyboard-accessible, inactive pinned panels are inert, and the mobile menu traps focus and restores it on close. The expertise sequence, complete works list, location selection and enquiry tabs work independently of the animation libraries. Enquiries still open WhatsApp or email for the visitor to send.

Reference implementation guidance: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ and https://gsap.com/docs/v3/Plugins/ScrollTrigger/. Desktop motion takes its direction from Still/Form, the opening video reveal from Casa Momo, and the editorial palette/type from Loam House.

The missing reference sequence is implemented in js/project-story.js and css/project-story.css: the final project cards dissolve through a feathered mist veil; a centered image expands into a panorama, contracts into an editorial gallery, and exchanges places with the previous/next thumbnails as the visitor scrolls. It appears at #project-perspectives on the homepage and in every project rendering gallery. The numbered controls and thumbnails seek the same scroll timeline. The final frame expands again before the page continues. Mobile and reduced-motion modes retain a static reading order. Checks and captured animation states are saved in output/previews/project-story-qa.json and motion-*.png.

The editorial refinement matches the approved boards with a layered rounded collage, three-plus-two statistics grid, larger portrait composition, the earlier architectural worktable and service accordions (since replaced by the Atelier below), a dusk coastline, two-column ethos, olive company cards, underlined contact tabs and a gold wordmark above the footer navigation. The archived screenshots show that earlier accordion layout. All 20 completed buildings remain directly visible. The footprint map remains schematic, not to scale. Current implementation screenshots and responsive checks are in `output/previews/editorial-polish/`; a source snapshot is in `output/backups/before-editorial-polish/`.

Project-card motion was subsequently rebuilt against the supplied `Screen Recording 2026-11-11 012720.mp4`. A single rounded image window travels between columns while full-size images roll vertically inside it. Incoming copy panels rise from below, outgoing panels remain behind the moving image, and text resolves with a short blur reveal. All geometry and access states follow a reversible scrubbed timeline; numbered buttons seek named project holds. Desktop resize and reduced-motion teardown remove the temporary image window and restore the original four card images. Reference frames, implementation captures and checks are in `output/previews/reference-012720/`. The earlier editorial screenshots show the previous card animation.

The project-card layout now follows the reference's top-left sans-serif titles, bottom-left outlined number controls, and bottom-right descriptions with project links. Paired panels alternate charcoal and ivory, with balanced near-viewport margins on desktop. The external pagination and project counter are removed. Mobile retains stacked images and copy. Updated screenshots and responsive checks are in `output/previews/stillform-card-layout/`; earlier card screenshots and recordings predate this layout.

The expertise section is currently the light Architect's Atelier test version (`css/expertise-atelier.css`, `js/expertise-atelier.js`), following the selected concept. Eight aligned ivory-and-brass model scenes illustrate land assessment through turnkey delivery. Live HTML text, a four-by-two desktop service index, and an SVG gold route stay synchronized; numbered model markers also select stages. The gold node moves continuously between stages every 2.4 seconds; after stage 08 the gold line fades out and the sequence starts again at stage 01. On arrival, the next decoded image fades over the previous opaque composition for 1.1 seconds, without exposing the background. Desktop autoplay pauses outside the section and when the tab is hidden. There is no pause control: a manually selected stage stays for 6 seconds and the sequence then continues from it. Keyboard focus inside the section holds the sequence until focus leaves, and reduced motion or data-saver disables autoplay. Inactive copy panels are inert; the service index supports arrow keys, Home and End. The illustrative model is AI-generated and does not represent an actual QS Realty development. Optimized WebP assets are in `assets/img/expertise/atelier/`; PNG masters and exact built-in generation prompts are in `output/imagegen/expertise-atelier/`. The preceding cinematic design is preserved in `output/backups/before-expertise-atelier/`. Current screenshots, checks and the animation preview are in `output/previews/expertise-atelier/`.

## Source cleanup

Unused legacy homepage loaders, expertise maps/accordions, card rendering branches, and superseded gallery styles have been removed. The unused expertise-studio CSS/JS files were removed from the application folders; their prior versions remain in `output/backups/before-code-cleanup/`. Shared CSS and responsive overrides remain where current pages need them. Source imagery, video comparison exports, generated masters, vendor libraries and existing review artifacts are retained.

Desktop/mobile layout comparisons and interaction checks are saved in `output/previews/code-cleanup/`. No build dependencies were added to the website, and no deployment or Git push was performed.

## Image cleanup

After that cleanup, 26 referenced website images remained in `assets/`. The 42 unused images (20.8 MB), including original client references and PNG masters, were moved to `output/backups/unused-images/` with their original folder structure. Their paths and SHA-256 hashes are recorded in `output/previews/image-cleanup/moved-images.json`. Videos and existing output previews are unchanged. To restore an archived image, copy it back to its recorded original path.

## Video cleanup

The hero now serves `assets/client/video/hero-marine-drive-mobile.mp4` (1280 � 720, about 1.1 MB) at widths up to 999px or on coarse-pointer devices, covering phone landscape. Desktop keeps `hero-marine-drive-ai-4k.mp4`. The Full HD `hero-marine-drive-ai.mp4` is retained as the source master for future encodes, alongside the shared poster. Five unused skyline/watermarked videos (39.3 MB) were moved to `output/backups/unused-videos/`. The archive preserves original paths; SHA-256 hashes and browser playback checks are in `output/previews/video-cleanup/`. Existing review recordings in `output/` are retained.


## Mobile refinement � November 2026

Mobile entry uses a short CSS brand dissolve and never waits for video readiness. The menu starts below the header and scrolls internally on short screens. The homepage gallery supports native horizontal swiping and numbered controls below 1000px; all 20 completed works stay visible. Optional `mobileImage` fields in project data provide 720px WebP alternatives without changing desktop sources.

Below 650px, expertise shows the model, a compact animated gold route, a horizontally scrollable stage selector and the selected description together. The sequence autoplays while the model is visible; manual selection, reduced motion and Data Saver pause automatic playback. Choosing a stage does not scroll the page, and the existing opaque-base crossfade is preserved. Below 768px, the contact form comes immediately after its heading, with office details and the map below it. Resize listeners restore the desktop DOM order.

Verification artifacts are in `output/previews/mobile-fixes/`. The release uses asset cache version 20261113-2.

Mobile sections 01 and 05 retain the desktop motion language: section 01 uses a shortened pinned collage-to-inline-image sequence (one viewport of scroll), and section 05 uses continuous gold-path travel with synchronized image crossfades. Native touch scrolling remains in control. Motion checks and screenshots are saved in `output/previews/mobile-motion/`.
