import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export const badgeVariants = cva('inline-flex items-center rounded-md px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider', {
  variants: {
    variant: {
      home: 'bg-green/13 text-green-dark',
      business: 'bg-navy/10 text-navy',
      case: 'bg-amber/16 text-[#8a5a06]',
      neutral: 'bg-cream text-navy/80 normal-case tracking-normal font-medium rounded-full px-2.5 text-xs',
    },
  },
  defaultVariants: { variant: 'neutral' },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
