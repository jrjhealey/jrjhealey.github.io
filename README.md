# Zephyr Venturecraft

Personal consulting site for Dr Joe Healey. Static HTML/CSS/JS, no build step, deploys to GitHub Pages.

## Files
- `index.html` — main page (hero, services, about, working together, contact)
- `about.html` — full background, timeline, philosophy
- `styles.css` — shared design system
- `main.js` — wind particle canvas + all interactions
- `molecular.svg` — molecular texture overlay (atoms, rings, helix)
- `.nojekyll` — disables Jekyll processing
- `deploy.sh` — manual deploy helper

## Before launch — to-do
- [ ] Replace dummy WhatsApp number in `main.js` (`code` array) with the real WhatsApp Business number
- [ ] Replace placeholder email `hello@zephyrventurecraft.com` (index.html + about.html) with the real address
- [ ] Save portrait photo as `portrait.jpg` in this folder (about.html falls back to a stock image until then)
- [ ] Review `about.html` bio + timeline dates against your CV (drafted from the brief; some dates are approximate)
- [ ] Optional: swap the Unsplash images for owned/licensed photography
- [ ] Optional: custom domain

## Deploy
```bash
./deploy.sh "your commit message"
```

## Notes
- Respects `prefers-reduced-motion` (particle field + parallax disable automatically).
- All imagery is hotlinked from Unsplash except the portrait. Self-host before launch if you want to avoid the external dependency.
