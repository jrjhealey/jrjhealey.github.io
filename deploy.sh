#!/usr/bin/env bash
# Deploy Zephyr Venturecraft to GitHub Pages (jrjhealey.github.io)
#
#   ./deploy.sh                        # commit everything with a dated message + push
#   ./deploy.sh "your commit message"  # …or supply your own message
#
# GitHub Pages serves this repo straight from the `master` branch, so a push
# is a deploy. Run this from the repo root.
set -euo pipefail

cd "$(dirname "$0")"                       # always operate from the repo root
MSG="${1:-Update site ($(date +%Y-%m-%d))}"

# Clear a stale index lock if one was left behind (e.g. by an external editor)
if [ -f .git/index.lock ]; then
  echo "• Removing stale .git/index.lock"
  rm -f .git/index.lock
fi

# Sanity check: essential files must be present
for f in index.html about.html portfolio.html privacy.html styles.css main.js .nojekyll CNAME assets/mark.png assets/molecular.svg assets/portrait.jpg; do
  [ -e "$f" ] || { echo "✗ Missing $f — aborting."; exit 1; }
done

git add -A

if git diff --cached --quiet; then
  echo "• Nothing to commit — pushing any unpushed commits."
else
  git commit -m "$MSG"
fi

git push origin master

echo "✓ Pushed to origin/master. Live shortly at https://jrjhealey.github.io"
