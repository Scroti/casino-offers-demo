'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface RotatingWordProps {
  words: string[];
  intervalMs?: number;
  className?: string;
}

// Mobile-safe rotating text: words wrap inline naturally and animate via
// opacity/transform only — no width measurement, no overflow that could
// push content out of the viewport on small screens.
export function RotatingWord({
  words,
  intervalMs = 3000,
  className,
}: RotatingWordProps) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((p) => (p + 1) % words.length);
        setVisible(true);
      }, 220);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  return (
    <span
      className={cn(
        'inline-block transition-all duration-300 will-change-transform',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1.5',
        className,
      )}
    >
      {words[idx]}
    </span>
  );
}
