# Consultant Website — Design Spec

**Datum:** 2026-04-21
**Domain/Repo:** domi.cc
**Zielgruppe:** Einkäufer, Vendor-Manager, CTOs/CIOs großer Unternehmen (DAX, Mittelstand-Enterprise, Behörden) im DACH-Raum
**Ziel:** Dominik Haßelkuss als Senior DevOps / Interim-CTO-Consultant positionieren. Credibility + technische Tiefe + Führungsreife signalisieren. Keine Kontaktmöglichkeit — Interessierte finden den Weg selbst.

## Leitplanken (Constraints)

- **Statisch hostbar** (GitHub Pages / Netlify / Cloudflare Pages). Nur `index.html` + Assets. Kein Build-Tool zwingend nötig, aber optional erlaubt wenn es hilft.
- **Keine Kontaktmöglichkeit:** Kein Formular, kein Booking, keine prominente Mailadresse. Nur Impressum (gesetzlich Pflicht in DE) + GitHub-Link zu Ansilume.
- **Projekte geheim:** Keine Klarnamen von Kunden/Projekten. Branchen-Anonymisierung (z. B. *„DAX30 Bank"*). **Keine Zeiträume** pro Station (sonst fliegen Überschneidungen auf). Reihenfolge chronologisch jüngst → älteste, ohne Datumsangaben.
- **Ansilume darf herausstechen:** Open-Source-Projekt, GitHub-Link ausdrücklich gewünscht — bekommt einen eigenen Abschnitt.
- **Sprachen:** Deutsch primär, Toggle zu Englisch oben rechts.

## Positionierung

- Tagline: **„Problemlöser. Optimierer. Macher."** (aus CV übernommen)
- One-Liner unterhalb: *Senior DevOps & Interim-CTO. DACH-weit.* (ohne Jahresangabe, um nicht zu datieren)
- **Trust-Badge prominent im Hero:** `SÜ1 · ready for SÜ2` — in Monospace, mit dezentem Amber-Rahmen, neben oder unter Tagline. Signal an Behörden / KRITIS / Finanzsektor.
- Kurz-Manifest (3 Sätze) unter Hero: Was er liefert, wie er arbeitet, wer davon profitiert.

## Mood & Visuelle Sprache

- **Farbe:** Graphit-Schwarz `#0a0e14` (Basis), Off-White `#e6edf3` (Text), Amber `#ffb347` (primärer Akzent), Cyan-Mint `#7dfccd` (nur für Ansilume + Technik-Highlights), Muted Grey `#3a4553` (Borders, subtile Struktur).
- **Typografie:** Inter (Variable, Text + Überschriften) + JetBrains Mono (Terminal, Code, HUD). Große, editoriale Headlines; Monospace für alles, was „System" signalisiert.
- **Texturen:** Subtile Film-Grain-Overlay (CSS-Noise oder PNG). Dünnes 1px-Grid an Sektionsgrenzen, sparsam.
- **Animation:** Ruhig, technisch. Keine Bouncy-Spielereien. Fade-ins, Scanline-Effekte, typewriter-Animationen, leichte Parallax.

## Struktur (Sektionen)

1. **Hero — Boot-Sequenz**
   - Schwarzer Viewport. `ansible-playbook dominik.yml` läuft typewriter-mäßig durch: PLAYBOOK-Header, 6–8 TASK-Zeilen mit `ok: [dominik.cc]`, finale `PLAY RECAP ok=N changed=N failed=0`.
   - Terminal fadet aus, Name **„Dominik Haßelkuss"** erscheint groß mittig, Tagline darunter, One-Liner darunter.
   - Oben rechts permanent: HUD-Uptime-Counter `uptime: XXy XXm XXd` — live incrementing, gerechnet ab Berufsbeginn 2007 (THW/Young Solutions). Unauffällig, Monospace.
   - Unten Scroll-Hinweis als blinkender Cursor `▊`.

2. **Positionierung / Manifest**
   - 3 kurze Sätze, groß gesetzt. Positioniert Dominik für C-Level und Einkauf.

3. **Was ich liefere** (Service-Blöcke, 4 Cards im Grid)
   - Monitoring & Observability
   - Automation & IaC
   - Security & Hardening
   - Leadership & Interim-Management
   - Je Card: 1 Icon (reines SVG, Monospace-Style), 1 Headline, 2–3 Zeilen Fließtext.

4. **Ansilume — eigener Hero-Abschnitt**
   - Cyan-Mint als Akzent. ASCII-/Logo-Block animiert (leichtes Glow/Pulse).
   - Kurzbeschreibung: Open-Source-Alternative zu Ansible AWX / Tower / Semaphore UI.
   - GitHub-Link als einziger externer CTA-ähnlicher Link auf der Seite.
   - Darf bewusst größer/prominenter sein als andere Abschnitte.

5. **Skill-Matrix**
   - Kategorisiert: Infrastruktur & OS, Automation, Monitoring/Observability, Security, Cloud & Container, Entwicklung, Datenbanken, Führung/Prozesse.
   - Ansible in der Automation-Kategorie bekommt visuellen Vorrang + Ansilume-Badge.
   - Scroll-Trigger: Jede Kategorie rendert sich beim Sichtbarwerden wie ein Ansible-Run (`TASK [load skill: PROMETHEUS] => ok`).

6. **Erfahrungs-Timeline**
   - Vertikale Timeline, chronologisch jüngst → älteste. **Keine Jahreszahlen.**
   - Pro Station: Rolle (z. B. *„Sec-DevOps & Automation Engineer"*), Branchen-Label (z. B. *„Online-Broker (DAX)"*), 2–3 Bullet-Highlights, Tech-Stack-Chips.
   - Ansilume als eigene Station mit Cyan-Akzent (ohne zu dominieren — der eigene Ansilume-Abschnitt ist weiter oben).
   - **Landes-Behörde (Justiz)-Station** bekommt ein prominentes `SÜ1`-Badge direkt an der Rolle, in Amber. Signalisiert Clearance-Kontext.
   - Branchenlabels aus CV-Analyse: Online-Broker (DAX), Landes-Behörde, Internet-Infrastruktur-Provider, Verlagswesen, Automotive Tier-1 (intl.), Direktbank, E-Commerce (EMEA), Sparkassenverbund, Versicherer (Top-10), Startup/Scale-up, BOS (Katastrophenschutz), System-Integrator.

7. **Leadership-Track**
   - Bullet-Liste (ohne Firmennamen):
     - *Team von 3 auf 15 aufgebaut (Interim-GF)*
     - *Startup auf 100+ MA skaliert, Exit nach 4 Jahren*
     - *Geschäftsführer eigenes Unternehmen (PUSH IT GmbH)*
     - *CTO/CEO-Verantwortung mehrfach*
     - *Internationalisierung EMEA*

8. **Auszeichnungen**
   - 4 Einträge aus CV, groß gesetzt mit Jahr + Preisname. (Jahre hier ok — sind Awards, keine Kundenprojekte.)

9. **Bildung · Sprachen · Ehrenamt**
   - Klein, 3 Spalten: B.Sc. Informatik HS Kempten · DE/EN/Schweizerdeutsch · THW (Pressearbeit, Teamleader).

10. **Footer**
    - Animiertes `$ whoami` das einen kurzen „Selbstbeschreibungs-Haiku" ausgibt.
    - Impressum-Link (eigene Unterseite `impressum.html`).
    - Copyright, Jahr live.
    - Kein Social, kein Kontakt.

## Interaktive Effekte (konkret)

| Effekt | Umsetzung |
|---|---|
| Boot-Sequenz Hero | Typewriter via JS, feste Zeilen, ~1.8s Gesamtdauer. Skip-Option nach 1. User-Scroll. |
| Uptime-HUD | `setInterval` alle 1s, Differenz zu `2005-06-01` (Start erste Engineering-Rolle, Young Solutions AG laut CV). |
| Skill-Matrix Ansible-Run-Animation | IntersectionObserver triggert typewriter pro Zeile. |
| Portrait-Reveal | Zwei Bilder übereinander: Duotone Graphit/Amber (CSS `filter` + `mix-blend-mode`) und Original. Scroll-Progress blendet per `clip-path` um. CRT-Scanlines als `::after` overlay. |
| Network-Graph Hintergrund | Canvas 2D, 30–50 Nodes, Spring-Force-Layout, sehr langsam. Nodes leicht attraktiert zum Cursor (subtil, nicht aggressiv). Opazität max 0.25. |
| Sprach-Toggle DE/EN | Pure JS: `lang` Attribute, Text-Strings in JS-Objekt, `localStorage`-Persistenz. |
| Whoami-Footer | Bei Sichtbarkeit startet typewriter, der einen kleinen Absatz über Dominik „ausgibt". |
| Smooth Scroll | Lenis (~3 KB) für buttrigen Scroll auf Desktop. Mobile: native. |

## Tech-Stack

- **HTML/CSS/JS, kein Framework.** Eine `index.html`, CSS in `styles.css`, JS in `main.js` (+ optional `i18n.js` und `canvas.js`).
- **Kein Build-Schritt erforderlich.** Lokaler Preview: einfacher Static-Server (z. B. `python -m http.server`).
- **Bild-Optimierung:** Foto → WebP in 3 Größen (480 / 768 / 1280 px), originale JPG behalten als Fallback. Target: < 200 KB für größte Variante.
- **Fonts:** Self-hosted (Inter + JetBrains Mono, Variable-Fonts). Kein Google-Fonts CDN (DSGVO).
- **Lenis** per CDN oder bundled (wenige KB).
- **Analytics:** Keine.
- **Deploy:** Static hosting — GitHub Pages naheliegend, CNAME auf domi.cc.

## Content-Anpassungen aus CV

### Branchen-Labels (Reihenfolge chronologisch jüngst → älteste, OHNE Jahre)

1. Open-Source (ansilume)
2. Online-Broker (DAX)
3. Landes-Behörde (Justiz)
4. Internet-Infrastruktur-Provider
5. Verlagswesen
6. Automotive Tier-1 (international)
7. Direktbank
8. Startup/Scale-up (Beratung)
9. Sparkassenverbund
10. Versicherer (Top-10)
11. Startup/Scale-up (Business Analyst)
12. E-Commerce (EMEA, Modehandel)
13. Eigenes Unternehmen (GF)
14. Interim-GF (Agentur-Scale-up)
15. Gründung & Exit (eigenes Startup)
16. BOS (Katastrophenschutz, Ehrenamt)
17. System-Integrator (Schweiz)
18. Senior-Entwicklung (Pharma/Bau)
19. Plattform (Artists/Agencies)
20. Werkstudent (Automotive-Konzern)

### Skill-Matrix Kategorien

- **Infrastruktur & OS:** Debian, Ubuntu, RHEL, CentOS, Linux Hardening, CIS, SSH, Apache, rsyslog, keepalived, HAproxy, SSL-Rollout
- **Automation & IaC:** **Ansible (+ Ansilume)**, Ansible AWX/Tower, Semaphore, Bash, Python3, Terraform (PoC), Git/GitLab, CI/CD-Pipelines
- **Monitoring & Observability:** Prometheus, Grafana, Loki, Promtail, Thanos, Tempo, Icinga2, Nagios, Centreon, Zabbix, CheckMK, Splunk, ELK, Site24x7, Selenium
- **Security:** SIEM, Splunk Enterprise, Rapid7, LogRhythm, Kaspersky, CIS-Hardening, ISO 27001, Threat Intelligence, SecOps, BSI-Pentest-Kooperation
- **Cloud & Container:** AWS (EC2, S3, RDS, Route 53, Auto-Scaling, LB, Lambda, CloudFront), Azure, Docker, Podman, Kubernetes, OpenShift, Red Hat Satellite
- **Virtualisierung:** Proxmox, ESX, VMware, KVM
- **Entwicklung:** PHP, Yii2, Zend, JS, HTML, CSS, ReactJS, SQL
- **Datenbanken:** MySQL, MariaDB, Galera Cluster, Aurora Multi-AZ, Oracle
- **Netzwerk:** OpenVPN, Wireguard, Firewall, Routing
- **Führung & Prozesse:** Teamleitung, Training, Wissenstransfer, Scrum, Product Ownership, Demand & Backlog Management, Internationalisierung EMEA, Qualitätsmanagement, IT-Prozessoptimierung

## Datenstruktur (für i18n)

Alle Texte (DE + EN) liegen in einem `content.js` als JS-Objekt:
```js
const content = {
  de: { hero: { tagline: "...", ... }, ... },
  en: { hero: { tagline: "...", ... }, ... }
};
```
Rendering über Selector-basiertes Binding (`[data-i18n="hero.tagline"]`).

## Non-Goals / Bewusst weggelassen

- Kein Kontaktformular, keine E-Mail prominent, kein Telefon, kein Kalender-Booking.
- Keine Social-Links außer GitHub/Ansilume.
- Keine Analytics, kein Tracking, keine Cookies (außer Sprach-Toggle in localStorage).
- Keine Blogstruktur, keine News, keine Testimonials (würden Kunden leaken).
- Kein CMS, kein Backend.
- Keine Jahresangaben bei beruflichen Stationen.

## Dateistruktur

```
/
├── index.html
├── impressum.html
├── styles.css
├── main.js
├── i18n.js
├── content.js
├── canvas.js
├── assets/
│   ├── portrait-480.webp
│   ├── portrait-768.webp
│   ├── portrait-1280.webp
│   ├── portrait.jpg (Fallback)
│   ├── fonts/
│   │   ├── Inter.woff2
│   │   └── JetBrainsMono.woff2
│   └── favicon.svg
└── docs/superpowers/specs/2026-04-21-consultant-website-design.md
```

## Akzeptanzkriterien

- Seite lädt auf Desktop + Mobile ohne sichtbaren Jank.
- Lighthouse-Performance ≥ 90.
- Keine externen Tracker/CDNs (außer optional Lenis, sonst bundled).
- Sprach-Toggle wechselt alle Texte ohne Page-Reload, Zustand persistiert.
- Keine Kundennamen, keine Zeiträume pro Station erkennbar.
- Ansilume-Abschnitt ist visuell das zweitmarkanteste Element (nach dem Hero).
- Impressum legal korrekt (Firma, Anschrift, Geschäftsführer, HRB, UST-ID — aus CV).
- Foto optimiert, < 200 KB größte Variante.
- „Richtig fancy" Wow-Faktor: Boot-Sequenz + Uptime-HUD + Canvas-Netzwerk + Ansible-Run-Skill-Matrix + Portrait-Reveal zusammen.

## Offene Punkte (nach Review)

Keine. Spec ist komplett. Falls User nachsteuert: hier eintragen.
