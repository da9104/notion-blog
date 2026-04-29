'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleProvider';

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'ko' : 'en')}
      aria-label={locale === 'en' ? 'Switch to Korean' : '영어로 전환'}
      className="relative flex items-center justify-center h-[45px] w-[45px] rounded-full overflow-hidden transition-colors border-2 border-white/30 hover:border-white hover:bg-white/10"
    >
      <div className="relative overflow-hidden h-full w-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={locale}
            className="absolute flex items-center justify-center"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <span
              className="text-[11px] font-semibold tracking-widest text-white"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {locale.toUpperCase()}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </button>
  );
}
