import { describe, it, expect } from 'vitest';
import { resolve, apply } from '../src/i18n.js';

const fixture = {
  de: { hero: { tagline: 'Hallo' }, list: ['a', 'b'] },
  en: { hero: { tagline: 'Hello' }, list: ['a', 'b'] },
};

describe('resolve(content, path, lang)', () => {
  it('returns nested string by dotted path', () => {
    expect(resolve(fixture, 'hero.tagline', 'de')).toBe('Hallo');
    expect(resolve(fixture, 'hero.tagline', 'en')).toBe('Hello');
  });

  it('returns undefined for missing path', () => {
    expect(resolve(fixture, 'hero.missing', 'de')).toBeUndefined();
  });

  it('returns the value itself for non-string leaves', () => {
    expect(resolve(fixture, 'list', 'de')).toEqual(['a', 'b']);
  });
});

describe('apply(root, content, lang)', () => {
  it('sets text on elements with [data-i18n]', () => {
    document.body.innerHTML = '<h1 data-i18n="hero.tagline">__</h1>';
    apply(document.body, fixture, 'de');
    expect(document.querySelector('h1').textContent).toBe('Hallo');
    apply(document.body, fixture, 'en');
    expect(document.querySelector('h1').textContent).toBe('Hello');
  });

  it('sets html lang attribute when root is documentElement', () => {
    document.documentElement.setAttribute('lang', 'de');
    apply(document.documentElement, fixture, 'en');
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  it('leaves elements without data-i18n untouched', () => {
    document.body.innerHTML = '<p>static</p><p data-i18n="hero.tagline">__</p>';
    apply(document.body, fixture, 'de');
    expect(document.querySelectorAll('p')[0].textContent).toBe('static');
  });
});
