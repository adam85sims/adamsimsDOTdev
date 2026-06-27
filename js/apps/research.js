// Research app — renders findings from autonomous experiments and framework developments.

export function renderResearch(cv) {
  const root = document.createElement("div");
  root.className = "research-container";
  
  const researchData = cv.research || [];

  root.innerHTML = `
    <div class="research-layout">
      <aside class="research-sidebar">
        <div class="research-sidebar-title">Research Log</div>
        <nav class="research-nav">
          ${researchData.map((item, idx) => `
            <button class="research-nav-item ${idx === 0 ? 'is-active' : ''}" data-target="${item.id}">
              <span class="research-nav-type">${escape(item.type)}</span>
              <span class="research-nav-label">${escape(item.title)}</span>
              <span class="research-nav-date">${escape(item.date)}</span>
            </button>
          `).join("")}
        </nav>
      </aside>
      <main class="research-content">
        ${researchData.map((item, idx) => `
          <div class="research-pane ${idx === 0 ? 'is-active' : ''}" id="pane-${item.id}">
            <div class="research-header-block">
              <span class="research-badge">${escape(item.type)}</span>
              <h2>${escape(item.title)}</h2>
              <p class="research-tagline">${escape(item.tagline)}</p>
            </div>
            
            <div class="research-body-section">
              <h3>Overview</h3>
              <p class="research-summary-text">${escape(item.summary)}</p>
            </div>

            ${item.findings ? `
              <div class="research-body-section">
                <h3>Key Research Insights</h3>
                <div class="insight-cards">
                  ${item.findings.map(f => `
                    <div class="insight-card">
                      <h4>${escape(f.title)}</h4>
                      <p>${escape(f.desc)}</p>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            ${item.modules ? `
              <div class="research-body-section">
                <h3>Extracted Framework Modules</h3>
                <div class="module-cards">
                  ${item.modules.map(m => `
                    <div class="module-card">
                      <div class="module-card-header">
                        <span class="module-icon">&gt;_</span>
                        <h4>${escape(m.name)}</h4>
                      </div>
                      <p>${escape(m.desc)}</p>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}
            
            <div class="research-meta-section">
              <div class="research-meta-item">
                <strong>Project Directory:</strong>
                ${item.links.map(l => `
                  <span class="research-path" title="Click to copy path" data-path="${escape(l.path)}">
                    ${escape(l.label)} <span class="research-path-hover-hint">(${escape(l.path)})</span>
                  </span>
                `).join("")}
              </div>
            </div>
          </div>
        `).join("")}
      </main>
    </div>
  `;

  // Wire up sidebar switching
  const navItems = root.querySelectorAll(".research-nav-item");
  const panes = root.querySelectorAll(".research-pane");
  
  navItems.forEach(btn => {
    btn.addEventListener("click", () => {
      navItems.forEach(b => b.classList.remove("is-active"));
      panes.forEach(p => p.classList.remove("is-active"));
      
      btn.classList.add("is-active");
      const target = btn.dataset.target;
      root.querySelector(`#pane-${target}`).classList.add("is-active");
    });
  });

  // Copy to clipboard with toast/visual confirmation on the item itself
  const paths = root.querySelectorAll(".research-path");
  paths.forEach(span => {
    span.addEventListener("click", () => {
      const path = span.dataset.path;
      navigator.clipboard.writeText(path).then(() => {
        const originalText = span.innerHTML;
        span.innerHTML = `<span style="color: var(--yaru-orange); font-weight: 600;">✓ Copied to clipboard!</span>`;
        setTimeout(() => {
          span.innerHTML = originalText;
        }, 1500);
      }).catch(err => {
        console.error("Failed to copy path:", err);
      });
    });
  });

  return root;
}

function escape(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}
