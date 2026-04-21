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
