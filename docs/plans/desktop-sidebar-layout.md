# Plan: Desktop Left Sidebar (Vigloo-style Layout)

**Status:** Completed 2026-04-29

## Context

User wanted a fixed left branding panel on desktop only, inspired by the Vigloo website. Mobile layout stays as a phone frame. Desktop gets a 280px fixed left panel with branding, nav, credentials, and controls.

## Layout

```
Mobile (< lg):
  [     phone frame 430px centered     ]

Desktop (≥ lg):
  [ DesktopSidebar 280px fixed ][ phone frame 430px, mx-auto in remaining space ]
```

## Implementation

### New component: `src/components/layout/DesktopSidebar.tsx`
- `hidden lg:flex flex-col fixed inset-y-0 left-0 w-[280px]`
- `bg-[var(--background)]` — theme-aware, follows dark/light mode
- `border-r border-[var(--outline-variant)]` — right divider
- Content: logo → tagline → nav links → credentials → LocaleToggle + ThemeToggle + copyright

### `src/app/layout.tsx`
- Added `<DesktopSidebar />` before the phone frame
- Wrapped phone frame in `<div className="lg:pl-[280px]">` to offset on desktop

### `src/components/layout/BottomNav.tsx`
- Added `lg:hidden` — desktop uses sidebar nav instead

### `src/components/layout/Header/Header.tsx`
- Desktop: `lg:left-[280px] lg:right-0 lg:translate-x-0 lg:max-w-none` — spans non-sidebar area
- Inner div: `lg:max-w-[430px] lg:mx-auto` — aligns with phone frame
- `lg:border-b-0` — backdrop blur handles visual separation; hard border looked wrong spanning full width

## Key Decisions

- Sidebar width `280px` — comfortable for credentials list, doesn't cramp phone frame on 1280px+ screens
- Theme-aware background — user explicitly requested dark/light mode support
- `lg:pl-[280px]` on wrapper (not on the phone frame div itself) — preserves `mx-auto` centering inside
- BottomNav hidden on desktop — fixed `left-1/2` positioning would misalign with offset phone frame
- `lg:border-b-0` on header — cleaner than `overflow: hidden`; border rendered across 1000px+ width looked disconnected
