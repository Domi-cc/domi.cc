import { describe, it, expect } from 'vitest';
import { formatUptime } from '../src/uptime.js';

describe('formatUptime(from, now)', () => {
  it('returns zeroed uptime when from === now', () => {
    const d = new Date('2020-01-01T00:00:00Z');
    expect(formatUptime(d, d)).toBe('0y 0mo 0d 0h 0m 0s');
  });

  it('counts whole years, months, days correctly', () => {
    const from = new Date('1988-01-27T00:00:00Z');
    const now  = new Date('2026-04-21T00:00:00Z');
    // 38y 2mo 25d 0h 0m 0s
    expect(formatUptime(from, now)).toBe('38y 2mo 25d 0h 0m 0s');
  });

  it('handles month rollover when day-of-month is smaller than reference', () => {
    const from = new Date('2000-03-31T00:00:00Z');
    const now  = new Date('2000-04-01T00:00:00Z');
    // 0y 0mo 1d 0h 0m 0s
    expect(formatUptime(from, now)).toBe('0y 0mo 1d 0h 0m 0s');
  });

  it('includes hours/minutes/seconds component', () => {
    const from = new Date('2026-04-21T00:00:00Z');
    const now  = new Date('2026-04-21T03:45:12Z');
    expect(formatUptime(from, now)).toBe('0y 0mo 0d 3h 45m 12s');
  });
});
