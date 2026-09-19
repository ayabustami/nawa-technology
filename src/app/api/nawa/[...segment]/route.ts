import { NextResponse, type NextRequest } from 'next/server';
import { STUB_COLLECTIONS, stubContact, stubGet } from '@/lib/data/stub';

/* =========================================================================
   NAWA API STUBS (HTTP surface)
   -------------------------------------------------------------------------
   These routes exist so the browser, external tools and your future backend
   team have a real contract to look at before anything is implemented.
   Every collection returns an empty array, which makes the UI render its
   designed EMPTY state.

   HOW TO REPLACE THIS WITH YOUR BACKEND
     1. Implement these endpoints on your own server, matching the shapes in
        `src/lib/data/types.ts`.
     2. Set NEXT_PUBLIC_API_URL=https://api.your-domain.com in `.env.local`.
        The data client then targets it and this file stops being used.

   ROUTES
     GET  /api/nawa/services              GET  /api/nawa/services/:slug
     GET  /api/nawa/projects              GET  /api/nawa/projects/:slug
     GET  /api/nawa/projects/categories   GET  /api/nawa/testimonials
     GET  /api/nawa/capabilities          GET  /api/nawa/process
     GET  /api/nawa/values                GET  /api/nawa/milestones
     GET  /api/nawa/team                  GET  /api/nawa/contact-channels
     GET  /api/nawa/content               POST /api/nawa/contact
   ========================================================================= */

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ segment: string[] }> };

export async function GET(_request: NextRequest, context: Ctx) {
  const { segment } = await context.params;
  const { status, body } = stubGet((segment ?? []).join('/'));
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest, context: Ctx) {
  const { segment } = await context.params;
  const path = (segment ?? []).join('/');

  if (path !== 'contact') {
    return NextResponse.json(
      { error: 'method_not_allowed', message: 'POST is only handled for /api/nawa/contact.' },
      { status: 405 },
    );
  }

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const result = stubContact(body as never);
  return NextResponse.json(result.body, { status: result.status });
}

/** Machine-readable index, handy while wiring up a backend. */
export async function OPTIONS(_request: NextRequest, _context: Ctx) {
  return NextResponse.json({
    service: 'NAWA Technology frontend API stubs',
    status: 'stub',
    collections: STUB_COLLECTIONS,
    hint: 'Set NEXT_PUBLIC_API_URL to route the frontend to your own backend.',
  });
}
