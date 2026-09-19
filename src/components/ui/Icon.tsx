import {
  Boxes, Braces, BrainCircuit, Cloud, Code2, Compass, Cpu, Database, Figma, Gauge,
  Globe, Grid2x2, Layers, LayoutGrid, LineChart, Lock, Monitor, Network, Palette,
  Plug, Rocket, Scale, Server, Share2, ShieldCheck, Smartphone, Sparkles, Terminal,
  Workflow, Wrench, Boxes as Package, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Icon registry.
 * Your database stores an icon *name* (a string). This map resolves it to a
 * component. Unknown or missing names fall back to a neutral nucleus glyph,
 * so a bad CMS value can never break the layout.
 */
export const ICONS: Record<string, LucideIcon> = {
  boxes: Boxes,
  package: Package,
  braces: Braces,
  brain: BrainCircuit,
  cloud: Cloud,
  code: Code2,
  'code-2': Code2,
  compass: Compass,
  cpu: Cpu,
  database: Database,
  design: Figma,
  figma: Figma,
  gauge: Gauge,
  globe: Globe,
  grid: Grid2x2,
  layers: Layers,
  layout: LayoutGrid,
  chart: LineChart,
  'line-chart': LineChart,
  lock: Lock,
  monitor: Monitor,
  network: Network,
  palette: Palette,
  plug: Plug,
  rocket: Rocket,
  scale: Scale,
  server: Server,
  share: Share2,
  shield: ShieldCheck,
  'shield-check': ShieldCheck,
  mobile: Smartphone,
  sparkles: Sparkles,
  terminal: Terminal,
  workflow: Workflow,
  wrench: Wrench,
};

export const ICON_NAMES = Object.keys(ICONS).sort();

function FallbackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="9.2" ry="4" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.2" transform="rotate(-30 12 12)" />
      <ellipse cx="12" cy="12" rx="9.2" ry="4" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.2" transform="rotate(60 12 12)" />
    </svg>
  );
}

export function resolveIcon(name?: string | null): LucideIcon | typeof FallbackIcon {
  if (!name) return FallbackIcon;
  const key = name.trim().toLowerCase().replace(/[\s_]+/g, '-');
  return ICONS[key] ?? FallbackIcon;
}

export function Icon({
  name,
  className,
  strokeWidth = 1.5,
  ...rest
}: { name?: string | null; className?: string; strokeWidth?: number } & Omit<React.SVGProps<SVGSVGElement>, 'name'>) {
  const Cmp = resolveIcon(name);
  return <Cmp className={cn('size-5', className)} strokeWidth={strokeWidth} aria-hidden {...rest} />;
}

/** Icon inside a hairline tile — the standard service/capability treatment. */
export function IconTile({
  name,
  className,
  size = 'md',
  tone = 'default',
}: {
  name?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'accent';
}) {
  const Cmp = resolveIcon(name);
  const box = size === 'lg' ? 'size-12 rounded-md' : size === 'sm' ? 'size-8 rounded-xs' : 'size-10 rounded-sm';
  const glyph = size === 'lg' ? 'size-5.5' : size === 'sm' ? 'size-4' : 'size-[1.15rem]';

  return (
    <span
      className={cn(
        'relative inline-grid shrink-0 place-items-center border transition-colors duration-300',
        box,
        tone === 'accent' ? 'border-accent-line bg-accent-soft text-accent' : 'border-line bg-surface-2 text-fg-muted',
        className,
      )}
    >
      <Cmp className={glyph} strokeWidth={1.4} aria-hidden />
    </span>
  );
}
