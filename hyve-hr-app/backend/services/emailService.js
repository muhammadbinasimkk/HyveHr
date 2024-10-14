const nodemailer = require('nodemailer');

// Create a transport using Gmail's SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS, // Your Gmail password or app password if 2FA is enabled
  },
  logger: true, // Enable logging
  debug: true, // Show more detailed debug info
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"HyveHR" <${process.env.GMAIL_USER}>`, // Sender address
      to, // List of receivers
      subject, // Subject line
      text, // Plain text body
      html, // HTML body
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
