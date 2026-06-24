import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

const router = express.Router();

const BCRYPT_ROUNDS = 12;
const JWT_EXPIRES_IN = '7d';

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required.' });

        if (password.length < 8)
            return res.status(400).json({ error: 'Password must be at least 8 characters.' });

        // Check for existing user
        const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        if (existing.rows.length > 0)
            return res.status(409).json({ error: 'An account with that email already exists.' });

        const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        const result = await query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
            [email.toLowerCase(), hash]
        );

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return res.status(201).json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required.' });

        const result = await query(
            'SELECT id, email, password FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        // Deliberate: same error for "no user" and "wrong password" — avoids email enumeration
        if (result.rows.length === 0)
            return res.status(401).json({ error: 'Invalid email or password.' });

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ error: 'Invalid email or password.' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;