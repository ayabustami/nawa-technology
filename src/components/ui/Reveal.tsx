'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Reveal — scroll-triggered entrance.
 * Adds `data-visible` once the element enters the viewport. All styling is
 * in CSS (`.reveal`, `.line-mask`) so motion stays GPU-cheap and honours
 * `prefers-reduced-motion` globally.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  variant = 'fade-up',
  once = true,
  threshold = 0.12,
  rootMargin = '0px 0px -8% 0px',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  variant?: 'fade-up' | 'fade' | 'line-mask';
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  const base = variant === 'fade' ? 'transition-opacity duration-700 ease-[var(--ease-expo)]' : variant === 'line-mask' ? 'line-mask' : 'reveal';

  return (
    <Tag
      ref={ref as never}
      data-visible={visible}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
      className={cn(base, variant === 'fade' && !visible && 'opacity-0', className)}
    >
      {variant === 'line-mask' ? <span>{children}</span> : children}
    </Tag>
  );
}

/** Staggers a list of children without needing per-item state. */
export function RevealGroup({
  children,
  className,
  step = 70,
  as: Tag = 'div',
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
  as?: ElementType;
}) {
  return (
    <Tag className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * step}>
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
