import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.NEXT_PUBLIC_TEST_BASE_URL || 'http://localhost:3000';

describe.skipIf(!process.env.NEXT_PUBLIC_TEST_E2E)('E2E: Home page', () => {
  it('returns 200', async () => {
    const res = await fetch(BASE_URL + '/');
    expect(res.status).toBe(200);
  });

  it('returns HTML content type', async () => {
    const res = await fetch(BASE_URL + '/');
    expect(res.headers.get('content-type')).toContain('text/html');
  });

  it('contains brand name in HTML', async () => {
    const res = await fetch(BASE_URL + '/');
    const html = await res.text();
    expect(html).toContain('DAMI UI');
  });

  it('does not contain server error indicator', async () => {
    const res = await fetch(BASE_URL + '/');
    const html = await res.text();
    expect(html).not.toContain('Application error');
    expect(html).not.toContain('TypeError');
  });

  it('/about returns 200', async () => {
    const res = await fetch(BASE_URL + '/about');
    expect(res.status).toBe(200);
  });

  it('/search returns 200', async () => {
    const res = await fetch(BASE_URL + '/search');
    expect(res.status).toBe(200);
  });
});
