import { content } from './content.js';
import { apply } from './i18n.js';
import { renderAll } from './render.js';

const STORAGE_KEY = 'domi.lang';
const DEFAULT_LANG = 'de';
const ALLOWED = new Set(['de', 'en']);

function getInitialLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && ALLOWED.has(stored)) return stored;
  const browser = (navigator.language || '').slice(0, 2).toLowerCase();
  return ALLOWED.has(browser) ? browser : DEFAULT_LANG;
}

function setLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.querySelectorAll('.lang-toggle button').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });
  renderAll(document, content, lang);
  apply(document.documentElement, content, lang);
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const attr = el.getAttribute('data-i18n-attr');
    const path = el.getAttribute('data-i18n');
    const value = path.split('.').reduce((acc, k) => acc?.[k], content[lang]);
    if (typeof value === 'string') el.setAttribute(attr, value);
  });
}

function initLangToggle() {
  document.querySelectorAll('.lang-toggle button').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}

function init() {
  setLang(getInitialLang());
  initLangToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
