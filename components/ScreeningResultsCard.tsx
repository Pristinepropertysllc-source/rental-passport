import { SCREENING_CATEGORIES } from '@/lib/screening';

type ScreeningItem = {
  category: string;
  status: string;
  documentId: string | null;
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: '#f3f1ec', color: '#6b6862' },
  PROCESSING: { bg: '#fbf3e3', color: '#c98a4b' },
  COMPLETED: { bg: '#e6f2e6', color: '#2f6b3a' },
  VERIFIED: { bg: '#e6f2e6', color: '#2f6b3a' },
  FAILED: { bg: '#fbeceb', color: '#b3423a' },
  EXPIRED: { bg: '#fbeceb', color: '#b3423a' }
};

export function ScreeningResultsCard({
  screeningItems,
  shareToken,
  passportId
}: {
  screeningItems: ScreeningItem[];
  shareToken?: string;
  passportId: string;
}) {
  const itemFor = (category: string) => screeningItems.find((i) => i.category === category);
  const anyCompleted = screeningItems.some((i) => i.status === 'COMPLETED' || i.status === 'VERIFIED');
  const reportDocId = screeningItems.find((i) => i.documentId)?.documentId;

  return (
    <div className="screening-card">
      <div className="screening-card-header">
        <div>
          <h2 style={{ margin: 0 }}>Screening Results</h2>
          <p className="muted" style={{ margin: '2px 0 0', fontSize: 13 }}>
            Credit, background, and landlord history screening
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {anyCompleted && <span className="screening-verified-badge">✓ Verified by Rental Passport</span>}
          {reportDocId && (
            <a
              href={shareToken ? `/api/doc/${reportDocId}?share=${shareToken}` : `/api/doc/${reportDocId}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm no-print"
            >
              View report
            </a>
          )}
        </div>
      </div>

      <div className="screening-rows">
        {SCREENING_CATEGORIES.map((cat) => {
          const item = itemFor(cat.key);
          const status = item?.status || 'PENDING';
          const style = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
          return (
            <div className="screening-row" key={cat.key}>
              <span>{cat.label}</span>
              <span className="screening-status-pill" style={{ background: style.bg, color: style.color }}>
                {status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="no-print" style={{ marginTop: 16 }}>
        <a
          className="btn btn-primary btn-sm"
          href={
            shareToken
              ? `/api/passport-pdf/${passportId}?share=${shareToken}`
              : `/api/passport-pdf/${passportId}`
          }
        >
          Download / print complete file (application + all documents)
        </a>
      </div>
    </div>
  );
}
