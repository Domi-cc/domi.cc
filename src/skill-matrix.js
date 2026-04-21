export function initSkillMatrixAnimation(root) {
  const categories = root.querySelectorAll('.skills-category');
  if (!categories.length) return;
  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const status = e.target.querySelector('.status');
      if (status && !status.dataset.done) {
        status.dataset.done = '1';
        animateStatus(status);
      }
    }
  }, { threshold: 0.4 });
  categories.forEach((c) => observer.observe(c));
}

function animateStatus(el) {
  const states = ['=> running', '=> installing', '=> verifying', '=> ok'];
  let i = 0;
  const step = () => {
    el.textContent = states[i++];
    el.style.color = i === states.length ? 'var(--cyan)' : 'var(--amber)';
    if (i < states.length) setTimeout(step, 200);
  };
  step();
}
