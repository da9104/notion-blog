import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockQuery = vi.fn().mockResolvedValue({
  results: [
    {
      id: 'post-1',
      object: 'page',
      properties: {
        Title: { title: [{ plain_text: 'Test Post' }] },
        Slug: { type: 'rich_text', rich_text: [{ plain_text: 'test-post' }] },
        Published: { checkbox: true },
        PublishedDate: { date: { start: '2024-01-01' } },
        Tags: { multi_select: [{ id: 'tag-1', name: 'Design' }] },
        Description: { rich_text: [{ plain_text: 'A test post' }] },
        File: { type: 'files', files: [] },
      },
      cover: null,
    },
  ],
});

const mockBlocksList = vi.fn().mockResolvedValue({ results: [] });

vi.mock('@notionhq/client', () => {
  class Client {
    databases = { query: mockQuery };
    blocks = { children: { list: mockBlocksList } };
  }
  return { Client };
});

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
  existsSync: vi.fn().mockReturnValue(true),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.stubEnv('NEXT_PUBLIC_NOTION_DATABASE_ID', 'test-db-id');
vi.stubEnv('NEXT_PUBLIC_NOTION_API_KEY', 'test-api-key');

describe('notionFetch', () => {
  beforeEach(() => {
    vi.resetModules();
    mockQuery.mockClear();
    mockBlocksList.mockClear();
  });

  it('returns posts from Notion API', async () => {
    const { notionFetch } = await import('../../src/lib/notion');
    const result = await notionFetch({});
    expect(result.data).toHaveLength(1);
    expect((result.data as any[])[0].id).toBe('post-1');
  });

  it('returns blocks array', async () => {
    const { notionFetch } = await import('../../src/lib/notion');
    const result = await notionFetch({});
    expect(Array.isArray(result.blocks)).toBe(true);
  });

  it('serves from cache on second call within TTL', async () => {
    const { notionFetch } = await import('../../src/lib/notion');
    await notionFetch({});
    const callCount = mockQuery.mock.calls.length;
    await notionFetch({});
    expect(mockQuery.mock.calls.length).toBe(callCount);
  });
});
