'use client';

export function PrintButton() {
  return (
    <button
      className="btn btn-primary no-print"
      style={{ marginBottom: 16 }}
      onClick={() => window.print()}
    >
      Print / Save as PDF
    </button>
  );
}
