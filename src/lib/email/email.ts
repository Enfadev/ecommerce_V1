import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPasswordResetEmailParams {
  email: string;
  resetToken: string;
  userName?: string;
}

export async function sendPasswordResetEmail({
  email,
  resetToken,
  userName,
}: SendPasswordResetEmailParams) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #050816; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #e2e8f0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 32px 16px; background: radial-gradient(circle at top, rgba(76, 29, 149, 0.22), transparent 55%), radial-gradient(circle at bottom, rgba(37, 99, 235, 0.18), transparent 60%);">
              <tr>
                <td align="center">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #0f172a; border-radius: 20px; border: 1px solid rgba(148, 163, 184, 0.12); overflow: hidden;">
                    <tr>
                      <td align="center" style="padding: 36px 32px 28px; border-bottom: 1px solid rgba(148, 163, 184, 0.16);">
                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                          <tr>
                            <td align="center" style="padding: 0;">
                              <span style="display: inline-block; width: 56px; height: 56px; line-height: 56px; border-radius: 999px; background: linear-gradient(135deg, #22c55e, #16a34a); color: #f8fafc; font-size: 28px; font-weight: 600;">✓</span>
                            </td>
                          </tr>
                        </table>
                        <h1 style="margin: 0 0 12px; font-size: 24px; font-weight: 600; color: #f8fafc;">Reset Your Password</h1>
                        <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #cbd5f5;">
                          Complete the secure reset flow inside the next hour to keep your account protected.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 32px 32px 36px;">
                        ${userName ? `<p style="margin: 0 0 20px; font-size: 15px; color: #e2e8f0;">Hello ${userName},</p>` : ''}
                        <p style="margin: 0 0 26px; font-size: 15px; line-height: 1.7; color: #cbd5f5;">
                          We received a password reset request for your account. Use the button below to choose a new password securely.
                        </p>
                        <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto 30px;">
                          <tr>
                            <td align="center" style="border-radius: 14px; background: linear-gradient(135deg, #2563eb, #1d4ed8);">
                              <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.02em; border-radius: 14px;">Reset Password</a>
                            </td>
                          </tr>
                        </table>
                        <div style="margin: 0 0 28px; padding: 18px 20px; border-radius: 14px; background: rgba(37, 99, 235, 0.12); border: 1px solid rgba(59, 130, 246, 0.35);">
                          <p style="margin: 0; font-size: 13px; line-height: 1.7; color: #93c5fd;">
                            <strong style="color: #bfdbfe;">Expiry notice:</strong> The reset link stays active for 60 minutes. After that, request a new one from the forgot password page.
                          </p>
                        </div>
                        <p style="margin: 0 0 12px; font-size: 13px; line-height: 1.7; color: #a5b4fc;">
                          If the button above does not work, copy and paste this link into your browser:
                        </p>
                        <p style="margin: 0; font-size: 12px; line-height: 1.7; color: #93c5fd; word-break: break-all;">${resetUrl}</p>
                        <div style="margin-top: 34px; padding-top: 22px; border-top: 1px solid rgba(148, 163, 184, 0.16);">
                          <p style="margin: 0; font-size: 12px; line-height: 1.7; color: #94a3b8;">
                            Didn’t request this change? Ignore this email. Your current password will remain the same and your account stays secure.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding: 22px 32px; background: rgba(15, 23, 42, 0.8); border-top: 1px solid rgba(148, 163, 184, 0.12);">
                        <p style="margin: 0; font-size: 12px; color: rgba(148, 163, 184, 0.85);">
                          © ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_SITE_NAME || 'E-Commerce Store'}. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}
