export const DOCUMENT_TYPES = [
  'Government ID',
  'Pay Stub',
  'Bank Statement',
  'Tax Document',
  'Offer Letter',
  'Pet Record',
  'Other'
];

// Display wording for each stored document type. The stored values in
// DOCUMENT_TYPES are unchanged, so existing uploads keep working.
export const DOCUMENT_CATEGORY_INFO: Record<string, { label: string; description: string; button: string }> = {
  'Government ID': {
    label: 'Government-Issued ID',
    description: "Driver's license, state ID, or passport.",
    button: 'Upload ID'
  },
  'Pay Stub': {
    label: 'Proof of Income',
    description: 'Recent pay stubs or other documents showing your income.',
    button: 'Upload Proof of Income'
  },
  'Bank Statement': {
    label: 'Bank Statements',
    description: 'Bank statements that may help support your financial information.',
    button: 'Upload Bank Statement'
  },
  'Tax Document': {
    label: 'Tax Documents',
    description: 'Tax returns or other relevant tax documents.',
    button: 'Upload Tax Document'
  },
  'Offer Letter': {
    label: 'Employment Offer Letter',
    description: 'An offer letter confirming a new job or upcoming employment.',
    button: 'Upload Offer Letter'
  },
  'Pet Record': {
    label: 'Pet Documentation',
    description: 'Pet records or other relevant pet documentation.',
    button: 'Upload Pet Documents'
  },
  Other: {
    label: 'Other Supporting Documents',
    description: 'Upload any additional documents you would like to include in your Rental Passport.',
    button: 'Upload Other Document'
  }
};

export function documentLabel(type: string) {
  return DOCUMENT_CATEGORY_INFO[type]?.label ?? type;
}
