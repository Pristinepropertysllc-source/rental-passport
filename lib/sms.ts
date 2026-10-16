// Minimal Twilio SMS sender (no SDK needed). Needs these env vars in Vercel:
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER (E.164, e.g. +12405550123)
// If they are not set, sending is skipped and nothing breaks.

export function smsConfigured() {
  return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
}

// Turns "(240) 555-0123" into "+12405550123". Returns null if it doesn't look like a US number.
export function toE164(raw: string | null | undefined): string | null {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

export type SmsResult = { ok: boolean; optedOut?: boolean; error?: string };

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  if (!smsConfigured()) return { ok: false, error: 'SMS not configured' };
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: to, From: process.env.TWILIO_FROM_NUMBER!, Body: body }).toString()
    });
    if (res.ok) return { ok: true };
    const data: any = await res.json().catch(() => ({}));
    // 21610 = the person replied STOP; Twilio blocks further texts to them.
    if (data?.code === 21610) return { ok: false, optedOut: true, error: 'Recipient opted out' };
    return { ok: false, error: data?.message || `Twilio error ${res.status}` };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error' };
  }
}
