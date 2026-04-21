import Lenis from '../vendor/lenis.min.mjs';

export function initSmoothScroll() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lenis = new Lenis({
    lerp: 0.2,
    wheelMultiplier: 1.25,
    touchMultiplier: 1.8,
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}
