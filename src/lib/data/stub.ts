import type { ContactSubmission } from './types';

/* =========================================================================
   NAWA STUB LAYER
   -------------------------------------------------------------------------
   The single definition of "what the API returns before your backend
   exists". It is used in TWO places:

     1. In-process, by the data client during server rendering, so the page
        never makes an HTTP request back into its own server (which
        deadlocks in development).
     2. By the HTTP route in `src/app/api/nawa/[...segment]/route.ts`, so
        client-side fetches and external tools see the same contract.

   Replace this with your backend by setting NEXT_PUBLIC_API_URL — the data
   client then stops touching this file entirely.
   ========================================================================= */

export const STUB_COLLECTIONS: Record<string, { description: string; record: string }> = {
  services: { description: 'Service records rendered by the services grid.', record: 'Service' },
  projects: { description: 'Project records rendered by the work grid.', record: 'Project' },
  'projects/categories': { description: 'Distinct project categories used by the filter bar.', record: '{ id, label, slug }' },
  testimonials: { description: 'Client quotes. Never hardcoded in the frontend.', record: 'Testimonial' },
  capabilities: { description: 'Capability index entries.', record: 'Capability' },
  process: { description: 'Ordered process steps.', record: 'ProcessStep' },
  values: { description: 'Company values.', record: 'CompanyValue' },
  milestones: { description: 'Dated company milestones.', record: 'Milestone' },
  team: { description: 'Team members.', record: 'TeamMember' },
  'contact-channels': { description: 'Email, phone, office and social links.', record: 'ContactChannel' },
  content: { description: 'Free-text editorial slots keyed by slug.', record: 'ContentSlot' },
};

export type StubResponse = { status: number; body: unknown };

/** GET — collection or detail route. */
export function stubGet(path: string): StubResponse {
  if (/^(services|projects)\/[^/]+$/.test(path)) {
    const kind = path.split('/')[0].replace(/s$/, '');
    return {
      status: 404,
      body: {
        error: 'not_found',
        message: `No ${kind} record with this slug. Connect your database to serve it.`,
        meta: { status: 'stub' },
      },
    };
  }

  if (path in STUB_COLLECTIONS) {
    const meta = STUB_COLLECTIONS[path];
    return {
      status: 200,
      body: {
        data: [],
        total: 0,
        meta: {
          collection: path,
          record: meta.record,
          description: meta.description,
          status: 'stub',
          note: 'NAWA frontend stub. Point NEXT_PUBLIC_API_URL at your backend to serve real records.',
        },
      },
    };
  }

  return {
    status: 404,
    body: {
      error: 'unknown_collection',
      message: `No stub exists for "/api/nawa/${path}".`,
      known: Object.keys(STUB_COLLECTIONS),
    },
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** POST /contact — validates the brief the same way the client does. */
export function stubContact(body: Partial<ContactSubmission> | null): StubResponse {
  if (!body) return { status: 400, body: { error: 'invalid_json', message: 'Request body must be JSON.' } };

  const fieldErrors: Record<string, string> = {};
  if (!body.name?.trim()) fieldErrors.name = 'Name is required.';
  if (!body.email?.trim()) fieldErrors.email = 'Email is required.';
  else if (!EMAIL_RE.test(body.email.trim())) fieldErrors.email = 'Enter a valid email address.';
  if (!body.message?.trim()) fieldErrors.message = 'Message is required.';

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 422, body: { error: 'validation_failed', fieldErrors } };
  }

  /* ------------------------------------------------------------------
     TODO(backend): persist the submission.
       await db.projectBrief.create({ data: { ...body, receivedAt: new Date() } })
     ------------------------------------------------------------------ */
  return {
    status: 202,
    body: {
      ok: true,
      id: `stub-${Date.now().toString(36)}`,
      message: 'Stub accepted the brief. Connect your database to persist it.',
      received: { ...body, timestamp: new Date().toISOString() },
      meta: { status: 'stub' },
    },
  };
}
