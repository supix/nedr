import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import synonymsRouter from './routes/synonyms';
import downloadRouter from './routes/download';
import healthRouter from './routes/health';
import { connectToMongo } from './db/mongo';
import { seedTermsIfEmpty } from './seed/seedTerms';

const app = express();

// Basic middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Soft rate limit (very basic) using a simple in-memory token bucket per IP
// NOTE: This is intentionally simple for the POC. For production, use a robust limiter.
const rateWindowMs = 10_000; // 10s window
const maxReqPerWindow = 100;
const ipHits = new Map<string, { count: number; resetAt: number }>();
app.use((req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
  const now = Date.now();
  const rec = ipHits.get(ip) || { count: 0, resetAt: now + rateWindowMs };
  if (now > rec.resetAt) {
    rec.count = 0;
    rec.resetAt = now + rateWindowMs;
  }
  rec.count += 1;
  ipHits.set(ip, rec);
  if (rec.count > maxReqPerWindow) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }
  next();
});

// API routes
app.use('/api/health', healthRouter);
app.use('/api/synonyms', synonymsRouter);
app.use('/api/download', downloadRouter);

// Optionally serve static Angular build if present (kept for convenience)
const distPath = process.env.FRONTEND_DIST_PATH || '/app/dist';
app.use(express.static(distPath));

// 404 for /api
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';

async function start() {
  try {
    await connectToMongo(process.env.MONGO_URI || 'mongodb://mongo:mongo@127.0.10.1:27017,127.0.10.2:27017,127.0.10.3:27017/meanpoc?authSource=admin');
    if ((process.env.SEED_ON_START || 'true').toLowerCase() === 'true') {
      await seedTermsIfEmpty();
    }
  } catch (e) {
    console.error('MongoDB initialization failed:', e);
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
  });
}

start();

export default app;
