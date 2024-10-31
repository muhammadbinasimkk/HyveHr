const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('../config/db'); // Using `mssql` now for SQL Server
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

// Register a new user and company
router.post('/register', async (req, res) => {
    const { firstName, lastName, companyName, email, password } = req.body;

    try {
        // Existing user and company checks
        const userResult = await sql.query`SELECT * FROM dbo.[User] WHERE Email = ${email}`;
        if (userResult.recordset.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let companyId;
        const companyResult = await sql.query`SELECT ID FROM dbo.Company WHERE Name = ${companyName}`;
        if (companyResult.recordset.length > 0) {
            companyId = companyResult.recordset[0].ID;
        } else {
            const newCompanyResult = await sql.query`
                INSERT INTO dbo.Company (Name, CreatedOn, State) 
                OUTPUT INSERTED.ID 
                VALUES (${companyName}, GETDATE(), 1)`;
            
            companyId = newCompanyResult.recordset[0].ID;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        await sql.query`
            INSERT INTO dbo.[User] (FirstName, LastName, FullName, Email, CompanyId, Password, ModifiedOn, EmailConfirmToken, State)
            VALUES (${firstName}, ${lastName}, ${firstName + ' ' + lastName}, ${email}, ${companyId}, ${hashedPassword}, GETDATE(), ${emailToken}, 0)
        `;

        const confirmationUrl = `http://localhost:3000/confirm-email/${emailToken}`;
        await sendEmail(
            email,
            'Confirm Your Registration',
            `Click to confirm: ${confirmationUrl}`,
            `<a href="${confirmationUrl}">Confirm</a>`
        );

        res.status(201).json({
            message: 'User and company registered successfully. Check your email for confirmation.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Confirm email (update 'State' instead of 'EmailConfirmed')
router.get('/confirm-email/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await sql.query`UPDATE dbo.[User] SET State = 1 WHERE Email = ${decoded.email}`;
        res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
});

// Login user (check 'State' instead of 'EmailConfirmed')
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await sql.query`SELECT * FROM dbo.[User] WHERE Email = ${email}`;
        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the user's email is confirmed (State == 1)
        if (user.State === 0) {
            return res.status(403).json({ message: 'Please confirm your email before logging in.' });
        }

        const accessToken = generateAccessToken({ id: user.ID, email: user.Email, role: user.Role });
        const refreshToken = generateRefreshToken({ id: user.ID, email: user.Email, role: user.Role });
        refreshTokens.push(refreshToken);

        res.json({ accessToken, refreshToken, user: { id: user.ID, email: user.Email, role: user.Role } });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
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
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const result = await sql.query`SELECT * FROM dbo.User WHERE Email = ${email}`;
        if (result.recordset.length === 0) return res.status(404).json({ message: 'User not found' });

        const resetToken = jwt.sign({ id: result.recordset[0].ID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

        await sendEmail(email, 'Password Reset', `Reset your password: ${resetUrl}`, `<a href="${resetUrl}">Reset Password</a>`);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send reset email' });
    }
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 10);

        await sql.query`UPDATE dbo.User SET Password = ${hashedPassword} WHERE ID = ${decoded.id}`;
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
});


module.exports = router;
