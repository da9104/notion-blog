import Image from 'next/image';
import Link from 'next/link';
import type { ProcessedPost } from '@/types/post';

interface PostListItemProps {
  post: ProcessedPost;
}

export function PostListItem({ post }: PostListItemProps) {
  const category = post.tags[0]?.name ?? 'Article';

  return (
    <>
      <Link href={`/posts/${post.slug}`} className="block group">
        <article className="flex gap-4 py-5">
          {/* Square thumbnail */}
          <div className="w-20 h-20 shrink-0 rounded-sm overflow-hidden bg-[var(--neutral)] relative">
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-[var(--surface-container-high)]" />
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-1 min-w-0">
            <p
              className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {category}
            </p>
            <h2
              className="text-xl font-medium leading-[1.25] text-[var(--foreground)] line-clamp-2"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              {post.title}
            </h2>
            {post.description && (
              <p
                className="text-sm leading-relaxed text-[var(--tertiary)] line-clamp-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {post.description}
              </p>
            )}
          </div>
        </article>
      </Link>
      <div className="border-b border-[var(--outline-variant)]" />
    </>
  );
}
