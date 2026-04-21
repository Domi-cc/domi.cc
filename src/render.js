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
