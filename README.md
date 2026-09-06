# Aditya — Aerodynamics Engineer · Portfolio

Personal portfolio site. Static HTML/CSS/JS, no build step, no dependencies.
Designed to be hosted free on GitHub Pages.

**Live site:** `https://YOUR-USERNAME.github.io/portfolio/`

---

## Deploy to GitHub Pages (5 minutes)

**1. Create an empty repo on GitHub**

Go to <https://github.com/new>, name it `portfolio`, set it **Public**, and do
**not** tick "Add a README" (this folder already has one).

**2. Push this folder**

Open a terminal in this folder and run:

```bash
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

**3. Turn Pages on**

In the repo: **Settings → Pages → Build and deployment**
→ Source: **Deploy from a branch** → Branch: **main** → Folder: **/ (root)** → **Save**.

Wait ~60 seconds. Your site is live at `https://YOUR-USERNAME.github.io/portfolio/`.

**Want the shorter URL** `https://YOUR-USERNAME.github.io/`? Name the repo
`YOUR-USERNAME.github.io` instead of `portfolio` — everything else is identical.

---

## Updating the site later

```bash
git add -A
git commit -m "Update projects section"
git push
```

Pages redeploys automatically, usually within a minute.

---

## Folder layout

```
portfolio/
├── index.html                  all page content
├── assets/
│   ├── css/styles.css          design system, layout, components
│   ├── css/mobile.css          responsive breakpoints + desktop-view toggle
│   ├── js/script.js            nav, lightbox, galleries, counters
│   ├── img/                    26 project images
│   └── cv/Aditya_Kumar_CV.pdf  the file the "Download CV" buttons point at
├── .nojekyll                   tells Pages to serve files as-is
└── README.md
```

---

## Common edits

**Swap the CV.** Replace `assets/cv/Aditya_Kumar_CV.pdf` with your current one,
keeping the same filename. Nothing else needs changing.

**Add a photo to a gallery.** Drop the image into `assets/img/`, then in
`index.html` copy an existing `<figure class="gitem">` block inside the relevant
`<div class="gstrip">` and change the `src`, `alt`, `data-caption` and
`data-sub`. Every image in a `gstrip`, `img-row` or `intro-img-stack` is
automatically wired into the lightbox — no JS changes needed.

Search `index.html` for `TO ADD LATER` — those comments mark the slots that were
placeholders in the old PDF version:

- CL/CD correlation, CFD vs track
- Tuft-testing flow visualisation
- Residuals & convergence plots
- Adani Defence wing CFD + internship photos
- Tata Motors internship photo
- RANS MRF derivation, IFR-27 front/rear wing CFD, Pacejka 6.1 lap sim
- Formula Bharat award / cost report / BOM photos

**Change a colour.** Everything comes from CSS custom properties at the top of
`assets/css/styles.css` — `--red`, `--blue`, `--bg`, `--text` and friends.

**Add a nav item.** Add an `<li><a href="#section-id">Label</a></li>` to
`.nav-links`. Scrollspy picks it up automatically as long as the id exists.

---

## What the page does

- Sticky nav with scroll-spy highlighting and a hamburger menu under 980px
- Scroll progress bar and back-to-top button
- Horizontal image strips: drag to scroll, arrow buttons, keyboard accessible
- Full-screen lightbox with prev/next, arrow keys, Escape, swipe, and a counter
- Expandable project cards
- Animated stat counters, reveal-on-scroll (both disabled under
  `prefers-reduced-motion`)
- **Switch to Desktop View** toggle in the footer, matching the behaviour on
  phone browsers where you'd otherwise pinch-zoom. The choice is remembered.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly also works.

## Browser support

Any current Chrome, Safari, Firefox or Edge. No framework, no build tooling,
no external JavaScript — only Google Fonts is loaded from a CDN.
