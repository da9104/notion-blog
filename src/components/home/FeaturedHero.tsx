'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ProcessedPost } from '@/types/post';
import { useTranslation } from '@/hooks/useTranslation';

interface FeaturedHeroProps {
  post: ProcessedPost;
}

export function FeaturedHero({ post }: FeaturedHeroProps) {
  const { t } = useTranslation();
  const category = post.tags[0]?.name ?? 'Featured';

  return (
    <section className="relative w-full aspect-[4/5] sm:aspect-[16/9] overflow-hidden bg-[var(--neutral)]">
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          priority
          quality={90}
          className="object-cover"
          unoptimized
        />
      )}

      {/* Gradient protection */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Caption card */}
      <div className="absolute bottom-0 left-0 w-full p-[var(--sides)] pb-8 md:pb-10">
        <div className="max-w-[1100px] mx-auto">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest text-white/80 mb-3"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.home.featured} &nbsp;·&nbsp; {category}
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight text-white mb-4 max-w-2xl"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {post.title}
          </h1>
          {post.description && (
            <p
              className="text-sm text-white/80 mb-6 max-w-md leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {post.description}
            </p>
          )}
          <Link
            href={`/posts/${post.slug}`}
            className="inline-block bg-white dark:text-black text-black text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-white/90 transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.home.readStory}
          </Link>
        </div>
      </div>
    </section>
  );
}
