import { formatUptime } from './uptime.js';

const BIRTH = new Date('1988-01-27T00:00:00+01:00');

export function startUptimeHUD(element) {
  const tick = () => {
    element.textContent = formatUptime(BIRTH, new Date());
  };
  tick();
  return setInterval(tick, 1000);
}
