import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { getPageContext } from '@/lib/i18n/server';
import { ROUTES } from '@/lib/site';
import { cn } from '@/lib/utils';
import { PageHero } from '@/components/layout/PageHero';
import { StyleGuideNav } from '@/components/system/StyleGuideNav';
import { CodeBlock } from '@/components/system/CodeBlock';
import { Button, ButtonLink, QuietLink } from '@/components/ui/Button';
import { Badge, Tag, MetaRow } from '@/components/ui/Badge';
import { Card, IndexChip, SpecList } from '@/components/ui/Card';
import { EmptyState, EmptyInline, CoreWaitingGlyph } from '@/components/ui/EmptyState';
import { Slot, SlotBox, SlotMarker, SlotRules } from '@/components/ui/Slot';
import { Skeleton, SkeletonCard, SkeletonGrid, SkeletonText } from '@/components/ui/Skeleton';
import { HairlineGrid, GridCell } from '@/components/ui/HairlineGrid';
import { IconTile, ICON_NAMES, resolveIcon } from '@/components/ui/Icon';
import { TextInput, TextArea, SelectInput } from '@/components/ui/Field';
import { CapabilitySkeleton } from '@/components/sections/CapabilityIndex';
import { NawaGlyph, NawaMark } from '@/components/graphics/NawaMark';
import { AbstractCover } from '@/components/graphics/AbstractCover';

export const metadata: Metadata = {
  title: 'Design system',
  description: 'The tokens, components and states the NAWA Technology site is built from.',
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: 'colour', label: 'Colour' },
  { id: 'typography', label: 'Typography' },
  { id: 'layout', label: 'Layout & spacing' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'cards', label: 'Cards & surfaces' },
  { id: 'badges', label: 'Badges & tags' },
  { id: 'icons', label: 'Icons' },
  { id: 'slots', label: 'Content slots' },
  { id: 'states', label: 'Loading / empty / error' },
  { id: 'motion', label: 'Motion' },
  { id: 'responsive', label: 'Responsive' },
  { id: 'data', label: 'Data contract' },
];

export default async function StyleGuidePage() {
  const { t } = await getPageContext();

  return (
    <>
      <PageHero
        eyebrow={t.pageHero.styleGuide.eyebrow}
        title={t.pageHero.styleGuide.title}
        lede={t.pageHero.styleGuide.lede}
        size="md"
        meta={[
          { label: 'Tokens', value: 'src/styles/globals.css' },
          { label: 'Themes', value: 'obsidian · bone' },
          { label: 'Locales', value: 'en · ar (RTL)' },
          { label: 'Status', value: 'Internal' },
        ]}
      />

      <div className="nawa-shell grid gap-12 py-16 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:gap-16 lg:py-20">
        <StyleGuideNav sections={SECTIONS} />

        <div className="min-w-0">
          {/* ------------------------------------------------------------ */}
          <GuideSection id="colour" title="Colour" index="01" note="Two themes, one token set. Components never hardcode a colour — they reference a semantic variable, so switching `data-theme` on <html> repaints the entire product.">
            <SubHead>Semantic tokens — obsidian (default)</SubHead>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {SEMANTIC_TOKENS.map((token) => (
                <Swatch key={token.name} name={token.name} variable={token.variable} usage={token.usage} />
              ))}
            </div>

            <SubHead className="mt-14">Ember — the single accent</SubHead>
            <Ramp
              scale={[
                ['ember-50', 'bg-ember-50'], ['ember-100', 'bg-ember-100'], ['ember-200', 'bg-ember-200'],
                ['ember-300', 'bg-ember-300'], ['ember-400', 'bg-ember-400'], ['ember-500', 'bg-ember-500'],
                ['ember-600', 'bg-ember-600'], ['ember-700', 'bg-ember-700'], ['ember-800', 'bg-ember-800'],
                ['ember-900', 'bg-ember-900'], ['ember-950', 'bg-ember-950'],
              ]}
            />

            <SubHead className="mt-10">Ink — warm neutral</SubHead>
            <Ramp
              scale={[
                ['ink-25', 'bg-ink-25'], ['ink-50', 'bg-ink-50'], ['ink-100', 'bg-ink-100'], ['ink-200', 'bg-ink-200'],
                ['ink-300', 'bg-ink-300'], ['ink-400', 'bg-ink-400'], ['ink-500', 'bg-ink-500'], ['ink-600', 'bg-ink-600'],
                ['ink-700', 'bg-ink-700'], ['ink-800', 'bg-ink-800'], ['ink-900', 'bg-ink-900'], ['ink-950', 'bg-ink-950'],
              ]}
            />

            <SubHead className="mt-10">Bone — light theme ground</SubHead>
            <Ramp
              scale={[
                ['bone-50', 'bg-bone-50'], ['bone-100', 'bg-bone-100'], ['bone-200', 'bg-bone-200'],
                ['bone-300', 'bg-bone-300'], ['bone-400', 'bg-bone-400'], ['bone-500', 'bg-bone-500'],
              ]}
            />

            <div className="mt-10 rounded-md border border-line bg-surface/50 p-5">
              <p className="t-small">
                Switch the theme live with the developer panel (bottom corner, <Kbd>⌘</Kbd> <Kbd>⇧</Kbd> <Kbd>D</Kbd>) or the
                toggle in the footer. Both themes are fully tokenised — no component contains a theme-specific override.
              </p>
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="typography" title="Typography" index="02" note="Geist for Latin display and UI, Geist Mono for labels and numerals, IBM Plex Sans Arabic for the whole RTL layout. Arabic tracking is opened up automatically — negative letter-spacing damages Arabic word shapes.">
            <div className="overflow-hidden rounded-md border border-line">
              <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
                <div className="border-b border-line p-6 sm:border-e sm:border-b-0">
                  <p className="t-display text-fg">Aa</p>
                </div>
                <div className="p-6">
                  <SpecList
                    items={[
                      { label: 'Display', value: 'Geist' },
                      { label: 'Mono', value: 'Geist Mono' },
                      { label: 'Arabic', value: 'IBM Plex Sans Arabic' },
                      { label: 'Weights', value: '300–700' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col">
              {TYPE_SCALE.map((row) => (
                <div key={row.className} className="grid gap-3 border-t border-line py-6 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-8">
                  <div>
                    <p className="font-mono text-[0.6875rem] text-accent">{row.className}</p>
                    <p className="mt-1.5 font-mono text-[0.625rem] leading-relaxed text-fg-subtle">{row.spec}</p>
                  </div>
                  <p className={cn(row.className, 'text-fg')}>{row.sample}</p>
                </div>
              ))}
              <div className="border-t border-line" aria-hidden />
            </div>

            <SubHead className="mt-12">Arabic pairing</SubHead>
            <div className="grid gap-5 sm:grid-cols-2">
              <Card className="p-6">
                <p className="t-eyebrow mb-4">English — ltr</p>
                <p className="t-h3 text-fg">Build what’s next.</p>
                <p className="t-body mt-3">The core, or the seed. Something small that grows into something much bigger.</p>
              </Card>
              <Card className="p-6" >
                <p className="t-eyebrow mb-4">العربية — rtl</p>
                <p className="t-h3 text-fg" dir="rtl" lang="ar" style={{ letterSpacing: '0em' }}>ابنِ ما هو قادم.</p>
                <p className="t-body mt-3" dir="rtl" lang="ar" style={{ lineHeight: 1.9 }}>
                  نواة — الجوهر أو البذرة؛ شيءٌ صغير ينمو ليصبح أكبر بكثير.
                </p>
              </Card>
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="layout" title="Layout & spacing" index="03" note="One shell width, one narrow editorial measure, one fluid gutter, one fluid section rhythm. Every page uses these — never ad-hoc padding.">
            <HairlineGrid columns="sm:grid-cols-2 lg:grid-cols-3">
              {LAYOUT_TOKENS.map((token) => (
                <GridCell key={token.name} pad="p-5">
                  <p className="font-mono text-[0.6875rem] text-accent">{token.name}</p>
                  <p className="mt-2 font-mono text-[0.8125rem] text-fg">{token.value}</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-muted">{token.usage}</p>
                </GridCell>
              ))}
            </HairlineGrid>

            <SubHead className="mt-12">Radii</SubHead>
            <div className="flex flex-wrap items-end gap-6">
              {[
                ['2xs', '2px'], ['xs', '4px'], ['sm', '6px'], ['md', '10px'], ['lg', '14px'], ['xl', '20px'],
              ].map(([name, value]) => (
                <div key={name} className="flex flex-col items-center gap-3">
                  <span
                    className="size-16 border border-line-strong bg-surface-2"
                    style={{ borderRadius: value }}
                    aria-hidden
                  />
                  <span className="font-mono text-[0.625rem] text-fg-subtle">{name} · {value}</span>
                </div>
              ))}
            </div>

            <SubHead className="mt-12">Borders & rules</SubHead>
            <div className="grid gap-4">
              <div className="rounded-sm border border-line p-4"><p className="t-small">border-line — default hairline</p></div>
              <div className="rounded-sm border border-line-strong p-4"><p className="t-small">border-line-strong — emphasis, inputs, frames</p></div>
              <div className="rounded-sm border border-dashed border-line-strong p-4"><p className="t-small">dashed — content slots awaiting data</p></div>
              <div className="rounded-sm border border-accent-line bg-accent-softer p-4"><p className="t-small">border-accent-line — accent emphasis, active filters</p></div>
              <div><span className="rule block" aria-hidden /><p className="t-small mt-3">.rule — fading horizontal divider</p></div>
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="buttons" title="Buttons" index="04" note="Four variants, three sizes. `primary` carries a light sweep on hover; `secondary` warms its border toward the accent. Every button renders as <button>, <Link> or <a> from the same component.">
            <SubHead>Variants</SubHead>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent-outline">Accent outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>

            <SubHead className="mt-12">Sizes</SubHead>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>

            <SubHead className="mt-12">With affordances</SubHead>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href={ROUTES.contact} variant="primary" arrow="up-right">Arrow</ButtonLink>
              <Button variant="secondary" loading>Loading</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <QuietLink href={ROUTES.work}>Quiet link</QuietLink>
            </div>

            <SubHead className="mt-12">Usage</SubHead>
            <CodeBlock
              title="Button.tsx"
              code={`<ButtonLink href="/contact?intent=start-a-project" variant="primary" size="lg" arrow="up-right">
  Start a Project
</ButtonLink>

<Button variant="secondary" loading={isSubmitting} onClick={submit}>
  Send message
</Button>`}
            />
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="inputs" title="Inputs" index="05" note="Label, control, hint and error are one component so the four states can never drift apart. Every field maps to a database column.">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextInput label="Name" placeholder="Your full name" required requiredLabel="Required" optionalLabel="Optional" />
              <TextInput label="Email" type="email" placeholder="name@company.com" required requiredLabel="Required" optionalLabel="Optional" />
              <SelectInput label="Project type" placeholder="Select a project type" optionalLabel="Optional" hint="Options load from your database">
                <option>Project type A</option>
                <option>Project type B</option>
              </SelectInput>
              <TextInput label="Error state" defaultValue="invalid@" error="Enter a valid email address." />
            </div>
            <div className="mt-6">
              <TextArea label="Message" placeholder="What are you building?" rows={4} required requiredLabel="Required" optionalLabel="Optional" counter={<span className="font-mono text-[0.625rem] text-fg-subtle">0/2000</span>} />
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="cards" title="Cards & surfaces" index="06" note="Cards are hairline-bordered surfaces with a top edge that lights on hover. Interactive cards lift 3px. Nothing uses drop shadows as its primary affordance.">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6">
                <p className="t-eyebrow mb-4">Static</p>
                <p className="t-h4 text-fg">Default card</p>
                <p className="t-small mt-2">border-line on var(--surface), radius lg.</p>
              </Card>
              <Card interactive className="p-6">
                <p className="t-eyebrow mb-4">Interactive</p>
                <p className="t-h4 text-fg">Hover me</p>
                <p className="t-small mt-2">Lifts 3px, border warms, top edge glows.</p>
              </Card>
              <Card className="relative overflow-hidden">
                <AbstractCover seed="style-guide-card" className="aspect-[16/9]" />
                <div className="p-6">
                  <p className="t-eyebrow mb-3">With media</p>
                  <p className="t-h4 text-fg">Generated cover</p>
                  <p className="t-small mt-2">Deterministic art from the record slug.</p>
                </div>
              </Card>
            </div>

            <SubHead className="mt-12">Hairline grid</SubHead>
            <HairlineGrid columns="sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <GridCell key={n} pad="p-5">
                  <IndexChip value={String(n).padStart(2, '0')} tone="accent" />
                  <p className="mt-4 text-[0.9375rem] font-medium text-fg">Cell {n}</p>
                  <p className="mt-1.5 text-[0.8125rem] text-fg-muted">Shared 1px rules, no gutters.</p>
                </GridCell>
              ))}
            </HairlineGrid>

            <SubHead className="mt-12">Definition list</SubHead>
            <div className="max-w-md">
              <SpecList
                items={[
                  { label: 'Category', value: '—' },
                  { label: 'Year', value: '—' },
                  { label: 'Client', value: '—' },
                ]}
              />
              <div className="mt-6">
                <MetaRow label="Meta row" value="Alternate form" />
              </div>
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="badges" title="Badges & tags" index="07" note="Monospace, uppercase, wide-tracked. Badges carry state; tags carry taxonomy values straight from the database.">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="neutral">Neutral</Badge>
              <Badge tone="accent">Accent</Badge>
              <Badge tone="outline">Outline</Badge>
              <Badge tone="solid">Solid</Badge>
              <Badge tone="accent" dot>With dot</Badge>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Tag>Technology A</Tag>
              <Tag>Technology B</Tag>
              <Tag>Technology C</Tag>
              <Tag>Stack D</Tag>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <IndexChip value="01" />
              <IndexChip value="02" tone="accent" />
              <SlotMarker label="Content slot" />
              <SlotMarker label="Content slot" tone="accent" />
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="icons" title="Icons" index="08" note={`Lucide at 1.4–1.6 stroke weight. Your database stores an icon *name*; the registry resolves it, and unknown values fall back to the nucleus glyph so a bad CMS entry can never break a card. ${ICON_NAMES.length} names registered.`}>
            <HairlineGrid columns="grid-cols-3 sm:grid-cols-4 lg:grid-cols-6">
              {ICON_NAMES.map((name) => {
                const IconCmp = resolveIcon(name);
                return (
                  <GridCell key={name} pad="p-4" className="flex flex-col items-center gap-3 text-center">
                    <IconCmp className="size-5 text-fg-muted transition-colors duration-300 group-hover/cell:text-accent" strokeWidth={1.4} aria-hidden />
                    <span className="font-mono text-[0.5625rem] break-all text-fg-subtle">{name}</span>
                  </GridCell>
                );
              })}
            </HairlineGrid>

            <SubHead className="mt-12">Icon tiles</SubHead>
            <div className="flex flex-wrap items-center gap-4">
              <IconTile name="layers" size="sm" />
              <IconTile name="layers" />
              <IconTile name="layers" size="lg" />
              <IconTile name="layers" tone="accent" />
              <IconTile name="definitely-not-an-icon" tone="accent" />
            </div>

            <SubHead className="mt-12">Brand mark</SubHead>
            <div className="flex flex-wrap items-center gap-10">
              <span className="size-16 text-fg"><NawaGlyph /></span>
              <NawaMark />
              <NawaMark size="lg" arabicMark="نواة" />
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="slots" title="Content slots" index="09" note="A slot is a marked placeholder for copy that belongs to your database. It is never lorem ipsum and never a fabricated claim — it states plainly what will appear there.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <Slot label="Content slot — Introduction" className="t-h3">
                  Company introduction will appear here.
                </Slot>
                <p className="t-body mt-4">Body slots carry one honest sentence at the real measure.</p>
                <SlotRules lines={4} className="mt-5" />
              </div>
              <div className="flex flex-col gap-6">
                <SlotBox label="Content slot">
                  <p className="text-[0.8125rem] text-fg-subtle">Image will appear here.</p>
                </SlotBox>
                <div className="rounded-sm border border-dashed border-line-strong p-5">
                  <SlotMarker label="Content slot" tone="accent" className="mb-3" />
                  <p className="text-[0.8125rem] text-fg-subtle">Social links will appear here.</p>
                </div>
                <EmptyInline>Feature list will appear here.</EmptyInline>
              </div>
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="states" title="Loading / empty / error" index="10" note="Three states, one component. `AsyncSection` picks between them from the resolved `DataResult` — sections never decide for themselves.">
            <SubHead>Loading — skeletons mirror real geometry</SubHead>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <SkeletonCard variant="service" />
              <SkeletonCard variant="project" />
              <SkeletonCard variant="testimonial" />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <SkeletonCard variant="step" />
              <SkeletonCard variant="value" />
              <div className="rounded-lg border border-line p-5">
                <SkeletonText lines={4} />
                <Skeleton className="mt-5 h-9 w-32 rounded-sm" />
              </div>
              <SkeletonGrid count={1} variant="service" columns="" />
            </div>
            <div className="mt-5">
              <CapabilitySkeleton count={4} columns="sm:grid-cols-2 lg:grid-cols-4" />
            </div>

            <SubHead className="mt-14">Empty — designed, not broken</SubHead>
            <div className="grid gap-5 lg:grid-cols-2">
              <EmptyState
                label="Selected work"
                title="Our work is coming soon."
                body="Projects are published from the NAWA database. Nothing has been released here yet."
                actions={<Button variant="secondary" size="sm" arrow="up-right">Start a Project</Button>}
              />
              <div className="flex flex-col gap-5">
                <EmptyState compact glyph={false} title="No projects in this category." body="Try a different filter." />
                <div className="card p-6">
                  <p className="t-eyebrow mb-4">Inline empty</p>
                  <EmptyInline>Technology list will appear here.</EmptyInline>
                </div>
                <div className="card flex items-center gap-5 p-6">
                  <CoreWaitingGlyph className="size-14 shrink-0" />
                  <div>
                    <p className="t-h4 text-fg">The waiting core</p>
                    <p className="t-small mt-1.5">Every empty state carries the nucleus, dashed orbit and pulse.</p>
                  </div>
                </div>
              </div>
            </div>

            <SubHead className="mt-14">Error — recoverable, never alarming</SubHead>
            <div className="rounded-lg border border-accent-line/60 bg-accent-softer px-6 py-10 text-center">
              <span className="mx-auto mb-4 grid size-10 place-items-center rounded-full border border-accent-line bg-accent-soft text-accent">
                <ArrowUpRight className="size-4" strokeWidth={1.6} aria-hidden />
              </span>
              <p className="t-h4 text-fg">This section could not reach its data source.</p>
              <p className="mt-2 font-mono text-[0.6875rem] text-fg-subtle">API responded 500 for /services</p>
              <Button variant="secondary" size="sm" className="mt-5">Try again</Button>
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="motion" title="Motion" index="11" note="Motion is quiet and short. Reveals run once on scroll; ambient loops run for tens of seconds so they read as texture, not animation. Everything collapses under `prefers-reduced-motion`.">
            <HairlineGrid columns="sm:grid-cols-2 lg:grid-cols-4">
              {MOTION_TOKENS.map((token) => (
                <GridCell key={token.name} pad="p-5">
                  <p className="font-mono text-[0.6875rem] text-accent">{token.name}</p>
                  <p className="mt-2 font-mono text-[0.75rem] break-all text-fg">{token.value}</p>
                  <p className="mt-2 text-[0.8125rem] text-fg-muted">{token.usage}</p>
                </GridCell>
              ))}
            </HairlineGrid>

            <SubHead className="mt-12">Live samples</SubHead>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="grid place-items-center p-6">
                <span className="size-16 text-accent/70 animate-orbit"><NawaGlyph /></span>
                <p className="t-micro mt-4">orbit · 44s</p>
              </Card>
              <Card className="grid place-items-center p-6">
                <CoreWaitingGlyph className="size-16" />
                <p className="t-micro mt-4">pulse-ring · 3.4s</p>
              </Card>
              <Card className="p-6">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="mt-3 h-3 w-4/5" />
                <p className="t-micro mt-4">shimmer · 1.9s</p>
              </Card>
              <Card className="overflow-hidden p-0">
                <div className="marquee mask-fade-x overflow-hidden py-6">
                  <div className="marquee-track gap-8" style={{ ['--marquee-dur' as string]: '18s' }}>
                    {Array.from({ length: 8 }, (_, i) => (
                      <span key={i} className="flex shrink-0 items-center gap-8">
                        <span className="text-[0.8125rem] whitespace-nowrap text-fg-muted">Capability</span>
                        <span className="size-1 rotate-45 bg-accent/60" aria-hidden />
                      </span>
                    ))}
                  </div>
                </div>
                <p className="t-micro px-6 pb-5">marquee · hover to pause</p>
              </Card>
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="responsive" title="Responsive" index="12" note="Mobile is designed, not shrunk. The hero stacks its type first and drops the nucleus behind it; navigation becomes a full-screen sheet; grids collapse to a single column before they collapse to two.">
            <HairlineGrid columns="sm:grid-cols-2 lg:grid-cols-4">
              {BREAKPOINTS.map((bp) => (
                <GridCell key={bp.name} pad="p-5">
                  <p className="font-mono text-[0.6875rem] text-accent">{bp.name}</p>
                  <p className="mt-2 font-mono text-[0.8125rem] text-fg">{bp.range}</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-fg-muted">{bp.behaviour}</p>
                </GridCell>
              ))}
            </HairlineGrid>

            <SubHead className="mt-12">Behaviour by component</SubHead>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse text-start">
                <thead>
                  <tr className="border-b border-line">
                    {['Component', 'Mobile', 'Tablet', 'Desktop'].map((head) => (
                      <th key={head} className="t-eyebrow px-4 py-3 text-start font-medium">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RESPONSIVE_ROWS.map((row) => (
                    <tr key={row[0]} className="border-b border-line-subtle transition-colors duration-300 hover:bg-surface/60">
                      {row.map((cell, i) => (
                        <td key={i} className={cn('px-4 py-3.5 align-top text-[0.8125rem]', i === 0 ? 'font-medium text-fg' : 'text-fg-muted')}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GuideSection>

          {/* ------------------------------------------------------------ */}
          <GuideSection id="data" title="Data contract" index="13" note="Every dynamic section reads a `DataResult<T>`. Point NEXT_PUBLIC_API_URL at your backend and the site populates — no component changes.">
            <CodeBlock title="DataResult<T>" code={`export type DataStatus = 'loading' | 'empty' | 'ready' | 'error';

export interface DataResult<T> {
  status: DataStatus;
  data: T[];
  error?: string;      // only when status === 'error'
  total?: number;      // paginated count
  source: 'api' | 'stub' | 'preview' | 'static';
}`} />

            <div className="mt-5">
              <CodeBlock title="Service" code={`export interface Service {
  id: string;
  slug: string;
  name: Localized<string>;
  shortDescription?: Localized<string>;
  fullDescription?: Localized<string>;
  icon?: string;                 // resolved by the icon registry
  image?: MediaAsset;
  features?: Localized<string>[];
  technologies?: string[];
  cta?: { label: Localized<string>; href: string };
  order?: number;
  featured?: boolean;
  publishedAt?: string;          // ISO-8601
}`} />
            </div>

            <div className="mt-5">
              <CodeBlock title="Project" code={`export interface Project {
  id: string;
  slug: string;
  title: Localized<string>;
  description?: Localized<string>;
  category?: Localized<string>;
  coverImage?: MediaAsset;
  gallery?: MediaAsset[];
  technologies?: string[];
  date?: string;
  url?: string;
  client?: Localized<string>;
  role?: Localized<string>;
  duration?: Localized<string>;
  featured?: boolean;
  order?: number;
  caseStudy?: {
    summary?: Localized<string>;
    blocks: CaseStudyBlock[];    // heading | paragraph | image | quote | list | metrics | divider
    outcomes?: { label: Localized<string>; value: Localized<string> }[];
  };
}`} />
            </div>

            <div className="mt-5">
              <CodeBlock title="Rendering a section" code={`const result = resolveCollection(await dataApi.projects(), PREVIEW_FIXTURES.projects, preview);

<AsyncSection
  result={result}
  loading={<SkeletonGrid count={6} variant="project" />}
  empty={<EmptyState title={t.empty.work.title} body={t.empty.work.body} />}
>
  {(projects) => <ProjectGrid projects={projects} locale={locale} labels={labels} />}
</AsyncSection>`} />
            </div>

            <div className="mt-5">
              <CodeBlock title="Endpoints" code={`GET  /api/nawa/services            GET  /api/nawa/services/:slug
GET  /api/nawa/projects             GET  /api/nawa/projects/:slug
GET  /api/nawa/projects/categories  GET  /api/nawa/testimonials
GET  /api/nawa/capabilities         GET  /api/nawa/process
GET  /api/nawa/values               GET  /api/nawa/milestones
GET  /api/nawa/team                 GET  /api/nawa/contact-channels
GET  /api/nawa/content              POST /api/nawa/contact`} />
            </div>

            <div className="mt-8 rounded-md border border-accent-line bg-accent-softer p-5">
              <p className="flex items-start gap-3 text-[0.875rem] leading-relaxed text-fg">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                <span>
                  Localised fields accept either a plain string or <code className="font-mono text-[0.8125rem] text-accent">{'{ en, ar }'}</code>.
                  Partially translated rows fall back English → Arabic → empty, so the layout never renders{' '}
                  <code className="font-mono text-[0.8125rem] text-accent">undefined</code>.
                </span>
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href={ROUTES.home} className="group/home inline-flex items-center gap-2 text-[0.875rem] font-medium text-fg transition-colors hover:text-accent">
                Back to the site
                <ArrowUpRight className="size-4 transition-transform duration-400 ease-[var(--ease-nawa)] group-hover/home:translate-x-0.5 group-hover/home:-translate-y-0.5 rtl:-scale-x-100" strokeWidth={1.6} aria-hidden />
              </Link>
            </div>
          </GuideSection>
        </div>
      </div>
    </>
  );
}

/* ====================================================================== */
/*  Style-guide building blocks                                            */
/* ====================================================================== */

function GuideSection({
  id,
  title,
  index,
  note,
  children,
}: {
  id: string;
  title: string;
  index: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-line py-14 first:border-t-0 first:pt-0 lg:py-16">
      <div className="mb-10 flex items-start gap-5">
        <span className="t-num mt-2 text-accent">{index}</span>
        <div>
          <h2 className="t-h2 text-fg">{title}</h2>
          {note && <p className="t-body mt-3 max-w-2xl text-pretty">{note}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function SubHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mb-6 flex items-center gap-4', className)}>
      <h3 className="t-eyebrow whitespace-nowrap">{children}</h3>
      <span className="rule flex-1" aria-hidden />
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-grid min-w-5 place-items-center rounded-[3px] border border-line-strong bg-surface-2 px-1.5 py-0.5 font-mono text-[0.625rem] text-fg-muted">
      {children}
    </kbd>
  );
}

function Swatch({ name, variable, usage }: { name: string; variable: string; usage: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <span className="block h-16 w-full border-b border-line" style={{ background: `var(${variable})` }} aria-hidden />
      <div className="p-3.5">
        <p className="font-mono text-[0.6875rem] text-fg">{name}</p>
        <p className="mt-1 font-mono text-[0.625rem] break-all text-fg-subtle">{variable}</p>
        <p className="mt-2 text-[0.75rem] leading-relaxed text-fg-muted">{usage}</p>
      </div>
    </div>
  );
}

function Ramp({ scale }: { scale: [string, string][] }) {
  return (
    <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
      <div className="flex min-w-[36rem] overflow-hidden rounded-md border border-line">
        {scale.map(([name, className]) => (
          <div key={name} className="min-w-0 flex-1">
            <span className={cn('block h-14 w-full', className)} aria-hidden />
            <p className="truncate border-t border-line bg-surface px-2 py-2 font-mono text-[0.5625rem] text-fg-subtle">
              {name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====================================================================== */
/*  Reference data                                                         */
/* ====================================================================== */

const SEMANTIC_TOKENS = [
  { name: 'bg', variable: '--bg', usage: 'Page ground' },
  { name: 'bg-deep', variable: '--bg-deep', usage: 'Footer, wells, covers' },
  { name: 'bg-elevated', variable: '--bg-elevated', usage: 'Raised panels' },
  { name: 'surface', variable: '--surface', usage: 'Cards, inputs' },
  { name: 'surface-2', variable: '--surface-2', usage: 'Card hover, chips' },
  { name: 'surface-3', variable: '--surface-3', usage: 'Active segments' },
  { name: 'fg', variable: '--fg', usage: 'Primary text' },
  { name: 'fg-muted', variable: '--fg-muted', usage: 'Body copy' },
  { name: 'fg-subtle', variable: '--fg-subtle', usage: 'Labels, meta' },
  { name: 'line', variable: '--line', usage: 'Default hairline' },
  { name: 'line-strong', variable: '--line-strong', usage: 'Emphasis rules' },
  { name: 'accent', variable: '--accent', usage: 'Accent text & icons' },
  { name: 'accent-solid', variable: '--accent-solid', usage: 'Primary button fill' },
  { name: 'accent-soft', variable: '--accent-soft', usage: 'Accent tint' },
  { name: 'accent-line', variable: '--accent-line', usage: 'Accent borders' },
  { name: 'overlay', variable: '--overlay', usage: 'Scrims' },
];

const TYPE_SCALE = [
  { className: 't-display', spec: 'clamp(2.85rem → 7.75rem) / 1.0 / -0.035em', sample: 'Build what’s next.' },
  { className: 't-display-sm', spec: 'clamp(2.3rem → 5.25rem) / 1.02', sample: 'Section statement' },
  { className: 't-h1', spec: 'clamp(2.1rem → 4.25rem) / 1.04', sample: 'Page headline' },
  { className: 't-h2', spec: 'clamp(1.7rem → 3rem) / 1.09', sample: 'Section headline' },
  { className: 't-h3', spec: 'clamp(1.28rem → 1.75rem) / 1.22', sample: 'Card headline' },
  { className: 't-h4', spec: '1.0625rem / 1.35', sample: 'Item title' },
  { className: 't-lede', spec: 'clamp(1.06rem → 1.375rem) / 1.55 / weight 350', sample: 'Supporting line under a headline, written to be read at a glance.' },
  { className: 't-body', spec: '1rem / 1.7', sample: 'Body copy for paragraphs and descriptions.' },
  { className: 't-small', spec: '0.875rem / 1.62', sample: 'Secondary copy, captions, form notes.' },
  { className: 't-micro', spec: '0.75rem / 1.5', sample: 'Fine print and timestamps.' },
  { className: 't-eyebrow', spec: 'mono 0.6875rem / uppercase / 0.2em', sample: 'Section eyebrow' },
  { className: 't-num', spec: 'mono 0.75rem / tabular / 0.06em', sample: '01 · 02 · 03' },
];

const LAYOUT_TOKENS = [
  { name: '--shell-max', value: '84rem (1344px)', usage: 'Default content shell' },
  { name: '--shell-narrow', value: '62rem (992px)', usage: 'Editorial measure' },
  { name: '--shell-gutter', value: 'clamp(1.25rem, 4vw, 3.5rem)', usage: 'Fluid side padding' },
  { name: '--section-y', value: 'clamp(4.5rem, 9vw, 9.5rem)', usage: 'Vertical section rhythm' },
  { name: '--header-h', value: '4.5rem → 3.75rem', usage: 'Header height, condenses on scroll' },
  { name: 'scroll-padding-top', value: 'header + 1.5rem', usage: 'Anchor offset under the sticky header' },
];

const MOTION_TOKENS = [
  { name: '--dur-fast', value: '140ms', usage: 'Colour, opacity' },
  { name: '--dur-base', value: '260ms', usage: 'Hover states' },
  { name: '--dur-slow', value: '520ms', usage: 'Overlays, lifts' },
  { name: '--dur-slower', value: '900ms', usage: 'Scroll reveals' },
  { name: '--ease-nawa', value: 'cubic-bezier(.22,1,.36,1)', usage: 'Default, slightly sprung' },
  { name: '--ease-expo', value: 'cubic-bezier(.16,1,.3,1)', usage: 'Reveals, headline masks' },
  { name: '--ease-in-out-soft', value: 'cubic-bezier(.65,0,.35,1)', usage: 'Ambient loops' },
  { name: 'reduced motion', value: 'global override', usage: 'All animation collapses to 0.01ms' },
];

const BREAKPOINTS = [
  { name: 'base', range: '< 640px', behaviour: 'Single column. Full-screen nav sheet. Hero type at its fluid minimum. CTAs stack full width.' },
  { name: 'sm', range: '≥ 640px', behaviour: 'Two-column grids begin. Card padding steps up. CTAs sit inline.' },
  { name: 'md', range: '≥ 768px', behaviour: 'Project grids go to two columns. Metadata strips become four-up.' },
  { name: 'lg', range: '≥ 1024px', behaviour: 'Desktop navigation replaces the sheet. Sticky rails activate. Three-column grids.' },
  { name: 'xl', range: '≥ 1280px', behaviour: 'Shell reaches its 1344px maximum and the gutter stops growing.' },
];

const RESPONSIVE_ROWS = [
  ['Hero', 'Type at clamp minimum, nucleus behind at 34% opacity, CTAs stacked full width', 'Nucleus grows to 45% opacity, CTAs inline', 'Two-column: type left, nucleus right with pointer parallax'],
  ['Navigation', 'Full-screen sheet, editorial-scale links with indices', 'Sheet, language switcher visible in the bar', 'Inline links with accent underline, primary CTA button'],
  ['Service grid', '1 column', '2 columns', '3 columns'],
  ['Project grid', '1 column, 4:3 cover', '2 columns', '3 columns; list view available'],
  ['Cards', 'Padding 1.25rem, footer meta stacks', 'Padding 1.5rem', 'Padding 1.5rem, hover lift + edge glow'],
  ['Forms', 'Single column, full-width submit', 'Two columns from 640px', 'Two columns with sticky sidebar rail'],
  ['Empty states', 'Padding 2.5rem vertical, compact glyph', 'Padding 4rem vertical', 'Full framed state with corner ticks'],
  ['Footer', 'Stacked columns, wordmark scaled to viewport', 'Two-column brand row', 'Brand + three index columns, oversized wordmark'],
];
