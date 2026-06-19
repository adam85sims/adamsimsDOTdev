/* auto-generated bundle — do not edit. rebuild with scripts/bundle.sh */

/* ========== wm.js ========== */
// Window manager: drag, focus, minimise, maximise, close, z-index.
// Pure vanilla, no deps. Exposes a small API on window.WM.

const WM = (() => {
  const layer = document.getElementById("windowLayer");
  let zCounter = 100;
  const windows = new Map(); // id -> win state
  const focusOrder = []; // most recent last

  function nextZ() { return ++zCounter; }

  function focus(id) {
    const w = windows.get(id);
    if (!w) return;
    if (w.el.classList.contains("is-minimised")) {
      w.el.classList.remove("is-minimised");
    }
    w.el.style.zIndex = String(nextZ());
    for (const other of windows.values()) other.el.classList.remove("is-focused");
    w.el.classList.add("is-focused");
    const idx = focusOrder.indexOf(id);
    if (idx >= 0) focusOrder.splice(idx, 1);
    focusOrder.push(id);
    document.dispatchEvent(new CustomEvent("wm:focus", { detail: { id } }));
  }

  function minimise(id) {
    const w = windows.get(id);
    if (!w) return;
    w.el.classList.add("is-minimised");
  }

  function toggleMax(id) {
    const w = windows.get(id);
    if (!w) return;
    w.el.classList.toggle("is-maximised");
  }

  function close(id) {
    const w = windows.get(id);
    if (!w) return;
    if (w.onClose) {
      const keep = w.onClose();
      if (keep === false) return;
    }
    w.el.remove();
    windows.delete(id);
    const idx = focusOrder.indexOf(id);
    if (idx >= 0) focusOrder.splice(idx, 1);
    document.dispatchEvent(new CustomEvent("wm:closed", { detail: { id } }));
  }

  function attachDrag(winEl, handleEl) {
    let drag = null;
    handleEl.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      if (e.target.closest(".win-btn")) return;
      const id = winEl.dataset.id;
      focus(id);
      const rect = winEl.getBoundingClientRect();
      drag = {
        startX: e.clientX,
        startY: e.clientY,
        origLeft: rect.left,
        origTop: rect.top,
        moved: false,
      };
      handleEl.setPointerCapture(e.pointerId);
    });
    handleEl.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) > 3) drag.moved = true;
      if (winEl.classList.contains("is-maximised")) return;
      const layerRect = layer.getBoundingClientRect();
      const w = winEl.offsetWidth;
      const h = winEl.offsetHeight;
      let nx = drag.origLeft + dx - layerRect.left;
      let ny = drag.origTop + dy - layerRect.top;
      nx = Math.max(-w + 60, Math.min(layerRect.width - 60, nx));
      ny = Math.max(0, Math.min(layerRect.height - 30, ny));
      winEl.style.left = `${nx}px`;
      winEl.style.top = `${ny}px`;
    });
    handleEl.addEventListener("pointerup", (e) => {
      handleEl.releasePointerCapture(e.pointerId);
      drag = null;
    });
  }

  function attachResize(winEl) {
    const dirs = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
    for (const d of dirs) {
      const handle = document.createElement("div");
      handle.className = `window-resize ${d}`;
      handle.dataset.dir = d;
      winEl.appendChild(handle);
      let drag = null;
      handle.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        if (winEl.classList.contains("is-maximised")) return;
        e.stopPropagation();
        const r = winEl.getBoundingClientRect();
        drag = {
          startX: e.clientX,
          startY: e.clientY,
          w: r.width,
          h: r.height,
          left: r.left,
          top: r.top,
          dir: d,
        };
        handle.setPointerCapture(e.pointerId);
      });
      handle.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        let { w, h, left, top } = drag;
        if (d.includes("e")) w = Math.max(280, drag.w + dx);
        if (d.includes("s")) h = Math.max(180, drag.h + dy);
        if (d.includes("w")) {
          const nw = Math.max(280, drag.w - dx);
          if (nw > 280) left = drag.left + (drag.w - nw);
          w = nw;
        }
        if (d.includes("n")) {
          const nh = Math.max(180, drag.h - dy);
          if (nh > 180) top = drag.top + (drag.h - nh);
          h = nh;
        }
        const layerRect = layer.getBoundingClientRect();
        winEl.style.width = `${w}px`;
        winEl.style.height = `${h}px`;
        winEl.style.left = `${left - layerRect.left}px`;
        winEl.style.top = `${top - layerRect.top}px`;
      });
      handle.addEventListener("pointerup", (e) => {
        handle.releasePointerCapture(e.pointerId);
        drag = null;
      });
    }
  }

  function open({ id, title, icon, width = 720, height = 480, x, y, content, onClose, onFocus, headerActions = [] }) {
    if (windows.has(id)) {
      const existing = windows.get(id);
      if (existing.el.classList.contains("is-minimised")) {
        existing.el.classList.remove("is-minimised");
      }
      focus(id);
      return existing.el;
    }
    const el = document.createElement("div");
    el.className = "window";
    el.dataset.id = id;

    // Cap window dimensions to the available viewport so mobile users
    // never get an overlay that overflows the screen.
    const layerRect = layer.getBoundingClientRect();
    const pad = 12;
    const cappedW = Math.min(width, layerRect.width - pad);
    const cappedH = Math.min(height, layerRect.height - pad);
    el.style.width = `${cappedW}px`;
    el.style.height = `${cappedH}px`;

    // Position with cascade, using the capped dimensions
    const cascade = (windows.size % 8) * 28;
    const left = x ?? Math.max(pad, (layerRect.width - cappedW) / 2 + cascade - 80);
    const top = y ?? Math.max(pad, (layerRect.height - cappedH) / 2 + cascade - 60);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;

    const header = document.createElement("div");
    header.className = "window-header";

    // Build left-side title (icon + text)
    const titleEl = document.createElement("div");
    titleEl.className = "window-title";
    titleEl.innerHTML = `${icon ? `<span class="window-title-icon">${icon}</span>` : ""}<span>${title}</span>`;

    // Build right-side actions
    const actions = document.createElement("div");
    actions.className = "window-actions";

    // Custom app actions (left of standard min/max/close)
    for (const a of headerActions) {
      const btn = document.createElement("button");
      btn.className = `win-btn win-btn-custom ${a.className || ""}`;
      btn.title = a.title || a.label || "";
      btn.setAttribute("aria-label", a.title || a.label || "");
      btn.innerHTML = a.icon || `<span class="win-btn-label">${a.label || ""}</span>`;
      if (a.onClick) btn.addEventListener("click", (e) => { e.stopPropagation(); a.onClick(); });
      actions.appendChild(btn);
    }

    actions.insertAdjacentHTML("beforeend", `
      <button class="win-btn win-btn-min" title="Minimise" aria-label="Minimise">
        <svg viewBox="0 0 12 12" width="10" height="10"><line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
      <button class="win-btn win-btn-max" title="Maximise" aria-label="Maximise">
        <svg viewBox="0 0 12 12" width="10" height="10"><rect x="2" y="2" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
      <button class="win-btn win-btn-close" title="Close" aria-label="Close">
        <svg viewBox="0 0 12 12" width="10" height="10"><line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
    `);

    header.appendChild(titleEl);
    header.appendChild(actions);

    const body = document.createElement("div");
    body.className = "window-body";
    if (typeof content === "string") body.innerHTML = content;
    else if (content instanceof Node) body.appendChild(content);

    el.appendChild(header);
    el.appendChild(body);
    layer.appendChild(el);
    attachDrag(el, header);
    attachResize(el);
    header.querySelector(".win-btn-min").addEventListener("click", (e) => { e.stopPropagation(); minimise(id); });
    header.querySelector(".win-btn-max").addEventListener("click", (e) => { e.stopPropagation(); toggleMax(id); });
    header.querySelector(".win-btn-close").addEventListener("click", (e) => { e.stopPropagation(); close(id); });
    header.addEventListener("dblclick", (e) => { if (e.target.closest(".win-btn")) return; toggleMax(id); });
    el.addEventListener("pointerdown", () => focus(id));
    el.addEventListener("contextmenu", (e) => e.preventDefault());

    windows.set(id, { el, header, body, onClose, onFocus });
    focus(id);
    document.dispatchEvent(new CustomEvent("wm:opened", { detail: { id } }));
    return el;
  }

  function get(id) { return windows.get(id); }
  function isOpen(id) { return windows.has(id); }
  function list() { return [...windows.keys()]; }

  return { open, close, focus, minimise, toggleMax, get, isOpen, list };
})();

window.WM = WM;

/* ========== apps/registry.js ========== */
// App registry: each app exports { id, label, icon, defaultSize, render, onOpen }.
// main.js calls this and wires windows, dock, desktop icons.
const ICONS = {
  resume: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><line x1="9" y1="13" x2="17" y2="13"/><line x1="9" y1="17" x2="17" y2="17"/><line x1="9" y1="9" x2="11" y2="9"/></svg>',
  projects: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="4" x2="9" y2="20"/></svg>',
  skills: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>',
  about: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4 4-7 8-7s8 3 8 7"/></svg>',
  contact: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6l9 7 9-7"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="6,10 10,12 6,14"/><line x1="13" y1="15" x2="18" y2="15"/></svg>',
  print: '<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5V2h8v3"/><rect x="2" y="5" width="12" height="8" rx="1"/><rect x="4" y="9" width="8" height="5"/></svg>',
};

// Each app may declare extra window-header buttons (left of min/max/close).
const PRINT_ACTION = {
  label: "Print",
  title: "Print / Save as PDF",
  className: "win-btn-print",
  icon: ICONS.print,
  onClick: () => triggerPrint(),
};
const APPS = [
  {
    id: "resume",
    title: "Resume",
    icon: ICONS.resume,
    defaultSize: { w: 820, h: 720 },
    onOpen: (cv) => renderResume(cv),
    headerActions: [PRINT_ACTION],
    showOnDesktop: true,
    showInDock: true,
  },
  { id: "projects", title: "Projects", icon: ICONS.projects, defaultSize: { w: 860, h: 600 }, onOpen: (cv) => renderProjects(cv), showOnDesktop: true, showInDock: true },
  { id: "skills", title: "Skills", icon: ICONS.skills, defaultSize: { w: 760, h: 560 }, onOpen: (cv) => renderSkills(cv), showOnDesktop: false, showInDock: true },
  { id: "about", title: "About", icon: ICONS.about, defaultSize: { w: 560, h: 480 }, onOpen: (cv) => renderAbout(cv), showOnDesktop: true, showInDock: false },
  { id: "contact", title: "Contact", icon: ICONS.contact, defaultSize: { w: 520, h: 440 }, onOpen: (cv) => renderContact(cv), showOnDesktop: false, showInDock: true },
  { id: "terminal", title: "Terminal", icon: ICONS.terminal, defaultSize: { w: 720, h: 440 }, onOpen: (cv) => createTerminal(cv), showOnDesktop: true, showInDock: true },
];

/* ========== apps/resume.js ========== */
// Resume app — renders the canonical CV view.

const PRINT_ICON = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5V2h8v3"/><rect x="2" y="5" width="12" height="8" rx="1"/><rect x="4" y="9" width="8" height="5"/><circle cx="12" cy="7.5" r="0.6" fill="currentColor"/></svg>';
function renderResume(cv) {
  const root = document.createElement("div");
  root.className = "resume";
  const p = cv.person;

  root.innerHTML = `
    <div class="resume-toolbar no-print">
      <button class="resume-print-btn" type="button" data-action="print">
        ${PRINT_ICON} <span>Print / Save as PDF</span>
      </button>
      <span class="resume-toolbar-hint">or press <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>P</kbd></span>
    </div>

    <article class="resume-doc">
      <div class="resume-header">
        <h1 class="resume-name">${escape(p.name)}</h1>
        <div class="resume-title">${escape(p.title)}</div>
        <div class="resume-meta">
          <span>${escape(p.location)}</span>
          <span><a href="mailto:${escape(p.email)}">${escape(p.email)}</a></span>
          <span class="resume-status">${escape(p.status)}</span>
        </div>
        <p class="resume-tagline">${escape(p.tagline)}</p>
      </div>

      <section class="resume-section">
        <h2>Summary</h2>
        <p class="resume-summary">${escape(cv.summary)}</p>
      </section>

      <section class="resume-section">
        <h2>Experience</h2>
        ${cv.experience.map(exp => `
          <div class="exp-block">
            <div class="exp-head">
              <div>
                <span class="exp-role">${escape(exp.role)}</span>
                <span class="exp-company"> · ${escape(exp.company)}</span>
              </div>
              <div class="exp-period">${escape(exp.period)} · ${escape(exp.location)}</div>
            </div>
            <ul class="exp-highlights">
              ${exp.highlights.map(h => `<li>${escape(h)}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </section>

      <section class="resume-section">
        <h2>Selected Projects</h2>
        ${cv.projects.slice(0, 4).map(proj => `
          <div class="exp-block">
            <div class="exp-head">
              <div>
                <span class="exp-role">${escape(proj.name)}</span>
                <span class="exp-company"> · ${escape(proj.tagline)}</span>
              </div>
              <div class="exp-period">${escape(proj.status)}</div>
            </div>
            <ul class="exp-highlights">
              ${proj.highlights.slice(0, 2).map(h => `<li>${escape(h)}</li>`).join("")}
            </ul>
          </div>
        `).join("")}
      </section>

      <section class="resume-section">
        <h2>Skills</h2>
        <div class="resume-skills-grid">
          ${Object.entries(cv.skills).map(([cat, items]) => `
            <div class="resume-skills-cell">
              <h3>${escape(cat)}</h3>
              <p>${items.map(escape).join(" · ")}</p>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="resume-section">
        <h2>Education</h2>
        ${cv.education.map(e => `
          <div class="exp-block">
            <div class="exp-head">
              <div>
                <span class="exp-role">${escape(e.qualification)}</span>
                <span class="exp-company"> · ${escape(e.institution)}</span>
              </div>
              <div class="exp-period">${escape(e.year)}</div>
            </div>
          </div>
        `).join("")}
      </section>

      ${cv.interests && cv.interests.length ? `
      <section class="resume-section">
        <h2>Interests</h2>
        <p class="resume-summary">${cv.interests.map(escape).join(" · ")}</p>
      </section>` : ""}

      <div class="resume-section-pair">
        <section class="resume-section">
          <h2>Languages</h2>
          <p>${p.languages.map(escape).join(" · ")}</p>
        </section>
        <section class="resume-section resume-section-last">
          <h2>Links</h2>
          <p class="resume-links">
            ${(cv.links || []).map(l => `<a href="${escape(l.href)}">${escape(l.value)}</a>`).join(" · ")}
          </p>
        </section>
      </div>
    </article>
  `;

  // Wire the print button
  const btn = root.querySelector('[data-action="print"]');
  if (btn) btn.addEventListener("click", () => triggerPrint());

  return root;
}

// Trigger the browser print dialog. Called from the toolbar button, the
// window-header action, or the Ctrl/Cmd+P shortcut.
function triggerPrint() {
  // Dispatch a custom event so other code (e.g. the window-header Print
  // button on a different window) can react if needed.
  document.dispatchEvent(new CustomEvent("cv:print"));
  // Defer one frame so any event listeners run before the print dialog opens.
  requestAnimationFrame(() => window.print());
}

function escape(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}


/* ========== apps/projects.js ========== */
// Projects app — card grid.
function renderProjects(cv) {
  const root = document.createElement("div");
  root.className = "projects";
  root.innerHTML = cv.projects.map(proj => `
    <article class="project-card">
      <div class="project-head">
        <div class="project-name">${escape(proj.name)}</div>
        <div class="project-status">${escape(proj.status)}</div>
      </div>
      <p class="project-tagline">${escape(proj.tagline)}</p>
      <div class="project-stack">
        ${(proj.stack || []).map(s => `<span>${escape(s)}</span>`).join("")}
      </div>
      <ul class="project-highlights">
        ${(proj.highlights || []).map(h => `<li>${escape(h)}</li>`).join("")}
      </ul>
      ${proj.url ? `<div><a href="${escape(proj.url)}" target="_blank" rel="noopener">${escape(proj.url)}</a></div>` : ""}
    </article>
  `).join("");
  return root;
}

function escape(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

/* ========== apps/skills.js ========== */
// Skills app — categorised.
function renderSkills(cv) {
  const root = document.createElement("div");
  root.className = "skills";
  const entries = Object.entries(cv.skills);
  root.innerHTML = entries.map(([cat, items]) => `
    <div class="skill-card">
      <h3>${escape(cat)}</h3>
      <ul>
        ${items.map(i => `<li>${escape(i)}</li>`).join("")}
      </ul>
    </div>
  `).join("");
  return root;
}

function escape(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

/* ========== apps/about.js ========== */
// About app — short bio.
function renderAbout(cv) {
  const root = document.createElement("div");
  root.className = "about";
  const p = cv.person;
  root.innerHTML = `
    <h2>Hi — I'm ${escape(p.name)}.</h2>
    <p>${escape(cv.summary)}</p>

    <h3>Where I'm at</h3>
    <p>${escape(p.location)}. ${escape(p.status)}.</p>

    <h3>What I'm into right now</h3>
    <ul>
      ${cv.interests.map(i => `<li>${escape(i)}</li>`).join("")}
    </ul>

    <h3>Languages</h3>
    <p>${p.languages.map(escape).join(" · ")}</p>
  `;
  return root;
}

function escape(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

/* ========== apps/contact.js ========== */
// Contact app.
function renderContact(cv) {
  const root = document.createElement("div");
  root.className = "contact";
  const p = cv.person;
  root.innerHTML = `
    <h2>Get in touch</h2>
    <p>I'm open to remote contracts and full-time roles in AI Platform Engineering and Agentic AI.</p>
    <div class="contact-row">
      <div class="contact-label">Email</div>
      <div class="contact-value"><a href="mailto:${escape(p.email)}">${escape(p.email)}</a></div>
    </div>
    <div class="contact-row">
      <div class="contact-label">Status</div>
      <div class="contact-value">${escape(p.status)}</div>
    </div>
    <div class="contact-row">
      <div class="contact-label">Location</div>
      <div class="contact-value">${escape(p.location)}</div>
    </div>
    <div class="contact-row">
      <div class="contact-label">Time zone</div>
      <div class="contact-value" id="contactTz">computing…</div>
    </div>
    <div class="contact-row">
      <div class="contact-label">Stack</div>
      <div class="contact-value">Linux · TypeScript · Python · Go · LLM orchestration</div>
    </div>
  `;
  // Fill timezone after mount
  queueMicrotask(() => {
    const tz = root.querySelector("#contactTz");
    if (tz) tz.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
  });
  return root;
}

function escape(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

/* ========== apps/terminal.js ========== */
// Terminal app — a small but real shell. Commands: help, ls, cat, open, whoami,
// date, uname, echo, clear, projects, resume, contact, skills, banner, exit.
const BANNER = String.raw`
   ___   __  __ ___ ___   ___  _  _  ___ ___ ___
  / _ \ |  \/  | __|_ _| |   \| || |/ __| __| _ \
 | (_) || |\/| | _| | |  | |) | __ | (__| _||   /
  \___/ |_|  |_|___|___| |___/|_||_|\___|___|_|_\

  adamsims.dev — agentic ai engineer · ai platform engineer
  shimonoseki, japan (from sep 2026) · remote now
  type 'help' for commands.  ctrl+l to clear.
`;

const COMMANDS = {
  help: {
    desc: "list available commands",
    fn: () => [
      "available commands:",
      "  help              show this message",
      "  ls                list available 'files' (cv sections)",
      "  cat <file>        read a file (e.g. cat resume, cat projects)",
      "  open <app>        open a window (resume|projects|skills|about|contact|terminal)",
      "  whoami            short bio",
      "  contact           show contact details",
      "  resume            alias for 'open resume'",
      "  projects          alias for 'open projects'",
      "  skills            alias for 'open skills'",
      "  about             alias for 'open about'",
      "  date              current date/time",
      "  uname -a          system info",
      "  echo <text>       repeat text",
      "  banner            reprint the welcome banner",
      "  sudo <anything>   try it",
      "  exit              close terminal",
      "  clear             clear the screen (ctrl+l)",
    ].join("\n"),
  },
  ls: {
    desc: "list available 'files'",
    fn: () => [
      "cv/",
      "  resume.json   experience.json   education.json",
      "  skills.json   projects.json     contact.json",
      "  README.md",
      "tools/",
      "  resume.app   projects.app   skills.app",
      "  about.app    contact.app    terminal.app",
    ].join("\n"),
  },
  cat: {
    desc: "read a file",
    fn: (args, ctx) => {
      if (!args.length) return { kind: "error", text: "usage: cat <file>" };
      const file = args[0].toLowerCase();
      const cv = ctx.cv;
      switch (file) {
        case "resume":
        case "resume.json":
          return { kind: "info", text: renderResumeText(cv) };
        case "projects":
        case "projects.json":
          return { kind: "info", text: renderProjectsText(cv) };
        case "skills":
        case "skills.json":
          return { kind: "info", text: renderSkillsText(cv) };
        case "contact":
        case "contact.json":
          return { kind: "info", text: renderContactText(cv) };
        case "experience":
        case "experience.json":
          return { kind: "info", text: renderExperienceText(cv) };
        case "education":
        case "education.json":
          return { kind: "info", text: renderEducationText(cv) };
        case "readme":
        case "readme.md":
          return { kind: "info", text: renderReadme(cv) };
        default:
          return { kind: "error", text: `cat: ${file}: no such file or directory` };
      }
    },
  },
  open: {
    desc: "open a window",
    fn: (args, ctx) => {
      if (!args.length) return { kind: "error", text: "usage: open <app>" };
      const target = args[0].toLowerCase();
      const app = APPS.find(a => a.id === target);
      if (!app) return { kind: "error", text: `open: '${target}' is not a registered app` };
      WM.open({
        id: app.id,
        title: app.title,
        icon: app.icon,
        width: app.defaultSize.w,
        height: app.defaultSize.h,
        content: app.onOpen(ctx.cv),
      });
      return { kind: "success", text: `opened ${app.title}` };
    },
  },
  whoami: {
    desc: "short bio",
    fn: (args, ctx) => ({ kind: "info", text: `${ctx.cv.person.name} — ${ctx.cv.person.title}` }),
  },
  contact: {
    desc: "show contact details",
    fn: (args, ctx) => ({ kind: "info", text: renderContactText(ctx.cv) }),
  },
  resume: { desc: "open resume window", fn: (args, ctx) => COMMANDS.open.fn(["resume"], ctx) },
  projects: { desc: "open projects window", fn: (args, ctx) => COMMANDS.open.fn(["projects"], ctx) },
  skills: { desc: "open skills window", fn: (args, ctx) => COMMANDS.open.fn(["skills"], ctx) },
  about: { desc: "open about window", fn: (args, ctx) => COMMANDS.open.fn(["about"], ctx) },
  date: { desc: "current date/time", fn: () => ({ kind: "info", text: new Date().toString() }) },
  uname: {
    desc: "system info",
    fn: (args) => {
      if (args[0] === "-a") {
        return { kind: "info", text: "AdamOS 1.0.0 #1 SMP adamsims-desktop x86_64 GNU/Linux" };
      }
      return { kind: "info", text: "AdamOS" };
    },
  },
  echo: { desc: "echo text", fn: (args) => ({ kind: "info", text: args.join(" ") }) },
  banner: { desc: "reprint the welcome banner", fn: () => ({ kind: "accent", text: BANNER }) },
  sudo: {
    desc: "try it",
    fn: (args) => ({ kind: "error", text: `[sudo] password for guest: \nSorry, user guest is not in the sudoers file. This incident will be reported to Adam.` }),
  },
  exit: { desc: "close terminal", fn: (args, ctx) => { ctx.close(); return { kind: "info", text: "logout" }; } },
  clear: { desc: "clear the screen", fn: (args, ctx) => { ctx.clear(); return null; } },
};

function renderResumeText(cv) {
  const p = cv.person;
  return [
    `${p.name} — ${p.title}`,
    p.location,
    p.email,
    "",
    p.tagline,
    "",
    "Summary:",
    cv.summary,
  ].join("\n");
}
function renderProjectsText(cv) {
  return cv.projects.map(pr => [
    `${pr.name}  [${pr.status}]`,
    `  ${pr.tagline}`,
    `  stack: ${(pr.stack || []).join(", ")}`,
    ...(pr.highlights || []).map(h => `  - ${h}`),
    pr.url ? `  url: ${pr.url}` : null,
  ].filter(Boolean).join("\n")).join("\n\n");
}
function renderSkillsText(cv) {
  return Object.entries(cv.skills).map(([cat, items]) => `${cat}:\n${items.map(i => `  - ${i}`).join("\n")}`).join("\n\n");
}
function renderContactText(cv) {
  const p = cv.person;
  return [
    `Email:    ${p.email}`,
    `Location: ${p.location}`,
    `Status:   ${p.status}`,
    `TZ:       ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
  ].join("\n");
}
function renderExperienceText(cv) {
  return cv.experience.map(e => [
    `${e.role} @ ${e.company}  (${e.period})`,
    ...e.highlights.map(h => `  - ${h}`),
  ].join("\n")).join("\n\n");
}
function renderEducationText(cv) {
  return cv.education.map(e => `${e.qualification} — ${e.institution} (${e.year})`).join("\n");
}
function renderReadme(cv) {
  return [
    `# ${cv.person.name}`,
    "",
    cv.person.tagline,
    "",
    "this 'desktop' is a single-page vanilla html/css/js app.",
    "drag windows. resize from the edges. open the terminal and type 'help'.",
    "",
    "data lives in /data/cv.json — edit that file, refresh, all windows update.",
  ].join("\n");
}
function createTerminal(cv) {
  const root = document.createElement("div");
  root.className = "terminal";
  root.innerHTML = `
    <div class="terminal-output" tabindex="0"></div>
    <div class="terminal-input-line">
      <span class="terminal-prompt">adam@adamsims.dev:~$</span>
      <input class="terminal-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" />
    </div>
  `;
  const out = root.querySelector(".terminal-output");
  const input = root.querySelector(".terminal-input");
  const ctx = { cv, close: () => WM.close("terminal"), clear: () => { out.innerHTML = ""; } };

  const history = [];
  let hIndex = 0;

  function write(text, kind = "info") {
    if (text == null) return;
    const span = document.createElement("span");
    span.className = `terminal-line terminal-${kind}`;
    span.textContent = text;
    out.appendChild(span);
  }
  function writePrompt(cmd) {
    const span = document.createElement("span");
    span.className = "terminal-line";
    span.innerHTML = `<span class="terminal-prompt">adam@adamsims.dev:~$</span> ${escape(cmd)}`;
    out.appendChild(span);
  }
  function writeBlock(text, kind) {
    if (text == null) return;
    for (const line of text.split("\n")) write(line, kind);
  }
  function exec(line) {
    const trimmed = line.trim();
    if (!trimmed) return;
    history.push(trimmed);
    hIndex = history.length;
    writePrompt(trimmed);
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const def = COMMANDS[cmd];
    if (!def) {
      writeBlock(`${cmd}: command not found. type 'help' for a list.`, "error");
      return;
    }
    const result = def.fn(args, ctx);
    if (result == null) return;
    if (typeof result === "string") writeBlock(result, "info");
    else writeBlock(result.text, result.kind || "info");
  }

  // Initial greeting
  write(BANNER.trim(), "accent");
  write("", "muted");
  write("welcome. type 'help' to see what's available, or click around the desktop.", "muted");
  write("", "muted");

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const v = input.value;
      input.value = "";
      exec(v);
      out.scrollTop = out.scrollHeight;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex] ?? "";
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0) return;
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] ?? "";
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      out.innerHTML = "";
    }
  });
  // Click anywhere in terminal to focus input
  root.addEventListener("click", (e) => {
    if (e.target.closest(".win-btn")) return;
    input.focus();
  });
  // Auto-focus input when window opens
  queueMicrotask(() => input.focus());

  return root;
}

function escape(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

/* ========== main.js ========== */
// Main entry: load CV, boot, build desktop + dock, wire windows.

window.__MAIN_STARTED = true;
console.log("[main] script executing");
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
  for (const app of APPS) {
    if (!app.showOnDesktop) continue;
    const btn = document.createElement("button");
    btn.className = "desktop-icon";
    btn.dataset.app = app.id;
    btn.innerHTML = `
      <span class="desktop-icon-img">${app.icon}</span>
      <span class="desktop-icon-label">${app.title}</span>
    `;
    btn.addEventListener("dblclick", () => openApp(app, cv));
    btn.addEventListener("click", (e) => {
      // Single click selects (visual only)
      for (const b of layer.querySelectorAll(".desktop-icon")) b.classList.remove("is-selected");
      btn.classList.add("is-selected");
    });
    layer.appendChild(btn);
  }
}

function openApp(app, cv) {
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
  // Skipped in ?print=1 mode because the resume is already rendered as a
  // full document by enterPrintMode().
  const params = new URLSearchParams(location.search);
  const isPrintMode = params.get("print") === "1";
  if (!isPrintMode) {
    setTimeout(() => openApp(APPS[0], cv), 200);
  }

  // ?print=1 — skip the desktop chrome and render the resume printably.
  // This is the URL a recruiter can hit to get a clean printable view in
  // their browser. They can still Cmd+P to save as PDF.
  if (isPrintMode) {
    enterPrintMode(cv);
  }
  if (params.get("pdf") === "1") {
    // /?pdf=1 — auto-trigger the print dialog after a short delay so the
    // page can render fully first.
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
        // Let the browser's native print dialog handle it — the print
        // stylesheet will make the output look correct.
        WM.focus("resume");
      }
    }
  });
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

/* ========== inlined cv data (from data/cv.json) ========== */
window.__CV_DATA = {
  "person": {
    "name": "Adam Sims",
    "title": "Agentic AI Engineer · AI Platform Engineer",
    "location": "Shimonoseki, Japan (from Sep 2026) · UK Remote (now)",
    "email": "adam@adamsims.dev",
    "tagline": "I build tools that ship. Currently living in a terminal, building agents that actually finish the job.",
    "status": "Available for remote contracts · open to AI Platform / Agentic Engineering roles",
    "languages": ["English (native)", "Japanese (conversational, learning)"]
  },
  "summary": "Agentic AI engineer with 5+ years in regulated public-service environments and a track record of shipping integrated creative tools. Specialised in LLM-orchestrated workflows, local-first AI platforms, and turning ambiguous problems into working products. Comfortable owning the full stack — from governance and guardrail design through to the deploy, the dev container, and the docs the next person will read.",
  "experience": [
    {
      "company": "Independent / Open Source",
      "role": "Founder, Engineer, Maintainer",
      "period": "2022 — Present",
      "location": "Remote (UK → Japan)",
      "highlights": [
        "Shipped NX-Writer — an integrated creative environment for fiction writers (Electron + TypeScript). Real customers, real revenue, real support burden.",
        "Authored and sold multiple game asset packs and tools on itch.io and Gumroad.",
        "Currently shipping Phaser-NGE — a visual novel / narrative game engine built on top of Phaser 3, with its own scene editor, asset pipeline, and Ink integration.",
        "Day-to-day stack: Linux (Fedora primary), Neovim, tmux, Docker, Ollama, ComfyUI, custom Bash + Python tooling."
      ]
    },
    {
      "company": "Public Service Organisation (UK)",
      "role": "Risk Manager",
      "period": "5 years",
      "location": "UK",
      "highlights": [
        "Owned the risk register, control framework, and incident response for a regulated function.",
        "Designed and enforced guardrails — the same muscle that maps directly onto LLM agent safety, output validation, and policy enforcement.",
        "Translated between engineering, compliance, and senior leadership without losing fidelity at any boundary.",
        "Postgraduate in Software Development — kept the engineering edge sharp while the day job paid the bills."
      ]
    }
  ],
  "projects": [
    {
      "id": "nx-writer",
      "name": "NX-Writer",
      "tagline": "Integrated creative environment for fiction writers",
      "status": "Shipped · For sale",
      "stack": ["Electron", "TypeScript", "CodeMirror 6", "React", "Vite"],
      "url": "https://nx-writer.app",
      "highlights": [
        "Real product. Real users. Real money. Built solo over months, sold on a public storefront.",
        "Custom editor with project tree, character/scene/world databases, distraction-free mode, and a manuscript export pipeline.",
        "Owned every layer — UI, persistence, packaging, auto-update, licensing, support."
      ]
    },
    {
      "id": "phaser-nge",
      "name": "Phaser-NGE",
      "tagline": "Visual novel / narrative game engine on Phaser 3",
      "status": "In development · Showable demo soon",
      "stack": ["Phaser 3", "TypeScript", "Vite", "Ink (Inkle)", "CodeDOM"],
      "highlights": [
        "Custom Phaser 3 scene editor with type-aware inspectors, CodeDOM-driven code generation, and a Unity-style file browser.",
        "Designed for writers and solo devs — data files, not naming conventions, drive the engine.",
        "Engine target: the 'Dave is Drowning' apocalyptic VN, and any other narrative game that wants a real editor."
      ]
    },
    {
      "id": "hermes",
      "name": "Hermes Agent",
      "tagline": "CLI AI agent orchestration platform (Nous Research)",
      "status": "Active development · Daily driver",
      "stack": ["Python", "MCP (Model Context Protocol)", "Skills system", "Multi-provider routing"],
      "highlights": [
        "Deep daily user. The thing that's writing this page, running my dev environment, and routing my LLM traffic.",
        "Composed of skills, plugins, cron jobs, and a native MCP client. I extend it, break it, and ship patches back.",
        "Used as the substrate for most of my agentic workflows — code review, repo maintenance, scheduled jobs, multi-agent delegation."
      ]
    },
    {
      "id": "opencode",
      "name": "OpenCode / Crush / Antigravity",
      "tagline": "OpenCode CLI · Crush terminal UI · Antigravity IDE — daily driver for AI-assisted coding",
      "status": "Daily driver",
      "stack": ["Go", "TypeScript", "Provider adapters", "Headroom routing"],
      "highlights": [
        "OpenCode as my primary coding agent CLI. Crush as the terminal UI when I want a TUI. Antigravity for IDE-grade sessions.",
        "Routed through Headroom (chopratejas/headroom) — an OpenCode-compatible routing proxy that runs on systemd at home, cutting my LLM spend dramatically.",
        "Multi-provider strategy: native provider for direct calls, Headroom for anything that benefits from caching/routing."
      ]
    },
    {
      "id": "comfyui-pipelines",
      "name": "ComfyUI Pipelines",
      "tagline": "Local image generation stack on AMD ROCm",
      "status": "Operational · In daily use",
      "stack": ["ComfyUI", "PyTorch 2.9 ROCm", "Anima v1.0", "SDXL + IP-Adapter FaceID", "Custom workflows"],
      "highlights": [
        "Local ComfyUI server on an AMD RX 9060 XT (17GB VRAM). 1100+ nodes loaded.",
        "Production workflows for character-consistent art (IP-Adapter FaceID), game asset generation (Anima), and training data prep.",
        "Runs alongside the rest of the stack — same machine, same backup, same Tailscale tail."
      ]
    },
    {
      "id": "headroom",
      "name": "Headroom",
      "tagline": "OpenCode-compatible LLM routing proxy",
      "status": "In production at home",
      "stack": ["Go", "OpenAI-compatible API", "Caching", "Routing rules"],
      "highlights": [
        "Chopratejas/headroom — runs on :8787 at home, exposed to my dev machine over Tailscale.",
        "Cuts LLM API spend by routing repeated prompt prefixes through a cache. Real, measurable savings.",
        "Systemd user unit with linger=yes — survives reboots, doesn't need a babysitter."
      ]
    }
  ],
  "skills": {
    "Agentic AI & LLMs": [
      "Agentic workflow design (Claude Code, OpenCode, Hermes, custom MCP servers)",
      "MCP (Model Context Protocol) — server authoring, tool registration, native clients",
      "LLM routing & cost optimisation (Headroom, prompt caching, provider failover)",
      "Skills / plugin architectures (composable, discoverable, versioned)",
      "Guardrail design (output validation, policy enforcement, tool-call sandboxing)",
      "Multi-agent orchestration & delegation"
    ],
    "Engineering": [
      "TypeScript / Python / Go / Bash / C#",
      "Electron, React, Vite, Svelte",
      "Phaser 3, Ink, custom scene editors",
      "Node.js, tsc, vitest, eslint",
      "Docker, systemd, Tailscale",
      "Neovim + tmux as a primary IDE"
    ],
    "Platform & Infra": [
      "Linux (Fedora primary, Ubuntu/Yaru at heart, Arch dabblings)",
      "ROCm / CUDA / local inference (llama.cpp, Ollama, ComfyUI)",
      "Hugging Face Hub, model downloads, LoRA training",
      "Cloudflare Pages / S3 / static deploys",
      "Systemd user services, linger, auto-restart"
    ],
    "Governance, Risk & Compliance (GRC)": [
      "Risk register ownership in a regulated public service",
      "Control framework design and enforcement",
      "Incident response and post-incident review",
      "Stakeholder translation: engineering ↔ compliance ↔ leadership",
      "Guardrail design that maps cleanly onto LLM agent safety"
    ],
    "Product & Shipping": [
      "Solo founder of a sold product (NX-Writer) — every role, every day",
      "Public storefronts (itch.io, Gumroad), payment, licensing, support",
      "Asset pack creation, marketing pages, product-led growth"
    ]
  },
  "education": [
    {
      "qualification": "Postgraduate Diploma, Software Development",
      "institution": "UK University",
      "year": "2022 — 2024"
    },
    {
      "qualification": "BSc (Hons), Software Development · First Class",
      "institution": "UK University",
      "year": "2018 — 2021"
    }
  ],
  "interests": [
    "Visual novels and narrative games (currently building one)",
    "Open-source maintainership and contribution",
    "Local-first AI and self-hosted tooling",
    "Moving to Shimonoseki, learning Japanese, eating fugu (responsibly)",
    "Long-form writing, worldbuilding, and the craft of pacing"
  ],
  "links": [
    { "label": "Email", "value": "adam@adamsims.dev", "href": "mailto:adam@adamsims.dev" },
    { "label": "LinkedIn", "value": "linkedin.com/in/adamsims", "href": "https://www.linkedin.com/in/adamsims" },
    { "label": "GitHub", "value": "github.com/adamsims", "href": "https://github.com/adamsims" }
  ]
};
