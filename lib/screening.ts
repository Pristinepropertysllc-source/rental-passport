export const SCREENING_CATEGORIES = [
  { key: 'CREDIT', label: 'Credit Screening' },
  { key: 'CRIMINAL', label: 'Background Screening' },
  { key: 'RENTAL_HISTORY', label: 'Landlord Search' }
] as const;

export const SCREENING_STATUSES = [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'VERIFIED',
  'FAILED',
  'EXPIRED'
] as const;
