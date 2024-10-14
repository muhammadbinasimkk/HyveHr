const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db'); // Ensure your MySQL connection is set up
const nodemailer = require('nodemailer');

// Configure Nodemailer (use your SMTP configuration)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Example for Gmail
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS,  // Your email password
  },
});

// Register a new user
exports.register = async (req, res) => {
  const { first_name, last_name, company_name, email, password, role } = req.body;

  // Check if all required fields are filled
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  try {
    // Check if the email already exists
    const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email confirmation token
    const emailConfirmToken = crypto.randomBytes(32).toString('hex');

    // Insert the new user into the database
    const [result] = await db.execute(
      `INSERT INTO users (first_name, last_name, company_name, email, password, role, email_confirm_token, email_confirmed, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [first_name, last_name, company_name || '', email, hashedPassword, role || 'User', emailConfirmToken, false]
    );

    if (result.affectedRows === 1) {
      // Send confirmation email
      const confirmationUrl = `http://yourdomain.com/confirm-email?token=${emailConfirmToken}&email=${email}`;
      await transporter.sendMail({
        to: email,
        subject: 'Email Confirmation',
        html: `<h1>Welcome!</h1>
               <p>Please confirm your email by clicking the link below:</p>
               <a href="${confirmationUrl}">Confirm Email</a>`,
      });

      res.status(201).json({
        message: 'User registered successfully. Please confirm your email.',
        success: true,
      });
    } else {
      res.status(500).json({ message: 'Failed to register user.' });
    }
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Email confirmation handler
exports.confirmEmail = async (req, res) => {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).json({ message: 'Invalid confirmation link.' });
  }

  try {
    // Verify the email confirmation token
    const [user] = await db.execute('SELECT * FROM users WHERE email = ? AND email_confirm_token = ?', [email, token]);
    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid confirmation link.' });
    }

    // Update email confirmation status
    await db.execute('UPDATE users SET email_confirmed = TRUE, email_confirm_token = NULL WHERE email = ?', [email]);
    res.status(200).json({ message: 'Email confirmed successfully!' });
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Login handler
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    // Check if user exists
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const foundUser = user[0];

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if the email is confirmed
    if (!foundUser.email_confirmed) {
      return res.status(403).json({ message: 'Email not confirmed. Please check your email.' });
    }

    // Generate a token (consider using JWT for this)
    const token = crypto.randomBytes(32).toString('hex'); // Example for token generation; consider using JWT

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: foundUser.id,
        first_name: foundUser.first_name,
        last_name: foundUser.last_name,
        role: foundUser.role,
        token: token, // Send the token to the client
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
