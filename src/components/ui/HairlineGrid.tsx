import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------
   HairlineGrid — an elegant spec-sheet grid.
   Cells share single-pixel rules instead of floating in gutters, which gives
   NAWA its precise, technical, editorial feel.
   ---------------------------------------------------------------------- */

export function HairlineGrid({
  children,
  columns = 'sm:grid-cols-2 lg:grid-cols-4',
  className,
  cellClassName,
  as: Tag = 'div',
}: {
  children: ReactNode;
  columns?: string;
  className?: string;
  cellClassName?: string;
  as?: 'div' | 'ul' | 'ol';
}) {
  return (
    <Tag className={cn('grid border-e border-b border-line', columns, className)}>
      {Array.isArray(children)
        ? children.map((child, i) => {
            const Cell = Tag === 'div' ? 'div' : 'li';
            return (
              <Cell key={i} className={cn('border-s border-t border-line', cellClassName)}>
                {child}
              </Cell>
            );
          })
        : children}
    </Tag>
  );
}

/** A single cell inside HairlineGrid with consistent internal rhythm. */
export function GridCell({
  children,
  className,
  pad = 'p-5 sm:p-6',
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        'group/cell relative h-full',
        pad,
        hover && 'transition-colors duration-500 ease-[var(--ease-nawa)] hover:bg-surface-2/70',
        className,
      )}
    >
      {children}
    </div>
  );
}
