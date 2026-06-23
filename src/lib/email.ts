import nodemailer from "nodemailer";

// Free email via Gmail SMTP (App Password required)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
  },
});

export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${resetToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password — Investo Boost</title>
</head>
<body style="margin:0;padding:0;background:#060810;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060810;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a0d18;border:1px solid rgba(255,215,0,0.15);border-radius:20px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;background:linear-gradient(135deg,rgba(255,215,0,0.1) 0%,rgba(10,13,24,1) 100%);border-bottom:1px solid rgba(255,215,0,0.1);text-align:center;">
              <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#FFD700,#FFA500);border-radius:12px;line-height:48px;font-size:24px;margin-bottom:12px;">💰</div>
              <h1 style="margin:0;color:#FFD700;font-size:22px;font-weight:800;letter-spacing:-0.02em;">INVESTO BOOST</h1>
              <p style="margin:4px 0 0;color:#6b7280;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Premium Crypto Investment</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#f9fafb;font-size:24px;font-weight:700;">Reset Your Password</h2>
              <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.6;">Hi ${toName}, we received a request to reset your password. Click the button below to create a new password.</p>
              
              <div style="text-align:center;margin:32px 0;">
                <a href="${resetUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#000;font-weight:800;font-size:15px;text-decoration:none;border-radius:12px;letter-spacing:0.02em;box-shadow:0 4px 20px rgba(255,215,0,0.3);">
                  Reset Password
                </a>
              </div>

              <div style="background:rgba(255,215,0,0.05);border:1px solid rgba(255,215,0,0.1);border-radius:12px;padding:16px;margin:24px 0;">
                <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                  ⏱️ This link expires in <strong style="color:#FFD700;">1 hour</strong><br>
                  🔒 If you didn't request this, you can safely ignore this email.<br>
                  🚫 Never share this link with anyone.
                </p>
              </div>

              <p style="margin:0;color:#4b5563;font-size:12px;">Or copy this URL into your browser:<br>
                <span style="color:#FFD700;word-break:break-all;">${resetUrl}</span>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,215,0,0.08);text-align:center;">
              <p style="margin:0;color:#374151;font-size:12px;">© ${new Date().getFullYear()} Investo Boost. All rights reserved.</p>
              <p style="margin:4px 0 0;color:#374151;font-size:11px;">This is an automated email — please do not reply.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Investo Boost" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Reset Your Investo Boost Password",
    html,
  });
}

export async function sendWelcomeEmail(toEmail: string, toName: string) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#060810;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060810;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a0d18;border:1px solid rgba(255,215,0,0.15);border-radius:20px;overflow:hidden;">
          <tr>
            <td style="padding:32px 40px;background:linear-gradient(135deg,rgba(255,215,0,0.1) 0%,rgba(10,13,24,1) 100%);border-bottom:1px solid rgba(255,215,0,0.1);text-align:center;">
              <div style="font-size:40px;margin-bottom:12px;">🚀</div>
              <h1 style="margin:0;color:#FFD700;font-size:22px;font-weight:800;">Welcome to Investo Boost!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;color:#f9fafb;font-size:20px;">Hi ${toName}! 👋</h2>
              <p style="margin:0 0 20px;color:#9ca3af;font-size:15px;line-height:1.7;">
                Your account is ready. You can now deposit funds, choose an investment plan, and start earning daily profits from live crypto trades.
              </p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#000;font-weight:800;font-size:14px;text-decoration:none;border-radius:12px;">
                  Go to Dashboard →
                </a>
              </div>
              <p style="margin:0;color:#4b5563;font-size:13px;line-height:1.6;">
                💡 <strong style="color:#FFD700;">Tip:</strong> Share your referral code with friends and earn commissions on their deposits and daily profits!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,215,0,0.08);text-align:center;">
              <p style="margin:0;color:#374151;font-size:12px;">© ${new Date().getFullYear()} Investo Boost. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Investo Boost" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome to Investo Boost — Your Account is Ready! 🚀",
    html,
  });
}

export async function sendMagicLinkEmail(toEmail: string, toName: string, magicToken: string) {
  const magicUrl = `${process.env.NEXTAUTH_URL}/api/auth/magic-verify?token=${magicToken}&email=${encodeURIComponent(toEmail)}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Investo Boost</title>
</head>
<body style="margin:0;padding:0;background:#060810;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060810;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a0d18;border:1px solid rgba(255,215,0,0.15);border-radius:20px;overflow:hidden;">
          <tr>
            <td style="padding:32px 40px;background:linear-gradient(135deg,rgba(255,215,0,0.1) 0%,rgba(10,13,24,1) 100%);border-bottom:1px solid rgba(255,215,0,0.1);text-align:center;">
              <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#FFD700,#FFA500);border-radius:12px;line-height:48px;font-size:24px;margin-bottom:12px;">💰</div>
              <h1 style="margin:0;color:#FFD700;font-size:22px;font-weight:800;letter-spacing:-0.02em;">INVESTO BOOST</h1>
              <p style="margin:4px 0 0;color:#6b7280;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Premium Crypto Investment</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#f9fafb;font-size:24px;font-weight:700;">Your Magic Sign-In Link</h2>
              <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.6;">Hi ${toName || "there"}, click the button below to sign in instantly — no password needed.</p>
              
              <div style="text-align:center;margin:32px 0;">
                <a href="${magicUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#000;font-weight:800;font-size:15px;text-decoration:none;border-radius:12px;letter-spacing:0.02em;box-shadow:0 4px 20px rgba(255,215,0,0.3);">
                  Sign In to Investo Boost →
                </a>
              </div>

              <div style="background:rgba(255,215,0,0.05);border:1px solid rgba(255,215,0,0.1);border-radius:12px;padding:16px;margin:24px 0;">
                <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                  ⏱️ This link expires in <strong style="color:#FFD700;">15 minutes</strong><br>
                  🔒 If you didn't request this, you can safely ignore this email.<br>
                  🚫 Never share this link with anyone.
                </p>
              </div>

              <p style="margin:0;color:#4b5563;font-size:12px;">Or copy this URL into your browser:<br>
                <span style="color:#FFD700;word-break:break-all;">${magicUrl}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,215,0,0.08);text-align:center;">
              <p style="margin:0;color:#374151;font-size:12px;">© ${new Date().getFullYear()} Investo Boost. All rights reserved.</p>
              <p style="margin:4px 0 0;color:#374151;font-size:11px;">This is an automated email — please do not reply.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Investo Boost" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Your Magic Sign-In Link — Investo Boost",
    html,
  });
}
