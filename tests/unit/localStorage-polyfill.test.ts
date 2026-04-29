import { describe, it, expect, beforeEach, afterEach } from 'vitest';

function applyPolyfill() {
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (_key: string): null => null,
      setItem: (_key: string, _value: string): void => {},
      removeItem: (_key: string): void => {},
      clear: (): void => {},
      key: (_index: number): null => null,
      length: 0,
    },
    writable: true,
    configurable: true,
  });
}

describe('localStorage polyfill (Node.js v25 broken stub)', () => {
  let originalLocalStorage: typeof globalThis.localStorage;

  beforeEach(() => {
    originalLocalStorage = globalThis.localStorage;
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  it('simulates broken Node.js v25 localStorage', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: {},
      writable: true,
      configurable: true,
    });
    expect(typeof (globalThis.localStorage as any).getItem).toBe('undefined');
  });

  it('polyfill makes getItem callable and returns null', () => {
    applyPolyfill();
    expect(() => localStorage.getItem('theme')).not.toThrow();
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('polyfill makes setItem a no-op', () => {
    applyPolyfill();
    expect(() => localStorage.setItem('theme', 'dark')).not.toThrow();
  });

  it('polyfill makes removeItem a no-op', () => {
    applyPolyfill();
    expect(() => localStorage.removeItem('theme')).not.toThrow();
  });

  it('polyfill makes clear a no-op', () => {
    applyPolyfill();
    expect(() => localStorage.clear()).not.toThrow();
  });

  it('polyfill key() returns null', () => {
    applyPolyfill();
    expect(localStorage.key(0)).toBeNull();
  });

  it('instrumentation only applies when getItem is missing', () => {
    // Already has getItem — polyfill should be skipped
    const realGetItem = () => 'real';
    Object.defineProperty(globalThis, 'localStorage', {
      value: { getItem: realGetItem },
      writable: true,
      configurable: true,
    });
    const shouldPolyfill =
      typeof localStorage !== 'undefined' &&
      typeof (localStorage as any).getItem !== 'function';
    expect(shouldPolyfill).toBe(false);
  });
});
