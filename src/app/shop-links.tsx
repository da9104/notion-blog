import Link from 'next/link';
import { cn } from '@/lib/utils';

const collections: any[] = [
  {
    link: '/',
    title: 'Home',
  },
  {
    link: '/about',
    title: 'About',
  },
  {
    link: '/search',
    title: 'Search',
  },
];

export function ShopLinks({ className } : { className?: string }) {
  const align = 'left';
  const label = 'Menu';
  
  return (
    <div className={cn(align === 'left' ? 'text-left' : 'text-right', className)}>
      <h4 className="text-lg font-extrabold md:text-xl">{label}</h4>
      <ul className="flex flex-col gap-1.5 leading-5 mt-5">
        {collections.map((item: any, index: any) => (
          <li key={`${item.handle}-${index}`}>
            <Link href={`${item.link}`} prefetch>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
