const RAMP = '  .\'`,^:";~-_+<>i!lI?/\\|()1{}[]rcvunxzjftLCJUYXZO0Qoahkbdpqwm*WMB8&%$#@';

export async function initAsciiSelf(preEl, sectionEl, imgSrc) {
  if (!preEl || !sectionEl) return;

  const cols = 110;
  const rows = 66;

  const img = new Image();
  img.decoding = 'async';
  img.src = imgSrc;
  try {
    if ('decode' in img) await img.decode();
    else await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
  } catch {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const charAspect = 0.5;
  const imgAspect = img.width / img.height;
  const gridAspect = (cols * charAspect) / rows;
  let dw, dh, dx, dy;
  if (imgAspect > gridAspect) {
    dh = rows;
    dw = rows * imgAspect / charAspect;
    dx = (cols - dw) / 2;
    dy = 0;
  } else {
    dw = cols;
    dh = cols * charAspect / imgAspect;
    dx = 0;
    dy = (rows - dh) / 2;
  }
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cols, rows);
  ctx.drawImage(img, dx, dy, dw, dh);

  const pixels = ctx.getImageData(0, 0, cols, rows).data;
  const chars = new Array(cols * rows);
  const order = new Array(cols * rows);

  for (let i = 0; i < cols * rows; i++) {
    const r = pixels[i * 4];
    const g = pixels[i * 4 + 1];
    const b = pixels[i * 4 + 2];
    const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
    chars[i] = RAMP[Math.floor(lum * (RAMP.length - 1))];
    order[i] = i;
  }

  // Reveal order: spiral from center outward for a "rotate-in / build-up" feel.
  const cx = cols / 2;
  const cy = rows / 2;
  order.sort((a, b) => {
    const ax = a % cols, ay = (a - ax) / cols;
    const bx = b % cols, by = (b - bx) / cols;
    const da = Math.hypot(ax - cx, (ay - cy) * 1.8);
    const db = Math.hypot(bx - cx, (by - cy) * 1.8);
    return da - db;
  });

  const revealed = new Array(cols * rows).fill(false);

  let lastCount = -1;
  let raf = 0;

  const render = () => {
    const rect = sectionEl.getBoundingClientRect();
    const vh = window.innerHeight;
    const span = vh + rect.height;
    const pos = vh - rect.top;
    const progress = Math.max(0, Math.min(1, pos / span));

    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const target = Math.floor(eased * chars.length);

    if (target !== lastCount) {
      if (target > lastCount) {
        for (let i = lastCount + 1; i <= target && i < order.length; i++) {
          revealed[order[i]] = true;
        }
      } else {
        for (let i = lastCount; i > target && i >= 0; i--) {
          if (order[i] !== undefined) revealed[order[i]] = false;
        }
      }
      lastCount = target;

      let out = '';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = x + y * cols;
          out += revealed[idx] ? chars[idx] : ' ';
        }
        out += '\n';
      }
      preEl.textContent = out;
    }

    raf = 0;
  };

  const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  render();
}
