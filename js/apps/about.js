// About app — short bio.

export function renderAbout(cv) {
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
