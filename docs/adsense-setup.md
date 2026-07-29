# ScrollTake — AdSense / root hosting

## Why Google rejected the old URL

Old link:

`https://dubeyaditya29.github.io/mobileTelePromp/`

Google looks for ads.txt only here:

`https://YOUR-DOMAIN/ads.txt`

So the app must be at the **root** of the site:

`https://dubeyaditya29.github.io/`  
→ ads.txt = `https://dubeyaditya29.github.io/ads.txt`

## What we changed in code

- Vite `base` is `/` (root)
- Brand name is **ScrollTake**
- `public/ads.txt` ships with the build
- Ad slots load only if you set env vars (see below)

## Your steps (once)

### 1. Create the root site repo

On GitHub, create a **new repository** named exactly:

`dubeyaditya29.github.io`

(Must match your username + `.github.io`.)

### 2. Turn on Pages for that repo

Settings → Pages → Deploy from branch → `gh-pages` / root (or whatever the deploy push uses).

This project’s workflow / deploy script publishes the built site there.

### 3. Fix ads.txt

After AdSense gives you a publisher ID (`ca-pub-1234…`):

1. Edit `public/ads.txt`
2. Replace `pub-XXXXXXXXXXXXXXXX` with `pub-1234…` (same numbers, usually without `ca-`)
3. Redeploy
4. Open `https://dubeyaditya29.github.io/ads.txt` — you should see that one line

### 4. In AdSense

Add site: `https://dubeyaditya29.github.io` (the root, not `/mobileTelePromp/`).

### 5. Show ads in the app (optional until approved)

Create `.env` (or GitHub Actions secrets) :

```bash
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxx
VITE_ADSENSE_SLOT_EDITOR=1234567890
VITE_ADSENSE_SLOT_REVIEW=0987654321
```

Then rebuild/redeploy. Until these are set, the app runs with **no ads** (no empty broken boxes).
