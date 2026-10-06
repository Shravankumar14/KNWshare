import nodemailer from 'nodemailer';

/**
 * Sends an email using one of the supported channels:
 * 1. Resend HTTP API (if RESEND_API_KEY is defined) - Recommended for cloud providers like Render Free Tier that block outbound SMTP ports.
 * 2. Brevo HTTP API (if BREVO_API_KEY is defined).
 * 3. Nodemailer SMTP (if SMTP_HOST, SMTP_USER, SMTP_PASS are defined) with 5s connection/socket timeouts and IPv4 forcing.
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  // Option 1: Resend HTTP API (Port 443 HTTPS - Works on Render Free Tier)
  if (process.env.RESEND_API_KEY) {
    const from = process.env.EMAIL_FROM || 'InfoNest <onboarding@resend.dev>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.message || `Resend HTTP error ${res.status}`;
      console.error(`❌ [Resend Error] Failed sending to ${to}:`, errMsg);
      throw new Error(errMsg);
    }

    console.log(`✅ [Email Sent via Resend] Successfully sent to ${to} (Message ID: ${data.id})`);
    return { messageId: data.id };
  }

  // Option 2: Brevo HTTP API (Port 443 HTTPS - Works on Render Free Tier)
  if (process.env.BREVO_API_KEY) {
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || 'info@knwshare.dev';
    const senderName = process.env.BREVO_SENDER_NAME || 'InfoNest';
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.message || `Brevo HTTP error ${res.status}`;
      console.error(`❌ [Brevo Error] Failed sending to ${to}:`, errMsg);
      throw new Error(errMsg);
    }

    console.log(`✅ [Email Sent via Brevo] Successfully sent to ${to} (Message ID: ${data.messageId})`);
    return { messageId: data.messageId };
  }

  // Option 3: Standard SMTP via Nodemailer
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || user;

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials not configured (missing SMTP_HOST, SMTP_USER, or SMTP_PASS)');
  }

  const isSecure = port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user,
      pass,
    },
    family: 4,               // Enforce IPv4 to avoid ENETUNREACH errors on hosts without IPv6 routing
    connectionTimeout: 5000, // 5s connection timeout (fails fast rather than hanging indefinitely)
    greetingTimeout: 5000,   // 5s greeting timeout
    socketTimeout: 5000,     // 5s socket inactivity timeout
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

  const hasHttpProvider = !!(process.env.RESEND_API_KEY || process.env.BREVO_API_KEY);
  const hasSmtpProvider = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  if (!hasHttpProvider && !hasSmtpProvider) {
    console.warn('⚠️ [SMTP Notice] Email service unconfigured. Verification link printed above.');
    return { success: false, reason: 'unconfigured', verificationUrl };
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
