import express from 'express';
import crypto from 'crypto';
import Groq from 'groq-sdk';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper to build the Groq prompt
function buildPrompt(code, language) {
    return `You are a senior software engineer performing code analysis. Analyze the following ${language} code and respond with ONLY a valid JSON object — no markdown, no backticks, no explanation outside the JSON.

The JSON must have exactly these three keys:

{
  "explanation": "A clear plain-English explanation of what this code does. Use \\n\\n to separate paragraphs. No markdown.",
  "complexity": {
    "time": "O(...)",
    "space": "O(...)",
    "notes": "Explanation of why these complexities are what they are. Use **bold** for key terms. Use \\n\\n between paragraphs."
  },
  "refactor": "The full refactored version of the code as a plain string. Preserve the language. No markdown fences."
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\``;
}

// POST /api/analyze - Main code analysis endpoint
router.post('/', requireAuth, async (req, res) => {
    const { code, language } = req.body;

    if (!code?.trim())
        return res.status(400).json({ error: 'code is required.' });
    if (!language?.trim())
        return res.status(400).json({ error: 'language is required.' });

    // Deterministic hash — cache key + dedup key for snippets table
    const codeHash = crypto
        .createHash('sha256')
        .update(code.trim() + '::' + language.toLowerCase())
        .digest('hex');

    // Enforce 10-snippet limit per user
    const countResult = await query(
        'SELECT COUNT(*) FROM snippets WHERE user_id = $1',
        [req.userId]
    );
    const snippetCount = parseInt(countResult.rows[0].count, 10);

    // Check if this is a new snippet (not a re-analysis of existing hash)
    const existing = await query(
        'SELECT id FROM snippets WHERE code_hash = $1',
        [codeHash]
    );
    const isNew = existing.rows.length === 0;

    if (isNew && snippetCount >= 10) {
        return res.status(429).json({
            error: 'You have reached the 10-snippet limit. Delete a snippet to analyze new code.',
        });
    }

    // Call Groq API for analysis
    let analysis;
    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: buildPrompt(code, language) }],
            temperature: 0.2,
            max_tokens: 2048,
        });

        const raw = completion.choices[0].message.content.trim();

        // Strip markdown fences if the model ignores instructions
        const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        analysis = JSON.parse(cleaned);
    } catch (err) {
        console.error('Groq/parse error:', err);
        return res.status(502).json({ error: 'LLM analysis failed. Try again.' });
    }

    // Save the snippet and analysis to the database
    try {
        const firstLine = code.trim().split('\n')[0].slice(0, 255);

        // Upsert snippet (same hash = same row)
        const snippetResult = await query(
            `INSERT INTO snippets (user_id, language, code, code_hash, first_line)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (code_hash) DO UPDATE SET updated_at = now()
             RETURNING id, first_line, language, created_at`,
            [req.userId, language.toLowerCase(), code, codeHash, firstLine]
        );
        const snippet = snippetResult.rows[0];

        // Upsert analysis
        await query(
            `INSERT INTO analyses (snippet_id, explanation, time_complexity, space_complexity, complexity_notes, refactor)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (snippet_id) DO UPDATE
               SET explanation = EXCLUDED.explanation,
                   time_complexity = EXCLUDED.time_complexity,
                   space_complexity = EXCLUDED.space_complexity,
                   complexity_notes = EXCLUDED.complexity_notes,
                   refactor = EXCLUDED.refactor,
                   updated_at = now()`,
            [
                snippet.id,
                analysis.explanation,
                analysis.complexity.time,
                analysis.complexity.space,
                analysis.complexity.notes,
                analysis.refactor,
            ]
        );

        return res.json({
            snippetId: snippet.id,
            firstLine: snippet.first_line,
            language: snippet.language,
            createdAt: snippet.created_at,
            analysis,
            cached: false,
        });
    } catch (err) {
        console.error('DB persist error:', err);
        // Analysis succeeded — return it even if DB write fails
        return res.json({ analysis, cached: false, dbError: true });
    }
});

export default router;