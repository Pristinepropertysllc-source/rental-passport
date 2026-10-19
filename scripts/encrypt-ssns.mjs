// One-time (and safe to re-run) backfill: encrypts SSNs still stored as plain text.
// Same format as lib/ssn.ts. Runs on production builds (see vercel.json); does nothing
// outside production or when SSN_ENCRYPTION_KEY is not set.
import { createCipheriv, randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';

const PREFIX = 'enc:v1:';

if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
  console.log('encrypt-ssns: skipped (not a production build)');
  process.exit(0);
}
if (!process.env.SSN_ENCRYPTION_KEY) {
  console.log('encrypt-ssns: skipped (SSN_ENCRYPTION_KEY not set)');
  process.exit(0);
}
const key = Buffer.from(process.env.SSN_ENCRYPTION_KEY, 'base64');
if (key.length !== 32) {
  console.error('encrypt-ssns: SSN_ENCRYPTION_KEY must be 32 bytes, base64-encoded');
  process.exit(1);
}

function encrypt(value) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return PREFIX + [iv, cipher.getAuthTag(), ct].map((b) => b.toString('base64')).join(':');
}

const db = new PrismaClient();
const rows = await db.passport.findMany({
  where: { ssn: { not: null }, NOT: { ssn: { startsWith: PREFIX } } },
  select: { id: true, ssn: true }
});
let count = 0;
for (const row of rows) {
  if (!row.ssn || !row.ssn.trim()) continue;
  await db.passport.update({ where: { id: row.id }, data: { ssn: encrypt(row.ssn.trim()) } });
  count++;
}
console.log(`encrypt-ssns: encrypted ${count} SSN(s)`);
await db.$disconnect();
