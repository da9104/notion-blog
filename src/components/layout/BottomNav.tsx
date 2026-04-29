'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const tabs = [
    { label: t.nav.home, href: '/', icon: Home },
    { label: t.nav.archives, href: '/search', icon: LayoutGrid },
    { label: t.nav.contact, href: '/about#contact', icon: Mail },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px] border-t border-[var(--outline-variant)] bg-[var(--background)]/90 backdrop-blur-md">
      <ul className="flex items-center justify-around h-16 px-2">
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href.split('#')[0]);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 transition-colors',
                  active
                    ? 'text-[var(--foreground)]'
                    : 'text-[var(--tertiary)]'
                )}
              >
                <span className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors',
                  active && 'bg-[var(--neutral)]'
                )}>
                  <Icon
                    size={20}
                    strokeWidth={active ? 2 : 1.5}
                  />
                  <span
                    className="text-[10px] font-semibold tracking-widest uppercase"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {label}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
