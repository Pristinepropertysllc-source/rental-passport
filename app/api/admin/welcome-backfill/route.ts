import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { ensureWelcomeMessage } from '@/lib/welcomeMessage';

export const dynamic = 'force-dynamic';

// One-time admin tool: puts the welcome message in every existing tenant's
// inbox. Safe to run more than once (tenants who already have it are skipped).
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const tenants = await db.user.findMany({ where: { role: 'TENANT' }, select: { id: true } });
  for (const t of tenants) await ensureWelcomeMessage(t.id);
  return NextResponse.json({ tenants: tenants.length, done: true });
}
