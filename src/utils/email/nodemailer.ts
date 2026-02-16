import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAILERSEND_SMTP_HOST || 'smtp.mailersend.com',
  port: parseInt(process.env.MAILERSEND_SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports (587 uses STARTTLS)
  auth: {
    user: process.env.MAILERSEND_SMTP_USER, // Format: MS_xxxxx (from MailerSend dashboard)
    pass: process.env.MAILERSEND_SMTP_PASSWORD, // Your MailerSend SMTP password
  },
});

export async function sendOTPEmail(email: string, otpCode: string) {
  try {
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Pep Gallery'}" <${process.env.MAILERSEND_FROM_EMAIL || process.env.MAILERSEND_SMTP_USER}>`,
      to: email,
      subject: 'Your Login Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h2 style="color: #2c3e50; margin-top: 0;">Login Verification Code</h2>
              <p style="font-size: 16px;">Your verification code is:</p>
              <div style="background-color: #ffffff; padding: 25px; text-align: center; font-size: 36px; letter-spacing: 10px; font-weight: bold; margin: 25px 0; border-radius: 6px; border: 2px solid #e0e0e0;">
                ${otpCode}
              </div>
              <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
              <p style="font-size: 14px; color: #666; margin-top: 20px;">If you didn't request this code, please ignore this email.</p>
            </div>
          </body>
        </html>
      `,
      text: `Your verification code is: ${otpCode}. This code will expire in 10 minutes. If you didn't request this code, please ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export default transporter;

