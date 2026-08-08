import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { PrintableApplication } from '@/components/PrintableApplication';
import { PrintButton } from '@/components/PrintButton';
import { applicationComplete } from '@/lib/passport';

export default async function PrintPassportPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'TENANT') redirect('/landlord/dashboard');

  const passport = await db.passport.findUnique({
    where: { userId: user.id },
    include: {
      references: true,
      documents: true,
      occupants: true,
      pets: true,
      vehicles: true,
      rentalHistory: true,
      employment: true
    }
  });
  if (!passport) redirect('/passport');
  if (!applicationComplete(passport)) redirect('/dashboard');
  if (!passport.packagePaid) redirect('/passport/checkout');

  const applicantName = [passport.firstName, passport.lastName].filter(Boolean).join(' ') || user.email;

  return (
    <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <PrintButton />
      <PrintableApplication passport={passport} applicantName={applicantName} email={user.email} />
    </div>
  );
}
