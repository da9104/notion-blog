# Security: Next.js Vulnerability Fix

**Date:** 2026-04-29
**Severity:** Critical / High
**Status:** ✅ Resolved — upgraded to `next@15.5.15`

---

## Root Cause

`next@15.3.1` contained 12 known CVEs flagged by Vercel's build gate ("Vulnerable version of Next.js detected, please update immediately.").

### Critical CVEs (build-blocking)

| CVE | Description | Fixed in |
|-----|-------------|----------|
| GHSA-9qr9-h5gf-34mp | **RCE** via React Server Components flight protocol deserialization | 15.3.3 |
| GHSA-4342-x723-ch2f | **SSRF** via improper middleware redirect handling | 15.3.3 |

### High CVEs

| CVE | Description |
|-----|-------------|
| GHSA-w37m-7fhw-fmv9 | Server Actions source code exposure |
| GHSA-ggv3-7p47-pfv8 | HTTP request smuggling in rewrites |
| GHSA-h25m-26qc-wcjf | DoS via HTTP request deserialization in Server Components |
| GHSA-mwv6-3258-q52c | DoS with Server Components |
| GHSA-q4gf-8mx6-v5v3 | DoS with Server Components (variant) |
| GHSA-9g9p-9gw9-jx7f | DoS via Image Optimizer `remotePatterns` misconfiguration |

### Moderate CVEs

| CVE | Description |
|-----|-------------|
| GHSA-r2fc-ccr8-96c4 | Cache poisoning via missing `Vary` header |
| GHSA-g5qg-72qw-gw5v | Cache key confusion for Image Optimization API routes |
| GHSA-xv57-4mr9-wg8v | Content injection via Image Optimization |
| GHSA-3x4c-7xq6-9pq8 | Unbounded `next/image` disk cache growth (storage exhaustion) |

---

## Fix Applied

```diff
- "next": "15.3.1",
+ "next": "15.5.15",
- "eslint-config-next": "15.3.1",
+ "eslint-config-next": "15.5.15",
```

Both `next` and `eslint-config-next` must be kept in sync (same version).

---

## Note on `npm audit` Output

After upgrading, `npm audit` may still list Next.js under an advisory with range `>=9.3.4-canary.0`. This is an **npm registry metadata issue** — the advisory's upper bound (fixed version) was not properly scoped. Do **not** run `npm audit fix --force` for Next.js; it would attempt to downgrade to `next@9.3.3` (a breaking change).

The remaining audit findings are in AWS SDK transitive dependencies (`fast-xml-parser`, `uuid`, `@smithy/*`) — these are not part of the application's runtime surface and do not affect the Vercel build gate.

---

## Future: Keeping Next.js Updated

- Check [nextjs.org/blog](https://nextjs.org/blog) for security patch releases
- Vercel's build gate blocks deploys on any version with a critical/high CVE
- Target: stay within the latest `15.x` patch release
