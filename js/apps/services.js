// Services app — displays service tiers with pricing and proof points.
// Data comes from cv.services and cv.payment.

export function renderServices(cv) {
  const root = document.createElement("div");
  root.className = "services";

  const services = cv.services || [];
  const payment = cv.payment || {};

  // Sort by tier number
  services.sort((a, b) => a.tier - b.tier);

  root.innerHTML = `
    <div class="services-header">
      <h2>Services</h2>
      <p class="services-tagline">I build agents that finish the job, frameworks that survive contact with reality, and tools that actually ship.</p>
      <div class="services-cta">
        <a href="mailto:adam@thenetherwatch.com?subject=Project%20Enquiry" class="services-cta-btn">Start a conversation</a>
        <span class="services-cta-note">Response within 24 hours</span>
      </div>
    </div>

    <div class="services-grid">
      ${services.map(svc => `
        <div class="service-card" data-tier="${svc.tier}">
          <div class="service-card-header">
            <span class="service-tier-badge">Tier ${svc.tier}</span>
            <span class="service-icon">${svc.icon}</span>
          </div>
          <h3 class="service-name">${escape(svc.name)}</h3>
          <p class="service-tagline">${escape(svc.tagline)}</p>

          <ul class="service-items">
            ${svc.items.map(item => `<li>${escape(item)}</li>`).join("")}
          </ul>

          <div class="service-proof">
            <span class="service-proof-label">Proof</span>
            <p>${escape(svc.proof)}</p>
          </div>

          <div class="service-pricing">
            <span class="service-pricing-model">${escape(svc.pricing.model)}</span>
            <span class="service-pricing-amount">${escape(svc.pricing.gbp)}</span>
            <span class="service-pricing-alt">${escape(svc.pricing.usd)}</span>
          </div>
        </div>
      `).join("")}
    </div>

    ${payment.methods ? `
    <div class="services-payment">
      <h3>Payment</h3>
      <div class="payment-grid">
        <div class="payment-block">
          <span class="payment-label">Methods</span>
          <div class="payment-tags">${payment.methods.map(m => `<span class="payment-tag">${escape(m)}</span>`).join("")}</div>
        </div>
        <div class="payment-block">
          <span class="payment-label">Currencies</span>
          <div class="payment-tags">${payment.currencies.map(c => `<span class="payment-tag">${escape(c)}</span>`).join("")}</div>
        </div>
        <div class="payment-block">
          <span class="payment-label">Terms</span>
          <p class="payment-text">${escape(payment.terms)}</p>
        </div>
      </div>
      ${payment.note ? `<p class="payment-note">${escape(payment.note)}</p>` : ""}
    </div>
    ` : ""}
  `;

  return root;
}

function escape(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}
