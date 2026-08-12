import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const shareToken = req.nextUrl.searchParams.get('share');

  const document = await db.document.findUnique({
    where: { id: params.id },
    include: { passport: true }
  });
  if (!document) return new Response('Not found', { status: 404 });

  const user = await getCurrentUser();
  let authorized = false;

  // The tenant who owns this passport can always view their own documents.
  if (user && user.id === document.passport.userId) authorized = true;

  // A guest (or logged-in landlord) with a valid, unexpired share link for
  // this passport can view its documents.
  if (!authorized && shareToken) {
    const share = await db.share.findUnique({ where: { token: shareToken } });
    if (
      share &&
      share.passportId === document.passportId &&
      (!share.expiresAt || share.expiresAt > new Date())
    ) {
      authorized = true;
    }
  }

  // A logged-in landlord who has a share for this passport (by account or
  // by invited email) can view it even without the token in the URL.
  if (!authorized && user && user.role === 'LANDLORD') {
    const share = await db.share.findFirst({
      where: {
        passportId: document.passportId,
        OR: [{ landlordId: user.id }, { landlordEmail: user.email }]
      }
    });
    if (share) authorized = true;
  }

  if (!authorized) return new Response('Forbidden', { status: 403 });

  const blobRes = await fetch(document.url, {
    headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
  });
  if (!blobRes.ok || !blobRes.body) {
    return new Response('Error fetching file', { status: 502 });
  }

  return new Response(blobRes.body, {
    headers: {
      'Content-Type': blobRes.headers.get('content-type') || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${document.filename}"`
    }
  });
}
