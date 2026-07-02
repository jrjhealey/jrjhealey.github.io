# Deploying & custom domain — zephyrventurecraft.com

This site is a static GitHub Pages site served from the `master` branch of
`jrjhealey/jrjhealey.github.io`. A push to `master` is a deploy.

## Publishing changes

From the repo root:

```bash
./deploy.sh                        # commit everything with a dated message + push
./deploy.sh "your commit message"  # ...or supply your own message
```

The script stages all changes, commits, and pushes to `origin/master`. It runs a
sanity check first — these files must exist or it aborts:
`index.html about.html styles.css main.js molecular.svg portrait.jpg .nojekyll CNAME`.

## Custom domain: zephyrventurecraft.com (apex canonical)

Visitors land on the bare domain `zephyrventurecraft.com`; `www.` redirects to it.
Setup is three parts: the repo (done), GitHub (automatic), and Namecheap DNS.

### 1. Repo — CNAME file

The repo root contains a `CNAME` file with a single line:

```
zephyrventurecraft.com
```

This is already committed. GitHub reads it on deploy and sets the custom domain.
Do not delete it — `deploy.sh` will refuse to run without it.

### 2. Deploy so GitHub picks it up

Run `./deploy.sh` (or push `master`). Then confirm in the repo's
**Settings → Pages** that the custom domain shows `zephyrventurecraft.com`.

### 3. Namecheap DNS

1. Log in to Namecheap → **Domain List** → **Manage** on `zephyrventurecraft.com`.
2. Open the **Advanced DNS** tab.
3. **Delete the default parking records** in Host Records:
   - the CNAME record with host `www` → `parkingpage.namecheap.com`
   - the URL Redirect Record with host `@`
4. **Add four A records** (apex → GitHub Pages), host `@`, TTL Automatic:

   | Type | Host | Value           |
   |------|------|-----------------|
   | A    | @    | 185.199.108.153 |
   | A    | @    | 185.199.109.153 |
   | A    | @    | 185.199.110.153 |
   | A    | @    | 185.199.111.153 |

5. **Add a CNAME record** so `www` redirects to the apex:

   | Type  | Host | Value                |
   |-------|------|----------------------|
   | CNAME | www  | jrjhealey.github.io  |

6. (Optional) Add IPv6 `AAAA` records, host `@`:
   `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
7. Save all changes (green checkmarks + **Save All Changes**).

### 4. Wait, then enforce HTTPS

- Propagation is usually under 30 minutes on Namecheap (can be a few hours).
- Check it: `dig zephyrventurecraft.com +short` — success = the four `185.199.x.153` addresses.
- Once GitHub verifies the domain, tick **Enforce HTTPS** in Settings → Pages.
  The free Let's Encrypt certificate can take up to ~24h to provision (normal).

## Notes

- The site uses relative links, so nothing in the code changes for the domain switch.
- If you later add a `work.html` portfolio page, add it back to the sanity-check
  list in `deploy.sh`.
- GitHub Pages A-record IPs are stable but authoritative values live in GitHub's
  docs under "Managing a custom domain for your GitHub Pages site."
