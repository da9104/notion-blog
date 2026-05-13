'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import ToggleThemeButton from '@/components/toggle-theme-button';
import { LocaleToggle } from '@/components/LocaleToggle';

const credentials = [
  'Awarded 1st Prize — Open Source Contest Korea 2024',
  'Regex Technical Code Writer, Python ML (한국어) @ Tech Mahindra',
  'BSc Software Development for Business @ Glasgow Caledonian University 2023',
  'World Skills UK National Finalist — Web Design & Development 2021',
];

const tabs = [
  { label: 'Home', href: '/' },
  { label: 'Archives', href: '/search' },
  { label: 'Contact', href: '/about#contact' },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-[280px] bg-[var(--background)] border-r border-[var(--outline-variant)] px-6 py-8 z-40 overflow-y-auto">

      {/* Logo */}
      <Link href="/" className="block mb-1">
        <p
          className="text-2xl font-bold tracking-tight text-[var(--foreground)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          ©DAMI UI
        </p>
      </Link>

      {/* Tagline */}
      <p
        className="text-xs italic text-[var(--tertiary)] leading-relaxed mb-8"
        style={{ fontFamily: 'var(--font-headline)' }}
      >
        {t.footer.tagline}
      </p>

      {/* Divider */}
      <div className="border-t border-[var(--outline-variant)] mb-6" />

      {/* Nav links */}
      <nav className="flex flex-col gap-1 mb-8">
        {tabs.map(({ label, href }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href.split('#')[0]);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-semibold uppercase tracking-widest transition-colors',
                active
                  ? 'bg-[var(--neutral)] text-[var(--foreground)]'
                  : 'text-[var(--tertiary)] hover:text-[var(--foreground)] hover:bg-[var(--neutral)]'
              )}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-[var(--outline-variant)] mb-6" />

      {/* Profile */}
      <p
        className="text-base font-medium text-[var(--foreground)] mb-4"
        style={{ fontFamily: 'var(--font-headline)' }}
      >
        Sign up for our free newsletters.
      </p>

      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)]">
        Stay up to date with new posts, practical guides, and tools—no spam, just useful reads.
      </p>
      <ul className="flex flex-col gap-3 mb-auto">
        {/* {credentials.map((item, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span
              className="text-[10px] font-semibold text-[var(--tertiary)] tabular-nums w-4 shrink-0 mt-0.5"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="text-xs leading-relaxed text-[var(--tertiary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {item}
            </span>
          </li>
        ))} */}
      </ul>

      {/* Bottom controls */}
      <div className="mt-8 pt-6 border-t border-[var(--outline-variant)]">
        <div className="flex items-center gap-2 mb-3">
          <LocaleToggle />
          <ToggleThemeButton />
        </div>
        <p
          className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          © {new Date().getFullYear()} {t.footer.copyright}
        </p>
      </div>

    </aside>
  );
}
