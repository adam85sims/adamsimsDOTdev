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
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;

    // Position with cascade
    const layerRect = layer.getBoundingClientRect();
    const cascade = (windows.size % 8) * 28;
    const left = x ?? Math.max(20, (layerRect.width - width) / 2 + cascade - 80);
    const top = y ?? Math.max(10, (layerRect.height - height) / 2 + cascade - 60);
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
