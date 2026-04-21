import { describe, it, expect, vi } from 'vitest';
import { typewrite } from '../src/typewriter.js';

describe('typewrite', () => {
  it('fills element textContent to match target', async () => {
    vi.useFakeTimers();
    const el = document.createElement('span');
    const p = typewrite(el, 'hello', { speed: 10 });
    await vi.advanceTimersByTimeAsync(60);
    await p;
    expect(el.textContent).toBe('hello');
    vi.useRealTimers();
  });

  it('calls onDone at the end', async () => {
    vi.useFakeTimers();
    const el = document.createElement('span');
    const done = vi.fn();
    const p = typewrite(el, 'hi', { speed: 5, onDone: done });
    await vi.advanceTimersByTimeAsync(30);
    await p;
    expect(done).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it('supports skipping — skip() resolves immediately with full text', async () => {
    vi.useFakeTimers();
    const el = document.createElement('span');
    const run = typewrite(el, 'abcdef', { speed: 100 });
    await vi.advanceTimersByTimeAsync(50);
    run.skip();
    await run;
    expect(el.textContent).toBe('abcdef');
    vi.useRealTimers();
  });
});
