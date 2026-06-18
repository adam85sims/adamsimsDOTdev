// Contact app.

export function renderContact(cv) {
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
