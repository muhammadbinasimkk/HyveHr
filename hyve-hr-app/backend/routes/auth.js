const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const sendEmail = require('../services/emailService'); // Now using Mailtrap with nodemailer
const router = express.Router(); 

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Store refresh tokens (In a real-world app, you might store these in the database)
let refreshTokens = [];

// Register a new user
router.post('/register', async (req, res) => {
    const { firstName, lastName, companyName, email, password } = req.body;

    try {
        // Check if the user already exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

            // Check if the company already exists
            db.query('SELECT * FROM users WHERE company_name = ?', [companyName], async (err, companyResults) => {
                if (err) return res.status(500).json({ message: 'Database error' });

                // Assign role based on whether the company exists or not
                const role = companyResults.length > 0 ? 'User' : 'Owner';

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Generate email confirmation token
                const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

                // Insert the new user into the database
                db.query(
                    'INSERT INTO users (first_name, last_name, company_name, email, password, email_confirm_token, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                    [firstName, lastName, companyName, email, hashedPassword, emailToken, role],
                    async (err) => {
                        if (err) return res.status(500).json({ message: 'Failed to register user' });

                        // Send confirmation email
                        const confirmationUrl = `http://localhost:3000/confirm-email/${emailToken}`;
                        await sendEmail(
                            email,
                            'Confirm Your Registration',
                            `Click to confirm: ${confirmationUrl}`,
                            `<a href="${confirmationUrl}">Confirm</a>`
                        );

                        // Respond with success message
                        res.status(201).json({ message: 'User registered successfully. Check your email for confirmation.' });
                    }
                );
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Confirm email
router.get('/confirm-email/:token', (req, res) => {
    const { token } = req.params;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(400).json({ message: 'Invalid or expired token' });

        db.query('UPDATE users SET email_confirmed = 1 WHERE email = ?', [decoded.email], (err) => {
            if (err) return res.status(500).json({ message: 'Failed to confirm email' });
            res.status(200).json({ message: 'Email confirmed successfully' });
        });
    });
});

// Login user
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(400).json({ message: 'Invalid email or password' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
        if (!user.email_confirmed) return res.status(403).json({ message: 'Please confirm your email before logging in.' });

        const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });
        refreshTokens.push(refreshToken);

        res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } });
    });
});

// Token refresh
router.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'No token provided' });
    if (!refreshTokens.includes(token)) return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });
        const newAccessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
        res.json({ accessToken: newAccessToken });
    });
});

// Forgot password
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });

        const resetToken = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        sendEmail(email, 'Password Reset', `Reset your password: ${resetUrl}`, `<a href="${resetUrl}">Reset Password</a>`)
            .then(() => res.status(200).json({ message: 'Password reset email sent' }))
            .catch((err) => res.status(500).json({ message: 'Failed to send reset email' }));
    });
});

// Logout user
router.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.sendStatus(204);
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Update the user's password in the database
        db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id], (err) => {
            if (err) return res.status(500).json({ message: 'Failed to update password' });
            res.status(200).json({ message: 'Password reset successfully' });
        });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
});

module.exports = router;
