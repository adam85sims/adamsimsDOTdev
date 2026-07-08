// App registry: each app exports { id, label, icon, defaultSize, render, onOpen }.
// main.js calls this and wires windows, dock, desktop icons.

import { renderServices } from "./apps/services.js";
import { renderResume, triggerPrint } from "./apps/resume.js";
import { renderProjects } from "./apps/projects.js";
import { renderSkills } from "./apps/skills.js";
import { renderAbout } from "./apps/about.js";
import { renderContact } from "./apps/contact.js";
import { createTerminal } from "./apps/terminal.js";
import { renderResearch } from "./apps/research.js";

const ICONS = {
  resume: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><line x1="9" y1="13" x2="17" y2="13"/><line x1="9" y1="17" x2="17" y2="17"/><line x1="9" y1="9" x2="11" y2="9"/></svg>',
  projects: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="4" x2="9" y2="20"/></svg>',
  skills: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>',
  about: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4 4-7 8-7s8 3 8 7"/></svg>',
  contact: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6l9 7 9-7"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="6,10 10,12 6,14"/><line x1="13" y1="15" x2="18" y2="15"/></svg>',
  research: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  services: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/><circle cx="12" cy="12" r="3"/></svg>',
  print: '<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5V2h8v3"/><rect x="2" y="5" width="12" height="8" rx="1"/><rect x="4" y="9" width="8" height="5"/></svg>',
  sentinel: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect width="18" height="18" x="3" y="3" rx="4" fill="#E95420" stroke="none"/><text x="12" y="16.5" text-anchor="middle" fill="white" font-size="13" font-family="monospace" font-weight="bold">S</text></svg>',
};

// Each app may declare extra window-header buttons (left of min/max/close).
const PRINT_ACTION = {
  label: "Print",
  title: "Print / Save as PDF",
  className: "win-btn-print",
  icon: ICONS.print,
  onClick: () => triggerPrint(),
};

export const APPS = [
  { id: "services", title: "Services", icon: ICONS.services, defaultSize: { w: 900, h: 740 }, onOpen: (cv) => renderServices(cv), showOnDesktop: true, showInDock: true },
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
  { id: "research", title: "Research", icon: ICONS.research, defaultSize: { w: 860, h: 600 }, onOpen: (cv) => renderResearch(cv), showOnDesktop: true, showInDock: true },
  { id: "sentinel", title: "Sentinel Docs", icon: ICONS.sentinel, isExternal: true, url: "sentinel/index.html", showOnDesktop: true, showInDock: false },
  { id: "skills", title: "Skills", icon: ICONS.skills, defaultSize: { w: 760, h: 560 }, onOpen: (cv) => renderSkills(cv), showOnDesktop: false, showInDock: true },
  { id: "about", title: "About", icon: ICONS.about, defaultSize: { w: 560, h: 480 }, onOpen: (cv) => renderAbout(cv), showOnDesktop: true, showInDock: false },
  { id: "contact", title: "Contact", icon: ICONS.contact, defaultSize: { w: 520, h: 440 }, onOpen: (cv) => renderContact(cv), showOnDesktop: false, showInDock: true },
  { id: "terminal", title: "Terminal", icon: ICONS.terminal, defaultSize: { w: 720, h: 440 }, onOpen: (cv) => createTerminal(cv), showOnDesktop: true, showInDock: true },
];
