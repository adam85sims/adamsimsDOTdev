#!/usr/bin/env bash
# Bundle the JS sources and CSS into single self-contained files.
# Inlines data/cv.json into bundle.js so the site works double-clicked
# from a file manager (no http server, no CORS).
# Run after editing any js/*.js, js/apps/*.js, css/*.css, or data/cv.json.
set -euo pipefail
cd "$(dirname "$0")/.."

JS_OUT="js/bundle.js"
CSS_OUT="js/bundle.css"
JS_SOURCES=(wm.js apps/registry.js apps/resume.js apps/projects.js apps/skills.js apps/about.js apps/contact.js apps/terminal.js main.js)
CSS_SOURCES=(yaru.css desktop.css windows.css apps.css print.css)

# --- JS bundle ---
{
  echo "/* auto-generated bundle — do not edit. rebuild with scripts/bundle.sh */"
  for f in "${JS_SOURCES[@]}"; do
    echo ""
    echo "/* ========== $f ========== */"
    cat "js/$f"
  done
  echo ""
  echo "/* ========== inlined cv data (from data/cv.json) ========== */"
  echo "window.__CV_DATA = $(cat data/cv.json);"
} > "$JS_OUT.tmp"

python3 - "$JS_OUT.tmp" "$JS_OUT" <<'PY'
import re, sys
src = open(sys.argv[1]).read()
src = re.sub(r'^\s*import\s+\{[^}]+\}\s+from\s+"[^"]+";\s*\n', '', src, flags=re.MULTILINE)
src = re.sub(r'^\s*export\s+function\s+', 'function ', src, flags=re.MULTILINE)
src = re.sub(r'^\s*export\s+const\s+', 'const ', src, flags=re.MULTILINE)
src = re.sub(r'^\s*export\s+', '', src, flags=re.MULTILINE)
with open(sys.argv[2], "w") as f:
    f.write(src)
PY
rm "$JS_OUT.tmp"

# --- CSS bundle (in load order) ---
{
  echo "/* auto-generated bundle — do not edit. rebuild with scripts/bundle.sh */"
  for f in "${CSS_SOURCES[@]}"; do
    echo ""
    echo "/* ========== $f ========== */"
    cat "css/$f"
  done
} > "$CSS_OUT"

echo "rebuilt $JS_OUT ($(wc -c < "$JS_OUT") bytes)"
echo "rebuilt $CSS_OUT ($(wc -c < "$CSS_OUT") bytes)"
