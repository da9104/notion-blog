'use client';

import { useTranslation } from '@/hooks/useTranslation';

export function InsightBlock() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16 bg-[#121212]">
      <div className="max-w-[1100px] mx-auto px-[var(--sides)]">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-6"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {t.home.dailyInsight}
        </p>
        <div className="relative max-w-2xl">
          <span
            className="absolute -top-6 -left-2 text-7xl leading-none text-white/20 select-none"
            style={{ fontFamily: 'var(--font-headline)' }}
            aria-hidden
          >
            &ldquo;
          </span>
          <blockquote
            className="text-2xl md:text-3xl font-medium italic leading-snug text-white pl-4"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {t.home.quote}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
