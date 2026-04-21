export function initCanvasGraph(canvas) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  let nodes = [];
  const COUNT = 40;
  const MAX_LINK_DIST = 180;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width  = Math.floor(window.innerWidth  * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
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
