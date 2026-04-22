export const content = {
  de: {
    meta: {
      title: 'Dominik Haßelkuss — Problemlöser. Optimierer. Macher.',
      description: 'Senior Security & Sec-DevOps Engineer. National & international. SÜ1, ready für SÜ2.',
    },
    hero: {
      name: 'Dominik Haßelkuss',
      pronunciation: '/ˈhasəlˌkʊs/  ← ganz normal, wie „Hasselkuss"',
      tagline: 'Problemlöser. Optimierer. Macher.',
      oneLiner: 'Senior Security & Sec-DevOps Engineer · national & international',
      trustBadge: 'SÜ1 · ready for SÜ2',
      scrollHint: 'scroll',
    },
    manifesto: {
      heading: 'Was ich tue',
      paragraphs: [
        'Ich härte, baue und automatisiere Infrastrukturen, auf die sich große Unternehmen verlassen müssen.',
        'Security ist Haltung, nicht Feature: CIS-Baselines, SIEM-Anbindung, saubere Log-Pipelines, hardened Rollouts — Ende-zu-Ende.',
        'SÜ1 durchlaufen, ready für SÜ2. Wenn es dringend ist und niemand mehr weiterweiß — hol mich.',
      ],
    },
    services: {
      heading: 'Was ich liefere',
      cards: [
        { title: 'Security & Hardening', body: 'CIS-Hardening für OS, SSH, Apache. SIEM-Anbindung, SecOps, Incident-Vorbereitung. Log-Pipelines mit rsyslog, Loki, Grafana. Threat Intelligence. SÜ1 durchlaufen — ready für SÜ2.' },
        { title: 'Monitoring & Observability', body: 'Prometheus, Grafana, Loki, Icinga, Splunk — vom Greenfield-Stack bis zur HA-Migration bestehender Landschaften.' },
        { title: 'Automation & IaC', body: 'Ansible end-to-end: Rollout, Hardening, On-/Offboarding. Pipelines in GitLab. Schulung inklusive.' },
        { title: 'Interim & Führung', body: 'Interim-Verantwortung auf Zeit, Team-Aufbau, saubere Übergabe. Wenn ein Projekt nur mit einem Kopf oben läuft.' },
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
        { name: 'Security & Hardening', highlight: true, items: ['SÜ1 · ready for SÜ2', 'CIS-Hardening', 'OS/SSH/Apache Hardening', 'SIEM', 'Splunk Enterprise', 'Rapid7', 'LogRhythm', 'Threat Intelligence', 'ISO 27001', 'BSI-Pentest', 'SecOps', 'Incident Preparation'] },
        { name: 'Automation & IaC', highlight: true, items: ['Ansible (+ ansilume)', 'Ansible AWX/Tower', 'Semaphore', 'GitLab CI/CD', 'Bash', 'Python3', 'Terraform (PoC)'] },
        { name: 'Monitoring & Observability', items: ['Prometheus', 'Grafana', 'Loki', 'Promtail', 'Thanos', 'Tempo', 'Icinga2', 'Nagios', 'Centreon', 'Zabbix', 'CheckMK', 'Splunk', 'ELK', 'Site24x7', 'Selenium'] },
        { name: 'Cloud & Container', items: ['AWS (EC2/S3/RDS/Lambda/CF)', 'Azure', 'Docker', 'Podman', 'Kubernetes', 'OpenShift', 'Red Hat Satellite'] },
        { name: 'Infrastruktur & OS', items: ['Debian', 'Ubuntu', 'RHEL', 'CentOS', 'Linux Hardening', 'SSH/Apache Hardening', 'rsyslog', 'keepalived', 'HAproxy', 'SSL-Rollout'] },
        { name: 'Virtualisierung', items: ['Proxmox', 'ESX', 'VMware', 'KVM'] },
        { name: 'Entwicklung', items: ['PHP', 'Yii2', 'Zend', 'JavaScript', 'HTML', 'CSS', 'ReactJS', 'SQL'] },
        { name: 'Datenbanken', items: ['MySQL', 'MariaDB', 'Galera Cluster', 'Aurora Multi-AZ', 'Oracle'] },
        { name: 'Netzwerk', items: ['OpenVPN', 'Wireguard', 'Firewall', 'Routing'] },
        { name: 'Führung & Prozesse', items: ['Teamleitung', 'Training & Wissenstransfer', 'Scrum', 'Product Ownership', 'Demand & Backlog', 'EMEA-Internationalisierung', 'QM', 'IT-Prozessoptimierung'] },
      ],
    },
    timelineMeta: {
      heading: 'Stationen',
      note: '* Chronologisch jüngst zuerst. Keine Zeitangaben — aus gutem Grund.',
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
      description: 'Senior Security & Sec-DevOps Engineer. National & international. SÜ1 cleared, ready for SÜ2.',
    },
    hero: {
      name: 'Dominik Haßelkuss',
      pronunciation: '/ˈhasəlˌkʊs/  ← just say "Hasselkuss"',
      tagline: 'Problem solver. Optimiser. Doer.',
      oneLiner: 'Senior Security & Sec-DevOps Engineer · national & international',
      trustBadge: 'SÜ1 · ready for SÜ2',
      scrollHint: 'scroll',
    },
    manifesto: {
      heading: 'What I do',
      paragraphs: [
        'I harden, build and automate the infrastructure that large organisations depend on.',
        'Security is posture, not a feature: CIS baselines, SIEM integration, clean log pipelines, hardened rollouts — end to end.',
        'SÜ1 cleared, ready for SÜ2. When it is urgent and no one else can figure it out — call me.',
      ],
    },
    services: {
      heading: 'What I deliver',
      cards: [
        { title: 'Security & Hardening', body: 'CIS hardening for OS, SSH, Apache. SIEM integration, SecOps, incident prep. Log pipelines with rsyslog, Loki, Grafana. Threat intelligence. SÜ1 cleared — ready for SÜ2.' },
        { title: 'Monitoring & Observability', body: 'Prometheus, Grafana, Loki, Icinga, Splunk — from greenfield stacks to HA migrations of legacy estates.' },
        { title: 'Automation & IaC', body: 'Ansible end-to-end: rollout, hardening, on-/offboarding. GitLab pipelines. Training included.' },
        { title: 'Interim & Leadership', body: 'Interim responsibility, team build-up, clean handover. For projects that only run with a head on top.' },
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
        { name: 'Security & Hardening', highlight: true, items: ['SÜ1 · ready for SÜ2', 'CIS hardening', 'OS/SSH/Apache hardening', 'SIEM', 'Splunk Enterprise', 'Rapid7', 'LogRhythm', 'Threat Intelligence', 'ISO 27001', 'BSI pentest', 'SecOps', 'Incident Preparation'] },
        { name: 'Automation & IaC', highlight: true, items: ['Ansible (+ ansilume)', 'Ansible AWX/Tower', 'Semaphore', 'GitLab CI/CD', 'Bash', 'Python3', 'Terraform (PoC)'] },
        { name: 'Monitoring & Observability', items: ['Prometheus', 'Grafana', 'Loki', 'Promtail', 'Thanos', 'Tempo', 'Icinga2', 'Nagios', 'Centreon', 'Zabbix', 'CheckMK', 'Splunk', 'ELK', 'Site24x7', 'Selenium'] },
        { name: 'Cloud & Container', items: ['AWS (EC2/S3/RDS/Lambda/CF)', 'Azure', 'Docker', 'Podman', 'Kubernetes', 'OpenShift', 'Red Hat Satellite'] },
        { name: 'Infrastructure & OS', items: ['Debian', 'Ubuntu', 'RHEL', 'CentOS', 'Linux hardening', 'SSH/Apache hardening', 'rsyslog', 'keepalived', 'HAproxy', 'SSL rollout'] },
        { name: 'Virtualisation', items: ['Proxmox', 'ESX', 'VMware', 'KVM'] },
        { name: 'Development', items: ['PHP', 'Yii2', 'Zend', 'JavaScript', 'HTML', 'CSS', 'ReactJS', 'SQL'] },
        { name: 'Databases', items: ['MySQL', 'MariaDB', 'Galera Cluster', 'Aurora Multi-AZ', 'Oracle'] },
        { name: 'Networking', items: ['OpenVPN', 'Wireguard', 'Firewall', 'Routing'] },
        { name: 'Leadership & Process', items: ['Team leadership', 'Training & knowledge transfer', 'Scrum', 'Product ownership', 'Demand & backlog', 'EMEA internationalisation', 'QA', 'IT process optimisation'] },
      ],
    },
    timelineMeta: {
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

const STATIONS = [
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
    ansilume: true,
    url: 'https://github.com/ansilume/ansilume',
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
    industry: { de: 'Startup/Scale-up (Beratung)', en: 'Startup/scale-up (advisory)' },
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
    industry: { de: 'Startup/Scale-up (Produkt)', en: 'Startup/scale-up (product)' },
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
    industry: { de: 'Interim-GF (Agentur / Scale-up)', en: 'Interim MD (agency / scale-up)' },
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
    industry: { de: 'Senior-Entwicklung (Pharma/Bau)', en: 'Senior development (pharma/construction)' },
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
    industry: { de: 'Werkstudent (Automotive-Konzern)', en: 'Working student (automotive OEM)' },
    highlights: {
      de: ['Mitarbeiterqualifikations-Matrix (Q-Matrix)', 'Abfragen, Auswertungen'],
      en: ['Employee qualification matrix (Q-Matrix)', 'Surveys and reporting'],
    },
    stack: ['PHP', 'IIS', 'Oracle'],
  },
];

content.de.timeline = STATIONS.map((s) => ({
  role: s.role.de,
  industry: s.industry.de,
  highlights: s.highlights.de,
  stack: s.stack,
  ...(s.ansilume && { ansilume: true, url: s.url }),
  ...(s.clearance && { clearance: s.clearance }),
}));
content.en.timeline = STATIONS.map((s) => ({
  role: s.role.en,
  industry: s.industry.en,
  highlights: s.highlights.en,
  stack: s.stack,
  ...(s.ansilume && { ansilume: true, url: s.url }),
  ...(s.clearance && { clearance: s.clearance }),
}));
