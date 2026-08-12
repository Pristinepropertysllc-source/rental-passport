import type { Passport, References, Document, Occupant, Pet, Vehicle, RentalHistoryEntry, EmploymentEntry } from '@prisma/client';

export const SECTION_FIELDS = {
  personal: ['firstName', 'lastName', 'dateOfBirth', 'streetAddress', 'city', 'state', 'zip'] as const
};

type PassportWithRelations = Passport & {
  references: References[];
  documents: Document[];
  occupants: Occupant[];
  pets: Pet[];
  vehicles: Vehicle[];
  rentalHistory: RentalHistoryEntry[];
  employment: EmploymentEntry[];
};

export function sectionCompletion(passport: PassportWithRelations) {
  const result: Record<string, { done: number; total: number; complete: boolean }> = {};

  for (const [section, fields] of Object.entries(SECTION_FIELDS)) {
    const done = fields.filter((f) => !!(passport as any)[f]?.toString().trim()).length;
    result[section] = { done, total: fields.length, complete: done === fields.length };
  }

  const hasHousehold = passport.occupants.length > 0 || passport.pets.length > 0 || passport.vehicles.length > 0;
  result['household'] = {
    done: hasHousehold || passport.householdNA ? 1 : 0,
    total: 1,
    complete: hasHousehold || passport.householdNA
  };
  result['employment'] = {
    done: passport.employment.length > 0 || passport.employmentNA ? 1 : 0,
    total: 1,
    complete: passport.employment.length > 0 || passport.employmentNA
  };
  result['rentalHistory'] = {
    done: passport.rentalHistory.length > 0 || passport.rentalHistoryNA ? 1 : 0,
    total: 1,
    complete: passport.rentalHistory.length > 0 || passport.rentalHistoryNA
  };
  result['references'] = {
    done: passport.references.length > 0 || passport.referencesNA ? 1 : 0,
    total: 1,
    complete: passport.references.length > 0 || passport.referencesNA
  };
  result['documents'] = {
    done: passport.documents.length > 0 ? 1 : 0,
    total: 1,
    complete: passport.documents.length > 0
  };
  result['screeningPayment'] = {
    done: passport.packagePaid ? 1 : 0,
    total: 1,
    complete: passport.packagePaid
  };

  return result;
}

export function applicationComplete(passport: PassportWithRelations) {
  const sections = sectionCompletion(passport);
  return Object.entries(sections)
    .filter(([key]) => key !== 'screeningPayment')
    .every(([, s]) => s.complete);
}

export function overallCompletion(passport: PassportWithRelations) {
  const sections = sectionCompletion(passport);
  const totalDone = Object.values(sections).reduce((sum, s) => sum + s.done, 0);
  const totalFields = Object.values(sections).reduce((sum, s) => sum + s.total, 0);
  return Math.round((totalDone / totalFields) * 100);
}
