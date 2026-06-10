#!/usr/bin/env bash
# Deploy Zephyr Venturecraft to GitHub Pages (jrjhealey.github.io)
# Run this from inside your local clone of the repo, with the new
# site files copied in alongside it.
#   ./deploy.sh "optional commit message"
set -euo pipefail

MSG="${1:-Update site}"

# Sanity check: must run from the site root
for f in index.html about.html styles.css main.js molecular.svg; do
  [ -f "$f" ] || { echo "✗ Missing $f — run this from the repo root with the new files in place."; exit 1; }
done

touch .nojekyll            # keep Jekyll off

git add -A
git commit -m "$MSG" || echo "Nothing to commit."
git push origin master     # this repo's default branch is 'master'

echo "✓ Pushed. Live shortly at https://jrjhealey.github.io"
