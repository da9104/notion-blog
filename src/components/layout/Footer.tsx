'use client';

import ToggleThemeButton from '../toggle-theme-button';
import { LocaleToggle } from '../LocaleToggle';
import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="px-[var(--sides)] py-4 pb-6">
      <div className="bg-[#121212] rounded-xl p-5 flex flex-col gap-6">

        {/* Brand + controls row */}
        <div className="flex items-center justify-between">
          <p
            className="text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            ©DAMI UI
          </p>
          <div className="flex items-center gap-2">
            <LocaleToggle />
            <ToggleThemeButton inverted />
          </div>
        </div>

        {/* Tagline */}
        <p
          className="text-xs italic text-white/50 leading-relaxed"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          {t.footer.tagline}
        </p>

        {/* Copyright */}
        <p
          className="text-[10px] font-semibold uppercase tracking-widest text-white/40"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {new Date().getFullYear()} {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
