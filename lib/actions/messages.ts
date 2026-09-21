'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';

// Sends a message. Admins can message any tenant (by passing tenantId in the
// form); tenants can only message about their own application (tenantId is
// forced to their own id, ignoring anything the client sends). Either way,
// messaging is gated behind the tenant's screening payment being complete.
export async function sendMessageAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHENTICATED');

  const isAdmin = user.role === 'ADMIN';
  const tenantId = isAdmin ? String(formData.get('tenantId') || '') : user.id;
  const body = String(formData.get('body') || '').trim();
  if (!tenantId || !body) return;

  if (!isAdmin && user.role !== 'TENANT') throw new Error('UNAUTHORIZED');

  const tenant = await db.user.findUnique({
    where: { id: tenantId },
    include: { passport: true }
  });
  if (!tenant || tenant.role !== 'TENANT') throw new Error('Tenant not found');
  // Messaging only opens up once the tenant's screening package is paid.
  if (!tenant.passport?.packagePaid) throw new Error('Messaging is not available until payment is complete');

  await db.message.create({
    data: {
      tenantId,
      senderId: user.id,
      body,
      fromTenant: !isAdmin
    }
  });

  revalidatePath(`/admin/tenants/${tenantId}`);
  revalidatePath('/admin/tenants');
  revalidatePath('/dashboard');
}

// Tenant viewing their own inbox: marks admin-sent messages as read. Never
// touches the tenant's own sent messages.
export async function markMessagesReadAction() {
  const user = await getCurrentUser();
  if (!user) return;

  await db.message.updateMany({
    where: { tenantId: user.id, fromTenant: false, readAt: null },
    data: { readAt: new Date() }
  });

  revalidatePath('/dashboard');
}

// Admin viewing a tenant's thread: marks that tenant's sent messages as
// read. Never touches the admin's own sent messages.
export async function markMessagesReadByAdminAction(tenantId: string) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'ADMIN') return;

  await db.message.updateMany({
    where: { tenantId, fromTenant: true, readAt: null },
    data: { readAt: new Date() }
  });

  revalidatePath(`/admin/tenants/${tenantId}`);
  revalidatePath('/admin/tenants');
}
