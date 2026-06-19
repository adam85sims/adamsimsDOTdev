// Resume app — renders the canonical CV view.

const PRINT_ICON = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5V2h8v3"/><rect x="2" y="5" width="12" height="8" rx="1"/><rect x="4" y="9" width="8" height="5"/><circle cx="12" cy="7.5" r="0.6" fill="currentColor"/></svg>';

export function renderResume(cv) {
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
// Moves the resume out of the window-layer (which @media print hides) into
// a temporary print container on <body>, then restores it after the dialog
// closes. Skipped when ?print=1 or ?pdf=1 already rendered the resume
// directly on <body> via enterPrintMode().
export function triggerPrint() {
  if (!document.body.classList.contains("is-print-mode")) {
    preparePrintView();
  }
  document.dispatchEvent(new CustomEvent("cv:print"));
  // Double rAF: first frame lets the DOM mutation + class change paint;
  // second frame gives the browser time to recalculate styles before the
  // print dialog freezes the layout. Prevents blank-page issues.
  requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
}

// Move the resume element from its window into a standalone print-page
// container on <body> so @media print rules can render it (the
// .window-layer parent is hidden by the print stylesheet).
function preparePrintView() {
  teardownPrintView();
  const win = WM.get("resume");
  if (!win) return;
  const resumeEl = win.body.querySelector(".resume");
  if (!resumeEl) return;
  const printRoot = document.createElement("div");
  printRoot.className = "print-page";
  printRoot.id = "print-temp";
  // No display:none — the element is invisible on screen because no @media
  // screen rule targets #print-temp, but it must be in the render tree so
  // @media print can show it. An inline display:none would fight the
  // !important override in the print stylesheet and can cause blank pages.
  printRoot.appendChild(resumeEl);
  document.body.appendChild(printRoot);
  document.body.classList.add("is-printing");
}

// Restore the resume to its window after the print dialog closes.
export function teardownPrintView() {
  document.body.classList.remove("is-printing");
  const printRoot = document.getElementById("print-temp");
  if (!printRoot) return;
  const resumeEl = printRoot.querySelector(".resume");
  const win = WM.get("resume");
  if (resumeEl && win) {
    win.body.prepend(resumeEl);
  }
  printRoot.remove();
}

function escape(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

