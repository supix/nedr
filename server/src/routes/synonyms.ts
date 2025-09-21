import { Router } from 'express';
import { Term } from '../models/Term';

const router = Router();

// GET /api/synonyms?query=<text>
// Case-insensitive search on term or synonyms; partial prefix match supported.
router.get('/', async (req, res, next) => {
  const started = Date.now();
  try {
    const q = (req.query.query as string | undefined)?.trim().toLowerCase() || '';
    if (!q || q.length < 1) {
      return res.status(400).json({ error: 'query parameter is required' });
    }

    const prefix = new RegExp('^' + escapeRegex(q) + '$', 'i');

    const docs = await Term.find({
      $or: [{ term: prefix }, { synonyms: { $elemMatch: { $regex: prefix } } }],
    }).lean();

    const foundTerms = docs.map((d) => d.term);
    const uniqueSynonyms = Array.from(
      new Set(docs.flatMap((d) => d.synonyms).filter((s) => s && s.length > 0))
    ).sort();

    const durationMs = Date.now() - started;
    res.json({
      query: q,
      count: docs.length,
      terms: foundTerms,
      synonyms: uniqueSynonyms,
      tookMs: durationMs,
    });
  } catch (err) {
    next(err);
  }
});

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default router;
