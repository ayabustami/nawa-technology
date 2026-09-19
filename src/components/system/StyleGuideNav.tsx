'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/** Sticky table of contents with scroll-spy for the style guide. */
export function StyleGuideNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -68% 0px', threshold: [0, 0.2, 1] },
    );

    for (const section of sections) {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Design system sections" className="lg:sticky lg:top-28">
      <p className="t-eyebrow mb-5 hidden lg:block">Contents</p>
      <ul className="flex list-none gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:gap-0.5 lg:overflow-visible">
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id} className="shrink-0 lg:shrink">
              <a
                href={`#${section.id}`}
                className={cn(
                  'group/toc flex items-center gap-3 rounded-sm px-3 py-2 text-[0.8125rem] whitespace-nowrap transition-colors duration-300 lg:whitespace-normal',
                  isActive ? 'bg-accent-soft text-accent' : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
                )}
                aria-current={isActive ? 'true' : undefined}
              >
                <span
                  className={cn(
                    'hidden h-px w-4 transition-colors duration-300 lg:block',
                    isActive ? 'bg-accent' : 'bg-line-strong',
                  )}
                  aria-hidden
                />
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
