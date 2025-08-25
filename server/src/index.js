import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Simple API route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'server', timestamp: new Date().toISOString() });
});

// Not found handler for API
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
