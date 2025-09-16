'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useTheme } from "next-themes";

type ToggleButtonProps = {
  options: Array<{
    label: React.ReactNode;
    value: string;
  }>;
  defaultValue?: string;
  className?: string;
  onClick?: (value: string) => void;
};

const ToggleThemeButton = ({
  options,
  defaultValue,
  onClick,
  className,
  ...props
}: ToggleButtonProps) => {
  const [activeValue, setActiveValue] = useState(defaultValue || options[0].value);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a skeleton loader
  }

  const handleClick = (value: string) => {
    const currentIndex = options.findIndex((option) => option.value === value);
    const nextIndex = (currentIndex + 1) % options.length;
    const newValue = options[nextIndex].value;
    setActiveValue(newValue);
    setTheme(theme === "dark" ? "light" : "dark")

    if (onClick) onClick(newValue);
  };


  return (
    <button
      onClick={() => handleClick(activeValue)}
      className={cn(
        'relative border-2 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 flex items-center justify-center h-[45px] w-[45px] rounded-full overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="relative overflow-hidden h-full w-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {options.map((option) => {
            if (option.value !== activeValue) return null;

            return (
              <motion.div
                key={option.value}
                className="absolute flex items-center justify-center"
                initial={{
                  y: 40
                }}
                animate={{
                  y: 0
                }}
                exit={{
                  y: -40
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }}
              >
                {option.label}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </button>
  );
};

export default ToggleThemeButton;
