import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  slide?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Reveal({ children, delay = 0, slide = false, className = '', style }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>(delay);
  const cls = `${slide ? 'reveal-slide' : 'reveal'}${visible ? ' in' : ''} ${className}`.trim();
  return (
    <div ref={ref} className={cls} style={style}>
      {children}
    </div>
  );
}
