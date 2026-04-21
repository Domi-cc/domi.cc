export function typewrite(element, text, { speed = 30, onDone } = {}) {
  let i = 0;
  let cancelled = false;
  let resolveDone;

  const promise = new Promise((res) => { resolveDone = res; });

  const step = () => {
    if (cancelled) return;
    if (i < text.length) {
      element.textContent = text.slice(0, ++i);
      setTimeout(step, speed);
    } else {
      if (onDone) onDone();
      resolveDone();
    }
  };

  setTimeout(step, speed);

  promise.skip = () => {
    cancelled = true;
    element.textContent = text;
    if (onDone) onDone();
    resolveDone();
  };

  return promise;
}
