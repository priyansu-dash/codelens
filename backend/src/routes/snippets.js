import express from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/snippets — history list
router.get('/', requireAuth, async (req, res) => {
    try {
        const result = await query(
            `SELECT id, language, first_line, label, created_at
             FROM snippets
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT 10`,
            [req.userId]
        );
        return res.json({ snippets: result.rows });
    } catch (err) {
        console.error('Fetch snippets error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/snippets/:id — load a single snippet + its analysis
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const result = await query(
            `SELECT s.id, s.language, s.code, s.first_line, s.label, s.created_at,
                    a.explanation, a.time_complexity, a.space_complexity,
                    a.complexity_notes, a.refactor
             FROM snippets s
             LEFT JOIN analyses a ON a.snippet_id = s.id
             WHERE s.id = $1 AND s.user_id = $2`,
            [req.params.id, req.userId]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ error: 'Snippet not found.' });

        const row = result.rows[0];
        return res.json({
            id: row.id,
            language: row.language,
            code: row.code,
            first_line: row.first_line,
            label: row.label,
            created_at: row.created_at,
            analysis: row.explanation ? {
                explanation: row.explanation,
                complexity: {
                    time: row.time_complexity,
                    space: row.space_complexity,
                    notes: row.complexity_notes,
                },
                refactor: row.refactor,
            } : null,
        });
    } catch (err) {
        console.error('Fetch snippet error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/snippets/:id/delete — delete a snippet and its analysis
router.post('/:id/delete', requireAuth, async (req, res) => {
    try {
        const result = await query(
            `DELETE FROM snippets
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [req.params.id, req.userId]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ error: 'Snippet not found.' });

        return res.json({ deleted: true, id: result.rows[0].id });
    } catch (err) {
        console.error('Delete snippet error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/snippets/:id/rename — rename a snippet
router.post('/:id/rename', requireAuth, async (req, res) => {
    const { label } = req.body;

    if (typeof label !== 'string')
        return res.status(400).json({ error: 'label is required.' });

    // Trim and cap at 100 characters; empty string clears the label
    const trimmed = label.trim().slice(0, 100) || null;

    try {
        const result = await query(
            `UPDATE snippets
             SET label = $1, updated_at = now()
             WHERE id = $2 AND user_id = $3
             RETURNING id, label`,
            [trimmed, req.params.id, req.userId]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ error: 'Snippet not found.' });

        return res.json(result.rows[0]);
    } catch (err) {
        console.error('Rename snippet error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;