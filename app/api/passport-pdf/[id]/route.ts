import { NextRequest } from 'next/server';
import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

type Cursor = { page: PDFPage; y: number };

function newAppPage(pdf: PDFDocument, boldFont: PDFFont): Cursor {
  const page = pdf.addPage([612, 792]);
  page.drawText('Prospect Application Detail', {
    x: 50,
    y: 750,
    size: 16,
    font: boldFont,
    color: rgb(0.11, 0.33, 0.62)
  });
  page.drawLine({ start: { x: 50, y: 742 }, end: { x: 562, y: 742 }, thickness: 1.5, color: rgb(0.11, 0.33, 0.62) });
  return { page, y: 715 };
}

function drawRow(
  pdf: PDFDocument,
  cursor: Cursor,
  boldFont: PDFFont,
  font: PDFFont,
  label: string,
  value: string | null | undefined
) {
  if (cursor.y < 60) {
    const fresh = newAppPage(pdf, boldFont);
    cursor.page = fresh.page;
    cursor.y = fresh.y;
  }
  cursor.page.drawText(label, { x: 50, y: cursor.y, size: 9, font: boldFont, color: rgb(0.25, 0.25, 0.25) });
  const text = String(value || '').slice(0, 68);
  cursor.page.drawText(text, { x: 260, y: cursor.y, size: 9, font, color: rgb(0, 0, 0) });
  cursor.y -= 14;
  cursor.page.drawLine({
    start: { x: 50, y: cursor.y + 5 },
    end: { x: 562, y: cursor.y + 5 },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85)
  });
  cursor.y -= 4;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const shareToken = req.nextUrl.searchParams.get('share');

  const passport = await db.passport.findUnique({
    where: { id: params.id },
    include: {
      documents: { orderBy: { uploadedAt: 'asc' } },
      user: true,
      occupants: true,
      pets: true,
      vehicles: true,
      rentalHistory: true,
      employment: true,
      references: true
    }
  });
  if (!passport) return new Response('Not found', { status: 404 });

  const user = await getCurrentUser();
  let authorized = false;

  if (user && user.id === passport.userId) authorized = true;
  if (user && user.role === 'ADMIN') authorized = true;

  if (!authorized && shareToken) {
    const share = await db.share.findUnique({ where: { token: shareToken } });
    if (share && share.passportId === passport.id && (!share.expiresAt || share.expiresAt > new Date())) {
      authorized = true;
    }
  }
  if (!authorized && user && user.role === 'LANDLORD') {
    const share = await db.share.findFirst({
      where: { passportId: passport.id, OR: [{ landlordId: user.id }, { landlordEmail: user.email }] }
    });
    if (share) authorized = true;
  }

  if (!authorized) return new Response('Forbidden', { status: 403 });

  const applicantName =
    [passport.firstName, passport.lastName].filter(Boolean).join(' ') || passport.user.email;

  const screeningReportDoc = passport.documents
    .filter((d) => d.type === 'Screening Report')
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];

  // Screening Report first, then everything else in upload order.
  const orderedDocs = [
    ...passport.documents.filter((d) => d.type === 'Screening Report'),
    ...passport.documents.filter((d) => d.type !== 'Screening Report')
  ];

  const mergedPdf = await PDFDocument.create();
  const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await mergedPdf.embedFont(StandardFonts.HelveticaBold);

  // ---- Cover page ----
  const cover = mergedPdf.addPage([612, 792]);
  let y = 730;
  cover.drawText('Rental Passport', { x: 50, y, size: 22, font: boldFont, color: rgb(0.18, 0.36, 0.31) });
  y -= 30;
  cover.drawText(applicantName, { x: 50, y, size: 16, font });
  y -= 26;
  cover.drawText(`Application ID: ${passport.id}`, { x: 50, y, size: 10, font, color: rgb(0.42, 0.42, 0.42) });
  y -= 16;
  const generatedFormatted = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date());
  cover.drawText(`Generated: ${generatedFormatted} ET`, {
    x: 50,
    y,
    size: 10,
    font,
    color: rgb(0.42, 0.42, 0.42)
  });
  y -= 40;

  // Verification stamp
  const stampTop = y;
  const stampHeight = screeningReportDoc ? 66 : 50;
  cover.drawRectangle({
    x: 50,
    y: stampTop - stampHeight,
    width: 300,
    height: stampHeight,
    borderWidth: 2,
    borderColor: screeningReportDoc ? rgb(0.18, 0.42, 0.24) : rgb(0.6, 0.6, 0.6),
    color: screeningReportDoc ? rgb(0.93, 0.97, 0.93) : rgb(0.96, 0.96, 0.96)
  });
  cover.drawText(screeningReportDoc ? 'VERIFIED' : 'SCREENING PENDING', {
    x: 62,
    y: stampTop - 22,
    size: 13,
    font: boldFont,
    color: screeningReportDoc ? rgb(0.13, 0.35, 0.18) : rgb(0.45, 0.45, 0.45)
  });
  cover.drawText('Rental Passport Screening', {
    x: 62,
    y: stampTop - 38,
    size: 9,
    font,
    color: rgb(0.3, 0.3, 0.3)
  });
  if (screeningReportDoc) {
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(screeningReportDoc.uploadedAt);
    cover.drawText(`Uploaded: ${formatted} ET`, {
      x: 62,
      y: stampTop - 54,
      size: 9,
      font,
      color: rgb(0.3, 0.3, 0.3)
    });
  }
  y = stampTop - stampHeight - 30;

  cover.drawText('Documents included in this file:', { x: 50, y, size: 13, font: boldFont });
  y -= 22;
  for (const doc of orderedDocs) {
    if (y < 60) break;
    cover.drawText(`\u2022 ${doc.type} \u2014 ${doc.filename}`, { x: 60, y, size: 11, font });
    y -= 18;
  }
  if (orderedDocs.length === 0) {
    cover.drawText('No documents uploaded yet.', { x: 60, y, size: 11, font, color: rgb(0.42, 0.42, 0.42) });
  }

  // ---- Prospect Application Detail pages ----
  const cursor = newAppPage(mergedPdf, boldFont);
  const row = (label: string, value: string | null | undefined) =>
    drawRow(mergedPdf, cursor, boldFont, font, label, value);

  row('First Name', passport.firstName);
  row('Last Name', passport.lastName);
  row('Street Address', passport.streetAddress);
  row('City', passport.city);
  row('State', passport.state);
  row('Zip', passport.zip);
  row('Date of Birth', passport.dateOfBirth);
  row('Home Phone', passport.homePhone);
  row('Mobile Phone', passport.mobilePhone);
  row('SSN', passport.ssn);
  row('Annual Income', passport.annualIncome);
  row('Email', passport.user.email);
  row('Which property are you applying to?', passport.propertyApplyingTo);
  row('Are you Active Military?', passport.activeMilitary);
  row('Do you have past judgements, or lawsuits?', passport.pastJudgments);
  row('Have you been arrested, or convicted for a crime?', passport.arrestedConvicted);
  row('When Do you Want to Move In?', passport.moveInDate);

  for (const o of passport.occupants) {
    row('First Name', o.firstName);
    row('Last Name', o.lastName);
    row('Date of Birth', o.dateOfBirth);
    row('Relationship', o.relationship);
  }
  for (const p of passport.pets) {
    row('Type', p.type);
    row('Breed', p.breed);
    row('Size (lbs.)', p.sizeLbs);
    row('Color', p.color);
  }
  for (const r of passport.rentalHistory) {
    row('Move In', r.moveIn);
    row('Move Out', r.moveOut);
    row('Landlord', r.landlord);
    row('Landlord Phone', r.landlordPhone);
    row('Street Address', r.street);
    row('City', r.city);
    row('State', r.state);
    row('Zip', r.zip);
    row('Rent Amount', r.rentAmount);
    row('Reason for leaving', r.reasonForLeaving);
    row('Landlord Email Contact', r.landlordEmail);
  }
  for (const e of passport.employment) {
    row('Date Start', e.dateStart);
    row('Date End', e.dateEnd);
    row('Employer Name', e.employerName);
    row('Position', e.position);
    row('Supervisor', e.supervisor);
    row('Phone', e.phone);
    row('Address', e.address);
    row('Salary', e.salary);
  }
  for (const v of passport.vehicles) {
    row('Name', v.ownerName);
    row('Address', v.ownerAddress);
    row('Home Phone', v.ownerHomePhone);
    row('Description (Color Etc.)', v.description);
    row('License Plate #', v.licensePlate);
    row('State', v.state);
    row('Make', v.make);
    row('Model', v.model);
    row('Year', v.year);
  }
  for (const ref of passport.references) {
    row('Name', ref.name);
    row('Address', ref.address);
    row('Home Phone', ref.homePhone);
    row('Mobile Phone', ref.mobilePhone);
  }

  // ---- Merge each real document's pages in order ----
  for (const doc of orderedDocs) {
    try {
      const res = await fetch(doc.url);
      if (!res.ok) continue;
      const bytes = await res.arrayBuffer();
      const contentType = res.headers.get('content-type') || '';
      const nameLower = doc.filename.toLowerCase();
      const isPdf = contentType.includes('pdf') || nameLower.endsWith('.pdf');
      const isPng = contentType.includes('png') || nameLower.endsWith('.png');
      const isJpg = contentType.includes('jpeg') || contentType.includes('jpg') || /\.jpe?g$/i.test(nameLower);

      if (isPdf) {
        const srcPdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        copiedPages.forEach((p) => mergedPdf.addPage(p));
      } else if (isPng || isJpg) {
        const img = isPng ? await mergedPdf.embedPng(bytes) : await mergedPdf.embedJpg(bytes);
        const page = mergedPdf.addPage([612, 792]);
        const maxWidth = 512;
        const maxHeight = 700;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        const w = img.width * scale;
        const h = img.height * scale;
        page.drawImage(img, { x: (612 - w) / 2, y: (792 - h) / 2, width: w, height: h });
      }
      // Unsupported file types are skipped -- they're still listed on the cover page.
    } catch {
      // Skip any document that fails to fetch or parse rather than failing the whole file.
    }
  }

  const pdfBytes = await mergedPdf.save();
  const safeName = applicantName.replace(/[^a-z0-9]+/gi, '-');

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${safeName}-rental-passport.pdf"`
    }
  });
}
