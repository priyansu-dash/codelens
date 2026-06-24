import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { query } from './db.js';
import authRoutes from './routes/auth.js';
import analyzeRoutes from './routes/analyze.js';
import snippetRoutes from './routes/snippets.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL 
        ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'] 
        : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))
app.use(express.json());

// Health check to verify server and DB connection
app.get('/api/health', async (req, res) => {
    try {
        await query('SELECT 1');
        return res.json({ status: 'ok', db: 'connected' });
    } catch (err) {
        console.error('Health check DB error:', err);
        return res.status(503).json({ status: 'error', db: 'unreachable' });
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/snippets', snippetRoutes);

// Catch-all for 404s
app.use((req, res) => res.status(404).json({ error: 'Not found.' }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CodeLens backend running on port ${PORT}`));