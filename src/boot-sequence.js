import { typewrite } from './typewriter.js';

const LINES = [
  '$ ansible-playbook domi.yml',
  '',
  'PLAY [domi.cc] **************************************************',
  '',
  'TASK [systemd : boot] =========================================== ok',
  'TASK [networking : connect internet] ============================ ok',
  'TASK [os : ensure linux installed] ============================== ok',
  'TASK [skills : install 20+ years experience] ==================== ok',
  'TASK [security : cleared SÜ1, ready for SÜ2] ==================== ok',
  'TASK [delivery : ship and hand over cleanly] ==================== ok',
  '',
  'PLAY RECAP ******************************************************',
  'domi.cc : ok=42 changed=17 unreachable=0 failed=0',
  '',
];

export async function playBootSequence(terminalEl, heroBodyEl) {
  terminalEl.textContent = '';
  for (const line of LINES) {
    const span = document.createElement('span');
    terminalEl.appendChild(span);
    terminalEl.appendChild(document.createTextNode('\n'));
    if (line) await typewrite(span, line, { speed: 14 });
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
