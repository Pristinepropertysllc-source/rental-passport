import { db } from '@/lib/db';
import { ResetPasswordForm } from './ResetPasswordForm';
import { AuthLogo } from '@/components/AuthLogo';

export default async function ResetPasswordPage({ params }: { params: { token: string } }) {
  const resetToken = await db.passwordResetToken.findUnique({ where: { token: params.token } });
  const valid = !!resetToken && resetToken.expiresAt > new Date();

  if (!valid) {
    return (
      <div className="shell" style={{ maxWidth: 440, paddingTop: 60 }}>
        <AuthLogo />
        <div className="card">
          <h1 style={{ fontSize: 20 }}>This reset link is invalid or has expired</h1>
          <p className="muted">Request a new one from the login page.</p>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={params.token} />;
}
