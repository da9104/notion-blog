# Session: Notion Sync Bug Fixes + Desktop Layout Redesign

**Date:** 2026-04-29  
**Branch:** main

---

## Summary

This session covered two major workstreams:
1. Fixing Notion post sync bugs (new posts not appearing, image handling)
2. Adding a Vigloo-inspired fixed left sidebar for desktop

---

## Part 1 — Notion Sync Bug Fixes

### Root Causes Found

| Bug | File | Description |
|-----|------|-------------|
| 1-hour in-memory cache | `src/lib/notion.ts` | `CACHE_TTL = 1000 * 60 * 60` blocked new posts for up to 1 hour |
| Broken empty-state throw | `src/lib/notion.ts:121` | `if (!response.results.length) throw` incorrectly errored on empty DB |
| Homepage static cache | `src/app/page.tsx` | No `dynamic = 'force-dynamic'` — Next.js may statically cache the page |
| Notion image URL expiry | `src/lib/notion.ts` | Notion images hosted on AWS S3 with expiring signed URLs |
| `Featured` property casing | `src/lib/processPost.ts` | Used `post.properties.featured` but Notion property is `Featured` |
| Hero fallback hiding real state | `src/app/page.tsx` | `?? posts[0]` fallback showed a non-featured post as hero |
| ForYouSection wrong filter | `src/app/page.tsx` | Filtered by `p.id !== featured?.id` instead of `!p.featured` |

---

### Changes Made

#### `src/lib/notion.ts`
- `CACHE_TTL` reduced: `1 hour → 5 minutes`
- Image pipeline overhauled:
  - Checks `fs.existsSync()` before downloading — images already saved to disk are never re-fetched
  - New images: fetched from S3, converted to **WebP at quality 80** via `sharp`, saved to `public/notion-images/<block.id>.webp`
  - Block URL always rewritten to `/notion-images/<block.id>.webp`
- Removed broken empty-state `throw` (was preventing cache update on empty DB)
- Exported `clearCache()` function for on-demand invalidation

#### `src/app/page.tsx`
- Added `export const dynamic = 'force-dynamic'`
- Hero selection: `posts.find(p => p.featured)` — no fallback (if no post is featured, shows "No posts published yet")
- ForYouSection: `posts.filter(p => !p.featured).slice(0, 6)` — only non-featured posts

#### `src/lib/processPost.ts`
- Added extraction of `post.properties.Featured` (capital F — matches Notion property name exactly)
- Returns `featured: featuredProp?.checkbox ?? false`

#### `src/types/post.ts`
- Added `featured?: boolean` to `ProcessedPost` interface

#### `src/app/api/revalidate/route.ts` *(new)*
- `GET /api/revalidate?secret=<REVALIDATE_SECRET>`
- Calls `clearCache()` + `revalidatePath('/')` + `revalidatePath('/posts/[slug]', 'page')` + `revalidatePath('/category/[slug]', 'page')`
- Requires `REVALIDATE_SECRET` env var

#### `next.config.js`
- Added `outputFileTracingRoot: path.join(__dirname)` — silences Next.js workspace root warning caused by multiple lockfiles

#### Dependencies
- Added `sharp` + `@types/sharp` for WebP conversion

---

### Environment Variables Required

```env
REVALIDATE_SECRET=<any-string>   # protects /api/revalidate endpoint
```

---

## Part 2 — Desktop Left Sidebar (Vigloo-style Layout)

### Design Intent

Inspired by [Vigloo](https://vigloo.com): fixed left branding panel on desktop, scrollable phone-frame content on the right. Mobile layout unchanged.

### Layout Architecture

```
Mobile (< lg):
  [     phone frame 430px centered     ]

Desktop (≥ lg):
  [ DesktopSidebar 280px ][ phone frame 430px, centered in remaining space ]
        fixed                    scrollable
```

---

### Changes Made

#### `src/components/layout/DesktopSidebar.tsx` *(new)*
- `hidden lg:flex flex-col` — desktop only, hidden on mobile
- `fixed inset-y-0 left-0 w-[280px]` — full-height fixed panel
- `bg-[var(--background)] border-r border-[var(--outline-variant)]` — theme-aware bg (dark/light mode)
- Content:
  - `©DAMI UI` logo → links to `/`
  - Tagline from `t.footer.tagline`
  - Nav links: Home / Archives / Contact with active state
  - Compact credentials list (4 items, same as `ProfileCard`)
  - Bottom: `LocaleToggle` + `ToggleThemeButton` + copyright

#### `src/app/layout.tsx`
- Imported and added `<DesktopSidebar />` before the phone frame
- Wrapped phone frame in `<div className="lg:pl-[280px]">` to offset it right of the sidebar on desktop

#### `src/components/layout/BottomNav.tsx`
- Added `lg:hidden` — BottomNav is mobile-only; desktop navigation is handled by the sidebar

#### `src/components/layout/Header/Header.tsx`
- On desktop (`lg:`): Header now spans `left-[280px]` to `right-0` (full non-sidebar width)
- Inner div gets `lg:max-w-[430px] lg:mx-auto` — content aligns with phone frame center
- `lg:border-b-0` — removes bottom border line on desktop; mobile keeps `border-b`

---

### Key Design Decisions

| Decision | Reason |
|----------|--------|
| Sidebar width: `280px` | Comfortable reading width for credentials list; leaves ample room for 430px phone frame |
| Theme-aware background (`var(--background)`) | User requested dark/light mode support instead of hardcoded dark |
| `lg:pl-[280px]` offset wrapper | Cleanest approach — doesn't break `mx-auto` centering inside the phone frame |
| `lg:border-b-0` on header | Backdrop blur provides visual separation on desktop; hard border looked disconnected across the wide header span |
| BottomNav hidden on desktop | Redundant with DesktopSidebar nav; prevents misalignment (it uses `left-1/2` fixed positioning) |

---

## Files Modified (Full List)

| File | Type | Changes |
|------|------|---------|
| `src/lib/notion.ts` | Modified | Cache TTL, WebP image pipeline, clearCache export, empty-state fix |
| `src/lib/processPost.ts` | Modified | Extract `Featured` checkbox, return `featured` field |
| `src/types/post.ts` | Modified | Add `featured?: boolean` |
| `src/app/page.tsx` | Modified | force-dynamic, featured filter, forYou filter |
| `src/app/api/revalidate/route.ts` | New | On-demand cache invalidation endpoint |
| `src/components/layout/DesktopSidebar.tsx` | New | Fixed left branding panel |
| `src/app/layout.tsx` | Modified | Add DesktopSidebar, lg:pl-[280px] wrapper |
| `src/components/layout/BottomNav.tsx` | Modified | lg:hidden |
| `src/components/layout/Header/Header.tsx` | Modified | Desktop positioning fix, lg:border-b-0 |
| `next.config.js` | Modified | outputFileTracingRoot |
| `package.json` | Modified | Added sharp, @types/sharp |
