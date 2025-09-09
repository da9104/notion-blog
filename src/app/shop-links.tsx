import Link from 'next/link';
// import { Collection } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

// interface ShopLinksProps {
//   collections: any[];
//   align?: 'left' | 'right';
//   label?: string;
//   className?: string;
// }

const collections: any[] = [
  {
    handle: 'all',
    title: 'All',
  },
  {
    handle: 'frontpage',
    title: 'Frontpage',
  },
  {
    handle: 'shop',
    title: 'Shop',
  },
];

export function ShopLinks() {
  const align = 'left';
  const label = 'Shop';
  const className = '';
  
  return (
    <div className={cn(align === 'left' ? 'text-left' : 'text-right', className)}>
      <h4 className="text-lg font-extrabold md:text-xl">{label}</h4>

      <ul className="flex flex-col gap-1.5 leading-5 mt-5">
        {collections.map((item: any, index: any) => (
          <li key={`${item.handle}-${index}`}>
            <Link href={`/shop/${item.handle}`} prefetch>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
