'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
export interface NavItem {
    title: string;
    href: string;
  }
  
export const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'About',
    href: '/about'
  },
  {
    title: 'Search',
    href: '/search'
  }
];

export function Header() {
  const pathname = usePathname();


  const hiddenHeader = () => {
     if (pathname.startsWith('/posts')) {
       return null
     }
  }

  return (
    <header className="grid fixed top-0 left-0 z-50 grid-cols-3 items-start w-full p-sides md:grid-cols-12 md:gap-sides">
      <div className="block flex-none md:hidden">
        {/* <MobileMenu collections={collections} /> */}
      </div>
      <Link href="/" className="w-full md:h-auto max-w-96 break-keep md:col-span-3 xl:col-span-3" prefetch>
        <p className="md:block hidden text-3xl font-bold shrink-0 ">©DAMI UI</p>
        {/* <LogoSvg className="w-auto h-6 max-md:place-self-center md:w-full md:h-auto max-w-96" /> */}
      </Link>
      <nav className="flex w-full gap-2 justify-end items-center md:col-span-9 xl:col-span-9">
        <ul className={`${hiddenHeader()} items-center gap-5 py-0.5 px-3 bg-background/10 rounded-sm backdrop-blur-md hidden md:flex`}>
          {navItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'font-semibold text-base transition-colors duration-200 uppercase',
                  pathname === item.href ? 'text-foreground' : 'text-foreground/50'
                )}
                prefetch
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header