import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) =>
    React.createElement('a', { href, ...props }, children),
}));

vi.mock('lucide-react', () => ({
  Search: () => React.createElement('span', null, 'search'),
  Home: () => React.createElement('span', null, 'home'),
  User: () => React.createElement('span', null, 'user'),
  Mail: () => React.createElement('span', null, 'mail'),
}));

describe('Header SSR', () => {
  it('renders without throwing', async () => {
    const { Header } = await import('../../src/components/layout/Header/Header');
    expect(() => renderToString(React.createElement(Header))).not.toThrow();
  });

  it('renders logo text', async () => {
    const { Header } = await import('../../src/components/layout/Header/Header');
    const html = renderToString(React.createElement(Header));
    expect(html).toContain('©DAMI UI');
  });

  it('renders nav items', async () => {
    const { Header } = await import('../../src/components/layout/Header/Header');
    const html = renderToString(React.createElement(Header));
    expect(html).toContain('Home');
    expect(html).toContain('About');
    expect(html).toContain('Search');
  });
});

describe('BottomNav SSR', () => {
  it('renders without throwing', async () => {
    const BottomNavModule = await import('../../src/components/layout/BottomNav');
    const BottomNav = BottomNavModule.default;
    expect(() => renderToString(React.createElement(BottomNav))).not.toThrow();
  });

  it('renders all 4 tab labels', async () => {
    const BottomNavModule = await import('../../src/components/layout/BottomNav');
    const BottomNav = BottomNavModule.default;
    const html = renderToString(React.createElement(BottomNav));
    expect(html).toContain('Home');
    expect(html).toContain('Search');
    expect(html).toContain('About');
    expect(html).toContain('Contact');
  });
});
