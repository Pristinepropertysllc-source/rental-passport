'use server';

import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';

export async function createLandlordInviteAction(formData: FormData) {
  const user = await requireUser();
  if (user.role !== 'LANDLORD') return;

  const propertyName = String(formData.get('propertyName') || '').trim();
  const token = randomBytes(16).toString('hex');

  await db.landlordInvite.create({
    data: {
      token,
      landlordId: user.id,
      propertyName: propertyName || null
    }
  });

  revalidatePath('/landlord/dashboard');
}
