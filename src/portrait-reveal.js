export function initPortraitReveal(element) {
  if (!element) return;
  const picture = element.querySelector('picture');
  if (!picture) return;

  let raf = 0;
  const update = () => {
    const rect = element.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.max(0, Math.min(1, 1 - (rect.top / vh)));
    picture.style.setProperty('--reveal', progress.toFixed(3));
    raf = 0;
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
