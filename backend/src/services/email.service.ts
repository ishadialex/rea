import nodemailer from "nodemailer";
import { env } from "../config/env.js";

/**
 * Create and configure Nodemailer transporter
 * @returns Configured nodemailer transporter
 */
function createTransporter() {
  return nodemailer.createTransporter({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

/**
 * Send OTP verification email
 * @param email - Recipient email address
 * @param code - 6-digit OTP code
 * @param firstName - User's first name for personalization
 * @returns Promise that resolves when email is sent
 */
export async function sendOtpEmail(email: string, code: string, firstName: string) {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 20px;
        }
        .otp-box {
          background: #f8f9fa;
          border: 2px dashed #667eea;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #667eea;
          font-family: 'Courier New', monospace;
        }
        .otp-label {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .warning-text {
          margin: 0;
          font-size: 14px;
          color: #856404;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          font-size: 14px;
          color: #666;
          border-top: 1px solid #dee2e6;
        }
        .footer p {
          margin: 5px 0;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello ${firstName},</p>
          <p>Thank you for registering with Alvarado! To complete your registration, please verify your email address using the code below:</p>

          <div class="otp-box">
            <div class="otp-code">${code}</div>
            <div class="otp-label">Your Verification Code</div>
          </div>

          <p>Enter this code in the verification page to activate your account.</p>

          <div class="warning">
            <p class="warning-text">
              ⏱️ <strong>This code will expire in 10 minutes.</strong> If you don't use it within this time, you'll need to request a new code.
            </p>
          </div>

          <p>If you didn't create an account with Alvarado, please ignore this email or contact our support team if you have concerns.</p>
        </div>
        <div class="footer">
          <p><strong>Alvarado</strong></p>
          <p>This is an automated message, please do not reply.</p>
          <p>Need help? Contact us at <a href="mailto:support@alvarado.com">support@alvarado.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Hello ${firstName},

Thank you for registering with Alvarado!

Your email verification code is: ${code}

This code will expire in 10 minutes.

Enter this code in the verification page to activate your account.

If you didn't create an account with Alvarado, please ignore this email.

---
Alvarado
This is an automated message, please do not reply.
Need help? Contact us at support@alvarado.com
  `;

  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: "Verify Your Email Address - Alvarado",
      text: textContent,
      html: htmlContent,
    });

    console.log(`✅ OTP email sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${email}:`, error);
    throw new Error("Failed to send verification email");
  }
}

/**
 * Send welcome email after successful verification (optional)
 * @param email - Recipient email address
 * @param firstName - User's first name
 */
export async function sendWelcomeEmail(email: string, firstName: string) {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          padding: 40px;
        }
        h1 {
          color: #667eea;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Alvarado! 🎉</h1>
        <p>Hi ${firstName},</p>
        <p>Your email has been successfully verified! You can now enjoy full access to your account.</p>
        <p>Get started by exploring our investment opportunities and managing your portfolio.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Alvarado Team</p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: "Welcome to Alvarado!",
      html: htmlContent,
    });
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${email}:`, error);
    // Don't throw error for welcome email - it's not critical
  }
}
