// Main entry: load CV, boot, build desktop + dock, wire windows.

window.__MAIN_STARTED = true;
console.log("[main] script executing");

import { APPS } from "./apps/registry.js";
import { createTerminal } from "./apps/terminal.js";
import { renderResume, triggerPrint, teardownPrintView } from "./apps/resume.js";
import { renderProjects } from "./apps/projects.js";
import { renderSkills } from "./apps/skills.js";
import { renderAbout } from "./apps/about.js";
import { renderContact } from "./apps/contact.js";
import { renderResearch } from "./apps/research.js";

const BOOT_LINES = [
  "[ OK ]  started adam desktop session",
  "[ OK ]  mounted /data/cv.json",
  "[ OK ]  loaded window manager (yaru-wm 0.1)",
  "[ OK ]  registered apps: resume projects skills about contact terminal",
  "[ OK ]  theme: yaru-orange on charcoal",
  "[ OK ]  starting user session…",
];

async function loadCV() {
  // Prefer data inlined into the bundle (lets the site work on file://
  // where fetch() is blocked by CORS, and also from a USB stick / email).
  if (window.__CV_DATA) return window.__CV_DATA;
  // Fall back to live fetch (works on any http(s) origin).
  const res = await fetch("data/cv.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`failed to load cv.json (${res.status})`);
  return await res.json();
}

function buildDock(cv) {
  const dock = document.getElementById("dock");
  dock.innerHTML = "";
  for (const app of APPS) {
    if (!app.showInDock) continue;
    const btn = document.createElement("button");
    btn.className = "dock-item";
    btn.dataset.app = app.id;
    btn.title = app.title;
    btn.innerHTML = `
      <span class="dock-item-icon">${app.icon}</span>
      <span class="dock-item-label">${app.title}</span>
    `;
    btn.addEventListener("click", () => openApp(app, cv));
    dock.appendChild(btn);
  }
  document.addEventListener("wm:opened", updateDockRunning);
  document.addEventListener("wm:closed", updateDockRunning);
}

function updateDockRunning() {
  const open = new Set(WM.list());
  for (const btn of document.querySelectorAll(".dock-item")) {
    btn.classList.toggle("is-running", open.has(btn.dataset.app));
  }
}

function buildDesktopIcons(cv) {
  const layer = document.getElementById("desktopIcons");
  layer.innerHTML = "";
  
  const isMobileOrTouch = () => {
    return window.matchMedia("(max-width: 820px)").matches || 
           window.matchMedia("(pointer: coarse)").matches;
  };

  for (const app of APPS) {
    if (!app.showOnDesktop) continue;
    const btn = document.createElement("button");
    btn.className = "desktop-icon";
    btn.dataset.app = app.id;
    btn.innerHTML = `
      <span class="desktop-icon-img">${app.icon}</span>
      <span class="desktop-icon-label">${app.title}</span>
    `;
    btn.addEventListener("dblclick", () => {
      if (!isMobileOrTouch()) {
        openApp(app, cv);
      }
    });
    btn.addEventListener("click", (e) => {
      if (isMobileOrTouch()) {
        openApp(app, cv);
      } else {
        // Single click selects (visual only)
        for (const b of layer.querySelectorAll(".desktop-icon")) b.classList.remove("is-selected");
        btn.classList.add("is-selected");
      }
    });
    layer.appendChild(btn);
  }
}

function openApp(app, cv) {
  if (app.isExternal) {
    window.open(app.url, "_blank");
    return;
  }
  WM.open({
    id: app.id,
    title: app.title,
    icon: app.icon,
    width: app.defaultSize.w,
    height: app.defaultSize.h,
    headerActions: app.headerActions,
    content: app.onOpen(cv),
  });
}

function startClock() {
  const el = document.getElementById("clock");
  function tick() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const day = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    el.textContent = `${day}  ${hh}:${mm}`;
  }
  tick();
  setInterval(tick, 30 * 1000);
}

async function runBoot() {
  const bootEl = document.getElementById("boot");
  const log = document.getElementById("bootLog");
  const bar = bootEl.querySelector(".boot-progress-bar");
  const total = BOOT_LINES.length;
  for (let i = 0; i < total; i++) {
    log.textContent += (i ? "\n" : "") + BOOT_LINES[i];
    log.scrollTop = log.scrollHeight;
    bar.style.width = `${((i + 1) / total) * 100}%`;
    await sleep(220 + Math.random() * 180);
  }
  await sleep(350);
  bootEl.classList.add("is-done");
  await sleep(480);
  bootEl.remove();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  // CV first, but don't block the boot animation visually
  const cvPromise = loadCV();
  await runBoot();
  let cv;
  try {
    cv = await cvPromise;
  } catch (e) {
    document.body.innerHTML = `<pre style="color:#EF2929;padding:24px;font-family:monospace">${e.message}</pre>`;
    return;
  }
  const desktop = document.getElementById("desktop");
  desktop.hidden = false;
  buildDock(cv);
  buildDesktopIcons(cv);
  startClock();

  // Activities button minimises everything except the focused window
  document.getElementById("activitiesBtn").addEventListener("click", () => {
    const open = WM.list();
    if (open.length === 0) return;
    // Find most recently focused
    let top = open[0];
    for (const id of open) {
      if (WM.get(id) && WM.get(id).el.classList.contains("is-focused")) { top = id; break; }
    }
    for (const id of open) {
      if (id !== top) WM.minimise(id);
    }
  });

  // First-run: open the resume window so the page never lands empty.
  // (Comment this out if you want a clean desktop on first load.)
  // Skipped in print/pdf modes because the resume is already rendered as a
  // full document by enterPrintMode().
  const params = new URLSearchParams(location.search);
  const isPrintMode = params.get("print") === "1" || params.get("pdf") === "1";
  if (!isPrintMode) {
    setTimeout(() => openApp(APPS[0], cv), 200);
  }

  // ?print=1 or ?pdf=1 — skip the desktop chrome and render the resume as
  // a clean full-page document (outside the window-layer so @media print
  // rules can see it). ?pdf=1 additionally auto-triggers the print dialog.
  if (isPrintMode) {
    enterPrintMode(cv);
  }
  if (params.get("pdf") === "1") {
    // Auto-trigger the print dialog after a short delay so the page can
    // render fully first.
    setTimeout(() => triggerPrint(), 600);
  }

  // Global Ctrl/Cmd+P shortcut: if the resume window isn't open, open it
  // before printing. If it is open, just print.
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
      // Don't hijack Cmd+P from a focused input unless the user is using
      // our own terminal. (The terminal handles its own Ctrl+L for clear.)
      const resumeWin = WM.get("resume");
      if (!resumeWin) {
        e.preventDefault();
        openApp(APPS.find(a => a.id === "resume"), cv);
        setTimeout(() => triggerPrint(), 250);
      } else {
        triggerPrint();
      }
    }
  });

  // Restore the resume to its window after the print dialog closes.
  window.addEventListener("afterprint", teardownPrintView);
}

function enterPrintMode(cv) {
  // Hide desktop chrome, show the resume as a full-page document.
  document.body.classList.add("is-print-mode");
  const desktop = document.getElementById("desktop");
  if (desktop) desktop.style.display = "none";
  const boot = document.getElementById("boot");
  if (boot) boot.remove();

  const printRoot = document.createElement("div");
  printRoot.className = "print-page";
  printRoot.appendChild(renderResume(cv));
  document.body.appendChild(printRoot);
}

main().catch((e) => {
  console.error("[main] fatal:", e);
  const log = document.getElementById("bootLog");
  if (log) {
    log.textContent += "\n\n[fatal] " + (e?.stack || e?.message || String(e));
  }
});
