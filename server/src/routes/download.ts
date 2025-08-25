import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// GET /api/download - send sample.pdf with proper headers
router.get('/', (req, res, next) => {
  try {
    const filePath = path.resolve(process.cwd(), 'public', 'files', 'sample.pdf');
    let etag = '';

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      res.setHeader('Content-Length', stat.size.toString());
      etag = `W/"${stat.size}-${stat.mtimeMs}"`;
    } else {
      // Fallback: minimal inline PDF if file is missing
      const inlinePdf = minimalPdfBuffer();
      etag = `W/"${inlinePdf.length}-inline"`;
      const ifNoneMatch = req.headers['if-none-match'];
      if (ifNoneMatch && ifNoneMatch === etag) {
        return res.status(304).end();
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="sample.pdf"');
      res.setHeader('ETag', etag);
      return res.send(inlinePdf);
    }

    const ifNoneMatch = req.headers['if-none-match'];
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="sample.pdf"');
    res.setHeader('ETag', etag);
    if (ifNoneMatch && ifNoneMatch === etag) {
      return res.status(304).end();
    }

    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

function minimalPdfBuffer(): Buffer {
  const content = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 67 >>\nstream\nBT\n/F1 18 Tf\n72 150 Td\n(Hello from backend sample.pdf) Tj\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n`;
  return Buffer.from(content, 'utf-8');
}

export default router;
