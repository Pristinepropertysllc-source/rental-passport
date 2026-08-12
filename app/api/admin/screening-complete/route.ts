import { NextRequest, NextResponse } from 'next/server';
import { recordCombinedScreeningReportFromClient } from '@/lib/actions/admin';

export async function POST(req: NextRequest) {
  const { passportId, url, filename } = await req.json();
  if (!passportId || !url || !filename) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    await recordCombinedScreeningReportFromClient(passportId, url, filename);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
