# Zephyr Venturecraft — jrjhealey.github.io

The personal consulting website of **Dr Joe Healey**, published at
**[jrjhealey.github.io](https://jrjhealey.github.io)**.

Zephyr Venturecraft is Joe's independent consulting practice — a trading name,
not a firm. The site presents his advisory work for therapeutics and deep-tech
ventures: scientific and R&D advisory, commercial and venture strategy, and
fractional leadership.

---

## About the site

A small, fast, dependency-free static site. Two pages, hand-written HTML/CSS/JS,
no build step and no framework. It is served directly by GitHub Pages from the
`master` branch.

Design language:

- **Palette** — cream (`#f8f3ea`), forest greens (`#0e2218` → `#eaf5ed`) and a
  copper accent (`#a0622a`).
- **Type** — Playfair Display (headings) + Inter (body), loaded from Google Fonts.
- **Motif** — molecular biology: an abstract molecular texture, a cursor-reactive
  "wind" particle field in the hero, and a continuous DNA double helix that snakes
  down through the lower sections, weaving along a static S-curve, revolving slowly,
  and re-colouring to suit each section's background.

All motion is implemented on `<canvas>` and is automatically disabled when the
visitor has `prefers-reduced-motion` set.

---

## Structure

```
.
├── index.html        # Landing: hero, services, about, engagement formats, contact
├── about.html        # Background: portrait, full bio, education, career timeline, philosophy
├── work.html         # Portfolio: rotating featured spotlight + filterable, expandable case-study list
├── styles.css        # Shared design system (tokens, layout, components, responsive rules)
├── main.js           # All interactivity (see below)
├── molecular.svg     # Molecular texture used behind the hero / page headers
├── portrait.jpg      # Landscape portrait used on the About page
├── .nojekyll         # Tells GitHub Pages to serve files as-is (no Jekyll build)
├── deploy.sh         # One-command commit + push helper
├── LICENSE           # MIT (covers source code only)
└── README.md
```

### `main.js` — what runs where

| Feature | Page | Notes |
|---|---|---|
| Sticky nav, solid-on-scroll | both | `about.html` uses the always-dark variant |
| Scroll-reveal, count-up stats, magnetic buttons | both | IntersectionObserver-based |
| Hero "wind" particle field | index | cursor-deflected flow field on `#wind` |
| Continuous DNA strand | index | one `<canvas data-strand>` per lower section, drawn from a shared global coordinate space + clock so it reads as a single helix; tapers in at the top |
| Vertical revolving helix | about | `<canvas data-helix>` behind the philosophy quote |
| Timeline progress + atom dots | about | fills as you scroll |

---

## Local preview

No tooling required — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

(Serving over HTTP rather than `file://` avoids path quirks with the Google
Fonts request and relative asset links.)

---

## Deploying

The site is published by GitHub Pages straight from the `master` branch — there
is no Actions workflow and no build step, so **a push is a deploy**.

```bash
./deploy.sh                        # stage everything, commit with a dated message, push
./deploy.sh "your commit message"  # …or supply your own message
```

The script checks the essential files are present, stages all changes, commits
(if there's anything to commit) and pushes to `origin master`. The live site
updates within a minute or so.

> Authentication uses your local git setup. The remote is
> `git@github.com:jrjhealey/jrjhealey.github.io.git`, so an SSH key on your
> GitHub account is the simplest option.

---

## Editing notes

- **Contact details** — the email (`hello@zephyrventurecraft.com`) and the
  WhatsApp number (a placeholder, char-code-obfuscated in `main.js`) should be
  replaced with real details before sharing widely.
- **Imagery** — service-card and credential images are hotlinked from Unsplash;
  self-host them if you'd prefer no external dependency.
- **Bio & timeline** — the About-page copy and career dates were drafted from
  Joe's CV and are worth a final accuracy pass.
- **Colours & type** — everything keys off the CSS custom properties at the top
  of `styles.css`; change those tokens to re-theme the whole site.
- **Portfolio entries** — `work.html` is data-driven: edit the `PROJECTS` array
  in the commented `<script>` near the bottom of the file. Copy a block to add an
  entry, set `featured: true` to include it in the rotating spotlight, and add
  `problem` / `approach` / `result` text to give a row its expandable case study
  (blank fields are hidden). Filters are generated automatically from each
  entry's `type`.

---

© 2026 Zephyr Venturecraft — the independent practice of Dr Joe Healey.
