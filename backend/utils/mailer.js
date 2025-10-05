// backend/utils/mailer.js
const nodemailer = require('nodemailer');

const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '587',
  SMTP_SECURE = 'false', // 'true' cho 465, 'false' cho 587
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,            // ví dụ: "MentorHub <hungtuan2406@gmail.com>"
} = process.env;

if (!SMTP_USER || !SMTP_PASS) {
  console.warn('[mailer] Missing SMTP_USER or SMTP_PASS in environment variables');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: String(SMTP_SECURE) === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS, // App Password 16 ký tự
  },
});

/**
 * Gửi email
 * @param {Object} opts
 * @param {string|string[]} opts.to
 * @param {string} opts.subject
 * @param {string} [opts.html]
 * @param {string} [opts.text]
 * @param {string|string[]} [opts.cc]
 * @param {string|string[]} [opts.bcc]
 * @param {string} [opts.replyTo]
 */
async function sendMail({ to, subject, html, text, cc, bcc, replyTo }) {
  const from = MAIL_FROM || SMTP_USER;
  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    text: text || '',
    cc,
    bcc,
    replyTo,
  });
}

module.exports = { sendMail, transporter };
