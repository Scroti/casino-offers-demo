import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: ReactNode;
  href?: string;
  className?: string;
  // Renders a hover-only gradient line along the top edge.
  withTopGlow?: boolean;
}

const baseClasses =
  'group relative rounded-2xl border border-border/50 bg-card overflow-hidden ' +
  'transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/8 ' +
  'hover:-translate-y-0.5';

const topGlow = (
  <div
    aria-hidden
    className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent
               opacity-0 group-hover:opacity-100 transition-opacity"
  />
);

export function PremiumCard({ children, href, className, withTopGlow = true }: PremiumCardProps) {
  const content = (
    <>
      {withTopGlow && topGlow}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseClasses, 'block', className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn(baseClasses, className)}>{content}</div>;
}
