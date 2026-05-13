# Plan: Notion Post Sync Bug Fixes + Image Pipeline

**Status:** Completed 2026-04-29

## Context

New posts created in Notion were not appearing on the blog. Root cause was a 1-hour in-memory cache blocking fresh data, compounded by no revalidation mechanism, and Notion's S3-hosted images expiring after a period of time.

## Bugs Fixed

1. **1-hour cache TTL** → reduced to 5 minutes (`src/lib/notion.ts`)
2. **No on-demand revalidation** → new `/api/revalidate` endpoint
3. **Homepage not force-dynamic** → added `export const dynamic = 'force-dynamic'`
4. **Image re-download on every cache miss** → `fs.existsSync()` guard added
5. **Images stored as JPEG, S3 URLs expire** → converted to WebP via `sharp`, served from `public/notion-images/`
6. **`Featured` property casing wrong** → `post.properties.featured` → `post.properties.Featured`
7. **Hero showed fallback post** → removed `?? posts[0]`; hero only shows `Featured = true` posts
8. **ForYouSection filter wrong** → `p.id !== featured?.id` → `!p.featured`
9. **Broken empty-state throw** → removed erroneous throw on empty DB results

## Key Decisions

- `CACHE_TTL = 5 min` — short enough for near-realtime sync, still protects Notion rate limits
- WebP quality `80` — good visual quality / file size tradeoff
- `clearCache()` exported from `notion.ts` — lets the revalidate endpoint clear in-memory state without a server restart
- No fallback for hero — if no post is marked `Featured`, show "No posts published yet" (intentional; user controls featured state in Notion)
