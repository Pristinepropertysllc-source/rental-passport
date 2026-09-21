'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';

export async function sendMessageAction(formData: FormData) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'ADMIN') throw new Error('UNAUTHORIZED');

  const tenantId = String(formData.get('tenantId') || '');
  const body = String(formData.get('body') || '').trim();
  if (!tenantId || !body) return;

  const tenant = await db.user.findUnique({
    where: { id: tenantId },
    include: { passport: true }
  });
  if (!tenant || tenant.role !== 'TENANT') throw new Error('Tenant not found');
  // Messaging only opens up once the tenant's screening package is paid.
  if (!tenant.passport?.packagePaid) throw new Error('Tenant has not completed payment yet');

  await db.message.create({
    data: {
      tenantId,
      senderId: admin.id,
      body
    }
  });

  revalidatePath(`/admin/tenants/${tenantId}`);
  revalidatePath('/dashboard');
}

export async function markMessagesReadAction() {
  const user = await getCurrentUser();
  if (!user) return;

  await db.message.updateMany({
    where: { tenantId: user.id, readAt: null },
    data: { readAt: new Date() }
  });

  revalidatePath('/dashboard');
}
