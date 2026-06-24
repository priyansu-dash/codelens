import jwt from 'jsonwebtoken';

/**
 * Middleware that verifies the JWT in the Authorization header.
 * On success, attaches `req.userId` for downstream route handlers.
 * Usage: router.get('/protected', requireAuth, handler)
 */
export const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer '))
        return res.status(401).json({ error: 'Missing or malformed Authorization header.' });

    const token = header.slice(7); // strip "Bearer "

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(401).json({ error: 'Session expired. Please log in again.' });
        return res.status(401).json({ error: 'Invalid token.' });
    }
};