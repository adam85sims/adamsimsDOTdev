// Terminal app — a small but real shell. Commands: help, ls, cat, open, whoami,
// date, uname, echo, clear, projects, resume, contact, skills, banner, exit.

import { APPS } from "./registry.js";

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

export function createTerminal(cv) {
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
