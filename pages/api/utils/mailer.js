// pages/api/utils/mailer.js

import nodemailer from 'nodemailer';

let transporter;

if (!transporter) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD, // Your Gmail App Password
    },
  });
}

export async function send2FACode(email, code) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your 2FA Code – TheBioLink',
    text: `Your verification code is: ${code}\n\nEnter it in the app to continue.\n\nThis code expires in 15 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2>🔐 2FA Code</h2>
        <p><strong>Your verification code is:</strong></p>
        <div style="font-size: 24px; background: #f0f0f0; padding: 10px; border-radius: 8px; letter-spacing: 5px; text-align: center;">
          ${code}
        </div>
        <p><small>This code expires in 15 minutes.</small></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 2FA code sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Could not send 2FA email. Please try again later.');
  }
}

// Export default in case you import the module directly
export default { send2FACode };
