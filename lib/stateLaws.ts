// Reusable tenant screening report laws, alphabetical (no state is featured over another).
// Shared by the landing page, the message renters send to landlords, and the
// landlord's view of a shared Rental Passport.
export type StateLaw = {
  name: string;
  code: string;
  summary: string;
  landlordNote: string;
  citation: string;
  href: string;
};

// Alphabetical, no state featured over another.
export const STATE_LAWS: StateLaw[] = [
  {
    name: 'California',
    code: 'CA',
    landlordNote:
      "Under California Civil Code \u00a71950.1, a landlord who accepts a reusable tenant screening report may not charge the applicant an application screening fee or a fee to access it.",
    summary:
      "Landlords may accept a reusable tenant screening report prepared in the last 30 days. If they do, they can't charge you an application screening fee or a fee to access it.",
    citation: 'California Civil Code \u00a71950.1',
    href: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.1'
  },
  {
    name: 'Colorado',
    code: 'CO',
    landlordNote:
      "Under Colorado Revised Statutes \u00a738-12-904, landlords must generally accept a portable tenant screening report less than 30 days old and may not charge an application fee when one is provided.",
    summary:
      "Landlords must accept a portable tenant screening report less than 30 days old, and can't charge you an application fee when you provide one. Limited exception: a landlord who takes only one application fee at a time and refunds it.",
    citation: 'Colorado Revised Statutes \u00a738-12-904',
    href: 'https://law.justia.com/codes/colorado/title-38/tenants-and-landlords/article-12/part-9/section-38-12-904/'
  },
  {
    name: 'Maryland',
    code: 'MD',
    landlordNote:
      "Under Maryland Real Property \u00a78-218, a landlord who accepts a reusable tenant screening report may not charge the applicant an application fee or a fee to access the report.",
    summary:
      "Landlords must tell applicants whether they accept reusable tenant screening reports. If they accept one prepared in the last 30 days, they can't charge you an application fee or a fee to access it.",
    citation: 'Maryland Real Property \u00a78-218',
    href: 'https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=8-218&enactments=false'
  },
  {
    name: 'New York',
    code: 'NY',
    landlordNote:
      "Under New York Real Property Law \u00a7238-a, the background or credit check fee must be waived when the applicant provides a check done within the past 30 days.",
    summary:
      'Background and credit check fees are capped at $20, and the landlord must waive the fee if you give them a background or credit check done within the past 30 days.',
    citation: 'New York Real Property Law \u00a7238-a',
    href: 'https://www.nysenate.gov/legislation/laws/RPP/238-A'
  },
  {
    name: 'Rhode Island',
    code: 'RI',
    landlordNote:
      "Under Rhode Island General Laws \u00a734-18-59, the applicant may not be charged for a background or credit check when they provide a qualifying report from the last 90 days.",
    summary:
      "Landlords can't charge more than the actual cost of a background or credit check, and can't charge for it if you provide a qualifying report from the last 90 days.",
    citation: 'Rhode Island General Laws \u00a734-18-59',
    href: 'http://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-59.htm'
  },
  {
    name: 'Washington',
    code: 'WA',
    landlordNote:
      "Under RCW 59.18.257, a landlord who accepts a comprehensive reusable tenant screening report may not charge the applicant to review it.",
    summary:
      "Landlords choose whether to accept a comprehensive reusable tenant screening report and must tell applicants. If they accept it, they can't charge you to review it.",
    citation: 'RCW 59.18.257',
    href: 'https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.257'
  }
];

// Finds a state from a passport "state" value. Accepts the 2-letter code or the
// full name in any capitalization; returns null for any other state.
export function findStateLaw(raw?: string | null): StateLaw | null {
  const v = (raw ?? '').trim().replace(/\./g, '').toLowerCase();
  if (!v) return null;
  return STATE_LAWS.find((s) => s.code.toLowerCase() === v || s.name.toLowerCase() === v) ?? null;
}
