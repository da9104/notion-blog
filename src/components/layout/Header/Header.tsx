'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItem {
  title: string;
  href: string;
}

export const navItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Search', href: '/search' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full max-w-[430px] left-1/2 -translate-x-1/2 lg:left-[280px] lg:right-0 lg:translate-x-0 lg:max-w-none lg:w-auto border-b border-[var(--outline-variant)]/40 lg:border-b-0 bg-[var(--background)]/80 backdrop-blur-md">
      <div className="lg:max-w-[430px] lg:mx-auto px-[var(--sides)] h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          prefetch
          className="text-xl font-bold tracking-tight text-[var(--foreground)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          ©DAMI UI
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch
                  className={cn(
                    'text-xs font-semibold uppercase tracking-widest transition-colors',
                    pathname === item.href
                      ? 'text-[var(--foreground)]'
                      : 'text-[var(--tertiary)] hover:text-[var(--foreground)]'
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile: search icon only (nav handled by BottomNav) */}
        <Link
          href="/search"
          className="md:hidden text-[var(--foreground)] p-1"
          aria-label="Search"
        >
          <Search size={20} strokeWidth={1.5} />
        </Link>
      </div>
    </header>
  );
}

export default Header;
