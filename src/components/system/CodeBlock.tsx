'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Code sample with a copy affordance. Used across the style guide. */
export function CodeBlock({
  code,
  language = 'ts',
  className,
  title,
  maxHeight,
}: {
  code: string;
  language?: string;
  className?: string;
  title?: string;
  maxHeight?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className={cn('overflow-hidden rounded-md border border-line bg-bg-deep', className)}>
      <figcaption className="flex items-center justify-between gap-4 border-b border-line bg-surface-2/40 px-4 py-2.5">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-fg-subtle">
          {title ?? language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-xs px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-subtle transition-colors duration-300 hover:bg-surface-3 hover:text-accent"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <Check className="size-3" strokeWidth={2} aria-hidden /> : <Copy className="size-3" strokeWidth={1.6} aria-hidden />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>
      <pre
        className="overflow-auto p-4 font-mono text-[0.75rem] leading-relaxed text-fg-muted"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}
