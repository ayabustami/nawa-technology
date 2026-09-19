import { stubContact, stubGet } from './stub';
import type {
  Capability,
  CompanyValue,
  ContactChannel,
  ContactSubmission,
  ContactSubmitResult,
  ContentSlot,
  DataResult,
  Milestone,
  ProcessStep,
  Project,
  Service,
  TeamMember,
  Testimonial,
} from './types';

/* =========================================================================
   NAWA DATA CLIENT
   -------------------------------------------------------------------------
   The single place the frontend talks to your backend.

   • Set NEXT_PUBLIC_API_URL to your API origin and every collection below
     is fetched from it over HTTP.
   • Leave it unset and the client resolves the local stub layer. On the
     server this happens IN PROCESS (no HTTP request back into the same
     server — that deadlocks during development); in the browser it goes to
     the `/api/nawa/*` route so the behaviour is identical either way.

   Accepted response envelope from your API:

       { "data": [ ... ], "total": 12 }     // preferred
       [ ... ]                              // also fine

   Anything empty resolves to `status: 'empty'`, which is what makes the
   designed empty states appear.
   ========================================================================= */

const EXPLICIT_API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';
const IS_SERVER = typeof window === 'undefined';

/** True once you point NEXT_PUBLIC_API_URL at a real backend. */
export const isApiConfigured = Boolean(EXPLICIT_API);

const useInProcessStub = !EXPLICIT_API && IS_SERVER;

const DEFAULT_REVALIDATE = 60;

type FetchOptions = {
  revalidate?: number;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
};

function withQuery(endpoint: string, query?: FetchOptions['query']): string {
  if (!query) return endpoint;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  }
  const qs = params.toString();
  if (!qs) return endpoint;
  return `${endpoint}${endpoint.includes('?') ? '&' : '?'}${qs}`;
}

function empty<T>(source: DataResult<T>['source'] = 'stub'): DataResult<T> {
  return { status: 'empty', data: [], total: 0, source };
}

/* ------------------------------------------------------- collection reads */

async function fetchCollection<T>(endpoint: string, options: FetchOptions = {}): Promise<DataResult<T>> {
  const path = withQuery(endpoint, options.query);

  if (useInProcessStub) {
    const res = stubGet(endpoint.replace(/^\//, '').split('?')[0]);
    if (res.status !== 200) return empty<T>();
    const rows = ((res.body as { data?: T[] }).data ?? []) as T[];
    return rows.length
      ? { status: 'ready', data: rows, total: rows.length, source: 'stub' }
      : { status: 'empty', data: [], total: 0, source: 'stub' };
  }

  const url = EXPLICIT_API ? `${EXPLICIT_API}${path}` : `/api/nawa${path}`;

  try {
    const res = await fetch(url, {
      signal: options.signal,
      headers: { accept: 'application/json' },
      ...(IS_SERVER ? { next: { revalidate: options.revalidate ?? DEFAULT_REVALIDATE } } : {}),
    });

    if (!res.ok) {
      return { status: 'error', data: [], error: `API responded ${res.status} for ${path}`, source: 'api' };
    }

    const json = (await res.json()) as unknown;
    const rows: T[] = Array.isArray(json)
      ? (json as T[])
      : Array.isArray((json as { data?: T[] })?.data)
        ? ((json as { data: T[] }).data)
        : [];
    const total = typeof (json as { total?: number })?.total === 'number' ? (json as { total: number }).total : rows.length;

    if (rows.length === 0) return { status: 'empty', data: [], total, source: 'api' };
    return { status: 'ready', data: rows, total, source: 'api' };
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') return empty<T>('api');
    return {
      status: 'error',
      data: [],
      error: error instanceof Error ? error.message : 'Unknown request failure',
      source: 'api',
    };
  }
}

/* --------------------------------------------------------- single records */

async function fetchRecord<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<{ status: DataResult<T>['status']; data?: T; error?: string }> {
  if (useInProcessStub) {
    const res = stubGet(endpoint.replace(/^\//, ''));
    if (res.status === 404) return { status: 'empty' };
    const record = (res.body as { data?: T })?.data;
    return record ? { status: 'ready', data: record } : { status: 'empty' };
  }

  const url = EXPLICIT_API ? `${EXPLICIT_API}${endpoint}` : `/api/nawa${endpoint}`;

  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      ...(IS_SERVER ? { next: { revalidate: options.revalidate ?? DEFAULT_REVALIDATE } } : {}),
    });
    if (res.status === 404) return { status: 'empty' };
    if (!res.ok) return { status: 'error', error: `API responded ${res.status}` };

    const json = (await res.json()) as { data?: T } | T;
    const record = (json as { data?: T })?.data ?? (!Array.isArray(json) ? (json as T) : undefined);
    if (!record) return { status: 'empty' };
    return { status: 'ready', data: record };
  } catch (error) {
    return { status: 'error', error: error instanceof Error ? error.message : 'Unknown request failure' };
  }
}

/* ------------------------------------------------------- typed endpoints */

export const dataApi = {
  services: (opts?: FetchOptions) => fetchCollection<Service>('/services', opts),
  service: (slug: string, opts?: FetchOptions) => fetchRecord<Service>(`/services/${encodeURIComponent(slug)}`, opts),

  projects: (opts?: FetchOptions & { category?: string }) =>
    fetchCollection<Project>('/projects', { ...opts, query: { ...opts?.query, category: opts?.category } }),
  project: (slug: string, opts?: FetchOptions) => fetchRecord<Project>(`/projects/${encodeURIComponent(slug)}`, opts),
  projectCategories: (opts?: FetchOptions) => fetchCollection<{ id: string; label: string; slug: string }>('/projects/categories', opts),

  testimonials: (opts?: FetchOptions) => fetchCollection<Testimonial>('/testimonials', opts),
  capabilities: (opts?: FetchOptions) => fetchCollection<Capability>('/capabilities', opts),
  process: (opts?: FetchOptions) => fetchCollection<ProcessStep>('/process', opts),
  values: (opts?: FetchOptions) => fetchCollection<CompanyValue>('/values', opts),
  milestones: (opts?: FetchOptions) => fetchCollection<Milestone>('/milestones', opts),
  team: (opts?: FetchOptions) => fetchCollection<TeamMember>('/team', opts),
  contactChannels: (opts?: FetchOptions) => fetchCollection<ContactChannel>('/contact-channels', opts),
  content: (opts?: FetchOptions) => fetchCollection<ContentSlot>('/content', opts),

  /** POST a contact brief. Uses the in-process stub on the server. */
  async submitContact(payload: ContactSubmission): Promise<ContactSubmitResult> {
    if (useInProcessStub) {
      const res = stubContact(payload);
      const body = res.body as { ok?: boolean; id?: string; message?: string; error?: string; fieldErrors?: Record<string, string> };
      if (res.status === 202 || body?.ok) return { ok: true, id: body?.id, message: body?.message };
      return { ok: false, error: body?.error ?? 'Validation failed', fieldErrors: body?.fieldErrors as never };
    }

    const url = EXPLICIT_API ? `${EXPLICIT_API}/contact` : '/api/nawa/contact';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as
        | { id?: string; message?: string; error?: string; fieldErrors?: Partial<Record<keyof ContactSubmission, string>> }
        | null;

      if (!res.ok) {
        return { ok: false, error: json?.error ?? `Request failed with status ${res.status}`, fieldErrors: json?.fieldErrors };
      }
      return { ok: true, id: json?.id, message: json?.message };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Network error' };
    }
  },
};

/** Convenience guard for conditional rendering. */
export const hasData = <T,>(result: DataResult<T>): boolean => result.status === 'ready' && result.data.length > 0;
