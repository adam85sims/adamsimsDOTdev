// Skills app — categorised.

export function renderSkills(cv) {
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
