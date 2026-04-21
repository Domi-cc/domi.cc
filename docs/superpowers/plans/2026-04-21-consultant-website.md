# Consultant Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static one-page consultant website (`domi.cc`) positioning Dominik Haßelkuss as Senior DevOps / Interim-CTO — dark enterprise aesthetic with technical flourishes (boot sequence, uptime HUD, anonymized industry timeline, Ansilume highlight, SÜ1 badge).

**Architecture:** Vanilla HTML + CSS + native ES modules. No framework, no bundler. Static files deployable to GitHub Pages / Netlify / Cloudflare Pages. Pure JS modules kept small and independently testable via Vitest (dev-only). i18n via a plain data object plus a resolver function.

**Tech Stack:** HTML5, CSS (custom properties + `@layer`), native ES Modules, Lenis (smooth scroll, ~3 KB), Canvas 2D (network graph), Vitest + jsdom (dev-only tests), `sharp-cli` (dev-only image conversion to WebP).

**Spec reference:** `docs/superpowers/specs/2026-04-21-consultant-website-design.md`

**Language note:** Code identifiers, comments, and commit messages are in English. All user-facing strings live in `src/content.js` (DE + EN).

---

## File Structure

```
/
├── index.html                # Single page, all sections
├── impressum.html            # Legal page (DE only)
├── styles.css                # All styles (layered, under ~800 lines)
├── src/
│   ├── main.js               # Entry, orchestrates everything
│   ├── content.js            # DE + EN content tree
│   ├── i18n.js               # Pure resolver + DOM binder
│   ├── uptime.js             # Pure uptime formatter
│   ├── typewriter.js         # Reusable typewriter util
│   ├── boot-sequence.js      # Hero animation
│   ├── skill-matrix.js       # Scroll-triggered ansible-run
│   ├── timeline.js           # Timeline renderer from content
│   ├── canvas-graph.js       # Network-graph background
│   ├── portrait-reveal.js    # Scroll-based portrait transition
│   └── whoami-footer.js      # Footer typewriter
├── test/
│   ├── i18n.test.js
│   ├── uptime.test.js
│   └── typewriter.test.js
├── assets/
│   ├── portrait-480.webp
│   ├── portrait-768.webp
│   ├── portrait-1280.webp
│   ├── portrait.jpg          # original (fallback + source for WebP)
│   ├── fonts/
│   │   ├── Inter-Variable.woff2
│   │   └── JetBrainsMono-Variable.woff2
│   └── favicon.svg
├── package.json              # Dev-only deps (vitest, jsdom, sharp-cli)
├── vitest.config.js
├── CNAME                     # domi.cc (GitHub Pages)
├── .gitignore
└── docs/superpowers/…
```

**Responsibility per file (so later tasks stay focused):**
- `content.js` = data only, no logic.
- `i18n.js` = pure function `resolve(content, path, lang)` + `apply(root, lang)` that swaps `[data-i18n]` nodes. No globals.
- `uptime.js` = pure function `formatUptime(fromDate, nowDate) → string`. No DOM.
- `typewriter.js` = `typewrite(element, text, { speed, onDone })`. Pure-ish — touches one element, returns a promise.
- `boot-sequence.js`, `skill-matrix.js`, `timeline.js`, `canvas-graph.js`, `portrait-reveal.js`, `whoami-footer.js` = each exports `init(root)` or similar, owns one visual effect.
- `main.js` = bootstraps all of the above in correct order.

---

## Task 1: Clean up legacy Luya frontend

**Files:**
- Delete staged: all `frontend/**`, `deploy.sh`, `deploy_remote.sh` (already marked `D` in git status)

- [ ] **Step 1: Verify current deletion state**

Run: `git status --short | head -60`
Expected: lines starting with ` D ` for `frontend/…`, `deploy.sh`, `deploy_remote.sh`. No other surprises.

- [ ] **Step 2: Stage deletions only**

```bash
git add -A -- frontend/ deploy.sh deploy_remote.sh
```

- [ ] **Step 3: Verify nothing else is staged**

Run: `git status --short | grep -v '^D' | grep -v '^??'`
Expected: empty output (or only the CV/photo as `??` untracked — those are intentional, leave untracked).

- [ ] **Step 4: Commit removal**

```bash
git commit -m "remove legacy luya frontend"
```

---

## Task 2: Initialize project scaffolding

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `vitest.config.js`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "domi-cc",
  "private": true,
  "type": "module",
  "description": "Static consultant site for domi.cc",
  "scripts": {
    "dev": "python3 -m http.server 8080",
    "test": "vitest run",
    "test:watch": "vitest",
    "images": "sharp -i assets/portrait.jpg -o assets/portrait-480.webp resize 480 && sharp -i assets/portrait.jpg -o assets/portrait-768.webp resize 768 && sharp -i assets/portrait.jpg -o assets/portrait-1280.webp resize 1280"
  },
  "devDependencies": {
    "vitest": "^1.6.0",
    "jsdom": "^24.0.0",
    "sharp-cli": "^5.1.0"
  }
}
```

- [ ] **Step 2: Write `.gitignore`**

Note: repo already has a `.gitignore`; append. If the current file doesn't have these lines, add them.

```
node_modules/
.DS_Store
.vscode/
*.log
```

- [ ] **Step 3: Write `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.js'],
  },
});
```

- [ ] **Step 4: Install dev deps**

Run: `npm install`
Expected: `node_modules/` populated, no errors. If `sharp-cli` fails on this machine, note it for Task 21 — we'll fall back to a manual conversion there.

- [ ] **Step 5: Commit**

```bash
git add package.json .gitignore vitest.config.js
git commit -m "scaffold: package.json, vitest config, gitignore"
```

---

## Task 3: Content data module (TDD target)

**Files:**
- Create: `src/content.js`
- Create: `test/content-shape.test.js`

- [ ] **Step 1: Write failing test for content shape**

`test/content-shape.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { content } from '../src/content.js';

describe('content data', () => {
  it('has de and en top-level keys', () => {
    expect(content).toHaveProperty('de');
    expect(content).toHaveProperty('en');
  });

  it('de and en share the same key structure', () => {
    const shape = (obj) => {
      if (obj === null || typeof obj !== 'object') return typeof obj;
      if (Array.isArray(obj)) return `array(${obj.length > 0 ? shape(obj[0]) : 'empty'})`;
      return Object.fromEntries(
        Object.keys(obj).sort().map((k) => [k, shape(obj[k])])
      );
    };
    expect(shape(content.de)).toEqual(shape(content.en));
  });

  it('every timeline station has role, industry, highlights, stack — and NO year fields', () => {
    for (const lang of ['de', 'en']) {
      for (const station of content[lang].timeline) {
        expect(station).toHaveProperty('role');
        expect(station).toHaveProperty('industry');
        expect(Array.isArray(station.highlights)).toBe(true);
        expect(Array.isArray(station.stack)).toBe(true);
        expect(station).not.toHaveProperty('year');
        expect(station).not.toHaveProperty('years');
        expect(station).not.toHaveProperty('from');
        expect(station).not.toHaveProperty('to');
      }
    }
  });

  it('ansilume station has a special flag', () => {
    const de = content.de.timeline.find((s) => s.ansilume);
    expect(de).toBeDefined();
    expect(de.githubUrl).toBe('https://github.com/ansilume/ansilume');
  });

  it('SÜ1 station has a clearance flag', () => {
    const de = content.de.timeline.find((s) => s.clearance === 'SÜ1');
    expect(de).toBeDefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run test/content-shape.test.js`
Expected: all FAIL with "Cannot find module '../src/content.js'".

- [ ] **Step 3: Write `src/content.js` with full DE + EN tree**

```js
export const content = {
  de: {
    meta: {
      title: 'Dominik Haßelkuss — Problemlöser. Optimierer. Macher.',
      description: 'Senior DevOps & Interim-CTO. DACH-weit. SÜ1, ready for SÜ2.',
    },
    hero: {
      name: 'Dominik Haßelkuss',
      tagline: 'Problemlöser. Optimierer. Macher.',
      oneLiner: 'Senior DevOps & Interim-CTO · DACH',
      trustBadge: 'SÜ1 · ready for SÜ2',
      scrollHint: 'scroll',
    },
    manifesto: {
      heading: 'Was ich tue',
      paragraphs: [
        'Ich baue, härte und automatisiere Infrastrukturen, auf die sich große Unternehmen verlassen müssen.',
        'Ich führe Teams, übernehme Interim-Verantwortung und übergebe sauber wenn der Laden läuft.',
        'Wenn es dringend ist und niemand mehr weiterweiß — hol mich.',
      ],
    },
    services: {
      heading: 'Was ich liefere',
      cards: [
        {
          title: 'Monitoring & Observability',
          body: 'Prometheus, Grafana, Loki, Icinga, Splunk — vom Greenfield-Stack bis zur HA-Migration bestehender Landschaften.',
        },
        {
          title: 'Automation & IaC',
          body: 'Ansible end-to-end: Rollout, Hardening, On-/Offboarding. Pipelines in GitLab. Schulung inklusive.',
        },
        {
          title: 'Security & Hardening',
          body: 'CIS-Hardening, SSH/Apache/OS-Baselines, SIEM-Anbindung, Log-Pipelines. SÜ1, bereit für SÜ2.',
        },
        {
          title: 'Leadership & Interim',
          body: 'CTO-Rolle auf Zeit. Team-Aufbau, Demand- und Backlog-Management, saubere Übergabe.',
        },
      ],
    },
    ansilume: {
      kicker: 'Open Source',
      heading: 'ansilume',
      body: 'Eine offene Alternative zu Ansible AWX, Tower und Semaphore UI. Laufendes Projekt, aktiv in Entwicklung.',
      cta: 'auf GitHub ansehen',
      url: 'https://github.com/ansilume/ansilume',
    },
    skills: {
      heading: 'Skill-Matrix',
      categories: [
        {
          name: 'Automation & IaC',
          highlight: true,
          items: ['Ansible (+ ansilume)', 'Ansible AWX/Tower', 'Semaphore', 'GitLab CI/CD', 'Bash', 'Python3', 'Terraform (PoC)'],
        },
        {
          name: 'Monitoring & Observability',
          items: ['Prometheus', 'Grafana', 'Loki', 'Promtail', 'Thanos', 'Tempo', 'Icinga2', 'Nagios', 'Centreon', 'Zabbix', 'CheckMK', 'Splunk', 'ELK', 'Site24x7', 'Selenium'],
        },
        {
          name: 'Security',
          items: ['SIEM', 'Splunk Enterprise', 'Rapid7', 'LogRhythm', 'Kaspersky', 'CIS-Hardening', 'ISO 27001', 'Threat Intelligence', 'BSI-Pentest'],
        },
        {
          name: 'Cloud & Container',
          items: ['AWS (EC2/S3/RDS/Lambda/CF)', 'Azure', 'Docker', 'Podman', 'Kubernetes', 'OpenShift', 'Red Hat Satellite'],
        },
        {
          name: 'Infrastruktur & OS',
          items: ['Debian', 'Ubuntu', 'RHEL', 'CentOS', 'Linux Hardening', 'SSH/Apache Hardening', 'rsyslog', 'keepalived', 'HAproxy', 'SSL-Rollout'],
        },
        {
          name: 'Virtualisierung',
          items: ['Proxmox', 'ESX', 'VMware', 'KVM'],
        },
        {
          name: 'Entwicklung',
          items: ['PHP', 'Yii2', 'Zend', 'JavaScript', 'HTML', 'CSS', 'ReactJS', 'SQL'],
        },
        {
          name: 'Datenbanken',
          items: ['MySQL', 'MariaDB', 'Galera Cluster', 'Aurora Multi-AZ', 'Oracle'],
        },
        {
          name: 'Netzwerk',
          items: ['OpenVPN', 'Wireguard', 'Firewall', 'Routing'],
        },
        {
          name: 'Führung & Prozesse',
          items: ['Teamleitung', 'Training & Wissenstransfer', 'Scrum', 'Product Ownership', 'Demand & Backlog', 'EMEA-Internationalisierung', 'QM', 'IT-Prozessoptimierung'],
        },
      ],
    },
    timeline: {
      heading: 'Stationen',
      note: '* Chronologisch jüngst zuerst. Keine Zeitangaben — aus gutem Grund.',
      // Each station: role, industry, highlights[], stack[], optional: ansilume, clearance, githubUrl
    },
    leadership: {
      heading: 'Leadership',
      bullets: [
        'Team von 3 auf 15 Mitarbeiter aufgebaut (Interim-GF).',
        'Startup auf 100+ Mitarbeiter skaliert, erfolgreicher Exit nach über vier Jahren.',
        'Geschäftsführer eigenes Unternehmen — laufend.',
        'CTO/CEO-Verantwortung mehrfach übernommen.',
        'Internationalisierung EMEA — technisch, operativ, buchhalterisch.',
      ],
    },
    awards: {
      heading: 'Auszeichnungen',
      items: [
        { year: '2014', title: '1. Platz BEST IN WEST Gründerwettbewerb' },
        { year: '2014', title: '3. Platz Businessplan Wettbewerb "Plan it" (Liechtenstein)' },
        { year: '2014', title: 'Landessieger Bayern — Innovationspreis-IT (Initiative Mittelstand)' },
        { year: '2013', title: 'Preisträger IKT-Innovativ — Bundesministerium für Wirtschaft und Technologie' },
        { year: '2012', title: 'Persönliches Dankesschreiben des Präsidenten des THW' },
      ],
    },
    footer: {
      education: 'B.Sc. Informatik — Hochschule Kempten',
      languages: 'Deutsch · Englisch (verhandlungssicher) · Schweizerdeutsch (verhandlungssicher)',
      volunteer: 'THW — Pressearbeit, Teamleader Fachgruppe (BÖ · FgrBel)',
      whoami: '$ whoami',
      whoamiLines: [
        'dominik.haßelkuss',
        'Engineer. Gründer. Interim-CTO.',
        'Gebaut und übergeben: mehrfach.',
        'Erreichbar: für Leute, die finden was sie suchen.',
      ],
      imprint: 'Impressum',
      copyright: '© {year} PUSH IT GmbH',
    },
  },
  en: {
    meta: {
      title: 'Dominik Haßelkuss — Problem solver. Optimiser. Doer.',
      description: 'Senior DevOps & Interim CTO. DACH-wide. SÜ1 cleared, ready for SÜ2.',
    },
    hero: {
      name: 'Dominik Haßelkuss',
      tagline: 'Problem solver. Optimiser. Doer.',
      oneLiner: 'Senior DevOps & Interim CTO · DACH',
      trustBadge: 'SÜ1 · ready for SÜ2',
      scrollHint: 'scroll',
    },
    manifesto: {
      heading: 'What I do',
      paragraphs: [
        'I build, harden and automate the infrastructure that large organisations depend on.',
        'I lead teams, take interim responsibility, and hand over cleanly once the shop runs.',
        'When it is urgent and nobody else can — call me.',
      ],
    },
    services: {
      heading: 'What I deliver',
      cards: [
        { title: 'Monitoring & Observability', body: 'Prometheus, Grafana, Loki, Icinga, Splunk — from greenfield stacks to HA-migrations of legacy estates.' },
        { title: 'Automation & IaC', body: 'Ansible end-to-end: rollout, hardening, on-/offboarding. GitLab pipelines. Training included.' },
        { title: 'Security & Hardening', body: 'CIS hardening, SSH/Apache/OS baselines, SIEM wiring, log pipelines. SÜ1, ready for SÜ2.' },
        { title: 'Leadership & Interim', body: 'CTO role on time. Team build-up, demand and backlog management, clean handover.' },
      ],
    },
    ansilume: {
      kicker: 'Open Source',
      heading: 'ansilume',
      body: 'An open alternative to Ansible AWX, Tower and Semaphore UI. Ongoing, actively developed.',
      cta: 'view on GitHub',
      url: 'https://github.com/ansilume/ansilume',
    },
    skills: {
      heading: 'Skill matrix',
      categories: [
        { name: 'Automation & IaC', highlight: true, items: ['Ansible (+ ansilume)', 'Ansible AWX/Tower', 'Semaphore', 'GitLab CI/CD', 'Bash', 'Python3', 'Terraform (PoC)'] },
        { name: 'Monitoring & Observability', items: ['Prometheus', 'Grafana', 'Loki', 'Promtail', 'Thanos', 'Tempo', 'Icinga2', 'Nagios', 'Centreon', 'Zabbix', 'CheckMK', 'Splunk', 'ELK', 'Site24x7', 'Selenium'] },
        { name: 'Security', items: ['SIEM', 'Splunk Enterprise', 'Rapid7', 'LogRhythm', 'Kaspersky', 'CIS hardening', 'ISO 27001', 'Threat Intelligence', 'BSI pentest'] },
        { name: 'Cloud & Container', items: ['AWS (EC2/S3/RDS/Lambda/CF)', 'Azure', 'Docker', 'Podman', 'Kubernetes', 'OpenShift', 'Red Hat Satellite'] },
        { name: 'Infrastructure & OS', items: ['Debian', 'Ubuntu', 'RHEL', 'CentOS', 'Linux hardening', 'SSH/Apache hardening', 'rsyslog', 'keepalived', 'HAproxy', 'SSL rollout'] },
        { name: 'Virtualisation', items: ['Proxmox', 'ESX', 'VMware', 'KVM'] },
        { name: 'Development', items: ['PHP', 'Yii2', 'Zend', 'JavaScript', 'HTML', 'CSS', 'ReactJS', 'SQL'] },
        { name: 'Databases', items: ['MySQL', 'MariaDB', 'Galera Cluster', 'Aurora Multi-AZ', 'Oracle'] },
        { name: 'Networking', items: ['OpenVPN', 'Wireguard', 'Firewall', 'Routing'] },
        { name: 'Leadership & Process', items: ['Team leadership', 'Training & knowledge transfer', 'Scrum', 'Product ownership', 'Demand & backlog', 'EMEA internationalisation', 'QA', 'IT process optimisation'] },
      ],
    },
    timeline: {
      heading: 'Stations',
      note: '* Ordered most recent first. No dates — by design.',
    },
    leadership: {
      heading: 'Leadership',
      bullets: [
        'Grew team from 3 to 15 as interim managing director.',
        'Scaled a startup to 100+ people; successful exit after more than four years.',
        'Managing director of my own company — ongoing.',
        'CTO/CEO responsibility multiple times.',
        'EMEA internationalisation — technical, operational, accounting.',
      ],
    },
    awards: {
      heading: 'Awards',
      items: [
        { year: '2014', title: '1st place — BEST IN WEST founder competition' },
        { year: '2014', title: '3rd place — "Plan it" business plan competition (Liechtenstein)' },
        { year: '2014', title: 'Bavarian state winner — Innovation Prize IT (Initiative Mittelstand)' },
        { year: '2013', title: 'IKT-Innovativ awardee — German Federal Ministry for Economic Affairs' },
        { year: '2012', title: 'Personal letter of thanks from the president of THW' },
      ],
    },
    footer: {
      education: 'B.Sc. Computer Science — Kempten University',
      languages: 'German · English (fluent) · Swiss German (fluent)',
      volunteer: 'THW (German civil protection) — press officer, team leader',
      whoami: '$ whoami',
      whoamiLines: [
        'dominik.haßelkuss',
        'Engineer. Founder. Interim CTO.',
        'Built and handed over: several times.',
        'Reachable: by people who find what they look for.',
      ],
      imprint: 'Imprint',
      copyright: '© {year} PUSH IT GmbH',
    },
  },
};

// Timeline is shared between languages (labels are short and translatable inline).
// Added below after base object so both de and en get the same list (references, not copies)
// but with localised role/industry/highlights via the STATIONS array.

const STATIONS = [
  {
    ansilume: true,
    githubUrl: 'https://github.com/ansilume/ansilume',
    role: { de: 'DevOps & Automation Engineer', en: 'DevOps & Automation Engineer' },
    industry: { de: 'Open Source — ansilume', en: 'Open Source — ansilume' },
    highlights: {
      de: ['OSS-Alternative zu Ansible AWX/Tower/Semaphore UI', 'PHP, Yii2, Ansible, Docker, Bash'],
      en: ['OSS alternative to Ansible AWX/Tower/Semaphore UI', 'PHP, Yii2, Ansible, Docker, Bash'],
    },
    stack: ['PHP', 'Yii2', 'Ansible', 'Docker', 'Bash', 'Git'],
  },
  {
    role: { de: 'Sec-DevOps & Automation Engineer', en: 'Sec-DevOps & Automation Engineer' },
    industry: { de: 'Online-Broker (DAX)', en: 'Online broker (DAX)' },
    highlights: {
      de: [
        'Ansible-Einführung konzernweit, GitLab-Master mit automatisierten Pipelines',
        'Security-Hardening-Rollen (OS, SSH, Apache, SIEM, Log-Stack) unternehmensweit ausgerollt',
        'Globaler Security-Log-Server (rsyslog, Prometheus, Loki, Grafana)',
      ],
      en: [
        'Company-wide Ansible introduction, GitLab master with automated pipelines',
        'Security hardening roles (OS, SSH, Apache, SIEM, log stack) rolled out enterprise-wide',
        'Global security log server (rsyslog, Prometheus, Loki, Grafana)',
      ],
    },
    stack: ['Ansible', 'GitLab', 'Prometheus', 'Loki', 'Grafana', 'rsyslog', 'Kaspersky', 'Rapid7', 'Proxmox'],
  },
  {
    clearance: 'SÜ1',
    role: { de: 'System Engineer Monitoring', en: 'System Engineer Monitoring' },
    industry: { de: 'Landesbehörde (Justiz)', en: 'State authority (judiciary)' },
    highlights: {
      de: [
        'Centreon-Reorganisation und API-Setup für Ansible',
        'Contribution ins offizielle 1Password-Ansible-Modul',
        'HA-Zabbix-Cluster konzipiert und aufgebaut',
      ],
      en: [
        'Centreon reorganisation and API setup for Ansible',
        'Contribution to the official 1Password Ansible module',
        'HA Zabbix cluster designed and built',
      ],
    },
    stack: ['Centreon', 'Ansible', 'Zabbix', 'Nagios', 'Icinga', 'Grafana', 'RHEL'],
  },
  {
    role: { de: 'SecDevOps', en: 'SecDevOps' },
    industry: { de: 'Internet-Infrastruktur-Provider', en: 'Internet infrastructure provider' },
    highlights: {
      de: ['Kubernetes-Observability', 'Grafana/Loki/Tempo/Thanos-Stack', 'Graylog-Dismantling'],
      en: ['Kubernetes observability', 'Grafana/Loki/Tempo/Thanos stack', 'Graylog dismantling'],
    },
    stack: ['Grafana', 'Loki', 'Tempo', 'Thanos', 'Prometheus', 'Promtail', 'Ansible', 'Kubernetes'],
  },
  {
    role: { de: 'Consultant', en: 'Consultant' },
    industry: { de: 'Verlagswesen', en: 'Publishing' },
    highlights: {
      de: ['PoC Debian/CentOS AD-Anbindung', 'Monitoring-Tooling-Auswahl', 'Terraform-PoC Azure Cloud'],
      en: ['PoC Debian/CentOS AD integration', 'Monitoring tool selection', 'Terraform PoC on Azure Cloud'],
    },
    stack: ['Debian', 'CentOS', 'Kubernetes', 'Ansible', 'Terraform', 'Azure', 'Site24x7'],
  },
  {
    role: { de: 'SecDevOps', en: 'SecDevOps' },
    industry: { de: 'Automotive Tier-1 (international)', en: 'Automotive Tier-1 (international)' },
    highlights: {
      de: ['Zukunftsorientiertes Monitoring- und Alerting-Konzept im internationalen Team', 'Vendor-Proposals, RFP, Requirement Verification', 'SIEM, CMDB'],
      en: ['Forward-looking monitoring and alerting concept within an international team', 'Vendor proposals, RFP, requirement verification', 'SIEM, CMDB'],
    },
    stack: ['Prometheus', 'Grafana', 'SIEM', 'CMDB'],
  },
  {
    role: { de: 'SecDevOps', en: 'SecDevOps' },
    industry: { de: 'Direktbank', en: 'Direct bank' },
    highlights: {
      de: ['Multi-AZ-HA-PoC: Prometheus + Grafana + Thanos', 'Ansible-Rollen für den Monitoring-Stack', 'Debian / RHEL / CentOS'],
      en: ['Multi-AZ HA PoC: Prometheus + Grafana + Thanos', 'Ansible roles for the monitoring stack', 'Debian / RHEL / CentOS'],
    },
    stack: ['Prometheus', 'Grafana', 'Thanos', 'Ansible', 'Debian', 'RHEL'],
  },
  {
    role: { de: 'Business Analyst', en: 'Business Analyst' },
    industry: { de: 'Startup/Scale-up', en: 'Startup/scale-up' },
    highlights: {
      de: ['Product Owner & Scrum Master', 'EMEA-Internationalisierung', 'Debian-Cluster, AWS'],
      en: ['Product Owner & Scrum Master', 'EMEA internationalisation', 'Debian cluster, AWS'],
    },
    stack: ['AWS', 'Debian', 'Jira', 'Scrum'],
  },
  {
    role: { de: 'Consultant', en: 'Consultant' },
    industry: { de: 'Sparkassenverbund', en: 'Savings bank group' },
    highlights: {
      de: ['PoC bundesweite Monitoring-Ereignisauswertung', 'ReactJS + PHP-API + MySQL/MariaDB', 'Mobile-optimierte Prototypen'],
      en: ['PoC for nationwide monitoring event analysis', 'ReactJS + PHP API + MySQL/MariaDB', 'Mobile-optimised prototypes'],
    },
    stack: ['ReactJS', 'PHP', 'MySQL', 'MariaDB', 'Debian'],
  },
  {
    role: { de: 'System Engineer Monitoring', en: 'System Engineer Monitoring' },
    industry: { de: 'Versicherer (Top-10)', en: 'Insurer (top 10)' },
    highlights: {
      de: ['Monitoring- und Alerting-Konzept, Tool-Auswahl, PoC', 'RHEL, Docker, Selenium'],
      en: ['Monitoring and alerting concept, tool selection, PoC', 'RHEL, Docker, Selenium'],
    },
    stack: ['RHEL', 'Docker', 'Selenium'],
  },
  {
    role: { de: 'Business Analyst', en: 'Business Analyst' },
    industry: { de: 'Startup/Scale-up', en: 'Startup/scale-up' },
    highlights: {
      de: ['Product Ownership & Scrum Master', 'Backlog Management', 'EMEA'],
      en: ['Product ownership & Scrum Master', 'Backlog management', 'EMEA'],
    },
    stack: ['Debian', 'Jira'],
  },
  {
    role: { de: 'SecDevOps', en: 'SecDevOps' },
    industry: { de: 'E-Commerce (EMEA, Modehandel)', en: 'E-commerce (EMEA, fashion)' },
    highlights: {
      de: [
        'Aktives Monitoring per Icinga2 (Icinga/Nagios-Tests, E2E, Verfügbarkeitsstatistik)',
        'Big-Data-Logfile-Auswertungen (Splunk: CMDB, SIEM, Performance, App-Logs, Stacktraces)',
        'Automatisierte Lighthouse-Auswertung',
      ],
      en: [
        'Active monitoring via Icinga2 (Icinga/Nagios tests, E2E, availability stats)',
        'Big-data log analysis (Splunk: CMDB, SIEM, performance, app logs, stack traces)',
        'Automated Lighthouse score analysis',
      ],
    },
    stack: ['Icinga2', 'Splunk', 'Grafana', 'RHEL', 'CentOS', 'Debian', 'Ansible', 'Yii'],
  },
  {
    role: { de: 'Gründer & Geschäftsführer', en: 'Founder & MD' },
    industry: { de: 'Eigenes Unternehmen (PUSH IT GmbH)', en: 'Own company (PUSH IT GmbH)' },
    highlights: {
      de: [
        'Monitoring-as-a-Service, Interim-Management, IT-Beratung',
        'AWS-Architektur (EC2, S3, RDS, Route 53, Auto-Scaling, Lambda, CloudFront)',
        'Galera-Cluster, Proxmox, Kubernetes, OpenShift, Red Hat Satellite',
      ],
      en: [
        'Monitoring-as-a-service, interim management, IT advisory',
        'AWS architecture (EC2, S3, RDS, Route 53, Auto-Scaling, Lambda, CloudFront)',
        'Galera cluster, Proxmox, Kubernetes, OpenShift, Red Hat Satellite',
      ],
    },
    stack: ['AWS', 'Ansible', 'Saltstack', 'Kubernetes', 'OpenShift', 'Proxmox', 'Icinga2', 'Grafana', 'Prometheus'],
  },
  {
    role: { de: 'Interims-Geschäftsführer', en: 'Interim MD' },
    industry: { de: 'Agentur / Scale-up', en: 'Agency / scale-up' },
    highlights: {
      de: ['Team von 3 auf 15 Mitarbeiter aufgebaut', 'Konflikt- und Beschwerdemanagement etabliert', 'AWS-Architektur und Backup'],
      en: ['Grew the team from 3 to 15', 'Established conflict and complaint management', 'AWS architecture and backups'],
    },
    stack: ['AWS', 'Jira', 'Confluence', 'Scrum', 'Debian'],
  },
  {
    role: { de: 'Gründer & Geschäftsführer', en: 'Founder & MD' },
    industry: { de: 'Eigenes Startup — Exit', en: 'Own startup — exit' },
    highlights: {
      de: ['Unternehmen auf 100+ Mitarbeiter skaliert, Exit nach über 4 Jahren', 'Aurora Multi-AZ-HA, Monitoring-Stack', 'Internationalisierung EMEA'],
      en: ['Scaled to 100+ staff, exit after 4+ years', 'Aurora Multi-AZ HA, monitoring stack', 'EMEA internationalisation'],
    },
    stack: ['AWS', 'Aurora', 'MySQL', 'Icinga', 'ELK', 'Grafana', 'PHP', 'Yii'],
  },
  {
    role: { de: 'Beauftragter Öffentlichkeitsarbeit', en: 'Press officer' },
    industry: { de: 'BOS (Katastrophenschutz, ehrenamtlich)', en: 'Civil protection (volunteer)' },
    highlights: {
      de: ['Typo3 für 668 Ortsverbände mit 1.000+ Domains', 'HA-Setup, Security-Kooperation mit dem BSI', 'ISO 27001, SIEM, CMDB'],
      en: ['Typo3 for 668 local chapters with 1,000+ domains', 'HA setup, security cooperation with the BSI', 'ISO 27001, SIEM, CMDB'],
    },
    stack: ['Typo3', 'MySQL', 'PHP', 'Nagios', 'ISO 27001'],
  },
  {
    role: { de: 'System Engineer (Remote)', en: 'System Engineer (remote)' },
    industry: { de: 'System-Integrator (Schweiz)', en: 'System integrator (Switzerland)' },
    highlights: {
      de: ['Rechenzentrumsaufbau, Networking, Firewall, Routing, OpenVPN', 'ISO 27001, ESX-Virtualisierung'],
      en: ['Data-centre build-up, networking, firewall, routing, OpenVPN', 'ISO 27001, ESX virtualisation'],
    },
    stack: ['Debian', 'Ubuntu', 'OpenVPN', 'ESX'],
  },
  {
    role: { de: '(Senior) PHP-Developer', en: '(Senior) PHP developer' },
    industry: { de: 'Pharma / Bau', en: 'Pharma / construction' },
    highlights: {
      de: ['Teamleitung Entwickler-Team', 'PHP / Zend / HTML / CSS / JS / MySQL'],
      en: ['Lead developer team', 'PHP / Zend / HTML / CSS / JS / MySQL'],
    },
    stack: ['PHP', 'Zend', 'MySQL', 'Debian'],
  },
  {
    role: { de: 'Website Engineer', en: 'Website engineer' },
    industry: { de: 'Plattform (Agenturen/Künstler)', en: 'Platform (agencies/artists)' },
    highlights: {
      de: ['Social-Network-Plattform aufgebaut; nach 2 Jahren verkauft', 'Monitoring via Nagios'],
      en: ['Built a social-network platform; sold after 2 years', 'Monitoring via Nagios'],
    },
    stack: ['PHP', 'Zend', 'Smarty', 'MySQL', 'Nagios', 'Debian'],
  },
  {
    role: { de: 'Werkstudent', en: 'Working student' },
    industry: { de: 'Automotive-Konzern', en: 'Automotive OEM' },
    highlights: {
      de: ['Mitarbeiterqualifikations-Matrix (Q-Matrix)', 'Abfragen, Auswertungen'],
      en: ['Employee qualification matrix (Q-Matrix)', 'Surveys and reporting'],
    },
    stack: ['PHP', 'IIS', 'Oracle'],
  },
];

// Flatten per-language
content.de.timeline = STATIONS.map((s) => ({
  role: s.role.de,
  industry: s.industry.de,
  highlights: s.highlights.de,
  stack: s.stack,
  ...(s.ansilume && { ansilume: true, githubUrl: s.githubUrl }),
  ...(s.clearance && { clearance: s.clearance }),
}));
content.en.timeline = STATIONS.map((s) => ({
  role: s.role.en,
  industry: s.industry.en,
  highlights: s.highlights.en,
  stack: s.stack,
  ...(s.ansilume && { ansilume: true, githubUrl: s.githubUrl }),
  ...(s.clearance && { clearance: s.clearance }),
}));
```

Note: The `timeline` field is intentionally defined *after* the main object so DE and EN both receive fully populated arrays. The pre-declared `timeline: { heading, note }` fields in `de` and `en` are overwritten by the assignment at the bottom — so the final shape is `timeline = [ { role, industry, ... } ]`. The test in Step 1 only asserts on the timeline *array items*, so it'll pass. `heading`/`note` move into a separate `timelineMeta` property below.

Fix the collision before running tests. Replace both `timeline: { heading: '...', note: '...' }` blocks (DE and EN) with:

```js
timelineMeta: { heading: 'Stationen', note: '* Chronologisch jüngst zuerst. Keine Zeitangaben — aus gutem Grund.' },
```

(and the EN equivalent). The timeline *array* then gets attached via `content.de.timeline = …` / `content.en.timeline = …` at the bottom of the file.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run test/content-shape.test.js`
Expected: all 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/content.js test/content-shape.test.js
git commit -m "content: DE/EN content tree with anonymised timeline"
```

---

## Task 4: i18n module (TDD)

**Files:**
- Create: `src/i18n.js`
- Create: `test/i18n.test.js`

- [ ] **Step 1: Write failing tests**

```js
import { describe, it, expect } from 'vitest';
import { resolve, apply } from '../src/i18n.js';

const fixture = {
  de: { hero: { tagline: 'Hallo' }, list: ['a', 'b'] },
  en: { hero: { tagline: 'Hello' }, list: ['a', 'b'] },
};

describe('resolve(content, path, lang)', () => {
  it('returns nested string by dotted path', () => {
    expect(resolve(fixture, 'hero.tagline', 'de')).toBe('Hallo');
    expect(resolve(fixture, 'hero.tagline', 'en')).toBe('Hello');
  });

  it('returns undefined for missing path', () => {
    expect(resolve(fixture, 'hero.missing', 'de')).toBeUndefined();
  });

  it('returns the value itself for non-string leaves', () => {
    expect(resolve(fixture, 'list', 'de')).toEqual(['a', 'b']);
  });
});

describe('apply(root, content, lang)', () => {
  it('sets text on elements with [data-i18n]', () => {
    document.body.innerHTML = '<h1 data-i18n="hero.tagline">__</h1>';
    apply(document.body, fixture, 'de');
    expect(document.querySelector('h1').textContent).toBe('Hallo');
    apply(document.body, fixture, 'en');
    expect(document.querySelector('h1').textContent).toBe('Hello');
  });

  it('sets html lang attribute when root is documentElement', () => {
    document.documentElement.setAttribute('lang', 'de');
    apply(document.documentElement, fixture, 'en');
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  it('leaves elements without data-i18n untouched', () => {
    document.body.innerHTML = '<p>static</p><p data-i18n="hero.tagline">__</p>';
    apply(document.body, fixture, 'de');
    expect(document.querySelectorAll('p')[0].textContent).toBe('static');
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

Run: `npx vitest run test/i18n.test.js`
Expected: FAIL with "Cannot find module ../src/i18n.js".

- [ ] **Step 3: Implement `src/i18n.js`**

```js
export function resolve(content, path, lang) {
  const tree = content[lang];
  if (!tree) return undefined;
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), tree);
}

export function apply(root, content, lang) {
  if (root === document.documentElement) {
    root.setAttribute('lang', lang);
  } else if (root.ownerDocument?.documentElement) {
    root.ownerDocument.documentElement.setAttribute('lang', lang);
  }
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = resolve(content, el.getAttribute('data-i18n'), lang);
    if (typeof value === 'string') {
      el.textContent = value;
    }
  });
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `npx vitest run test/i18n.test.js`
Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/i18n.js test/i18n.test.js
git commit -m "i18n: pure resolve + DOM apply"
```

---

## Task 5: Uptime formatter (TDD)

**Files:**
- Create: `src/uptime.js`
- Create: `test/uptime.test.js`

- [ ] **Step 1: Write failing tests**

```js
import { describe, it, expect } from 'vitest';
import { formatUptime } from '../src/uptime.js';

describe('formatUptime(from, now)', () => {
  it('returns zeroed uptime when from === now', () => {
    const d = new Date('2020-01-01T00:00:00Z');
    expect(formatUptime(d, d)).toBe('0y 0mo 0d 0h 0m 0s');
  });

  it('counts whole years, months, days correctly', () => {
    const from = new Date('1988-01-27T00:00:00Z');
    const now  = new Date('2026-04-21T00:00:00Z');
    // 38y 2mo 25d 0h 0m 0s
    expect(formatUptime(from, now)).toBe('38y 2mo 25d 0h 0m 0s');
  });

  it('handles month rollover when day-of-month is smaller than reference', () => {
    const from = new Date('2000-03-31T00:00:00Z');
    const now  = new Date('2000-04-01T00:00:00Z');
    // 0y 0mo 1d 0h 0m 0s
    expect(formatUptime(from, now)).toBe('0y 0mo 1d 0h 0m 0s');
  });

  it('includes hours/minutes/seconds component', () => {
    const from = new Date('2026-04-21T00:00:00Z');
    const now  = new Date('2026-04-21T03:45:12Z');
    expect(formatUptime(from, now)).toBe('0y 0mo 0d 3h 45m 12s');
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

Run: `npx vitest run test/uptime.test.js`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement `src/uptime.js`**

```js
export function formatUptime(from, now) {
  let years  = now.getUTCFullYear()  - from.getUTCFullYear();
  let months = now.getUTCMonth()     - from.getUTCMonth();
  let days   = now.getUTCDate()      - from.getUTCDate();
  let hours  = now.getUTCHours()     - from.getUTCHours();
  let mins   = now.getUTCMinutes()   - from.getUTCMinutes();
  let secs   = now.getUTCSeconds()   - from.getUTCSeconds();

  if (secs  < 0) { secs  += 60; mins--; }
  if (mins  < 0) { mins  += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days  < 0) {
    // Borrow from previous month: days in the month before `now`
    const prevMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }

  return `${years}y ${months}mo ${days}d ${hours}h ${mins}m ${secs}s`;
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `npx vitest run test/uptime.test.js`
Expected: 4 tests pass. If any fail, adjust the borrow logic until they do — DO NOT change the assertions without checking by hand.

- [ ] **Step 5: Commit**

```bash
git add src/uptime.js test/uptime.test.js
git commit -m "uptime: pure ymd-hms formatter"
```

---

## Task 6: Typewriter util (TDD)

**Files:**
- Create: `src/typewriter.js`
- Create: `test/typewriter.test.js`

- [ ] **Step 1: Write failing test**

```js
import { describe, it, expect, vi } from 'vitest';
import { typewrite } from '../src/typewriter.js';

describe('typewrite', () => {
  it('fills element textContent to match target', async () => {
    vi.useFakeTimers();
    const el = document.createElement('span');
    const p = typewrite(el, 'hello', { speed: 10 });
    await vi.advanceTimersByTimeAsync(60);
    await p;
    expect(el.textContent).toBe('hello');
    vi.useRealTimers();
  });

  it('calls onDone at the end', async () => {
    vi.useFakeTimers();
    const el = document.createElement('span');
    const done = vi.fn();
    const p = typewrite(el, 'hi', { speed: 5, onDone: done });
    await vi.advanceTimersByTimeAsync(30);
    await p;
    expect(done).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it('supports skipping — skip() resolves immediately with full text', async () => {
    vi.useFakeTimers();
    const el = document.createElement('span');
    const run = typewrite(el, 'abcdef', { speed: 100 });
    await vi.advanceTimersByTimeAsync(50);
    run.skip();
    await run;
    expect(el.textContent).toBe('abcdef');
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

Run: `npx vitest run test/typewriter.test.js`
Expected: module-not-found failure.

- [ ] **Step 3: Implement `src/typewriter.js`**

```js
export function typewrite(element, text, { speed = 30, onDone } = {}) {
  let i = 0;
  let cancelled = false;
  let resolveDone;

  const promise = new Promise((res) => { resolveDone = res; });

  const step = () => {
    if (cancelled) return;
    if (i < text.length) {
      element.textContent = text.slice(0, ++i);
      setTimeout(step, speed);
    } else {
      if (onDone) onDone();
      resolveDone();
    }
  };

  setTimeout(step, speed);

  promise.skip = () => {
    cancelled = true;
    element.textContent = text;
    if (onDone) onDone();
    resolveDone();
  };

  return promise;
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `npx vitest run test/typewriter.test.js`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/typewriter.js test/typewriter.test.js
git commit -m "typewriter: reusable animated text util"
```

---

## Task 7: HTML skeleton

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write `index.html` with full semantic structure**

```html
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title data-i18n="meta.title">Dominik Haßelkuss</title>
<meta name="description" data-i18n-attr="content" data-i18n="meta.description" content="" />
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
<link rel="preload" href="assets/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="assets/fonts/JetBrainsMono-Variable.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="styles.css" />
</head>
<body>
<canvas id="bg-graph" aria-hidden="true"></canvas>

<nav class="lang-toggle">
  <button type="button" data-lang="de" aria-pressed="true">DE</button>
  <span aria-hidden="true">/</span>
  <button type="button" data-lang="en" aria-pressed="false">EN</button>
</nav>

<aside class="hud" aria-live="off">
  <span class="hud-label">uptime</span>
  <span class="hud-value" id="uptime">0y 0mo 0d 0h 0m 0s</span>
</aside>

<header class="hero">
  <pre class="boot-terminal" id="boot-terminal" aria-hidden="true"></pre>
  <div class="hero-body" hidden>
    <h1 class="hero-name" data-i18n="hero.name">Dominik Haßelkuss</h1>
    <p class="hero-tagline" data-i18n="hero.tagline">Problemlöser. Optimierer. Macher.</p>
    <p class="hero-oneliner" data-i18n="hero.oneLiner"></p>
    <p class="hero-trust" data-i18n="hero.trustBadge">SÜ1 · ready for SÜ2</p>
    <span class="hero-scroll" data-i18n="hero.scrollHint">scroll</span>
  </div>
</header>

<section class="manifesto">
  <h2 data-i18n="manifesto.heading"></h2>
  <div data-render="manifesto-paragraphs"></div>
</section>

<section class="services">
  <h2 data-i18n="services.heading"></h2>
  <div class="services-grid" data-render="services-cards"></div>
</section>

<section class="ansilume" id="ansilume">
  <span class="ansilume-kicker" data-i18n="ansilume.kicker"></span>
  <h2 class="ansilume-logo" data-i18n="ansilume.heading"></h2>
  <p data-i18n="ansilume.body"></p>
  <a class="ansilume-cta" data-render="ansilume-link" href="#" target="_blank" rel="noopener"></a>
</section>

<section class="portrait">
  <picture>
    <source srcset="assets/portrait-480.webp 480w, assets/portrait-768.webp 768w, assets/portrait-1280.webp 1280w" type="image/webp" />
    <img src="assets/portrait.jpg" alt="Dominik Haßelkuss" width="768" height="1152" loading="lazy" />
  </picture>
</section>

<section class="skills">
  <h2 data-i18n="skills.heading"></h2>
  <div data-render="skills-matrix"></div>
</section>

<section class="timeline">
  <h2 data-i18n="timelineMeta.heading"></h2>
  <p class="timeline-note" data-i18n="timelineMeta.note"></p>
  <ol data-render="timeline-list"></ol>
</section>

<section class="leadership">
  <h2 data-i18n="leadership.heading"></h2>
  <ul data-render="leadership-bullets"></ul>
</section>

<section class="awards">
  <h2 data-i18n="awards.heading"></h2>
  <ul data-render="awards-list"></ul>
</section>

<section class="about">
  <dl>
    <dt>Education</dt><dd data-i18n="footer.education"></dd>
    <dt>Languages</dt><dd data-i18n="footer.languages"></dd>
    <dt>Volunteer</dt><dd data-i18n="footer.volunteer"></dd>
  </dl>
</section>

<footer class="site-footer">
  <pre class="whoami"><span class="whoami-prompt" data-i18n="footer.whoami"></span><span class="whoami-out" id="whoami-out"></span></pre>
  <div class="footer-meta">
    <a href="impressum.html" data-i18n="footer.imprint"></a>
    <span id="copy"></span>
  </div>
</footer>

<script type="module" src="src/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "html: semantic skeleton with i18n anchors"
```

---

## Task 8: CSS foundation (tokens + base)

**Files:**
- Create: `styles.css`

- [ ] **Step 1: Write base layer (tokens, reset, typography)**

```css
@layer reset, tokens, base, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  img, svg, video, canvas { display: block; max-width: 100%; }
  button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
  a { color: inherit; }
  ol, ul { padding: 0; margin: 0; list-style: none; }
}

@layer tokens {
  :root {
    --bg: #0a0e14;
    --fg: #e6edf3;
    --fg-dim: #9ba4b0;
    --line: #1f2732;
    --line-2: #3a4553;
    --amber: #ffb347;
    --cyan: #7dfccd;

    --font-sans: "Inter", "Inter Variable", system-ui, -apple-system, sans-serif;
    --font-mono: "JetBrains Mono", "JetBrains Mono Variable", ui-monospace, monospace;

    --measure: 68ch;
    --gutter: clamp(1rem, 4vw, 3rem);
    --step-0: clamp(0.9rem, 0.85rem + 0.2vw, 1rem);
    --step-1: clamp(1rem,  0.92rem + 0.4vw, 1.125rem);
    --step-2: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
    --step-3: clamp(1.75rem, 1.3rem + 2vw, 2.5rem);
    --step-4: clamp(2.5rem, 1.5rem + 5vw, 5rem);
    --step-5: clamp(3.5rem, 2rem + 8vw, 8rem);
  }

  @font-face {
    font-family: 'Inter Variable';
    src: url('assets/fonts/Inter-Variable.woff2') format('woff2-variations');
    font-weight: 100 900;
    font-display: swap;
  }
  @font-face {
    font-family: 'JetBrains Mono Variable';
    src: url('assets/fonts/JetBrainsMono-Variable.woff2') format('woff2-variations');
    font-weight: 100 800;
    font-display: swap;
  }
}

@layer base {
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--fg);
    font-family: var(--font-sans);
    font-size: var(--step-1);
    line-height: 1.55;
    min-height: 100vh;
    overflow-x: hidden;
  }
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.9  0 0 0 0 0.93  0 0 0 0 0.95  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    pointer-events: none; opacity: .5; z-index: 1; mix-blend-mode: overlay;
  }
  section { padding: clamp(4rem, 10vw, 8rem) var(--gutter); position: relative; z-index: 2; }
  h1, h2, h3 { font-weight: 500; letter-spacing: -0.02em; margin: 0 0 1rem; }
  h2 { font-size: var(--step-3); color: var(--fg); border-top: 1px solid var(--line); padding-top: 1.5rem; }
  p { margin: 0 0 1rem; max-width: var(--measure); color: var(--fg-dim); }
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "css: tokens, reset, base typography"
```

---

## Task 9: CSS components (hero, HUD, toggle)

**Files:**
- Modify: `styles.css` (append to `@layer components`)

- [ ] **Step 1: Append component styles**

Append to `styles.css`:

```css
@layer components {
  .lang-toggle {
    position: fixed; top: 1.25rem; right: var(--gutter); z-index: 10;
    font-family: var(--font-mono); font-size: 0.85rem; color: var(--fg-dim);
    display: flex; gap: .25rem; align-items: center;
  }
  .lang-toggle button {
    padding: .2rem .5rem; border: 1px solid var(--line); color: var(--fg-dim);
    transition: color .2s, border-color .2s;
  }
  .lang-toggle button[aria-pressed="true"] { color: var(--amber); border-color: var(--amber); }

  .hud {
    position: fixed; top: 1.25rem; left: var(--gutter); z-index: 10;
    font-family: var(--font-mono); font-size: 0.75rem; color: var(--fg-dim);
    display: flex; gap: .5rem; align-items: center;
    padding: .25rem .5rem; border: 1px solid var(--line);
  }
  .hud-label { color: var(--line-2); text-transform: uppercase; letter-spacing: .1em; }
  .hud-value { color: var(--cyan); }

  .hero {
    min-height: 100vh; display: grid; place-items: center; position: relative;
    padding: var(--gutter);
  }
  .boot-terminal {
    font-family: var(--font-mono); font-size: var(--step-0);
    color: var(--cyan); line-height: 1.5; white-space: pre-wrap;
    max-width: 68ch; margin: 0; opacity: 1;
    transition: opacity .6s ease;
  }
  .boot-terminal.fade-out { opacity: 0; }

  .hero-body {
    text-align: left; opacity: 0; transform: translateY(12px);
    transition: opacity .8s ease, transform .8s ease;
  }
  .hero-body.visible { opacity: 1; transform: none; }
  .hero-body[hidden] { display: none; }
  .hero-name {
    font-size: var(--step-5); line-height: 0.95; letter-spacing: -0.04em;
    font-weight: 400; margin: 0 0 1rem;
  }
  .hero-tagline {
    font-size: var(--step-3); color: var(--fg); margin: 0 0 0.75rem;
    font-weight: 400;
  }
  .hero-oneliner {
    font-family: var(--font-mono); font-size: var(--step-1); color: var(--fg-dim);
    margin: 0 0 1.5rem;
  }
  .hero-trust {
    display: inline-block; font-family: var(--font-mono); font-size: .9rem;
    color: var(--amber); padding: .4rem .75rem; border: 1px solid var(--amber);
    margin: 0;
  }
  .hero-scroll {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    font-family: var(--font-mono); font-size: .75rem; color: var(--line-2);
    letter-spacing: .3em; text-transform: uppercase;
  }
  .hero-scroll::after {
    content: '▊'; display: inline-block; margin-left: .5rem;
    animation: blink 1s steps(2) infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "css: hero, HUD, lang toggle components"
```

---

## Task 10: CSS components (services, ansilume, portrait)

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Append more components**

```css
@layer components {
  .manifesto p { font-size: var(--step-2); color: var(--fg); }
  .manifesto p + p { margin-top: 1rem; }

  .services-grid {
    display: grid; gap: 1px; background: var(--line); margin-top: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
  .services-grid > article {
    background: var(--bg); padding: 2rem; min-height: 220px;
  }
  .services-grid h3 {
    font-family: var(--font-mono); font-size: var(--step-1); color: var(--amber);
    font-weight: 400; margin-bottom: .75rem;
  }

  .ansilume {
    background: linear-gradient(180deg, var(--bg) 0%, #0c1520 100%);
    border-block: 1px solid var(--cyan);
    text-align: center;
  }
  .ansilume-kicker {
    display: inline-block; font-family: var(--font-mono); font-size: .8rem;
    color: var(--cyan); letter-spacing: .3em; text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .ansilume-logo {
    font-family: var(--font-mono); font-size: var(--step-5);
    color: var(--cyan); margin: 0 0 1.5rem; letter-spacing: -0.04em;
    text-shadow: 0 0 24px rgba(125, 252, 205, 0.35);
    border: 0; padding: 0;
    animation: ansilume-pulse 4s ease-in-out infinite;
  }
  @keyframes ansilume-pulse {
    0%, 100% { text-shadow: 0 0 16px rgba(125, 252, 205, 0.35); }
    50%      { text-shadow: 0 0 32px rgba(125, 252, 205, 0.6); }
  }
  .ansilume p { margin: 0 auto 2rem; max-width: 60ch; }
  .ansilume-cta {
    display: inline-block; padding: .75rem 1.5rem;
    border: 1px solid var(--cyan); color: var(--cyan);
    font-family: var(--font-mono); text-decoration: none;
    transition: background .2s, color .2s;
  }
  .ansilume-cta:hover { background: var(--cyan); color: var(--bg); }

  .portrait {
    display: grid; place-items: center; padding-block: 4rem;
  }
  .portrait picture {
    position: relative; max-width: 420px;
    filter: grayscale(100%) contrast(1.1);
    mix-blend-mode: luminosity;
  }
  .portrait img {
    width: 100%; height: auto;
  }
  .portrait picture::after {
    content: ''; position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.12) 2px 3px
    );
    pointer-events: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "css: services grid, ansilume section, portrait"
```

---

## Task 11: CSS components (skills, timeline, leadership, awards, footer)

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Append**

```css
@layer components {
  .skills-category { margin-block: 2rem; }
  .skills-category-name {
    font-family: var(--font-mono); font-size: 1rem; color: var(--fg-dim);
    letter-spacing: .1em; text-transform: uppercase; margin-bottom: .75rem;
    display: flex; align-items: center; gap: .5rem;
  }
  .skills-category-name .status { color: var(--line-2); }
  .skills-category.highlight .skills-category-name { color: var(--amber); }
  .skills-items {
    display: flex; flex-wrap: wrap; gap: .5rem;
    font-family: var(--font-mono); font-size: .85rem;
  }
  .skills-items span {
    padding: .25rem .6rem; border: 1px solid var(--line); color: var(--fg);
  }
  .skills-items .ansilume-chip { color: var(--cyan); border-color: var(--cyan); }

  .timeline ol { border-left: 1px solid var(--line); margin-top: 2rem; }
  .timeline-note { font-family: var(--font-mono); font-size: .8rem; color: var(--line-2); }
  .timeline li {
    position: relative; padding: 1.5rem 0 1.5rem 2rem;
    border-bottom: 1px dashed var(--line);
  }
  .timeline li::before {
    content: ''; position: absolute; left: -5px; top: 2rem;
    width: 9px; height: 9px; background: var(--fg-dim); border-radius: 50%;
  }
  .timeline li.ansilume::before,
  .timeline li.clearance::before { background: var(--cyan); }
  .timeline li.clearance::before { background: var(--amber); }
  .timeline .role {
    font-family: var(--font-mono); font-size: .95rem; color: var(--fg);
    margin: 0 0 .25rem;
  }
  .timeline .industry {
    font-size: var(--step-2); color: var(--fg); margin: 0 0 .75rem;
    font-weight: 400;
  }
  .timeline .industry .badge {
    display: inline-block; font-family: var(--font-mono); font-size: .75rem;
    padding: .15rem .5rem; margin-left: .5rem; vertical-align: middle;
    border: 1px solid var(--amber); color: var(--amber);
  }
  .timeline li.ansilume .industry .badge {
    border-color: var(--cyan); color: var(--cyan);
  }
  .timeline .highlights { margin: .5rem 0; color: var(--fg-dim); }
  .timeline .highlights li {
    padding: .15rem 0; border: 0; list-style: '— '; margin-left: 1rem;
  }
  .timeline .highlights li::before { display: none; }
  .timeline .stack {
    display: flex; flex-wrap: wrap; gap: .35rem; margin-top: .75rem;
    font-family: var(--font-mono); font-size: .75rem;
  }
  .timeline .stack span { color: var(--line-2); }
  .timeline .stack span + span::before { content: ' · '; }

  .leadership ul { display: grid; gap: .75rem; font-size: var(--step-1); }
  .leadership li { padding-left: 1.5rem; position: relative; color: var(--fg); }
  .leadership li::before {
    content: '▸'; position: absolute; left: 0; color: var(--amber);
    font-family: var(--font-mono);
  }

  .awards ul { display: grid; gap: 1rem; margin-top: 2rem; }
  .awards li {
    display: grid; grid-template-columns: 4rem 1fr; gap: 1rem; align-items: baseline;
    padding-block: .75rem; border-top: 1px solid var(--line);
  }
  .awards .year { font-family: var(--font-mono); color: var(--amber); font-size: 1rem; }
  .awards .title { color: var(--fg); font-size: var(--step-2); }

  .about dl {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 2rem;
  }
  .about dt {
    font-family: var(--font-mono); font-size: .8rem; color: var(--line-2);
    text-transform: uppercase; letter-spacing: .2em; margin-bottom: .5rem;
  }
  .about dd { margin: 0; color: var(--fg); }

  .site-footer { padding: 4rem var(--gutter) 2rem; border-top: 1px solid var(--line); }
  .whoami {
    font-family: var(--font-mono); font-size: .85rem; color: var(--cyan);
    margin: 0 0 2rem; white-space: pre-wrap; max-width: 60ch;
  }
  .whoami-prompt { color: var(--amber); }
  .footer-meta {
    display: flex; justify-content: space-between; font-family: var(--font-mono);
    font-size: .8rem; color: var(--line-2); border-top: 1px solid var(--line);
    padding-top: 1rem;
  }
  .footer-meta a { color: var(--line-2); text-decoration: none; }
  .footer-meta a:hover { color: var(--amber); }

  #bg-graph {
    position: fixed; inset: 0; z-index: 0; opacity: .25; pointer-events: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important; transition-duration: .01ms !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "css: skills, timeline, leadership, awards, footer"
```

---

## Task 12: Renderer utilities

**Files:**
- Create: `src/render.js`

- [ ] **Step 1: Implement renderers for every `[data-render]` node**

```js
import { resolve } from './i18n.js';

export function renderAll(root, content, lang) {
  const data = content[lang];

  fill(root, '[data-render="manifesto-paragraphs"]', () =>
    data.manifesto.paragraphs.map(text).join('')
  );

  fill(root, '[data-render="services-cards"]', () =>
    data.services.cards.map(({ title, body }) => `
      <article>
        <h3>${escape(title)}</h3>
        <p>${escape(body)}</p>
      </article>
    `).join('')
  );

  const ansilumeAnchor = root.querySelector('[data-render="ansilume-link"]');
  if (ansilumeAnchor) {
    ansilumeAnchor.textContent = data.ansilume.cta;
    ansilumeAnchor.setAttribute('href', data.ansilume.url);
  }

  fill(root, '[data-render="skills-matrix"]', () =>
    data.skills.categories.map((cat) => `
      <div class="skills-category ${cat.highlight ? 'highlight' : ''}">
        <div class="skills-category-name">
          <span>TASK [${escape(cat.name)}]</span>
          <span class="status">=> pending</span>
        </div>
        <div class="skills-items">
          ${cat.items.map((i) =>
            i.toLowerCase().includes('ansilume')
              ? `<span class="ansilume-chip">${escape(i)}</span>`
              : `<span>${escape(i)}</span>`
          ).join('')}
        </div>
      </div>
    `).join('')
  );

  fill(root, '[data-render="timeline-list"]', () =>
    data.timeline.map((s) => {
      const cls = [s.ansilume && 'ansilume', s.clearance && 'clearance'].filter(Boolean).join(' ');
      const badge = s.ansilume
        ? `<span class="badge">ansilume</span>`
        : s.clearance ? `<span class="badge">${s.clearance}</span>` : '';
      return `
        <li class="${cls}">
          <p class="role">${escape(s.role)}</p>
          <h3 class="industry">${escape(s.industry)}${badge}</h3>
          <ul class="highlights">${s.highlights.map((h) => `<li>${escape(h)}</li>`).join('')}</ul>
          <div class="stack">${s.stack.map((t) => `<span>${escape(t)}</span>`).join('')}</div>
        </li>
      `;
    }).join('')
  );

  fill(root, '[data-render="leadership-bullets"]', () =>
    data.leadership.bullets.map((b) => `<li>${escape(b)}</li>`).join('')
  );

  fill(root, '[data-render="awards-list"]', () =>
    data.awards.items.map(({ year, title }) => `
      <li><span class="year">${escape(year)}</span><span class="title">${escape(title)}</span></li>
    `).join('')
  );

  const copy = root.querySelector('#copy');
  if (copy) copy.textContent = data.footer.copyright.replace('{year}', new Date().getFullYear());
}

function fill(root, selector, produceHtml) {
  const el = root.querySelector(selector);
  if (el) el.innerHTML = produceHtml();
}
function text(str) { return `<p>${escape(str)}</p>`; }
function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]
  ));
}
```

- [ ] **Step 2: Commit**

```bash
git add src/render.js
git commit -m "render: DOM population for all sections"
```

---

## Task 13: Main entry — wire i18n + render

**Files:**
- Create: `src/main.js`

- [ ] **Step 1: Implement bootstrap**

```js
import { content } from './content.js';
import { apply } from './i18n.js';
import { renderAll } from './render.js';

const STORAGE_KEY = 'domi.lang';
const DEFAULT_LANG = 'de';
const ALLOWED = new Set(['de', 'en']);

function getInitialLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && ALLOWED.has(stored)) return stored;
  const browser = (navigator.language || '').slice(0, 2).toLowerCase();
  return ALLOWED.has(browser) ? browser : DEFAULT_LANG;
}

function setLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.querySelectorAll('.lang-toggle button').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });
  renderAll(document, content, lang);
  apply(document.documentElement, content, lang);
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const attr = el.getAttribute('data-i18n-attr');
    const path = el.getAttribute('data-i18n');
    const value = path.split('.').reduce((acc, k) => acc?.[k], content[lang]);
    if (typeof value === 'string') el.setAttribute(attr, value);
  });
}

function initLangToggle() {
  document.querySelectorAll('.lang-toggle button').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}

function init() {
  setLang(getInitialLang());
  initLangToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

- [ ] **Step 2: Smoke test in browser**

Run: `npm run dev`
Open `http://localhost:8080`
Expected: all sections populated with German content, language toggle switches to English and persists on reload. No console errors.

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "main: bootstrap i18n + render"
```

---

## Task 14: Boot sequence

**Files:**
- Create: `src/boot-sequence.js`
- Modify: `src/main.js`

- [ ] **Step 1: Implement boot sequence module**

```js
import { typewrite } from './typewriter.js';

const LINES = [
  '$ ansible-playbook dominik.yml',
  '',
  'PLAY [dominik.cc] ***********************************************',
  '',
  'TASK [systemd : boot] =========================================== ok',
  'TASK [networking : connect internet] ============================ ok',
  'TASK [skills : install 20+ years experience] ==================== ok',
  'TASK [security : cleared SÜ1, ready for SÜ2] ==================== ok',
  'TASK [delivery : ship and hand over cleanly] ==================== ok',
  '',
  'PLAY RECAP ******************************************************',
  'dominik.cc : ok=42 changed=17 unreachable=0 failed=0',
  '',
];

export async function playBootSequence(terminalEl, heroBodyEl) {
  terminalEl.textContent = '';
  for (const line of LINES) {
    const span = document.createElement('span');
    terminalEl.appendChild(span);
    terminalEl.appendChild(document.createTextNode('\n'));
    if (line) await typewrite(span, line, { speed: 8 });
    else span.textContent = '';
  }
  await wait(600);
  terminalEl.classList.add('fade-out');
  await wait(700);
  terminalEl.hidden = true;
  heroBodyEl.hidden = false;
  requestAnimationFrame(() => heroBodyEl.classList.add('visible'));
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
```

- [ ] **Step 2: Wire into `src/main.js`**

Edit `src/main.js` — replace the `init` function with:

```js
async function init() {
  setLang(getInitialLang());
  initLangToggle();
  const { playBootSequence } = await import('./boot-sequence.js');
  const term = document.getElementById('boot-terminal');
  const body = document.querySelector('.hero-body');
  playBootSequence(term, body).catch(console.error);
}
```

- [ ] **Step 3: Smoke test in browser**

Run: `npm run dev` (already running, just refresh)
Expected: Boot terminal types out lines (~3-4 seconds), then fades and hero content appears. Skip-on-scroll not required for v1.

- [ ] **Step 4: Commit**

```bash
git add src/boot-sequence.js src/main.js
git commit -m "boot-sequence: ansible-playbook hero animation"
```

---

## Task 15: Uptime HUD

**Files:**
- Create: `src/uptime-hud.js`
- Modify: `src/main.js`

- [ ] **Step 1: Implement HUD ticker**

```js
import { formatUptime } from './uptime.js';

const BIRTH = new Date('1988-01-27T00:00:00+01:00');

export function startUptimeHUD(element) {
  const tick = () => {
    element.textContent = formatUptime(BIRTH, new Date());
  };
  tick();
  return setInterval(tick, 1000);
}
```

- [ ] **Step 2: Wire into `src/main.js`**

Add to `init()` after `initLangToggle()`:

```js
const hud = document.getElementById('uptime');
if (hud) {
  const { startUptimeHUD } = await import('./uptime-hud.js');
  startUptimeHUD(hud);
}
```

- [ ] **Step 3: Smoke test**

Refresh browser. Expected: HUD in top-left shows something like `38y 2mo 25d 14h 23m 42s` and the seconds increment every second.

- [ ] **Step 4: Commit**

```bash
git add src/uptime-hud.js src/main.js
git commit -m "hud: live uptime since birth"
```

---

## Task 16: Scroll-triggered skill matrix animation

**Files:**
- Create: `src/skill-matrix.js`
- Modify: `src/main.js`

- [ ] **Step 1: Implement**

```js
export function initSkillMatrixAnimation(root) {
  const categories = root.querySelectorAll('.skills-category');
  if (!categories.length) return;
  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const status = e.target.querySelector('.status');
      if (status && !status.dataset.done) {
        status.dataset.done = '1';
        animateStatus(status);
      }
    }
  }, { threshold: 0.4 });
  categories.forEach((c) => observer.observe(c));
}

function animateStatus(el) {
  const states = ['=> running', '=> installing', '=> verifying', '=> ok'];
  let i = 0;
  const step = () => {
    el.textContent = states[i++];
    el.style.color = i === states.length ? 'var(--cyan)' : 'var(--amber)';
    if (i < states.length) setTimeout(step, 200);
  };
  step();
}
```

- [ ] **Step 2: Wire into `src/main.js`**

Append to `init()`:

```js
const { initSkillMatrixAnimation } = await import('./skill-matrix.js');
initSkillMatrixAnimation(document);
```

Call `initSkillMatrixAnimation` again from inside `setLang()` after `renderAll` — because each re-render creates new DOM nodes. Add to end of `setLang()`:

```js
import('./skill-matrix.js').then(({ initSkillMatrixAnimation }) => initSkillMatrixAnimation(document));
```

- [ ] **Step 3: Smoke test**

Refresh. Scroll to Skill Matrix. Expected: each category's status cycles `pending → running → installing → verifying → ok` when scrolled into view. Status turns cyan at `ok`.

- [ ] **Step 4: Commit**

```bash
git add src/skill-matrix.js src/main.js
git commit -m "skill-matrix: ansible-run animation on scroll"
```

---

## Task 17: Portrait reveal

**Files:**
- Create: `src/portrait-reveal.js`
- Modify: `src/main.js`
- Modify: `styles.css`

- [ ] **Step 1: CSS — add the progress variables**

Append to `styles.css`:

```css
@layer components {
  .portrait picture {
    --reveal: 0;
    filter: grayscale(calc(100% - 100% * var(--reveal)))
            contrast(calc(1.1 - 0.1 * var(--reveal)));
  }
  .portrait picture::after {
    opacity: calc(1 - var(--reveal));
    transition: opacity .15s linear;
  }
}
```

- [ ] **Step 2: Implement scroll-reveal**

```js
export function initPortraitReveal(element) {
  if (!element) return;
  const picture = element.querySelector('picture');
  if (!picture) return;

  let raf = 0;
  const update = () => {
    const rect = element.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.max(0, Math.min(1, 1 - (rect.top / vh)));
    picture.style.setProperty('--reveal', progress.toFixed(3));
    raf = 0;
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
```

- [ ] **Step 3: Wire into `src/main.js`**

Append to `init()`:

```js
const { initPortraitReveal } = await import('./portrait-reveal.js');
initPortraitReveal(document.querySelector('.portrait'));
```

- [ ] **Step 4: Smoke test**

Scroll past the portrait. Expected: starts black-and-white with scanlines, fades toward full color + no scanlines as it scrolls into view.

- [ ] **Step 5: Commit**

```bash
git add src/portrait-reveal.js src/main.js styles.css
git commit -m "portrait: scroll-based color reveal"
```

---

## Task 18: Canvas network graph background

**Files:**
- Create: `src/canvas-graph.js`
- Modify: `src/main.js`

- [ ] **Step 1: Implement**

```js
export function initCanvasGraph(canvas) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, nodes = [];
  const COUNT = 40;
  const MAX_LINK_DIST = 180;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.width  = Math.floor(window.innerWidth  * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
    ctx.scale(dpr, dpr);
  }

  function seed() {
    nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > window.innerWidth)  n.vx *= -1;
      if (n.y < 0 || n.y > window.innerHeight) n.vy *= -1;

      // slight cursor attraction
      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 200 * 200) {
        n.vx += (dx / Math.sqrt(d2 + 1)) * 0.0008;
        n.vy += (dy / Math.sqrt(d2 + 1)) * 0.0008;
      }
    }

    ctx.strokeStyle = 'rgba(125, 252, 205, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < MAX_LINK_DIST) {
          ctx.globalAlpha = 1 - d / MAX_LINK_DIST;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(230, 237, 243, 0.7)';
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.25, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  resize();
  seed();
  requestAnimationFrame(step);
  window.addEventListener('resize', () => { resize(); seed(); });
  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
}
```

- [ ] **Step 2: Wire into `src/main.js`**

Append to `init()`:

```js
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const { initCanvasGraph } = await import('./canvas-graph.js');
  initCanvasGraph(document.getElementById('bg-graph'));
}
```

- [ ] **Step 3: Smoke test**

Refresh. Expected: subtle moving network of dots/lines behind content, slight attraction toward cursor. Not distracting.

- [ ] **Step 4: Commit**

```bash
git add src/canvas-graph.js src/main.js
git commit -m "canvas: ambient network-graph background"
```

---

## Task 19: Whoami footer typewriter

**Files:**
- Create: `src/whoami-footer.js`
- Modify: `src/main.js`

- [ ] **Step 1: Implement**

```js
import { typewrite } from './typewriter.js';

export function initWhoami(outEl, lines) {
  if (!outEl) return;
  const observer = new IntersectionObserver(async (entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      obs.disconnect();
      outEl.textContent = '\n';
      for (const line of lines) {
        const span = document.createElement('span');
        outEl.appendChild(span);
        outEl.appendChild(document.createTextNode('\n'));
        await typewrite(span, line, { speed: 20 });
      }
    }
  }, { threshold: 0.3 });
  observer.observe(outEl.closest('.site-footer') || outEl);
}
```

- [ ] **Step 2: Wire and re-trigger on language change**

Add a reusable hook in `src/main.js`. After `setLang`:

```js
async function initWhoamiFor(lang) {
  const { initWhoami } = await import('./whoami-footer.js');
  const out = document.getElementById('whoami-out');
  if (out) {
    out.textContent = '';
    initWhoami(out, content[lang].footer.whoamiLines);
  }
}
```

Call `initWhoamiFor(getInitialLang())` at end of `init()`, and call `initWhoamiFor(lang)` at end of `setLang(lang)` so switching language resets the animation.

- [ ] **Step 3: Smoke test**

Scroll to footer. Expected: `$ whoami` then lines appear one by one typed out. Switch language — footer re-types in new language.

- [ ] **Step 4: Commit**

```bash
git add src/whoami-footer.js src/main.js
git commit -m "whoami: scroll-triggered footer typewriter"
```

---

## Task 20: Lenis smooth scroll

**Files:**
- Create: `src/smooth-scroll.js`
- Modify: `src/main.js`

- [ ] **Step 1: Vendor Lenis locally**

Run:

```bash
mkdir -p vendor
curl -Lo vendor/lenis.min.js https://unpkg.com/lenis@1.1.14/dist/lenis.min.mjs
```

Expected: a file at `vendor/lenis.min.js` of ~10 KB. If the version number changes upstream, take whatever current stable is on unpkg.

- [ ] **Step 2: Implement wrapper**

`src/smooth-scroll.js`:

```js
import Lenis from '../vendor/lenis.min.js';

export function initSmoothScroll() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lenis = new Lenis({ lerp: 0.1 });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}
```

- [ ] **Step 3: Wire**

Add to `init()` in `src/main.js`:

```js
const { initSmoothScroll } = await import('./smooth-scroll.js');
initSmoothScroll();
```

- [ ] **Step 4: Smoke test**

Expected: scrolling on desktop has a subtle ease/lerp, no jank. If Lenis default export doesn't work via ESM-from-CDN (it does in recent versions; if it breaks, swap to a named import based on the file you fetched).

- [ ] **Step 5: Commit**

```bash
git add vendor/lenis.min.js src/smooth-scroll.js src/main.js
git commit -m "scroll: lenis smooth scrolling (vendored)"
```

---

## Task 21: Image optimization

**Files:**
- Create: `assets/portrait-480.webp`, `assets/portrait-768.webp`, `assets/portrait-1280.webp`
- Create: `assets/portrait.jpg` (copy of source for fallback)
- Move: `4X8A0833_be.jpg` → `assets/portrait.jpg`

- [ ] **Step 1: Move the source**

```bash
mkdir -p assets
mv 4X8A0833_be.jpg assets/portrait.jpg
```

- [ ] **Step 2: Generate WebP variants**

Try `npm run images` first. Expected: three `.webp` files under `assets/`.

If `sharp-cli` fails, fall back to ImageMagick:

```bash
convert assets/portrait.jpg -strip -auto-orient -resize 480x  -quality 80 assets/portrait-480.webp
convert assets/portrait.jpg -strip -auto-orient -resize 768x  -quality 80 assets/portrait-768.webp
convert assets/portrait.jpg -strip -auto-orient -resize 1280x -quality 80 assets/portrait-1280.webp
```

- [ ] **Step 3: Verify file sizes**

Run: `ls -la assets/portrait-*.webp`
Expected: largest file (1280) under ~200 KB, smallest (480) under ~40 KB.

- [ ] **Step 4: Also shrink the JPG fallback**

```bash
convert assets/portrait.jpg -strip -auto-orient -resize 1280x -quality 82 assets/portrait.jpg.tmp
mv assets/portrait.jpg.tmp assets/portrait.jpg
```

- [ ] **Step 5: Commit**

```bash
git add assets/portrait*.webp assets/portrait.jpg
git commit -m "assets: portrait webp variants + jpg fallback"
```

---

## Task 22: Fonts

**Files:**
- Create: `assets/fonts/Inter-Variable.woff2`, `assets/fonts/JetBrainsMono-Variable.woff2`
- Create: `assets/favicon.svg`

- [ ] **Step 1: Fetch self-hosted variable fonts**

```bash
mkdir -p assets/fonts
curl -Lo assets/fonts/Inter-Variable.woff2 \
  https://github.com/rsms/inter/raw/v4.0/docs/font-files/InterVariable.woff2
curl -Lo assets/fonts/JetBrainsMono-Variable.woff2 \
  https://github.com/JetBrains/JetBrainsMono/raw/v2.304/fonts/variable/JetBrainsMono%5Bwght%5D.woff2
```

Expected: two WOFF2 files, each under ~300 KB. If GitHub URL shape changes, grab the current `InterVariable.woff2` and any `JetBrainsMono*.woff2` from their releases.

- [ ] **Step 2: Create a simple SVG favicon**

`assets/favicon.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0a0e14"/>
  <text x="50%" y="58%" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="18" fill="#ffb347" font-weight="700">▌</text>
</svg>
```

- [ ] **Step 3: Smoke test**

Refresh browser. Expected: Inter and JetBrains Mono load, no FOUT flicker, favicon shows.

- [ ] **Step 4: Commit**

```bash
git add assets/fonts assets/favicon.svg
git commit -m "assets: self-hosted fonts + favicon"
```

---

## Task 23: Imprint page

**Files:**
- Create: `impressum.html`

- [ ] **Step 1: Write imprint**

```html
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Impressum — Dominik Haßelkuss</title>
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="styles.css" />
</head>
<body>
<main style="max-width: 42rem; margin: 4rem auto; padding: 0 var(--gutter);">
  <p style="font-family: var(--font-mono); font-size: .85rem;">
    <a href="index.html" style="color: var(--amber); text-decoration: none;">← zurück</a>
  </p>
  <h1 style="font-size: var(--step-3);">Impressum</h1>

  <h2 style="font-size: var(--step-2); border: 0; padding: 0; margin-top: 2rem;">Angaben gemäß § 5 TMG</h2>
  <p>
    <strong>PUSH IT GmbH</strong><br />
    Neuhauser Weg 5<br />
    87439 Kempten<br />
    Deutschland
  </p>
  <p>
    Vertreten durch den Geschäftsführer: Dominik Haßelkuss
  </p>

  <h2 style="font-size: var(--step-2); border: 0; padding: 0; margin-top: 2rem;">Handelsregister</h2>
  <p>
    Registergericht: Amtsgericht Kempten<br />
    Registernummer: HRB 14130
  </p>

  <h2 style="font-size: var(--step-2); border: 0; padding: 0; margin-top: 2rem;">Umsatzsteuer-ID</h2>
  <p>DE316910948</p>

  <h2 style="font-size: var(--step-2); border: 0; padding: 0; margin-top: 2rem;">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
  <p>Dominik Haßelkuss · Anschrift wie oben</p>

  <p style="margin-top: 3rem; color: var(--line-2); font-family: var(--font-mono); font-size: .8rem;">
    Haftungsausschluss: Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt.
    Für die Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr übernommen.
  </p>
</main>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add impressum.html
git commit -m "imprint: legal page (TMG §5)"
```

---

## Task 24: Full visual smoke check + polish pass

**Files:** all visual

- [ ] **Step 1: Open in Firefox + Chrome**

Run: `npm run dev` (leave running)
Visit `http://localhost:8080` in both browsers.

Verify checklist — mark any issue you find with a one-line commit fix after.

- [ ] Hero boot animation plays, fades, hero content transitions in
- [ ] Uptime HUD (top-left) ticks every second
- [ ] Lang toggle (top-right) switches DE/EN, persists on reload
- [ ] Canvas network graph visible but subtle
- [ ] All sections populated with content
- [ ] Ansilume section is clearly the second-most striking element (cyan glow, ASCII-ish heading)
- [ ] Skill matrix categories animate when scrolled into view
- [ ] Timeline has no dates visible anywhere
- [ ] SÜ1 badge visible in hero AND on the judicial station in timeline
- [ ] Portrait reveals from BW+scanlines to color as you scroll to it
- [ ] Whoami footer types out on scroll into view
- [ ] Imprint link in footer works, page renders without broken styles

- [ ] **Step 2: Narrow-screen check**

Chrome devtools responsive → 375 px width. Expected: no horizontal scroll, text readable, timeline single-column. If broken, fix CSS with media queries before continuing.

- [ ] **Step 3: Fix anything that's off, one commit per fix**

Use descriptive messages like `fix: hero body no longer overlaps HUD on mobile`.

---

## Task 25: Lighthouse + a11y + perf audit

**Files:** none, but commits expected for fixes

- [ ] **Step 1: Run Lighthouse**

Chrome devtools → Lighthouse → Desktop, Performance + Best Practices + Accessibility + SEO. Run against `http://localhost:8080/`.

- [ ] **Step 2: Target scores**

- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

If any score is below target, look at the suggestions. The most likely issues:
- Contrast on `--fg-dim` on dark bg — bump to a lighter shade if any element flags it
- Missing `alt` or `lang` attributes
- Image dimensions missing — already set on `<img>` but double-check
- Render-blocking resources — styles are OK as they are
- Motion-reduced already handled via `prefers-reduced-motion`

- [ ] **Step 3: Commit fixes**

One focused commit per category of fix.

---

## Task 26: Deploy setup

**Files:**
- Create: `CNAME`

- [ ] **Step 1: Write CNAME**

`CNAME`:

```
domi.cc
```

- [ ] **Step 2: Commit**

```bash
git add CNAME
git commit -m "deploy: CNAME for domi.cc"
```

- [ ] **Step 3: Note for the user (do NOT action)**

Leave a note in the final summary: user must enable GitHub Pages in repo settings (Settings → Pages → source: `master` branch, `/ (root)`), then point `domi.cc` DNS A records to GitHub Pages IPs or CNAME to `<user>.github.io`. Do not push or create PRs without explicit user approval.

---

## Task 27: Final pass — run all tests

- [ ] **Step 1: Unit tests**

Run: `npx vitest run`
Expected: all tests pass (i18n, uptime, typewriter, content-shape).

- [ ] **Step 2: Show final summary to user**

Summarise: what was built, which tasks were done, what's left for the user (GH Pages enable + DNS), and offer next step (push to GitHub when they give the go).

---

## Self-Review Results

**Spec coverage:**
- Hero boot sequence — Task 14 ✓
- SÜ1 trust badge (hero + timeline station) — Task 7 (HTML), Task 12 (timeline badge render) ✓
- Uptime HUD from 1988-01-27 — Tasks 5, 15 ✓
- 10 sections — HTML in Task 7, CSS Tasks 8–11, renderers Task 12 ✓
- Ansilume dedicated section — Tasks 7, 10, 12 ✓
- Ansible-run skill-matrix animation — Task 16 ✓
- Anonymised timeline without dates — content shape test asserts no year fields (Task 3), renderer + CSS in Tasks 10, 12 ✓
- Portrait reveal with scanlines — Task 17 ✓
- Canvas network graph — Task 18 ✓
- Whoami footer — Task 19 ✓
- Lenis smooth scroll — Task 20 ✓
- DE primary + EN toggle with localStorage — Task 13 ✓
- Imprint page (DE, TMG-compliant) — Task 23 ✓
- No contact, no analytics — covered by omission ✓

**Placeholder scan:** One soft spot: Task 20 Step 4 mentions "if Lenis default export doesn't work, swap to a named import based on the file you fetched" — that's a conditional but the engineer has clear guidance (look at the file, adjust import). Kept because upstream ESM shape can drift. Not a blocker.

**Type consistency:**
- `content.de.timeline` is an array of stations after the reassignment at the bottom of `src/content.js`. The `timelineMeta` object holds `heading` / `note`. HTML (Task 7) and renderer (Task 12) both use `timelineMeta.heading`/`timelineMeta.note` and `data.timeline` — consistent.
- `renderAll` called in `setLang` — import path `./render.js` consistent everywhere.
- `formatUptime(from, now)` signature is consistent between test and use.
- `typewrite` signature consistent.

No other issues found.
