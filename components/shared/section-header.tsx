import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: { icon: LucideIcon; text: string };
  title: React.ReactNode;
  description?: string;
  cta?: { label: string; href: string };
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  cta,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-4 mb-8 sm:mb-10',
        centered
          ? 'items-center text-center'
          : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn(centered && 'max-w-2xl')}>
        {eyebrow && <Eyebrow {...eyebrow} centered={centered} />}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {cta && (
        <Button variant="ghost" className="text-primary gap-1.5 self-start sm:self-auto" asChild>
          <Link href={cta.href}>
            {cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}

function Eyebrow({
  icon: Icon,
  text,
  centered,
}: {
  icon: LucideIcon;
  text: string;
  centered: boolean;
}) {
  return (
    <p
      className={cn(
        'section-label mb-2',
        centered && 'justify-center',
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {text}
    </p>
  );
}
