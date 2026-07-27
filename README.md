# HICOM Ops — Landing Page

A one-page marketing site for the HICOM Ops shift-log app. Same build style as
`landing_page_dreaming_ball` (Tailwind Play CDN + Space Grotesk/Inter + GSAP +
vanilla-tilt), re-skinned to the app's indigo→gold brand and themed around the
paper → live-data story.

## Run it
Just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8090      # then visit http://localhost:8090
```

## The message
Paper logs → an app that writes straight to the Google Sheet the same second:
less time, fewer mistakes, one live source of truth. The hero shows a working
LOR% instrument (Day/Night toggle, output-vs-plan gauge) that mirrors the real
app; the "old way vs new way" section carries the core pitch.

## Add real screenshots (optional)
Any `<img class="ph">` that can't find its file renders a labelled placeholder
telling you exactly what to drop in and where. Add these to `pictures/` to
replace them:

| File | What it should show |
|------|---------------------|
| `hero_bg.jpg` | Plant floor (die-casting / machining), moody & dark, ≥1920px wide |
| `og_image.png` | Social-share card (1200×630) |

`pictures/app_icon.png` and `pictures/favicon.png` are already the real app
logo.

## Deploy (GitHub Pages)
Push this folder to a repo (or a `docs/` folder) and enable Pages — same as the
Dreaming Ball page. The "Download the APK" button points at the app repo's
GitHub Actions, where every build is attached as the `hicom-ops-apk` artifact.
