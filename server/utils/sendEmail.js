import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html }) => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Email Sent] Successfully sent to ${to} (Message ID: ${info.messageId})`);
    return info;
  } catch (err) {
    console.error(`❌ [Email Delivery Error] Failed sending to ${to}:`, err.message);
    throw err;
  }
};

export const sendVerificationEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationUrl = `${clientUrl}/verify-email/${token}`;

  console.log('--------------------------------------------------');
  console.log(`📨 [Email Verification] Target: ${email}`);
  console.log(`🔗 Verification Link: ${verificationUrl}`);
  console.log('--------------------------------------------------');

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ [SMTP Notice] SMTP_HOST, SMTP_USER, or SMTP_PASS not set in server/.env. Real email delivery requires valid SMTP credentials.');
    return;
  }

  const subject = 'Verify your email address - InfoNest';
  const text = `Hello,\n\nPlease verify your email for InfoNest by clicking the link below:\n${verificationUrl}\n\nThis verification link expires in 24 hours.\n\nIf you did not create an account, please disregard this email.`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; background-color: #0c0c0c; color: #ffffff; border-radius: 12px; border: 1px solid #222222;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: 700;">❖ InfoNest</h1>
      </div>
      <h2 style="color: #ffffff; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Verify your email address</h2>
      <p style="color: #a0a0a0; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
        Thank you for joining InfoNest! Please click the button below to verify your email address and activate your account.
      </p>
      <div style="text-align: center; margin-bottom: 28px;">
        <a href="${verificationUrl}" style="background-color: #D4AF37; color: #050505; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p style="color: #777777; font-size: 13px; line-height: 1.5; margin-bottom: 8px;">
        If button doesn't work, copy and paste this link into your browser:
      </p>
      <p style="color: #D4AF37; font-size: 13px; word-break: break-all; margin-bottom: 24px;">
        ${verificationUrl}
      </p>
      <div style="border-top: 1px solid #222222; padding-top: 16px; margin-top: 24px;">
        <p style="color: #666666; font-size: 12px; margin: 0;">
          This link will expire in 24 hours. If you did not sign up for InfoNest, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;

  return await sendEmail({ to: email, subject, text, html });
};

export default sendEmail;
