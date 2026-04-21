const CHARS = '.,-~:;=!*#$@';

export function initAsciiDonut(preEl) {
  if (!preEl) return;

  let A = 0;
  let B = 0;
  let scrollBoost = 0;
  let targetBoost = 0;
  let cols = 0;
  let rows = 0;

  const recomputeGrid = () => {
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;font-family:inherit;font-size:inherit;white-space:pre;';
    probe.textContent = 'M';
    preEl.appendChild(probe);
    const rect = probe.getBoundingClientRect();
    preEl.removeChild(probe);
    const charW = rect.width || 8;
    const charH = rect.height || 16;
    cols = Math.max(24, Math.floor(window.innerWidth / charW));
    rows = Math.max(16, Math.floor(window.innerHeight / charH));
  };

  const render = () => {
    const size = cols * rows;
    const output = new Array(size).fill(' ');
    const zbuffer = new Array(size).fill(0);

    const cx = cols / 2;
    const cy = rows / 2;
    // Radial scale — the donut roughly fills a circle of min(cols, rows)/2 * factor
    const k1 = Math.min(cols, rows) * 0.42;

    const sinA = Math.sin(A), cosA = Math.cos(A);
    const sinB = Math.sin(B), cosB = Math.cos(B);

    for (let theta = 0; theta < 6.28; theta += 0.18) {
      const sinT = Math.sin(theta), cosT = Math.cos(theta);
      for (let phi = 0; phi < 6.28; phi += 0.05) {
        const sinP = Math.sin(phi), cosP = Math.cos(phi);

        const circleX = cosT + 2;
        const circleY = sinT;

        const rotatedX = circleX * (cosB * cosP + sinA * sinB * sinP) - circleY * cosA * sinB;
        const rotatedY = circleX * (sinB * cosP - sinA * cosB * sinP) + circleY * cosA * cosB;
        const rotatedZ = cosA * circleX * sinP + circleY * sinA + 5;
        const ooz = 1 / rotatedZ;

        const xp = Math.floor(cx + k1 * ooz * rotatedX);
        const yp = Math.floor(cy - (k1 * 0.5) * ooz * rotatedY);

        if (yp < 0 || yp >= rows || xp < 0 || xp >= cols) continue;
        const idx = xp + cols * yp;

        const luminance =
          cosP * cosT * sinB -
          cosA * cosT * sinP -
          sinA * sinT +
          cosB * (cosA * sinT - cosT * sinA * sinP);

        if (ooz > zbuffer[idx]) {
          zbuffer[idx] = ooz;
          const n = Math.floor(luminance * 8);
          output[idx] = CHARS[n > 0 ? Math.min(n, CHARS.length - 1) : 0];
        }
      }
    }

    let result = '';
    for (let j = 0; j < rows; j++) {
      result += output.slice(j * cols, (j + 1) * cols).join('') + '\n';
    }
    preEl.textContent = result;

    const speed = 1 + scrollBoost;
    A += 0.025 * speed;
    B += 0.018 * speed;

    scrollBoost += (targetBoost - scrollBoost) * 0.08;
    targetBoost *= 0.92;
  };

  recomputeGrid();
  let last = performance.now();
  const loop = (t) => {
    if (t - last > 50) {
      render();
      last = t;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  window.addEventListener('resize', recomputeGrid);
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    targetBoost = Math.min(4, Math.abs(delta) * 0.08);
  }, { passive: true });
}
