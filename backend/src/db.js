import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (err) => {
  console.error('Unexpected Postgres client error:', err);
});

// Ping Neon every 4 minutes to prevent cold-start disconnects
// (Neon free tier suspends after ~5 min of inactivity)
setInterval(async () => {
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    console.warn('Keepalive ping failed:', err.message);
  }
}, 4 * 60 * 1000);

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();
export default pool;