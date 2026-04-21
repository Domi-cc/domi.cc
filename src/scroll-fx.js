export function initScrollFX(root = document) {
  const targets = root.querySelectorAll(
    '.services-grid > article, .timeline li, .awards li, .leadership li'
  );
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('reveal');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((t) => io.observe(t));

  const heroName = root.querySelector('.hero-name');
  const heroTag = root.querySelector('.hero-tagline');
  const hud = root.querySelector('.hud');

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const heroPass = Math.min(1, y / vh);
      if (heroName) {
        heroName.style.setProperty('--hero-z', `${-heroPass * 220}px`);
        heroName.style.setProperty('--hero-rx', `${heroPass * 35}deg`);
        heroName.style.setProperty('--hero-op', `${Math.max(0, 1 - heroPass * 1.4)}`);
      }
      if (heroTag) {
        heroTag.style.setProperty('--hero-z', `${-heroPass * 160}px`);
        heroTag.style.setProperty('--hero-op', `${Math.max(0, 1 - heroPass * 1.4)}`);
      }
      if (hud) {
        hud.style.setProperty('--hud-tilt', `${heroPass * -6}deg`);
      }
      raf = 0;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const ansilume = root.querySelector('.ansilume');
  const logo = root.querySelector('.ansilume-logo');
  if (ansilume && logo) {
    ansilume.addEventListener('pointermove', (e) => {
      const rect = ansilume.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      logo.style.setProperty('--ansilume-ry', `${nx * 22}deg`);
      logo.style.setProperty('--ansilume-rx', `${-ny * 16}deg`);
    });
    ansilume.addEventListener('pointerleave', () => {
      logo.style.setProperty('--ansilume-ry', '0deg');
      logo.style.setProperty('--ansilume-rx', '0deg');
    });
  }
}
