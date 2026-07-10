# Zephyr Venturecraft — jrjhealey.github.io

The personal consulting website of **Dr Joe Healey**, published at
**[zephyrventurecraft.com](https://zephyrventurecraft.com)** (served from
`jrjhealey.github.io` via GitHub Pages).

Zephyr Venturecraft Ltd is Joe's independent consulting practice. The site
presents his work building ventures in biotech and deep tech: scientific and
R&D advisory, commercial and venture strategy, and fractional leadership.

---

## About the site

A small, fast, dependency-free static site — three pages of hand-written
HTML/CSS/JS, no build step and no framework. It is served directly by GitHub
Pages from the `master` branch, so a push is a deploy.

Design language:

- **Palette** — cream (`#f8f3ea`), forest greens (`#0e2218` → `#eaf5ed`) and a
  copper accent (`#a0622a`). Everything keys off the CSS custom properties at
  the top of `styles.css`.
- **Type** — Playfair Display (headings, and the italic accents) + Inter (body),
  loaded from Google Fonts.
- **Logo** — the "Z" monogram: a forest tile with a cream Z flanked by two copper
  pills. Lives in `assets/` with mark, favicon, inverse/mono and lockup variants.
- **Motif** — an abstract molecular texture behind the hero and page headers,
  a cursor-reactive "wind" particle field in the hero, and faint DNA-strand
  canvases behind the lower sections of the home page.

All canvas motion is automatically disabled when the visitor has
`prefers-reduced-motion` set.

---

## Structure

```
.
├── index.html          # Landing: hero, services, about, engagement formats, contact
├── about.html          # Background: portrait, bio, education, career timeline
├── portfolio.html      # Portfolio: featured spotlight + filterable case-study list
├── styles.css          # Shared design system (tokens, layout, components, responsive)
├── main.js             # All interactivity (see below)
├── deploy.sh           # One-command commit + push helper
├── DEPLOY.md           # Deploy + custom-domain / DNS reference
├── CNAME               # Custom domain (zephyrventurecraft.com)
├── .nojekyll           # Serve files as-is (no Jekyll build)
├── LICENSE             # MIT (covers source code only)
├── README.md
└── assets/             # All images and brand files
    ├── mark.png                        # Site logo used in nav + footer
    ├── favicon-16/32/64/180/512.png    # Favicons + apple-touch icon
    ├── og-image.png                    # Social-share (Open Graph) card
    ├── molecular.svg                   # Texture behind hero / page headers
    ├── portrait.jpg                    # About-page portrait
    ├── svc-science.svg                 # Service-card graphic — advisory
    ├── svc-strategy.svg                # Service-card graphic — strategy
    ├── svc-leadership.svg              # Service-card graphic — leadership
    ├── zephyr-mark-*.png               # Logo mark variants (primary, inverse, mono)
    ├── zephyr-glyph-1024.png           # Z glyph
    └── zvc-lockup-*.png                # Horizontal wordmark lockups (light/dark/mono)
```

### `main.js` — what runs where

| Feature | Page | Notes |
|---|---|---|
| Sticky nav, solid-on-scroll | all | `about.html` / `portfolio.html` use the always-dark variant |
| Scroll-reveal, count-up stats, magnetic buttons, card tilt | all | IntersectionObserver / pointer-based |
| Hero "wind" particle field | index | cursor-deflected flow field on `#wind` |
| DNA-strand canvases | index | faint `<canvas data-strand>` behind the lower sections |
| Timeline progress + atom dots | about | fills as you scroll |
| Portfolio spotlight + filters | portfolio | data-driven from the `PROJECTS` array (inline `<script>`) |

---

## Local preview

No tooling required — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Serving over HTTP rather than `file://` avoids path quirks with the Google Fonts
request and relative asset links.

---

## Deploying

Published by GitHub Pages straight from the `master` branch — no Actions
workflow, no build step, so **a push is a deploy**.

```bash
./deploy.sh                        # stage everything, commit with a dated message, push
./deploy.sh "your commit message"  # …or supply your own message
```

The script checks the essential files are present, stages all changes, commits
(if there's anything to commit) and pushes to `origin master`. The live site
updates within a minute or so. See `DEPLOY.md` for the custom-domain / DNS setup.

> Authentication uses your local git setup. The remote is
> `git@github.com:jrjhealey/jrjhealey.github.io.git`, so an SSH key on your
> GitHub account is the simplest option.

---

## Editing notes

- **Contact** — the site points to LinkedIn (`/in/jrjhealey`); there is no public
  email or phone number. If you add an email later, wire it into the "Get in
  touch" / contact buttons on all three pages.
- **Imagery** — service-card graphics and credential tiles are on-brand SVGs
  (`assets/svc-*.svg` and inline glyphs); the only external images are the
  Unsplash portrait fallback on the About page. Self-host anything you want to
  guarantee offline.
- **Portfolio entries** — `portfolio.html` is data-driven: edit the `PROJECTS`
  array in the commented `<script>` near the bottom. Copy a block to add an
  entry, set `featured: true` to include it in the rotating spotlight, and add
  `problem` / `approach` / `result` text to give a row its expandable case study
  (blank fields are hidden). Filters are generated automatically from each
  entry's `type`.
- **Colours & type** — change the CSS custom properties at the top of
  `styles.css` to re-theme the whole site.
- **Legal** — the footer carries the Companies House disclosure (Zephyr
  Venturecraft Ltd, England & Wales, no. 17298267, registered office). Update it
  there if any of those details change.

---

© 2026 Zephyr Venturecraft Ltd — the independent practice of Dr Joe Healey.
