export function emailWrapper(contentHtml: string) {
  return `
    <div style="background:#f7f7f5; padding: 32px 16px; font-family: -apple-system, Helvetica, Arial, sans-serif;">
      <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg, #2f5d50 0%, #1e4a3f 100%); padding:28px 24px; text-align:center;">
          <img
            src="https://www.myrentalpassport.net/logo-email.png"
            alt="Rental Passport"
            width="120"
            style="display:block; margin:0 auto; max-width:120px; height:auto;"
          />
        </div>
        <div style="padding:32px 28px; color:#1e1c1a; line-height:1.65; font-size:15px;">
          ${contentHtml}
        </div>
        <div style="background:#f7f7f5; padding:18px 28px; text-align:center; border-top:1px solid #e4e2dd;">
          <p style="margin:0; font-size:12px; color:#5b5852; font-weight:600; letter-spacing:0.02em;">
            RENTAL PASSPORT
          </p>
          <p style="margin:4px 0 0; font-size:11px; color:#5b5852;">
            Apply Once. Rent Anywhere.
          </p>
        </div>
      </div>
    </div>
  `;
}

export function emailButton(url: string, label: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px auto;">
      <tr>
        <td style="background:#2f5d50; border-radius:8px;">
          <a href="${url}" style="display:inline-block; padding:13px 24px; color:#ffffff; text-decoration:none; font-weight:600; font-size:15px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
}
