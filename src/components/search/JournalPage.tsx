'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PostListItem } from './PostListItem';
import type { ProcessedPost } from '@/types/post';
import { useTranslation } from '@/hooks/useTranslation';

interface JournalPageProps {
  posts: ProcessedPost[];
  query?: string;
}

export function JournalPage({ posts, query = '' }: JournalPageProps) {
  const [inputValue, setInputValue] = useState(query);
  const { t } = useTranslation();

  const filteredPosts = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.name.toLowerCase().includes(q)) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [posts, inputValue]);

  return (
    <div className="px-[var(--sides)]">
      {/* Page header */}
      <div className="mb-8">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)] mb-3"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {t.journal.archiveLabel}
        </p>
        <h1
          className="text-5xl font-medium leading-[1.1] tracking-tight text-[var(--foreground)] mb-3"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          {t.journal.heading}
        </h1>
        <p
          className="text-base leading-relaxed text-[var(--tertiary)]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {t.journal.description}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-2">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--tertiary)]"
          strokeWidth={1.5}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t.journal.searchPlaceholder}
          className="w-full bg-[var(--neutral)] rounded-full pl-9 pr-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--outline-variant)]"
          style={{ fontFamily: 'var(--font-body)' }}
        />
      </div>

      {/* Top divider */}
      <div className="border-b border-[var(--outline-variant)] mb-0 mt-6" />

      {/* Post list */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center">
          <p
            className="text-sm text-[var(--tertiary)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.journal.noResults} &ldquo;{inputValue}&rdquo;
          </p>
        </div>
      ) : (
        <div>
          {filteredPosts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
