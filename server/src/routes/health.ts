import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  const uptime = process.uptime();
  res.json({ status: 'ok', uptime, ts: new Date().toISOString() });
});

export default router;
