import { describe, it, expect } from 'vitest';
import { content } from '../src/content.js';

describe('content data', () => {
  it('has de and en top-level keys', () => {
    expect(content).toHaveProperty('de');
    expect(content).toHaveProperty('en');
  });

  it('de and en share the same key structure', () => {
    const shape = (obj) => {
      if (obj === null || typeof obj !== 'object') return typeof obj;
      if (Array.isArray(obj)) return `array(${obj.length > 0 ? shape(obj[0]) : 'empty'})`;
      return Object.fromEntries(
        Object.keys(obj).sort().map((k) => [k, shape(obj[k])])
      );
    };
    expect(shape(content.de)).toEqual(shape(content.en));
  });

  it('every timeline station has role, industry, highlights, stack — and NO year fields', () => {
    for (const lang of ['de', 'en']) {
      for (const station of content[lang].timeline) {
        expect(station).toHaveProperty('role');
        expect(station).toHaveProperty('industry');
        expect(Array.isArray(station.highlights)).toBe(true);
        expect(Array.isArray(station.stack)).toBe(true);
        expect(station).not.toHaveProperty('year');
        expect(station).not.toHaveProperty('years');
        expect(station).not.toHaveProperty('from');
        expect(station).not.toHaveProperty('to');
      }
    }
  });

  it('ansilume station has a special flag', () => {
    const de = content.de.timeline.find((s) => s.ansilume);
    expect(de).toBeDefined();
    expect(de.url).toBe('https://github.com/ansilume/ansilume');
  });

  it('SÜ1 station has a clearance flag', () => {
    const de = content.de.timeline.find((s) => s.clearance === 'SÜ1');
    expect(de).toBeDefined();
  });

  it('every timeline station has the same key set in de and en', () => {
    const keys = (s) => Object.keys(s).sort().join(',');
    content.de.timeline.forEach((deStation, i) => {
      expect(keys(content.en.timeline[i])).toBe(keys(deStation));
    });
  });
});
