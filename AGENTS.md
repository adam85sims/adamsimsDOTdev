# AGENTS.md

## What this is

Personal portfolio/CV site styled as a GNOME desktop. No framework, no npm, no bundler — pure vanilla HTML/CSS/JS. Deployed to GitHub Pages.

## Architecture

- `index.html` — single entry point, loads `js/bundle.css` and `js/bundle.js`
- `js/wm.js` — window manager (drag, focus, minimise, maximise, close)
- `js/apps/registry.js` — app registry wiring apps to the WM
- `js/apps/*.js` — individual app modules: resume, projects, skills, about, contact, terminal
- `js/main.js` — boot sequence, desktop/dock builder, print mode
- `css/*.css` — individual source stylesheets (yaru theme, desktop, windows, apps, print, responsive)
- `data/cv.json` — CV/resume data consumed by all apps
- `scripts/bundle.sh` — the only build step
- `js/bundle.js`, `js/bundle.css` — **auto-generated**, never edit directly

## Build

```bash
bash scripts/bundle.sh
```

Requires Python 3 (uses regex to strip ES module import/export syntax). Run after editing any file under `js/`, `js/apps/`, `css/`, or `data/cv.json`.

Bundle script concatenation order is defined in the `JS_SOURCES` and `CSS_SOURCES` arrays inside `bundle.sh`. New app files must be added to `JS_SOURCES` manually.

## Deployment

GitHub Actions (`.github/workflows/pages.yml`) runs `bundle.sh` then deploys to GitHub Pages on push to `main`. Bundled files do not need to be committed — CI rebuilds them.

## URL modes

- `/?print=1` — hides desktop chrome, renders resume as a clean printable page (for recruiters)
- `/?pdf=1` — same as print but auto-triggers the browser print dialog
- `Ctrl/Cmd+P` — opens resume window if not open, then prints

## Editing guidelines

- Edit source files, never `bundle.js` or `bundle.css`
- `data/cv.json` is the single source of truth for all resume content
- CV data is inlined into the bundle (`window.__CV_DATA`) so the site works on `file://` without a server
- `js/apps/registry.js` controls which apps appear on desktop vs dock (`showOnDesktop`, `showInDock`)
- `js/wm.js` exposes `window.WM` globally — all app modules use this
- New apps: create `js/apps/<name>.js`, add it to `JS_SOURCES` in `bundle.sh`, register in `registry.js`
- CSS source order matters — see `CSS_SOURCES` in `bundle.sh`

## Gotchas

- No `.gitignore` exists — consider adding one for `bundle.js`/`bundle.css` if CI handles builds
- No linter, no typecheck, no tests — verification is manual browser testing
- The Python one-liner in `bundle.sh` strips `import {...} from "..."` and `export` keywords; source files use ES module syntax but the bundle does not
- `assets/` directory is empty; images/SVGs are inline or data-URIs
