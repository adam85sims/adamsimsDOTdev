// Projects app — card grid.

export function renderProjects(cv) {
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
