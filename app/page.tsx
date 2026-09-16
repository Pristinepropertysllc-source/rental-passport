import Link from 'next/link';
import { FAQAccordion } from '@/components/FAQAccordion';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    const destination =
      user.role === 'TENANT' ? '/dashboard' : user.role === 'ADMIN' ? '/admin/tenants' : '/landlord/dashboard';
    redirect(destination);
  }

  return (
    <div className="shell">
      {/* Hero */}
      <div className="hero">
        <h1>Apply Once. Rent Anywhere.</h1>
        <p>
          Build one verified Rental Passport and share it with as many landlords as
          you want &mdash; no re-typing your application for every property.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#pricing">
            See pricing
          </a>
          <Link className="btn btn-secondary" href="/login">
            Log in
          </Link>
        </div>
      </div>

      {/* Problem */}
      <div className="card">
        <h2>The problem with renting today</h2>
        <p className="muted" style={{ marginTop: 0 }}>Right now, renters have to:</p>
        <ul className="check-list">
          <li>Fill out the same application over and over</li>
          <li>Upload the same documents to every landlord</li>
          <li>Contact the same references multiple times</li>
          <li>Pay separate application fees at every property</li>
        </ul>
        <p className="muted" style={{ marginBottom: 0 }}>
          Rental Passport solves this with one reusable rental application &mdash; built once,
          shared everywhere.
        </p>
      </div>

      {/* How it works */}
      <div className="card">
        <h2>How it works</h2>
        <div className="section-list">
          <div className="section-row" style={{ alignItems: 'flex-start' }}>
            <div>
              <strong>1. Create your Rental Passport</strong>
              <p className="muted" style={{ margin: '4px 0 0' }}>
                Personal information, employment &amp; income, rental history, references,
                documents, and your screening results &mdash; all in one place.
              </p>
            </div>
          </div>
          <div className="section-row" style={{ alignItems: 'flex-start' }}>
            <div>
              <strong>2. Share with any landlord</strong>
              <p className="muted" style={{ margin: '4px 0 0' }}>
                You control what information is shared, which documents are visible, and how
                long access lasts.
              </p>
            </div>
          </div>
          <div className="section-row" style={{ alignItems: 'flex-start' }}>
            <div>
              <strong>3. Track every application</strong>
              <p className="muted" style={{ margin: '4px 0 0' }}>
                See every property you've applied to, who you've contacted, application
                status, profile views, and approval or denial updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="card" id="pricing">
        <h2>Create Your Rental Passport Once. Use It Everywhere.</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Build one verified rental profile and reuse it every time you apply &mdash; pay once
          for your screening, then share with as many landlords as you need at no extra cost.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="pricing-card pricing-card-highlight" style={{ maxWidth: 360, width: '100%' }}>
            <h3>Complete Screening</h3>
            <p className="price-tag">$54.99</p>
            <ul className="check-list">
              <li>Credit Check</li>
              <li>Enhanced Landlord Search</li>
              <li>National Criminal Search</li>
            </ul>
            <p className="muted" style={{ fontSize: 14 }}>
              Everything you need for a verified application ready to share.
            </p>
            <Link className="btn btn-primary" href="/register?package=COMPLETE">
              Get started
            </Link>
          </div>
        </div>
      </div>

      {/* Trust and sharing */}
      <div className="card">
        <h2>Your Rental Passport belongs to you.</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Once your screening is complete, you decide who sees it. Share a secure link with any
          landlord &mdash; they can view your application without creating an account.
        </p>
        <ul className="check-list">
          <li>Secure, unique application links</li>
          <li>Document sharing controls</li>
          <li>Access expiration settings</li>
          <li>Application viewing history</li>
          <li>Revoke access at any time</li>
        </ul>
      </div>

      {/* Audience sections */}
      <div className="grid-2">
        <div className="card">
          <h2>For Renters</h2>
          <ul className="check-list">
            <li>Apply faster with one reusable profile</li>
            <li>Upload your documents once</li>
            <li>Save money on repeat application fees</li>
            <li>Control exactly what you share, and with whom</li>
            <li>Track every application in one place</li>
          </ul>
        </div>
        <div className="card">
          <h2>For Landlords</h2>
          <ul className="check-list">
            <li>Receive complete, standardized applications</li>
            <li>Review applicants faster</li>
            <li>Access organized, verified documents</li>
            <li>Reach applicants directly using the contact info on their application</li>
            <li>Keep applicant records organized in one dashboard</li>
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 style={{ textAlign: 'center' }}>Frequently Asked Questions</h2>
        <p className="muted" style={{ textAlign: 'center', marginTop: 0 }}>
          Everything you need to know about Rental Passport.
        </p>
        <FAQAccordion
          items={[
            {
              question: 'What is Rental Passport?',
              answer:
                'Rental Passport is a digital rental application that lets you complete your rental information once and reuse it when applying to multiple rental properties. Instead of filling out the same application and uploading the same documents for every property, you keep your information organized in one secure Rental Passport.'
            },
            {
              question: 'How does Rental Passport work?',
              answer:
                "1. Create your account\nSign up and start your Rental Passport.\n\n2. Complete your application\nEnter your personal information, employment, income, rental history, references, household information, and supporting documents.\n\n3. Pay for your screening\nComplete payment securely through Stripe ($54.99).\n\n4. Complete your screening\nYour screening results are added to your Rental Passport.\n\n5. Apply to properties\nShare your Rental Passport with landlords instead of completing a new application from scratch."
            },
            {
              question: 'Do I have to complete the entire application before I pay?',
              answer:
                "No. You can proceed to payment at any point, even if some fields are still blank. We recommend filling out as much as you can, since a more complete application gives landlords more confidence, but it isn't required."
            },
            {
              question: "What's included in Rental Passport screening?",
              answer:
                'Complete Screening — $54.99\n\nIncludes:\n• Credit Check\n• Enhanced Landlord Search\n• National Criminal Search\n\nAvailable screening options may depend on the screening services connected to Rental Passport.'
            },
            {
              question: 'Does Rental Passport guarantee that I will be approved for a rental?',
              answer:
                'No. Rental Passport does not guarantee approval. Each landlord or property manager makes their own rental decision based on their own requirements, screening criteria, and applicable laws. Rental Passport helps you organize and share your rental information more efficiently.'
            },
            {
              question: 'Do I have to complete a new application for every property?',
              answer:
                'No — that\u2019s the purpose of Rental Passport. You can reuse your completed Rental Passport when applying to multiple properties. A landlord may still ask you for additional information or property-specific requirements.'
            },
            {
              question: 'Can I control what a landlord sees?',
              answer:
                'Yes. You control who can view your Rental Passport. You can set a link expiration date and revoke access at any time.'
            },
            {
              question: "Can I revoke a landlord's access?",
              answer:
                "Yes. You can revoke a landlord's access to your shared Rental Passport at any time from your Share page. Once revoked, that link no longer works."
            },
            {
              question: 'Does the landlord need a Rental Passport account?',
              answer:
                'No. A landlord can open your secure share link and view your application without creating an account. Landlords can optionally create an account to keep track of applicants in one dashboard.'
            },
            {
              question: 'Can I see who viewed my Rental Passport?',
              answer: 'Yes. Your Share page shows when each landlord you\u2019ve shared with has viewed your application.'
            },
            {
              question: 'Can I upload my own documents?',
              answer:
                'Yes. You can upload supporting documents such as a government ID, pay stubs, bank statements, tax documents, an offer letter, pet records, and other supporting documents.'
            },
            {
              question: 'Where are my screening results?',
              answer:
                'Once your screening is complete, your results appear on your dashboard under Verification Status, where you can view the report that was uploaded.'
            },
            {
              question: 'Can Rental Passport administrators upload screening results to my account?',
              answer:
                'Yes. Authorized Rental Passport administrators can upload screening results directly to your account when results are received outside of an automated system. Administrative uploads are logged for security and auditing purposes.'
            },
            {
              question: 'Is my information secure?',
              answer:
                'Rental Passport uses secure authentication and permission-based access, so your information is only visible to you, landlords you choose to share with, and authorized Rental Passport staff.'
            },
            {
              question: 'Does Rental Passport store my Social Security number?',
              answer:
                'Rental Passport may collect sensitive identity information, including a Social Security number, when required for the screening process. This information is used for verification and is shared with landlords through your Rental Passport at your discretion.'
            },
            {
              question: 'How much does it cost to share my Rental Passport?',
              answer:
                'There is no separate fee to share your Rental Passport. Your one-time $54.99 screening payment covers sharing with as many landlords as you need.'
            },
            {
              question: 'Can I use Rental Passport with multiple landlords?',
              answer:
                'Yes. The purpose of Rental Passport is to let you reuse your completed rental profile when applying to multiple properties. You stay in control of when and with whom your information is shared.'
            },
            {
              question: 'Can landlords use Rental Passport?',
              answer:
                'Yes. Landlords and property managers can use Rental Passport to receive, organize, and review rental applications, including applicant information, documents, rental history, employment and income information, and available screening results.'
            },
            {
              question: "What can landlords do with an applicant's Rental Passport?",
              answer:
                'Landlords can review applications, view applicant information and documents, review screening results, approve or deny applications, and download or print application records.'
            },
            {
              question: 'Does Rental Passport make the rental decision for landlords?',
              answer:
                'No. Rental Passport provides landlords with organized applicant information and screening results. The landlord or property manager is responsible for making the rental decision.'
            },
            {
              question: 'Can I print my Rental Passport?',
              answer:
                'Yes. The Print option generates a complete, printable file of your application and screening information, which you can also save as a PDF.'
            },
            {
              question: 'Can I edit my Rental Passport after completing it?',
              answer: 'Yes. You can update your information on your Passport page at any time.'
            },
            {
              question: 'What happens if my information changes?',
              answer:
                'Update your Rental Passport whenever important information changes, such as your address, employer, income, contact information, household information, or rental history. Keeping your information current helps landlords receive accurate application information.'
            },
            {
              question: 'What happens if I forget my password?',
              answer:
                "Use the \"Forgot password?\" link on the login page. Enter your email and we'll send you a secure link to set a new password. If you originally signed up with Google, use \"Continue with Google\" to sign in instead."
            },
            {
              question: 'Can I delete my account?',
              answer:
                "Account deletion and data-retention options are subject to Rental Passport's privacy and data-retention practices. Contact support if you need help with your account or personal information."
            },
            {
              question: 'How do I contact Rental Passport support?',
              answer:
                'If you need help with your account, application, payment, screening, or sharing your Rental Passport, email us at support@myrentalpassport.net.'
            }
          ]}
        />
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Apply Once. Rent Anywhere.</h2>
        <div className="hero-actions" style={{ marginTop: 14 }}>
          <a className="btn btn-primary" href="#pricing">
            Get started
          </a>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <Link href="/login" className="muted" style={{ fontSize: 13 }}>
          Admin
        </Link>
      </div>
    </div>
  );
}
