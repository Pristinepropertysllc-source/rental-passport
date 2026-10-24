import { findStateLaw } from '@/lib/stateLaws';

export const SITE_URL = 'https://www.myrentalpassport.net';

export function shareLink(token: string) {
  return `${SITE_URL}/share/${token}`;
}

// The pre-filled message used for text, email and the phone's Share sheet.
export function buildShareMessage({
  firstName,
  property,
  screeningDate,
  link,
  state
}: {
  firstName?: string | null;
  property?: string | null;
  screeningDate: string | null; // already formatted, e.g. "October 21, 2026"
  link: string;
  state?: string | null; // the renter's state, used to pick the right law sentence
}) {
  const lawSentence =
    findStateLaw(state)?.landlordNote ??
    'Many landlords accept reusable screening reports instead of charging a new application fee.';
  const greeting = firstName ? `Hi, this is ${firstName}.` : 'Hi.';
  const interest = property ? ` I'm interested in ${property}.` : '';
  const dated = screeningDate ? `, dated ${screeningDate}` : ' (screening in progress)';
  return (
    `${greeting}${interest} Here is my Rental Passport, a reusable tenant screening report ` +
    `with my application, credit, criminal, eviction and income screening${dated}: ${link}. ` +
    `It's free for you to view and no account is needed. ${lawSentence} Thank you!`
  );
}

// sms: needs digits only; assume a US number when 10 digits are given.
export function smsNumber(raw?: string | null) {
  if (!raw) return '';
  const digits = raw.replace(/[^\d+]/g, '');
  const onlyDigits = digits.replace(/\D/g, '');
  if (onlyDigits.length === 10) return `+1${onlyDigits}`;
  if (onlyDigits.length === 11 && onlyDigits.startsWith('1')) return `+${onlyDigits}`;
  return digits.startsWith('+') ? `+${onlyDigits}` : onlyDigits;
}
