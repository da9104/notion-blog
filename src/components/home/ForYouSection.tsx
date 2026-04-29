'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProcessedPost } from '@/types/post';
import { useTranslation } from '@/hooks/useTranslation';

interface ForYouSectionProps {
  posts: ProcessedPost[];
}

export function ForYouSection({ posts }: ForYouSectionProps) {
  const { t, locale } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const SCROLL_AMOUNT = 245;

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
  }, [checkScroll, posts]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1100px] mx-auto px-[var(--sides)]">
        {/* Section header */}
        <div className="flex items-baseline justify-between mb-8">
          <h2
            className="text-2xl font-medium"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {t.home.forYou}
          </h2>
          <Link
            href="/search"
            className="text-xs font-semibold uppercase tracking-widest text-[var(--tertiary)] hover:text-[var(--foreground)] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.home.viewAll}
          </Link>
        </div>

        {/* Scroll area with hover-reveal nav buttons */}
        <div className="relative group/carousel -mx-[var(--sides)]">

          {/* Left button */}
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className={cn(
              'absolute left-2 top-[40%] -translate-y-1/2 z-10 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200',
              'bg-[var(--background)]/90 backdrop-blur-sm border border-[var(--outline-variant)] text-[var(--foreground)]',
              'hover:border-[var(--primary)] hover:bg-[var(--background)]',
              canScrollLeft
                ? 'opacity-0 group-hover/carousel:opacity-100'
                : 'opacity-0 pointer-events-none'
            )}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>

          {/* Right button */}
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className={cn(
              'absolute right-2 top-[40%] -translate-y-1/2 z-10 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200',
              'bg-[var(--background)]/90 backdrop-blur-sm border border-[var(--outline-variant)] text-[var(--foreground)]',
              'hover:border-[var(--primary)] hover:bg-[var(--background)]',
              canScrollRight
                ? 'opacity-0 group-hover/carousel:opacity-100'
                : 'opacity-0 pointer-events-none'
            )}
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>

          {/* Scroll row */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-[var(--sides)]"
          >
            {posts.map((post) => {
              const category = post.tags[0]?.name ?? 'Article';
              return (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="flex-none w-[220px] sm:w-[260px] group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-[var(--neutral)] mb-3">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[var(--surface-container-high)]" />
                    )}
                  </div>

                  {/* Meta */}
                  <p
                    className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)] mb-1"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {category}
                  </p>
                  <h3
                    className="text-lg font-medium leading-snug text-[var(--foreground)] line-clamp-2"
                    style={{ fontFamily: 'var(--font-headline)' }}
                  >
                    {post.title}
                  </h3>
                  {post.date && (
                    <p
                      className="text-xs text-[var(--tertiary)] mt-1"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {new Date(post.date).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
