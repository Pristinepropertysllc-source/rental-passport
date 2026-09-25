'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { put } from '@vercel/blob';
import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') throw new Error('Unauthorized');
  return user;
}

async function recordCombinedScreeningReport(
  adminEmail: string,
  passportId: string,
  url: string,
  filename: string
) {
  const document = await db.document.create({
    data: { passportId, type: 'Screening Report', filename, url }
  });

  const categories = ['CREDIT', 'CRIMINAL', 'RENTAL_HISTORY'];
  for (const category of categories) {
    await db.screeningItem.upsert({
      where: { passportId_category: { passportId, category } },
      update: { documentId: document.id, status: 'COMPLETED', updatedByEmail: adminEmail },
      create: {
        passportId,
        category,
        documentId: document.id,
        status: 'COMPLETED',
        updatedByEmail: adminEmail
      }
    });
  }

  await db.auditLog.create({
    data: { passportId, action: 'Uploaded combined screening report', adminEmail }
  });

  revalidatePath(`/admin/tenants/${passportId}`);
  revalidatePath('/dashboard');
}

// Called from the API route after a large file has already been uploaded
// directly to Blob storage from the browser (bypassing the serverless
// function's ~4.5MB request body limit).
export async function recordCombinedScreeningReportFromClient(
  passportId: string,
  url: string,
  filename: string
) {
  const admin = await requireAdmin();
  await recordCombinedScreeningReport(admin.email, passportId, url, filename);
}

export async function uploadCombinedScreeningReportAction(formData: FormData) {
  const admin = await requireAdmin();
  const passportId = String(formData.get('passportId') || '');
  const file = formData.get('file') as File | null;
  if (!passportId || !file || file.size === 0) return;

  const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
  const key = `screening/${passportId}/${randomBytes(8).toString('hex')}${ext}`;
  const blob = await put(key, file, { access: 'public' });

  await recordCombinedScreeningReport(admin.email, passportId, blob.url, file.name);
}

export async function uploadScreeningResultAction(formData: FormData) {
  const admin = await requireAdmin();
  const passportId = String(formData.get('passportId') || '');
  const category = String(formData.get('category') || '');
  const file = formData.get('file') as File | null;
  if (!passportId || !category || !file || file.size === 0) return;

  const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
  const key = `screening/${passportId}/${randomBytes(8).toString('hex')}${ext}`;
  const blob = await put(key, file, { access: 'public' });

  const document = await db.document.create({
    data: { passportId, type: 'Screening Report', filename: file.name, url: blob.url }
  });

  await db.screeningItem.upsert({
    where: { passportId_category: { passportId, category } },
    update: { documentId: document.id, status: 'COMPLETED', updatedByEmail: admin.email },
    create: {
      passportId,
      category,
      documentId: document.id,
      status: 'COMPLETED',
      updatedByEmail: admin.email
    }
  });

  await db.auditLog.create({
    data: { passportId, action: `Uploaded ${category} screening report`, adminEmail: admin.email }
  });

  revalidatePath(`/admin/tenants/${passportId}`);
  revalidatePath('/dashboard');
}

export async function updateScreeningStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const passportId = String(formData.get('passportId') || '');
  const category = String(formData.get('category') || '');
  const status = String(formData.get('status') || '');
  if (!passportId || !category || !status) return;

  await db.screeningItem.upsert({
    where: { passportId_category: { passportId, category } },
    update: { status, updatedByEmail: admin.email },
    create: { passportId, category, status, updatedByEmail: admin.email }
  });

  await db.auditLog.create({
    data: { passportId, action: `Set ${category} status to ${status}`, adminEmail: admin.email }
  });

  revalidatePath(`/admin/tenants/${passportId}`);
  revalidatePath('/dashboard');
}

export async function updateAdminNotesAction(formData: FormData) {
  const admin = await requireAdmin();
  const passportId = String(formData.get('passportId') || '');
  const notes = String(formData.get('notes') || '');
  if (!passportId) return;

  await db.passport.update({ where: { id: passportId }, data: { internalNotes: notes } });
  await db.auditLog.create({
    data: { passportId, action: 'Updated internal notes', adminEmail: admin.email }
  });

  revalidatePath(`/admin/tenants/${passportId}`);
}

export async function promoteToAdminAction(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!email) return;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return;

  await db.user.update({ where: { email }, data: { role: 'ADMIN' } });
  revalidatePath('/admin/users');
}

export async function demoteAdminAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get('userId') || '');
  if (!userId || userId === admin.id) return; // can't demote yourself

  await db.user.update({ where: { id: userId }, data: { role: 'TENANT' } });
  revalidatePath('/admin/users');
}

// Safety valve for when a Stripe webhook was missed (e.g. it didn't exist
// yet when the payment completed) -- lets an admin manually confirm a
// payment that's been verified in Stripe's own dashboard.
export async function markPackagePaidAction(formData: FormData) {
  const admin = await requireAdmin();
  const passportId = String(formData.get('passportId') || '');
  if (!passportId) return;

  const passport = await db.passport.findUnique({ where: { id: passportId } });
  if (!passport) return;

  await db.passport.update({
    where: { id: passportId },
    data: {
      packagePaid: true,
      packageType: passport.packageType || 'COMPLETE'
    }
  });

  await db.auditLog.create({
    data: {
      passportId,
      action: 'Manually marked payment as received (webhook was missed)',
      adminEmail: admin.email
    }
  });

  revalidatePath(`/admin/tenants/${passportId}`);
  revalidatePath('/dashboard');
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get('userId') || '');
  if (!userId) return;

  if (userId === admin.id) {
    throw new Error('You cannot delete your own account.');
  }

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return;

  // Admin accounts must be demoted (via /admin/users) before they can be
  // deleted, so this can never be used to accidentally wipe out an admin.
  if (target.role === 'ADMIN') {
    throw new Error('Remove admin access before deleting this account.');
  }

  // Share.landlordId has no cascade rule (it's optional -- a share can
  // exist before the recipient ever creates an account), so deleting a
  // landlord who has been matched to existing shares would otherwise fail
  // with a foreign key error. Clear that reference first; the share itself
  // still exists, it just goes back to "not yet linked to a landlord
  // account" (matching how it looks before a landlord ever signs up).
  if (target.role === 'LANDLORD') {
    await db.share.updateMany({
      where: { landlordId: userId },
      data: { landlordId: null }
    });
  }

  await db.user.delete({ where: { id: userId } });

  revalidatePath('/admin/users');
  revalidatePath('/admin/tenants');
  redirect('/admin/tenants');
}
