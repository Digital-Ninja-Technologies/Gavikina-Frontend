import { useEffect, useRef, useState } from 'react';

// Lightweight scroll-reveal: returns a ref to attach and whether the
// element has entered the viewport. Includes a fallback timer so content
// never gets stuck invisible if the observer is slow or unsupported.
export function useReveal<T extends HTMLElement = HTMLDivElement>(delayMs = 0) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delayMs);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    const fallback = setTimeout(() => setVisible(true), 1800);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [delayMs]);

  return { ref, visible };
}
