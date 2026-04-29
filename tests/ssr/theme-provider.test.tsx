import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';

// Mock next-themes to test SSR boundary in isolation
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  useTheme: () => ({ theme: 'light', setTheme: () => {} }),
}));

// Import after mock
const ThemeProviderModule = await import('../../src/contexts/ThemeProvider');
const ThemeProvider = ThemeProviderModule.default;

describe('ThemeProvider SSR boundary', () => {
  it('renders without throwing on server', () => {
    expect(() => {
      renderToString(
        React.createElement(ThemeProvider, {
          defaultTheme: 'system', enableSystem: true,
          children: React.createElement('div', { id: 'test' }, 'content'),
        })
      );
    }).not.toThrow();
  });

  it('renders children correctly', () => {
    const html = renderToString(
      React.createElement(ThemeProvider, {
        defaultTheme: 'light',
        children: React.createElement('span', null, 'hello'),
      })
    );
    expect(html).toContain('hello');
  });

  it('does not reference localStorage during SSR', () => {
    // Temporarily break localStorage to verify it's not called
    const original = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      get() { throw new Error('localStorage accessed during SSR!'); },
      configurable: true,
    });

    try {
      expect(() => {
        renderToString(
          React.createElement(ThemeProvider, {
            defaultTheme: 'system',
            children: React.createElement('div', null),
          })
        );
      }).not.toThrow();
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        value: original,
        writable: true,
        configurable: true,
      });
    }
  });
});
