'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export function ContactSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto px-[var(--sides)]">
        <div className="border border-[var(--outline-variant)] rounded-xl p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)] mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t.home.getInTouch}
            </p>
            <h2
              className="text-3xl md:text-4xl font-medium leading-tight break-keep"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              {t.home.workTogether}
            </h2>
          </div>
          <Link
            href="/about#contact"
            className="inline-block shrink-0 bg-[var(--primary)] text-[var(--background)] text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-sm hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--primary-foreground)' }}
          >
            {t.home.sayHello}
          </Link>
        </div>
      </div>
    </section>
  );
}
