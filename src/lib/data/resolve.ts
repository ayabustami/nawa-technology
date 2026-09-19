import { cookies } from 'next/headers';
import { DEFAULT_PREVIEW, PREVIEW_COOKIE, PREVIEW_STATES, type PreviewState } from '@/lib/i18n';
import type { DataResult } from './types';

/**
 * Reads the developer state-preview from cookies.
 * When NEXT_PUBLIC_ENABLE_STATE_PREVIEW === 'false' this never touches the
 * cookie store, so pages remain statically renderable in production.
 */
export async function getPreviewState(): Promise<PreviewState> {
  if (process.env.NEXT_PUBLIC_ENABLE_STATE_PREVIEW === 'false') return DEFAULT_PREVIEW;
  try {
    const store = await cookies();
    const raw = store.get(PREVIEW_COOKIE)?.value as PreviewState | undefined;
    return raw && PREVIEW_STATES.includes(raw) ? raw : DEFAULT_PREVIEW;
  } catch {
    return DEFAULT_PREVIEW;
  }
}

export const isPreviewActive = (preview: PreviewState) => preview !== 'live';

/**
 * Collapses "what the API returned" and "what the developer asked to preview"
 * into the single result every section renders from.
 */
export function resolveCollection<T>(result: DataResult<T>, fixtures: readonly T[], preview: PreviewState): DataResult<T> {
  switch (preview) {
    case 'loading':
      return { status: 'loading', data: [], source: 'preview' };
    case 'empty':
      return { status: 'empty', data: [], total: 0, source: 'preview' };
    case 'populated':
      return { status: 'ready', data: [...fixtures], total: fixtures.length, source: 'preview' };
    case 'live':
    default:
      return result;
  }
}

export function resolveRecord<T>(
  result: { status: DataResult<T>['status']; data?: T; error?: string },
  fixture: T | undefined,
  preview: PreviewState,
): { status: DataResult<T>['status']; data?: T; error?: string; source: DataResult<T>['source'] } {
  switch (preview) {
    case 'loading':
      return { status: 'loading', source: 'preview' };
    case 'empty':
      return { status: 'empty', source: 'preview' };
    case 'populated':
      return fixture ? { status: 'ready', data: fixture, source: 'preview' } : { status: 'empty', source: 'preview' };
    case 'live':
    default:
      return { ...result, source: result.data ? 'api' : 'stub' };
  }
}
