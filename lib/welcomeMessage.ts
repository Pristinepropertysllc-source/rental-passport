import { db } from '@/lib/db';

export const WELCOME_MESSAGE =
  "Welcome to Rental Passport! I'm Granit, the founder. If you have any questions as you build your application, send me a message right here anytime, or call us at (240) 520-7174. We're happy to help.\n\n- Granit Pllana, Rental Passport";

// Makes sure a tenant has the welcome message in their inbox. Safe to call
// repeatedly: it only creates the message if the tenant doesn't already have it.
export async function ensureWelcomeMessage(tenantId: string) {
  try {
    const existing = await db.message.findFirst({
      where: { tenantId, fromTenant: false, body: WELCOME_MESSAGE },
      select: { id: true }
    });
    if (existing) return;
    const admin = await db.user.findFirst({ where: { role: 'ADMIN' }, orderBy: { createdAt: 'asc' } });
    if (!admin) return;
    await db.message.create({
      data: { tenantId, senderId: admin.id, body: WELCOME_MESSAGE, fromTenant: false }
    });
  } catch (e) {
    console.error('ensureWelcomeMessage failed', e);
  }
}
