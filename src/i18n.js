export function resolve(content, path, lang) {
  const tree = content[lang];
  if (!tree) return undefined;
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), tree);
}

export function apply(root, content, lang) {
  if (root === document.documentElement) {
    root.setAttribute('lang', lang);
  } else if (root.ownerDocument?.documentElement) {
    root.ownerDocument.documentElement.setAttribute('lang', lang);
  }
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = resolve(content, el.getAttribute('data-i18n'), lang);
    if (typeof value === 'string') {
      el.textContent = value;
    }
  });
}
