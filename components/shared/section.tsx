import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Background = 'default' | 'muted' | 'hero';

const backgroundClass: Record<Background, string> = {
  default: 'bg-background',
  muted: 'bg-muted/25',
  hero: '',
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: Background;
  containerClassName?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { background = 'default', className, containerClassName, children, ...rest },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn(
        'py-12 sm:py-16 lg:py-20 px-4 relative',
        backgroundClass[background],
        className,
      )}
      {...rest}
    >
      <div className={cn('container mx-auto max-w-7xl relative', containerClassName)}>
        {children}
      </div>
    </section>
  );
});
