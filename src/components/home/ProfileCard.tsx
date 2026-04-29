'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

const credentials = [
  'Awarded 1st Prize — Open Source Contest Korea 2024',
  'Regex Technical Code Writer, Python ML (한국어) @ Tech Mahindra',
  'BSc Software Development for Business @ Glasgow Caledonian University 2023',
  'World Skills UK National Finalist — Web Design & Development 2021',
];

export function ProfileCard() {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-[var(--surface-container)] px-[var(--sides)]">

      {/* Label */}
      <p
        className="text-[10px] font-semibold uppercase tracking-widest text-[var(--tertiary)] mb-5"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {t.profile.label}
      </p>

      {/* Name */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-5xl font-medium leading-tight mb-5"
        style={{ fontFamily: 'var(--font-headline)' }}
      >
        Dami K.
      </motion.h2>

      {/* Bio */}
      <p
        className="text-base leading-relaxed text-[var(--tertiary)] mb-10"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {t.profile.bio}
      </p>

      {/* Credentials */}
      <ul>
        {credentials.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: 'easeOut' }}
            className="flex gap-4 items-start border-b border-[var(--outline-variant)] py-4 last:border-0"
          >
            <span
              className="text-xs font-semibold text-[var(--tertiary)] mt-0.5 tabular-nums w-5 shrink-0"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="text-sm leading-relaxed text-[var(--foreground)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
