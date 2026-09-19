import Image from 'next/image';
import type { CaseStudyBlock, Locale } from '@/lib/data/types';
import { tv, tvList } from '@/lib/data/localized';
import { SlotMarker } from '@/components/ui/Slot';
import { AbstractCover } from '@/components/graphics/AbstractCover';

/* -------------------------------------------------------------------------
   CaseStudyBlocks — renders the `blocks` array of a project's case study.
   A block-based schema means your CMS can compose any article without a
   frontend change: heading, paragraph, image, quote, list, metrics, divider.
   ---------------------------------------------------------------------- */

export function CaseStudyBlocks({ blocks, locale }: { blocks: CaseStudyBlock[]; locale: Locale }) {
  if (!blocks.length) return null;

  return (
    <div className="flex flex-col gap-10">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={i} className="t-h3 text-fg text-balance">
                {tv(block.text, locale)}
              </h2>
            );

          case 'paragraph':
            return (
              <p key={i} className="t-body max-w-2xl text-pretty text-[1.0625rem]">
                {tv(block.text, locale)}
              </p>
            );

          case 'image': {
            const alt = tv(block.asset.alt ?? '', locale);
            return (
              <figure key={i} className="-mx-0 sm:mx-0">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-line bg-bg-deep">
                  {block.asset.src ? (
                    <Image src={block.asset.src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 900px" className="object-cover" />
                  ) : (
                    <AbstractCover seed={alt || `block-${i}`} className="size-full" />
                  )}
                </div>
                {block.caption && <figcaption className="t-micro mt-3 text-fg-subtle">{tv(block.caption, locale)}</figcaption>}
              </figure>
            );
          }

          case 'quote':
            return (
              <blockquote key={i} className="relative border-s-2 border-accent ps-6 sm:ps-8">
                <p className="t-h3 text-fg text-balance">{tv(block.text, locale)}</p>
                {block.attribution && (
                  <cite className="mt-4 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-fg-subtle not-italic">
                    {tv(block.attribution, locale)}
                  </cite>
                )}
              </blockquote>
            );

          case 'list': {
            const items = tvList(block.items, locale);
            return (
              <ul key={i} className="grid gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-sm border border-line bg-surface/60 px-4 py-3 text-[0.9375rem] text-fg-muted">
                    <span className="mt-[0.55rem] size-1 shrink-0 rotate-45 bg-accent/70" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            );
          }

          case 'metrics':
            return (
              <dl key={i} className="grid grid-cols-2 border-e border-b border-line sm:grid-cols-4">
                {block.items.map((item, j) => (
                  <div key={j} className="border-s border-t border-line px-4 py-5">
                    <dt className="t-eyebrow mb-3">{tv(item.label, locale)}</dt>
                    <dd className="font-mono text-[1.5rem] leading-none text-fg tabular-nums">{tv(item.value, locale)}</dd>
                  </div>
                ))}
              </dl>
            );

          case 'divider':
            return (
              <div key={i} className="flex items-center gap-4" aria-hidden>
                <span className="rule flex-1" />
                <span className="size-1.5 rotate-45 bg-accent/60" />
                <span className="rule flex-1" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

/** Shown when a project record has no case-study content yet. */
export function CaseStudySlot({ labels }: { labels: { caseStudyBody: string; marker: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <SlotMarker label={labels.marker} />
      <div className="space-y-4">
        <div className="h-px w-full bg-line-subtle" aria-hidden />
        <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-fg-subtle">{labels.caseStudyBody}</p>
        <div className="h-px w-5/6 bg-line-subtle" aria-hidden />
        <div className="h-px w-4/6 bg-line-subtle" aria-hidden />
        <div className="h-px w-full bg-line-subtle" aria-hidden />
      </div>
    </div>
  );
}
