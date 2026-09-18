import Link from 'next/link';
import { FAQSidebar } from '@/components/FAQSidebar';
import { FAQ_ITEMS } from '@/lib/faqData';
import { AuthLogo } from '@/components/AuthLogo';

export default function FAQPage() {
  return (
    <div className="shell" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <AuthLogo />
      <Link href="/" className="muted" style={{ fontSize: 13 }}>
        &larr; Back to homepage
      </Link>

      <div className="card" style={{ marginTop: 16 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 4 }}>Frequently Asked Questions</h1>
        <p className="muted" style={{ textAlign: 'center', marginTop: 0 }}>
          Everything you need to know about Rental Passport.
        </p>
        <FAQSidebar items={FAQ_ITEMS} />
      </div>

      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <Link href="/" className="btn btn-secondary">
          &larr; Back to homepage
        </Link>
      </div>
    </div>
  );
}
