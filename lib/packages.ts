export const PACKAGES = {
  ESSENTIAL: {
    key: 'ESSENTIAL',
    name: 'Essential Package',
    description: 'Includes Credit Check, Enhanced Landlord Search, and National Criminal Search.',
    priceCents: 5499,
    priceLabel: '$54.99/report'
  },
  COMPLETE: {
    key: 'COMPLETE',
    name: 'Complete Package',
    description:
      'Includes Credit Check, Enhanced Landlord Search, National Criminal Search, and Identity Verification.',
    priceCents: 7499,
    priceLabel: '$74.99/report'
  }
} as const;

export type PackageKey = keyof typeof PACKAGES;

export function isPackageKey(value: string): value is PackageKey {
  return value === 'ESSENTIAL' || value === 'COMPLETE';
}
