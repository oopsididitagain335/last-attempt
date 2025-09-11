// /utils/mailer.js
import nodemailer from 'nodemailer';

// Configure transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: Test connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

export async function send2FACode(email, code) {
  const mailOptions = {
    from: `"TheBioLink" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your 2FA Code for TheBioLink',
    text: `Your 2FA code is: ${code}\n\nIt expires in 15 minutes.`,
    html: `
      <h2>Your 2FA Code</h2>
      <p>Hello,</p>
      <p>Your one-time code to log in to TheBioLink is:</p>
      <h1 style="font-size: 2rem; font-weight: bold; letter-spacing: 8px;">${code}</h1>
      <p>This code expires in 15 minutes.</p>
      <p>Do not share this code with anyone.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ 2FA code sent to ${email}`);
  } catch (error) {
    console.error('❌ Failed to send 2FA email:', error);
    throw new Error('Failed to send verification email');
  }
}
