# Rental Passport — MVP starter

Apply once, share with any landlord. This is a working starter for the first
build stage described in the PRD: **tenants can create an account, complete
their Rental Passport, see it stored/accessible in a dashboard, and invite or
share it with landlords.**

## What's included

- Tenant + landlord accounts (email/password, one `role` per user)
- Multi-section Rental Passport form (personal, employment, rental history,
  household, references) with a live completion percentage
- Document upload (stored on local disk for dev — see "Before production" below)
- Tenant dashboard showing completion status and every application sent
- Share flow: tenant enters a landlord's email → gets a unique secure link
  (`/share/[token]`) → can copy/send it. If a landlord account with that email
  exists, the share also shows up automatically in their dashboard.
- Landlord dashboard listing applications shared with them, with an
  approve/deny action that updates status (`Sent → Viewed → Approved/Denied`)
- Revoke access from the tenant side at any time

## What's intentionally NOT included yet

Per the PRD's phased plan, these are next-phase, not in this starter:

- Actual email delivery for invites (the share link is generated and shown in
  the UI, but no message is sent — wire up SendGrid/Twilio/Resend in
  `lib/actions/share.ts`)
- Payments (application/screening fees) — Stripe integration point noted below
- Third-party screening/background check integration
- Messaging between tenant and landlord
- Property listings (this starter shares a *passport*, not tied to a specific
  listing yet — see "Next steps")
- Admin portal

## Getting started

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

Then open http://localhost:3000. SQLite (`prisma/dev.db`) is used so there's
zero external setup — register a tenant account, fill out the passport, then
register a second (landlord) account in a different browser/incognito window
to test sharing end to end.

## Project structure

```
app/
  page.tsx                 landing page
  register/, login/        auth pages
  dashboard/                tenant dashboard
  passport/                 the Rental Passport form
  passport/share/           invite/manage landlord shares
  share/[token]/            public read-only view landlords open
  landlord/dashboard/       landlord's applicant list
lib/
  db.ts                     Prisma client
  session.ts                cookie-backed session helpers
  passport.ts                completion-percentage logic
  actions/                  server actions (auth, passport, share)
prisma/schema.prisma         data model
```

## Before production (security & infra TODOs)

The PRD calls out sensitive data (SSN, financials, documents), so before this
goes live:

1. **Swap SQLite → Postgres.** Change `provider` in `prisma/schema.prisma` to
   `"postgresql"` and point `DATABASE_URL` at a real database.
2. **Swap local file storage → S3 (or similar).** `lib/actions/passport.ts`
   currently writes uploads to `public/uploads/`, which is fine for local dev
   only — it isn't encrypted at rest and won't persist on most hosts.
3. **Do not store a raw SSN.** This starter deliberately left the SSN field
   out of the schema. If/when you add it, use field-level encryption (e.g. a
   KMS-backed encrypt/decrypt helper) and restrict read access — don't add a
   plain `String` column for it.
4. **Add rate limiting / brute-force protection** on `/login` and `/register`.
5. **Add real email delivery** for share invites and status changes.
6. **Add audit logging** for who viewed/downloaded an applicant's data (the
   PRD's "audit logs" and "view who accessed their application" requirements).
7. **Stripe** for application/screening fees and later rent payments — add a
   `Payment` model and a checkout flow once the fee structure is decided.

## Next steps toward the fuller PRD

- Tie `Share` to a specific `Property` listing (add a `Property` model and a
  property picker on the share form) instead of a general passport share
- Tenant-landlord messaging
- PDF export of a passport (printable application record)
- Mobile-friendly polish / actual mobile app
