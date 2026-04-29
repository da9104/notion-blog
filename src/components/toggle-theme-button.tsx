'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

type ToggleThemeButtonProps = {
  className?: string;
  inverted?: boolean;
};

const ToggleThemeButton = ({ className, inverted }: ToggleThemeButtonProps) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn('h-[45px] w-[45px] rounded-full', className)} />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative flex items-center justify-center h-[45px] w-[45px] rounded-full overflow-hidden transition-colors border-2',
        inverted
          ? 'border-white/30 hover:border-white hover:bg-white/10'
          : 'border-[var(--outline-variant)] hover:border-[var(--primary)] hover:bg-[var(--neutral)]',
        className
      )}
    >
      <div className="relative overflow-hidden h-full w-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            className="absolute flex items-center justify-center"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {isDark
              ? <Moon size={16} className={inverted ? 'text-white' : 'text-[var(--foreground)]'} />
              : <Sun size={16} className={inverted ? 'text-white' : 'text-[var(--foreground)]'} />
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </button>
  );
};

export default ToggleThemeButton;
