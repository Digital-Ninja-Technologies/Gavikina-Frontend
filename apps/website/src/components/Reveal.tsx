import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';
import { cn } from '@gavikina/ui';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>(delay);
  return (
    <div
      ref={ref}
      className={cn('opacity-0 motion-reduce:opacity-100', visible && 'animate-gv-rise opacity-100', className)}
    >
      {children}
    </div>
  );
}
