# Agentic Engineering — Week Plan
## adamsims.dev

*Accumulated daily by the 10am planning cron. Each section = one day's work.*

---

## Day 1 — Monday 2026-06-29: Landscape Research
### Who Actually Hires Agentic/AI Engineers?

#### The Market Reality (Mid-2026)

The "AI agent" market has bifurcated into three tiers:

**Tier A — Well-funded startups (Seed → Series B)** who need agents built *yesterday*
- Raised $2-20M, have a product idea involving AI, but zero in-house agent expertise
- Hiring signals: job posts for "AI Engineer", "LLM Engineer", "ML Platform Engineer" on Wellfound, YC Work at a Fintech, LinkedIn
- Budget: $150-250/hr or $8k-25k fixed-scope projects
- Pain: "We tried LangChain and it broke in production. We need someone who's actually shipped this."
- Where they hang: YC alumni networks, Twitter/X AI circles, Product Hunt launchers, indie hacker Discords

**Tier B — Mid-market companies (50-500 employees)** adding AI to existing products
- SaaS companies, agencies, dev tool companies adding "AI features" to stay competitive
- Hiring signals: "AI Integration Lead", "Staff AI Engineer" on LinkedIn
- Budget: $180-300/hr or $15k-50k project-based
- Pain: "Our CTO says we need AI. Our devs are smart but have never built an agent. We need someone to architect it and hand off."
- Where they hang: LinkedIn, CTO peer groups, SaaStr, industry conferences

**Tier C — Regulated orgs (finance, health, government)** that need AI + compliance
- Banks, NHS trusts, insurance companies, government contractors
- Hiring signals: "AI Governance Lead", "Responsible AI Manager", vague "AI Strategist" posts
- Budget: £5k-15k/month retainers, or £800-1,500/day consulting
- Pain: "We can't deploy AI without proving it's safe. We need someone who speaks both engineering and compliance."
- Where they hang: Industry events (AI Summit London, CogX), procurement frameworks (G-Cloud), LinkedIn, direct referrals

---

### 10 Concrete Candidate Segments

| # | Segment | Example Buyer | Why They'd Pay Adam | Entry Signal |
|---|---------|---------------|---------------------|--------------|
| 1 | **AI-native startups (pre-Series A)** | YC batch companies building AI products | Need agents built fast, can't afford a team. Adam ships solo. | Wellfound job posts, YC Work at a Fintech, Twitter "hiring AI engineer" posts |
| 2 | **SaaS companies adding AI features** | Project management, CRM, dev tools adding "AI assistant" | Need someone who's integrated LLMs into real products, not just demos. | LinkedIn job posts for "AI Integration", product roadmap announcements |
| 3 | **UK regulated finance (FCA)** | Fintech startups, challenger banks, insurance | Need AI governance that satisfies FCA requirements. Adam's risk background. | FCA AI announcements, fintech conferences, LinkedIn finance+AI posts |
| 4 | **NHS / UK health tech** | NHS digital teams, healthtech startups | Deploying AI in clinical contexts needs governance-first approach. | NHS Digital tenders, healthtech meetups, NHS AI Lab announcements |
| 5 | **Game studios & creative tools** | Indie studios, VN developers, narrative game companies | Adam literally builds game engines and creative tools. NX-Writer, Phaser-NGE. | itch.io community, game dev Discords, GDC/networking |
| 6 | **Developer tools companies** | Companies building IDEs, CLIs, dev platforms | MCP integration, agent plugins, CLI tooling — Adam's daily driver stack. | GitHub MCP ecosystem, dev tool launch announcements |
| 7 | **AI agencies needing overflow talent** | Boutique AI agencies with more work than staff | Adam as a white-label subcontractor. Lower margin but steady flow. | Agency websites listing "AI capabilities", agency hiring posts |
| 8 | **Government contractors (UK)** | Companies on G-Cloud, Digital Outcomes framework | Public sector AI needs governance-first. Adam's 5 years in public service. | Gov.uk Digital Marketplace, G-Cloud listings, gov contractor LinkedIn |
| 9 | **Japanese market (from Sep 2026)** | Japanese companies entering AI, bilingual tech companies | Rare combo: English-native AI engineer moving to Japan, speaks Japanese. | Japan AI conferences, Tokyo startup ecosystem, bilingual job boards |
| 10 | **Open-source ecosystem sponsors** | Companies using MCP, Hermes ecosystem, Agent-Frameworks | Companies that benefit from Adam's OSS work and want custom extensions. | GitHub sponsors, MCP adoption announcements, Hermes ecosystem growth |

---

### Competitor Landscape

| Competitor Type | Examples | What They Do | Adam's Advantage |
|----------------|----------|--------------|-----------------|
| **AI consultancies (agency model)** | Faculty AI, Peak AI, Multiverse | Large teams, enterprise focus, big-ticket contracts | Adam is faster, cheaper, and ships solo. No 6-month sales cycle. |
| **Freelance platforms** | Toptal, Gun.io, Arc.dev | Body shopping — match freelancers to clients | Adam offers a *service*, not a body. Scoped deliverables, not hourly seat-warming. |
| **Solo AI consultants** | Various Twitter/X personalities | Advice, strategy, sometimes builds | Most are either pure strategy (no code) or pure code (no governance). Adam does both. |
| **LangChain/CrewAI shops** | Agencies built on specific frameworks | Build agents using off-the-shelf frameworks | Adam builds custom when frameworks break. Knows when to use them and when not to. |
| **Big 4 / Accenture** | Deloitte AI, PwC AI, Accenture AI | Enterprise AI transformation, huge teams | Adam is the antidote. For companies who've been burned by a 6-figure "AI strategy" that produced a slide deck. |

---

### Where Clients Actually Hang Out (Ranked by Signal Quality)

1. **LinkedIn** — Highest signal for B2B. Decision-makers post "looking for AI engineer" openly. Adam's existing profile is a funnel.
2. **Twitter/X AI community** — AI-native startups and indie builders. Lower ticket but faster close. Good for Tier 1.
3. **YC Work at a Fintech / Wellfound** — Curated startup jobs. Many are "need AI engineer" but don't know what they need yet.
4. **GitHub (MCP ecosystem)** — Companies adopting MCP will need custom servers. Adam's OSS presence = passive inbound.
5. **Industry conferences** — AI Summit London, CogX, Japan AI events (post-Sep). High effort, high reward for Tier C.
6. **Gov.uk Digital Marketplace / G-Cloud** — If Adam gets on the framework, government contracts flow. Slow to set up, sticky once in.
7. **Discord/Slack communities** — MLOps, AI Engineer, indie hacker groups. Good for warm intros and reputation building.
8. **Direct outreach to CTOs** — Cold email to Series A/B CTOs who just raised. High effort per lead but very targeted.

---

### Key Insight

Adam's unique position is the **governance + shipping** combo. Most AI consultants are either:
- (a) Researchers who can't ship → they write papers, not code
- (b) Agencies who ship but don't understand safety → they move fast and hope nobody notices
- (c) Strategists who make decks → no code, no proof

Adam caught his own agent fabricating compliance, built a governance gate, open-sourced it, AND shipped real products. That's a story no one else has.

**The wedge:** Lead with the Hermes Autonomy Experiment. "My agent tried to cheat. I built a gate to catch it. Let me build yours so it doesn't cheat either."

---

## Day 2 — Tuesday 2026-06-30: Service Scoping
### What Exactly Does Adam Sell?

#### Market Pricing Reality Check (UK 2026)

Pulled from nicolalazzari.ai, hashmeta.ai, nextpageit.com, codewave.com:

| Benchmark | Range | Source |
|-----------|-------|--------|
| **Freelance AI consultant hourly (UK)** | £80–£200/hr | nicolalazzari.ai |
| **Freelance AI day rate** | £500–£1,200/day | nicolalazzari.ai |
| **Agency day rate** | £1,000–£1,800/day | nicolalazzari.ai |
| **AI prototype/PoC** | £20k–£60k | nicolalazzari.ai |
| **AI strategy roadmap** | $25k–$250k | hashmeta.ai |
| **Execution = 75-85% of total project cost** | — | hashmeta.ai |
| **Agent dev cost driver #1** | Workflow complexity, not model | nextpageit.com |
| **Senior AI strategist** | $250–$500/hr | hashmeta.ai |

**Takeaway:** Adam's ballpark pricing from the business plan (£3k–£25k Tier 1, £2k–£5k/mo Tier 2, £800–£1,200/day Tier 4) sits at the **freelancer-to-solo-consultant** range. This is correct positioning — undercut agencies, outperform body shops on deliverable quality.

---

#### The Four Engagement Models

Adam's services collapse into four operational shapes, regardless of tier:

##### Model A: Fixed-Scope Build
**When it fits:** Client knows what they want. "Build us an MCP server." "Build us a governance gate." "Build us a desktop app."
- Scope document signed before work starts
- 50% deposit upfront, 50% on delivery
- Defined deliverables with acceptance criteria
- Change orders for anything outside scope
- **Typical duration:** 2–8 weeks
- **Best for:** Tier 1 (agent builds), Tier 3 (app builds)

##### Model B: Monthly Retainer
**When it fits:** Ongoing work that can't be fully scoped upfront. Governance reviews, iterative agent improvements, fractional AI leadership.
- Fixed monthly fee for a block of hours/deliverables
- Net 14 payment terms
- Monthly report: what was done, what's next, any risks found
- 30-day notice to cancel
- **Typical duration:** 3–12 months
- **Best for:** Tier 2 (governance), Tier 4 (fractional leadership)

##### Model C: Day Rate Consulting
**When it fits:** Client needs a brain, not a builder. Architecture reviews, stack selection, due diligence, half-day workshops.
- Half-day (4hrs) or full-day (8hrs) blocks
- Booked in advance, paid on invoice
- Output: written report or recorded session
- **Typical duration:** 1–5 days per engagement
- **Best for:** Tier 4 (consulting & strategy)

##### Model D: Build-and-Handoff
**When it fits:** Client wants the thing built AND wants to own it completely. Documentation, training, knowledge transfer included.
- Fixed-scope build (Model A) + handoff package
- Handoff includes: architecture docs, runbooks, video walkthrough, 30-day post-delivery support
- Premium over Model A (handoff takes time)
- **Typical duration:** 3–10 weeks
- **Best for:** Tier 1 + Tier 3 for teams who want to maintain it themselves

---

#### Tier-by-Tier Service Definitions

##### Tier 1: Agent Engineering — What Gets Delivered

| Package | What You Get | Typical Duration | Price Range |
|---------|-------------|-----------------|-------------|
| **MCP Server** | Custom MCP server — tool registration, data access, multi-provider routing. Tested, documented, deployed. | 1–2 weeks | £3,000–£6,000 |
| **Single Agent Build** | End-to-end agent: prompt architecture, tool integration, error handling, deployment config. Includes 2 rounds of revision. | 2–4 weeks | £5,000–£12,000 |
| **Multi-Agent System** | Delegation trees, parallel workstreams, agent-to-agent coordination with state isolation. Full test suite. | 4–8 weeks | £12,000–£25,000 |
| **LLM Routing Layer** | Provider failover, prompt caching, tier routing (reasoning vs speed), spend dashboard. | 2–3 weeks | £4,000–£8,000 |
| **Skills/Plugin Architecture** | Composable, versioned, discoverable skill system. Pattern behind Hermes, Claude Code, etc. | 3–5 weeks | £6,000–£15,000 |

**What's always included:** Source code, README, deployment config, 2 revision rounds, 14-day post-delivery bug fixes.
**What's extra:** Ongoing maintenance (→ retainer), production monitoring setup, CI/CD pipeline, team training sessions.

##### Tier 2: AI Governance & Safety — What Gets Delivered

| Package | What You Get | Typical Duration | Price Range |
|---------|-------------|-----------------|-------------|
| **Governance Audit** | Independent review of existing AI/agent setup. Find the leaks, the safety gaps, the compliance risks. Written report with prioritised recommendations. | 1–2 weeks (scattered) | £3,000–£6,000 |
| **Compliance Gate Build** | Independent verification system that checks agent claims against objective evidence. The thing that caught Hermes fabricating. | 3–5 weeks | £8,000–£15,000 |
| **Governance Retainer** | Monthly: guardrail maintenance, policy updates, incident response, quarterly audit report. | Ongoing | £2,000–£5,000/mo |
| **Risk Framework** | Risk register, control matrix, incident response playbook adapted for autonomous agents. | 2–3 weeks | £4,000–£8,000 |
| **AI Policy Package** | Usage policies, escalation procedures, stakeholder-ready documentation. | 1–2 weeks | £2,000–£4,000 |

**What's always included:** Written report/delodocs, policy templates, 2 revision rounds.
**What's extra:** Board-level presentation prep, regulatory submission support, ongoing monitoring (→ retainer).

##### Tier 3: Application & Tool Development — What Gets Delivered

| Package | What You Get | Typical Duration | Price Range |
|---------|-------------|-----------------|-------------|
| **Desktop App** | Electron/Tauri app with persistence, packaging, auto-update. Shippable. | 4–8 weeks | £10,000–£25,000 |
| **Web App** | Full-stack web application. Vanilla JS through React/Svelte — whatever fits. | 3–6 weeks | £5,000–£18,000 |
| **Creative Tool** | Editor, game engine, asset pipeline, visual novel system. The stuff Adam builds for fun. | 4–10 weeks | £8,000–£30,000 |
| **Developer Tooling** | CLI tools, TUIs, VS Code extensions, build scripts, CI/CD. | 1–4 weeks | £3,000–£10,000 |
| **Game Dev** | Phaser 3, narrative engines, Ink integration, scene editors. | 4–12 weeks | £8,000–£30,000 |

**What's always included:** Source code, README, build scripts, 2 revision rounds, 14-day post-delivery bug fixes.
**What's extra:** App store submission, ongoing maintenance, design/assets, user testing.

##### Tier 4: Consulting & Strategy — What Gets Delivered

| Package | What You Get | Typical Duration | Price Range |
|---------|-------------|-----------------|-------------|
| **Architecture Review** | Full audit of existing agent/LLM setup. Written report with findings and recommendations. | 1–2 days | £800–£2,400 |
| **Stack Selection Sprint** | "Should we use LangChain or build custom?" — answered with a written recommendation + rationale. | 1 day | £800–£1,200 |
| **AI Integration Strategy** | Where does AI fit in your product? Not everywhere. The right places. Roadmap document. | 2–3 days | £1,600–£3,600 |
| **Technical Due Diligence** | For investors/acquirers evaluating AI-native products. Written assessment. | 2–5 days | £1,600–£6,000 |
| **Fractional AI Leadership** | Part-time technical direction. Weekly syncs, async advisory, architecture decisions. | Ongoing | £3,000–£6,000/mo |

**What's always included:** Written report/output, 1 follow-up call within 7 days.
**What's extra:** Implementation of recommendations (→ Tier 1/2/3 engagement), board presentations.

---

#### The Scoping Process (How "I Need Help" Becomes a Signed SOW)

```
Step 1: INTAKE (free, 15 min)
  └─ Client fills out intake form or sends email
  └─ Adam reads it, decides if it's in scope
  └─ If yes → book a call. If no → refer to someone else.

Step 2: DISCOVERY CALL (free, 30 min)
  └─ What's the problem? What have you tried? What does "done" look like?
  └─ Adam asks hard questions to surface the real scope
  └─ Outcome: rough tier + model recommendation

Step 3: SCOPE DOCUMENT (paid if complex, free if straightforward)
  └─ For simple engagements: Adam writes a 1-page scope doc
  └─ For complex engagements (multi-agent, governance frameworks):
     a paid scoping sprint (£500–£1,500) that produces a detailed SOW
  └─ Deliverables, timeline, price, payment terms all spelled out

Step 4: SIGN & DEPOSIT
  └─ Client signs the scope doc
  └─ 50% deposit on fixed projects. First month on retainers.
  └─ No work starts without signed scope + deposit.

Step 5: BUILD / CONSULT
  └─ Weekly progress updates (async — email or message)
  └─ Revision rounds built into the scope
  └─ Change requests = new scope line item

Step 6: DELIVER & HANDOFF
  └─ Final deliverable + documentation
  └─ 14-day bug fix window (fixed projects)
  └─ 30-day post-delivery support (build-and-handoff)
  └─ Invoice for remaining balance
```

---

#### Client Intake Form (Draft)

```
1. Company name & website
2. Your name & role
3. What do you need built/audited/advised on? (1-2 sentences)
4. What have you already tried?
5. What does "done" look like?
6. Timeline: when do you need this?
7. Budget range (optional but helpful):
   □ Under £5k  □ £5k-15k  □ £15k-30k  □ £30k+  □ Not sure
8. How did you find adamsims.dev?
```

**Why this form matters:** It filters out tire-kickers (they won't fill it out), surfaces scope problems early ("we need AGI by Friday"), and gives Adam enough to decide if it's worth a discovery call.

---

#### Tools Adam Uses (Client-Facing)

| Category | Tools | Why Clients Care |
|----------|-------|-----------------|
| **Agent frameworks** | Hermes Agent, OpenCode, Claude Code | Multi-provider = no vendor lock-in. Hermes is the proof point. |
| **MCP** | Custom MCP servers, tool registration | Industry standard for agent tool integration. |
| **LLM providers** | Ollama (local), OpenAI, Anthropic, Google, Mistral | Can route to cheapest/fastest/local as needed. |
| **Governance** | Agent-Frameworks (OSS) | Open-source, auditable, proven to catch agent fabrication. |
| **Infra** | Fedora, Tailscale, systemd, Docker/Podman | Self-contained dev environment. No SaaS dependencies. |
| **Version control** | GitHub (public for OSS, private for client work) | Standard. Client gets full repo access. |
| **Comms** | Email, async messaging (no Slack unless client insists) | Minimal overhead. Updates on schedule, not on demand. |
| **Payments** | Revolut (multi-currency), bank transfer, Wise | GBP/USD/EUR/JPY. No conversion fees between Revolut accounts. |

---

#### What's NOT Included (And Why)

- **Ongoing production monitoring** — That's a retainer, not a project.
- **24/7 support** — Adam is solo. Response within 24hrs on business days.
- **Design/UX** — Adam builds functional tools, not Figma mockups. If you need design, bring it or Adam can refer.
- **Training your team** — Included in build-and-handoff. Extra for fixed-scope builds.
- **Legal/compliance advice** — Adam builds governance *systems*, not legal opinions. Consult a solicitor for regulatory submissions.
- **SLA guarantees** — No uptime SLAs on agents Adam builds. He'll build monitoring, but the client owns production.

---

#### Key Scoping Decisions Still To Make

1. **Paid discovery vs free discovery:** Should complex scoping sprints be paid? Lean yes — £500–£1,500 filters serious clients and compensates for the thinking time. Free for straightforward engagements.

2. **Minimum engagement:** Is there a floor? Probably £2,000 — below that, the admin overhead eats the margin. Quick consultations can be half-day rate (£400–£600).

3. **Revision policy:** 2 rounds included. Additional rounds at day rate. This needs to be explicit in every SOW.

4. **Kill fee:** If a client cancels mid-project, what happens? Suggestion: work done is billed. Deposit is non-refundable. Remaining balance prorated to work completed.

5. **Portfolio use:** Can Adam showcase the work? Default yes (anonymised if client prefers). This should be in the SOW.

---

## Day 3 — Wednesday 2026-07-01: Pricing Deep-Dive
### Rate Cards, Package Tiers, Deposit Structures

---

#### The Pricing Philosophy (Refined)

Adam's business plan says "no hourly rates published." That's correct for clients — but Adam needs an **internal hourly anchor** to price fixed-scope work and sanity-check quotes.

**Internal hourly rate: £150/hr** (target effective rate after admin, sales time, gaps between projects)

Why £150/hr?
- Sits at the **mid-range** of UK freelance AI (£80-200/hr from nicolalazzari.ai benchmarks)
- Below agency rates (£1,000-1,800/day = £125-225/hr) — competitive
- Above commodity freelance (£50-80/hr) — signals quality, not desperation
- At 4 billable hours/day average, 220 working days/year = **£132k/year gross** at full capacity
- Realistic: first year will be ~50% billable (rest is sales, admin, marketing) = ~£66k
- Aligns with Q4 target of £60k revenue run-rate

**Rule:** Every fixed-price quote should be backed by an estimated hours × £150 calculation. If the effective rate drops below £120/hr, the scope is wrong or the price is too low.

---

#### The Rate Card (What Clients See)

Adam doesn't publish hourly rates. Instead, clients see **package prices** and **day rates**. Here's the definitive card:

##### Fixed-Scope Packages (Tiers 1 & 3)

| Package | What Ships | Duration | Price (GBP) | Effective £/hr |
|---------|-----------|----------|-------------|----------------|
| **MCP Server** | Custom MCP server, tool registration, docs, deploy config | 1-2 weeks | **£4,000** | ~£150-200 |
| **Single Agent** | End-to-end agent: prompts, tools, error handling, deployment | 2-4 weeks | **£8,000** | ~£150-175 |
| **Multi-Agent System** | Delegation trees, state isolation, test suite, docs | 4-8 weeks | **£18,000** | ~£150-170 |
| **LLM Routing Layer** | Provider failover, caching, spend dashboard | 2-3 weeks | **£6,000** | ~£150-170 |
| **Skills Architecture** | Composable, versioned, discoverable skill system | 3-5 weeks | **£10,000** | ~£150-165 |
| **Desktop App** | Electron/Tauri app, persistence, packaging, auto-update | 4-8 weeks | **£16,000** | ~£150-170 |
| **Web App** | Full-stack application, whatever stack fits | 3-6 weeks | **£12,000** | ~£150-175 |
| **Creative Tool** | Editor, engine, asset pipeline, visual novel system | 4-10 weeks | **£18,000** | ~£150-170 |
| **Dev Tooling** | CLI, TUI, VS Code extension, build scripts | 1-4 weeks | **£5,000** | ~£140-175 |
| **Game Dev** | Phaser 3, narrative engines, Ink integration | 4-12 weeks | **£18,000** | ~£150-165 |

**Note:** These are *anchor prices* for the "Standard" tier (see below). Actual quotes may go up or down based on complexity.

##### Governance Packages (Tier 2)

| Package | What Ships | Duration | Price (GBP) |
|---------|-----------|----------|-------------|
| **Governance Audit** | Full review + written report with prioritised findings | 1-2 weeks | **£4,500** |
| **Compliance Gate Build** | Independent verification system (the thing that caught Hermes) | 3-5 weeks | **£12,000** |
| **Governance Retainer** | Monthly: guardrails, policy updates, incident response, quarterly report | Ongoing | **£3,500/mo** |
| **Risk Framework** | Risk register, control matrix, incident playbook | 2-3 weeks | **£6,000** |
| **AI Policy Package** | Usage policies, escalation procedures, stakeholder docs | 1-2 weeks | **£3,000** |

##### Consulting (Tier 4)

| Package | What Ships | Duration | Price (GBP) |
|---------|-----------|----------|-------------|
| **Half-Day Consult** | 4hrs focused session + written summary | Half day | **£600** |
| **Full-Day Consult** | 8hrs deep dive + written report | 1 day | **£1,000** |
| **Architecture Review** | Full audit + findings report | 1-2 days | **£1,500** |
| **Stack Selection Sprint** | "Should we use X or build custom?" + recommendation | 1 day | **£1,000** |
| **AI Integration Strategy** | Where AI fits in your product + roadmap | 2-3 days | **£2,500** |
| **Technical Due Diligence** | Investor/acquirer assessment of AI product | 2-5 days | **£3,500** |
| **Fractional AI Leadership** | Weekly syncs, async advisory, architecture decisions | Ongoing | **£4,000/mo** |

---

#### The Three-Tier System (Per Package)

Every fixed-scope package comes in three flavours. This is how Adam gives clients choice without scope creep:

| Tier | Name | What's Included | Multiplier | Example: Single Agent |
|------|------|----------------|------------|----------------------|
| 🟢 | **Quick Start** | Core deliverable, README, basic deployment config | 1.0× | £8,000 |
| 🔵 | **Standard** | + test suite, CI/CD config, 2 revision rounds, 14-day bug fixes | 1.25× | £10,000 |
| 🟣 | **Full Handoff** | + architecture docs, runbook, video walkthrough, 30-day support, training session | 1.5× | £12,000 |

**Why three tiers:**
- **Quick Start** captures budget-conscious clients who just need the thing built
- **Standard** is the recommended default (most clients pick this)
- **Full Handoff** is for teams who want to own and maintain it themselves (build-and-handoff model)
- Clients self-select → less negotiation, clearer expectations

---

#### Deposit & Payment Structure

##### Fixed-Scope Projects (Tiers 1 & 3)

```
50% deposit ──→ Work begins ──→ Milestone check ──→ 50% on delivery
(non-refundable)                   (optional for >4wk projects)
```

**Milestone structure for projects >4 weeks:**
- 33% deposit on signing
- 33% at midpoint (milestone deliverable reviewed)
- 34% on final delivery

**Why 50% deposit:**
- Filters out tyre-kickers (they won't pay half upfront)
- Covers Adam's initial time investment (the first 1-2 weeks are heaviest)
- Industry standard for freelance/consultancy
- Non-refundable — covers work completed if client cancels

##### Retainers (Tiers 2 & 4)

```
First month ──→ Monthly on 1st ──→ 30-day notice to cancel
(upfront)         (Net 14)
```

- First month paid in full before work starts
- Subsequent months invoiced on the 1st, Net 14
- 30-day written notice to cancel
- Unused hours don't roll over (they were reserved, not purchased)

##### Day Rate Consulting (Tier 4)

```
Invoice on completion ──→ Net 14
(or upfront for first-time clients)
```

- For repeat clients: invoice after the session, Net 14
- For new clients: payment before the session
- Multi-day engagements: 50% deposit on booking

---

#### Discounts & Special Rates (Limited, Strategic)

| Scenario | Discount | Why | Cap |
|----------|----------|-----|-----|
| **Multi-package bundle** | 10% off total | Client buying Agent + Governance together = higher LTV | Must be scoped as single SOW |
| **Startup discount** | 15% off | Pre-Series A startups with confirmed funding | Only on Tier 1, max 1 per quarter |
| **Repeat client** | 5% loyalty | Returning client within 12 months | Applied automatically |
| **OSS contributor** | Case-by-case | Companies whose OSS Adam uses/benefits from | 1-2 per year max |
| **Referral bonus** | £500 credit | Existing client refers a new paying client | Credited after new client pays deposit |

**NOT discounted:**
- Governance work (Tier 2) — never discount safety
- Rush jobs — charge a **25% rush premium** instead
- Scope creep — that's a change order, not a discount opportunity

---

#### Rush & Overtime Pricing

| Situation | Premium | How It Works |
|-----------|---------|--------------|
| **Rush delivery** (<50% of normal timeline) | +25% | Client pays premium for compressed schedule |
| **Weekend/bank holiday work** | +50% | Only if client explicitly requests it |
| **Scope expansion** mid-project | Day rate (£1,000/day) | New scope = new line item, priced at day rate |
| **Post-delivery support** beyond included period | £150/hr or retainer | 14-day bug fix window expires → hourly or retainer |

---

#### Payment Methods & Invoicing

| Method | Currencies | Notes |
|--------|-----------|-------|
| **Bank transfer** | GBP, USD, EUR, JPY | Primary. No fees for UK transfers. |
| **Revolut** | All major currencies | Multi-currency accounts. No FX fees between Revolut users. Best for international clients. |
| **Wise** | All major currencies | Good FX rates. For clients who don't have Revolut. |
| **PayPal** | All | Last resort — 3.5% fee absorbed by client or added to invoice. |

**Invoicing:** Stripe for card payments (if client insists), otherwise direct invoice with bank details. Every invoice includes: SOW reference, itemised deliverables, payment terms, due date.

---

#### What The Numbers Mean (Revenue Scenarios)

##### Conservative (Year 1, 50% utilisation)

| Quarter | Work | Revenue |
|---------|------|---------|
| Q1 (Jul-Sep) | 2 × Single Agent (£8k) + 1 × Half-Day Consult (£600) | **£16,600** |
| Q2 (Oct-Dec) | 1 × Multi-Agent (£18k) + 2 × Architecture Review (£1.5k) | **£21,000** |
| Q3 (Jan-Mar) | 1 × Compliance Gate (£12k) + 1 × Governance Retainer (£3.5k × 3) | **£22,500** |
| Q4 (Apr-Jun) | 1 × Creative Tool (£18k) + 1 × Retainer (£3.5k × 3) | **£28,500** |
| **Total Year 1** | | **£88,600** |

This exceeds the £60k Q4 run-rate target. Even at 40% utilisation, Year 1 hits ~£70k.

##### Optimistic (Year 1, 65% utilisation)

| Scenario | Revenue |
|----------|---------|
| 4 × Tier 1 builds (avg £12k) | £48,000 |
| 6 months governance retainer (1 client) | £21,000 |
| 3 × Tier 3 builds (avg £15k) | £45,000 |
| 10 × Tier 4 consulting days | £10,000 |
| **Total** | **£124,000** |

---

#### Pricing Decisions Still To Make

1. **Publish prices on the site?** Lean **yes** for Tier 4 (day rates) and popular Tier 1 packages. It filters. Keep Tier 2/3 "enquire for quote" — they're scope-dependent.
2. **Currency display?** Lead with GBP. Show USD equivalent. Add JPY from Sep 2026.
3. **Retainer hours cap?** Governance retainer at £3,500/mo — how many hours? Recommend 15hrs/mo (effective £233/hr). Over that → day rate.
4. **Startup discount verification?** Just ask for proof of funding stage? Or trust-based?
5. **Minimum engagement?** Still £2,000? Or raise to £3,000 given the rate card?

---

## Day 4 — Thursday 2026-07-02: Positioning & Copy
*(TBD)*

## Day 5 — Friday 2026-07-03: Outreach Plan
*(TBD)*

---

*Last updated: 2026-07-01 10:00 BST*
