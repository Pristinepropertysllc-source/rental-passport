'use server';

import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { DOCUMENT_TYPES } from '@/lib/documentTypes';

const PASSPORT_FIELD_NAMES = [
  'firstName',
  'lastName',
  'dateOfBirth',
  'streetAddress',
  'city',
  'state',
  'zip',
  'homePhone',
  'mobilePhone',
  'ssn',
  'annualIncome',
  'propertyApplyingTo',
  'moveInDate',
  'activeMilitary',
  'pastJudgments',
  'arrestedConvicted'
];

async function getOwnedPassport(userId: string) {
  const passport = await db.passport.findUnique({ where: { userId } });
  if (!passport) throw new Error('No passport found');
  return passport;
}

export async function updatePassportAction(formData: FormData) {
  const user = await requireUser();

  const data: Record<string, string> = {};
  for (const field of PASSPORT_FIELD_NAMES) {
    const value = formData.get(field);
    if (value !== null) data[field] = String(value);
  }

  await db.passport.update({ where: { userId: user.id }, data });

  revalidatePath('/passport');
  revalidatePath('/dashboard');
}

export async function setPackageAction(formData: FormData) {
  const user = await requireUser();
  const packageType = String(formData.get('packageType') || '');
  if (packageType !== 'ESSENTIAL' && packageType !== 'COMPLETE') return;

  await db.passport.update({ where: { userId: user.id }, data: { packageType } });

  revalidatePath('/passport/checkout');
}

// ---- N/A toggles for optional list sections ----

export async function markHouseholdNAAction(formData: FormData) {
  const user = await requireUser();
  await db.passport.update({ where: { userId: user.id }, data: { householdNA: true } });
  revalidatePath('/passport');
  revalidatePath('/dashboard');
}

export async function markEmploymentNAAction(formData: FormData) {
  const user = await requireUser();
  await db.passport.update({ where: { userId: user.id }, data: { employmentNA: true } });
  revalidatePath('/passport');
  revalidatePath('/dashboard');
}

export async function markRentalHistoryNAAction(formData: FormData) {
  const user = await requireUser();
  await db.passport.update({ where: { userId: user.id }, data: { rentalHistoryNA: true } });
  revalidatePath('/passport');
  revalidatePath('/dashboard');
}

export async function markReferencesNAAction(formData: FormData) {
  const user = await requireUser();
  await db.passport.update({ where: { userId: user.id }, data: { referencesNA: true } });
  revalidatePath('/passport');
  revalidatePath('/dashboard');
}

// ---- Occupants ----

export async function addOccupantAction(formData: FormData) {
  const user = await requireUser();
  const passport = await getOwnedPassport(user.id);

  const firstName = String(formData.get('firstName') || '').trim();
  const lastName = String(formData.get('lastName') || '').trim();
  if (!firstName || !lastName) return;

  await db.occupant.create({
    data: {
      passportId: passport.id,
      firstName,
      lastName,
      dateOfBirth: String(formData.get('dateOfBirth') || ''),
      relationship: String(formData.get('relationship') || '')
    }
  });
  await db.passport.update({ where: { id: passport.id }, data: { householdNA: false } });

  revalidatePath('/passport');
}

export async function removeOccupantAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get('id') || '');
  const occupant = await db.occupant.findUnique({ where: { id }, include: { passport: true } });
  if (!occupant || occupant.passport.userId !== user.id) return;
  await db.occupant.delete({ where: { id } });
  revalidatePath('/passport');
}

// ---- Pets ----

export async function addPetAction(formData: FormData) {
  const user = await requireUser();
  const passport = await getOwnedPassport(user.id);

  const type = String(formData.get('type') || '').trim();
  if (!type) return;

  await db.pet.create({
    data: {
      passportId: passport.id,
      type,
      breed: String(formData.get('breed') || ''),
      sizeLbs: String(formData.get('sizeLbs') || ''),
      color: String(formData.get('color') || '')
    }
  });
  await db.passport.update({ where: { id: passport.id }, data: { householdNA: false } });

  revalidatePath('/passport');
}

export async function removePetAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get('id') || '');
  const pet = await db.pet.findUnique({ where: { id }, include: { passport: true } });
  if (!pet || pet.passport.userId !== user.id) return;
  await db.pet.delete({ where: { id } });
  revalidatePath('/passport');
}

// ---- Vehicles ----

export async function addVehicleAction(formData: FormData) {
  const user = await requireUser();
  const passport = await getOwnedPassport(user.id);

  const description = String(formData.get('description') || '').trim();
  if (!description) return;

  await db.vehicle.create({
    data: {
      passportId: passport.id,
      description,
      licensePlate: String(formData.get('licensePlate') || ''),
      state: String(formData.get('state') || ''),
      make: String(formData.get('make') || ''),
      model: String(formData.get('model') || ''),
      year: String(formData.get('year') || ''),
      ownerName: String(formData.get('ownerName') || ''),
      ownerAddress: String(formData.get('ownerAddress') || ''),
      ownerHomePhone: String(formData.get('ownerHomePhone') || '')
    }
  });
  await db.passport.update({ where: { id: passport.id }, data: { householdNA: false } });

  revalidatePath('/passport');
}

export async function removeVehicleAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get('id') || '');
  const vehicle = await db.vehicle.findUnique({ where: { id }, include: { passport: true } });
  if (!vehicle || vehicle.passport.userId !== user.id) return;
  await db.vehicle.delete({ where: { id } });
  revalidatePath('/passport');
}

// ---- Rental history ----

export async function addRentalHistoryAction(formData: FormData) {
  const user = await requireUser();
  const passport = await getOwnedPassport(user.id);

  const landlord = String(formData.get('landlord') || '').trim();
  const street = String(formData.get('street') || '').trim();
  if (!landlord && !street) return;

  await db.rentalHistoryEntry.create({
    data: {
      passportId: passport.id,
      moveIn: String(formData.get('moveIn') || ''),
      moveOut: String(formData.get('moveOut') || ''),
      landlord,
      landlordPhone: String(formData.get('landlordPhone') || ''),
      landlordEmail: String(formData.get('landlordEmail') || ''),
      street,
      city: String(formData.get('city') || ''),
      state: String(formData.get('state') || ''),
      zip: String(formData.get('zip') || ''),
      rentAmount: String(formData.get('rentAmount') || ''),
      reasonForLeaving: String(formData.get('reasonForLeaving') || '')
    }
  });
  await db.passport.update({ where: { id: passport.id }, data: { rentalHistoryNA: false } });

  revalidatePath('/passport');
}

export async function removeRentalHistoryAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get('id') || '');
  const entry = await db.rentalHistoryEntry.findUnique({ where: { id }, include: { passport: true } });
  if (!entry || entry.passport.userId !== user.id) return;
  await db.rentalHistoryEntry.delete({ where: { id } });
  revalidatePath('/passport');
}

// ---- Employment history ----

export async function addEmploymentAction(formData: FormData) {
  const user = await requireUser();
  const passport = await getOwnedPassport(user.id);

  const employerName = String(formData.get('employerName') || '').trim();
  if (!employerName) return;

  await db.employmentEntry.create({
    data: {
      passportId: passport.id,
      dateStart: String(formData.get('dateStart') || ''),
      dateEnd: String(formData.get('dateEnd') || ''),
      employerName,
      position: String(formData.get('position') || ''),
      supervisor: String(formData.get('supervisor') || ''),
      phone: String(formData.get('phone') || ''),
      address: String(formData.get('address') || ''),
      salary: String(formData.get('salary') || '')
    }
  });
  await db.passport.update({ where: { id: passport.id }, data: { employmentNA: false } });

  revalidatePath('/passport');
}

export async function removeEmploymentAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get('id') || '');
  const entry = await db.employmentEntry.findUnique({ where: { id }, include: { passport: true } });
  if (!entry || entry.passport.userId !== user.id) return;
  await db.employmentEntry.delete({ where: { id } });
  revalidatePath('/passport');
}

// ---- References ----

export async function addReferenceAction(formData: FormData) {
  const user = await requireUser();
  const passport = await getOwnedPassport(user.id);

  const name = String(formData.get('name') || '').trim();
  if (!name) return;

  await db.references.create({
    data: {
      passportId: passport.id,
      name,
      address: String(formData.get('address') || ''),
      homePhone: String(formData.get('homePhone') || ''),
      mobilePhone: String(formData.get('mobilePhone') || ''),
      relationship: String(formData.get('relationship') || '')
    }
  });
  await db.passport.update({ where: { id: passport.id }, data: { referencesNA: false } });

  revalidatePath('/passport');
  revalidatePath('/dashboard');
}

export async function removeReferenceAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get('id') || '');
  const reference = await db.references.findUnique({ where: { id }, include: { passport: true } });
  if (!reference || reference.passport.userId !== user.id) return;
  await db.references.delete({ where: { id } });
  revalidatePath('/passport');
}

// ---- Documents ----

export async function uploadDocumentAction(formData: FormData) {
  const user = await requireUser();
  const passport = await getOwnedPassport(user.id);

  const file = formData.get('file') as File | null;
  const type = String(formData.get('type') || 'Other');
  if (!file || file.size === 0) return;
  if (!DOCUMENT_TYPES.includes(type as (typeof DOCUMENT_TYPES)[number])) return;

  const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
  const key = `${user.id}/${randomBytes(8).toString('hex')}${ext}`;

  const blob = await put(key, file, { access: 'public' });

  await db.document.create({
    data: {
      passportId: passport.id,
      type,
      filename: file.name,
      url: blob.url
    }
  });

  revalidatePath('/passport');
  revalidatePath('/dashboard');
}

export async function removeDocumentAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get('id') || '');
  const document = await db.document.findUnique({ where: { id }, include: { passport: true } });
  if (!document || document.passport.userId !== user.id) return;
  await db.document.delete({ where: { id } });
  revalidatePath('/passport');
}
