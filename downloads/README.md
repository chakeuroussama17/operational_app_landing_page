# downloads/

Put the release APK here, named exactly:

    hicom-ops.apk

The "Download the APK" button on the landing page links to
`downloads/hicom-ops.apk` with a `download` attribute, so clicking it starts
the download straight away (no GitHub digging).

## Where to get the APK
GitHub → repo **Actions** tab → open the newest green run →
**Artifacts** → download **hicom-ops-apk** (a .zip) → unzip →
rename `app-release.apk` to `hicom-ops.apk` → drop it in this folder.

## When you ship a new build
Just replace this file with the newer `hicom-ops.apk` (same name) — the button
keeps working, no HTML change needed.
