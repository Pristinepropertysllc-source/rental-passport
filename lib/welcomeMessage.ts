import { db } from '@/lib/db';

const LEGACY_WELCOME_MESSAGE =
  "Welcome to Rental Passport! I'm Granit, the founder. If you have any questions as you build your application, send me a message right here anytime, or call us at (240) 520-7174. We're happy to help.\n\n- Granit Pllana, Rental Passport";

export const WELCOME_MESSAGE =
  "Welcome to Rental Passport! I\u2019m Granit. If you have any questions while completing your application, feel free to message me here anytime or call us at (240) 520-7174. We\u2019re here to help make the process simple and stress-free.\n\n\u2014 Granit Pllana, Rental Passport";

// Makes sure a tenant has the welcome message in their inbox. Safe to call
// repeatedly: it only creates the message if the tenant doesn't already have it.
export async function ensureWelcomeMessage(tenantId: string) {
  try {
    // Upgrade anyone who already received the earlier wording, so nobody gets two welcome messages.
    await db.message.updateMany({
      where: { tenantId, fromTenant: false, body: LEGACY_WELCOME_MESSAGE },
      data: { body: WELCOME_MESSAGE }
    });
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
