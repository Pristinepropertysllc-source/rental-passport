const COMPLETE_SCREENING = {
  key: 'COMPLETE' as const,
  name: 'Complete Screening',
  description: 'Includes Credit Check, Enhanced Landlord Search, and National Criminal Search.',
  priceCents: 5499,
  priceLabel: '$54.99/report'
};

export const PACKAGES = {
  ESSENTIAL: COMPLETE_SCREENING,
  COMPLETE: COMPLETE_SCREENING
} as const;

export type PackageKey = keyof typeof PACKAGES;

export function isPackageKey(value: string): value is PackageKey {
  return value === 'ESSENTIAL' || value === 'COMPLETE';
}
