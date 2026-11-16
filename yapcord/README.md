# Yapcord

A community mod for the Yapper desktop app (Vencord-style): plugins, settings, badges, and an installer exe.
Not made by or affiliated with Yapper. Badges and name tags are custom Yapcord ones, never copies of official badges.

## Repo layout
- `src/` – the mod (bundled to `dist/yapcord.js`)
  - `adapter.js` – the only file that knows Yapper's page structure (**you must fill this in**)
  - `config.js` – badge list URL + support server invite
  - `plugins/` – one file per plugin; add yours to `plugins/index.js`
- `installer/` – the Electron installer (Install / Repair / Uninstall)
- `badges.json` – who gets which badge (only Yapcord users see them)
- `.github/workflows/release.yml` – builds everything and makes the release

## Setup
1. Create a GitHub repo named `yapcord` and push this folder to it. (The workflow points the mod and installer at your repo automatically, no editing needed.)
2. Optional: set the real Yapcord server invite in `src/config.js` (`SUPPORT_URL`).
3. Push to `main`. GitHub builds `YapcordInstaller.exe` and publishes it under Releases as "Yapcord (latest build)". Tag `v0.1.0` for a versioned release.

## Using the installer (Vencord-style)
Run the exe, pick your Yapper install (or a custom folder), click Install / Reinstall-Repair / Uninstall.
It closes Yapper automatically, downloads the newest mod from your GitHub release into `%APPDATA%\Yapcord\dist`, patches, and restarts Yapper.
Because the mod loads from that folder, re-running the installer (or Repair) is all it takes to update.

Open Yapcord -> Settings to see your detected Yapper ID, and use "Request a badge" (opens a GitHub issue). Add the ID to `badges.json`; badges show for every Yapcord user within minutes, no rebuild.

## How the installer works
Same trick as Vencord: it renames `resources/app.asar` to `_app.asar`, adds a tiny `resources/app/` loader that injects `yapcord.js` into each window, then starts the original app.
- Install: patch. Uninstall: restore the original. Repair: uninstall + install (use it after Yapper updates).

## Limits (read this)
- Works only if Yapper's desktop app is Electron with a normal `app.asar` and no asar-integrity fuse. If install says "app.asar not found", it is packaged differently.
- Yapcord auto-detects the user markers, the Settings sidebar and your ID by heuristics. If a guess is wrong, set an override at the top of `src/adapter.js`.
- Badges/name tags depend on that detection. Plugins that only inject CSS (Zen Scrollbars, Reduce Motion, Custom CSS) work without it.
- If Yapper's content security policy blocks `raw.githubusercontent.com`, badges will not load; host the JSON somewhere Yapper allows.
- The Windows exe is unsigned, so SmartScreen will warn. That's normal for unsigned indie apps.
