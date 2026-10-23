// The "screening date" is the date the screening results were added to the
// passport. For each completed/verified item we use the date its report
// document was uploaded (falling back to the item's last update). If several
// items are done we use the oldest date, so a 30-day-old warning is never
// hidden by a newer result. Returns null while nothing is complete yet.
const DONE = ['COMPLETED', 'VERIFIED'];

export function screeningDate(
  items: { status: string; updatedAt: Date; documentId: string | null }[],
  documents: { id: string; uploadedAt: Date }[]
): Date | null {
  const dates = items
    .filter((i) => DONE.includes(i.status))
    .map((i) => documents.find((d) => d.id === i.documentId)?.uploadedAt ?? i.updatedAt);
  if (dates.length === 0) return null;
  return new Date(Math.min(...dates.map((d) => d.getTime())));
}

export function formatLongDate(d: Date) {
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York'
  });
}

export function isOlderThan30Days(d: Date) {
  return Date.now() - d.getTime() > 30 * 24 * 60 * 60 * 1000;
}
