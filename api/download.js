// API endpoint for APK file downloads
// This function handles secure APK file delivery with proper headers and error handling

const fs = require('fs');
const path = require('path');

// APK file configuration
const APK_CONFIG = {
  filename: 'UnitConverter-v2.1.0.apk',
  filepath: path.join(process.cwd(), 'public', 'UnitConverter-v2.1.0.apk'),
  mimeType: 'application/vnd.android.package-archive',
  fileSize: 15200000 // 15.2 MB in bytes
};

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Range',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
};

// Security headers
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

function setHeaders(res, headers) {
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

function handleOptions(req, res) {
  setHeaders(res, { ...CORS_HEADERS, ...SECURITY_HEADERS });
  res.writeHead(200);
  res.end();
}

function handleDownload(req, res) {
  try {
    // Check if APK file exists
    if (!fs.existsSync(APK_CONFIG.filepath)) {
      console.error('APK file not found:', APK_CONFIG.filepath);
      return sendError(res, 404, 'APK file not found');
    }

    // Get file stats
    const stats = fs.statSync(APK_CONFIG.filepath);
    const fileSize = stats.size;

    // Set headers for file download
    const headers = {
      ...CORS_HEADERS,
      ...SECURITY_HEADERS,
      'Content-Type': APK_CONFIG.mimeType,
      'Content-Length': fileSize,
      'Content-Disposition': `attachment; filename="${APK_CONFIG.filename}"; filename*=UTF-8''${encodeURIComponent(APK_CONFIG.filename)}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Handle range requests for download resume
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(APK_CONFIG.filepath, { start, end });

      headers['Content-Range'] = `bytes ${start}-${end}/${fileSize}`;
      headers['Content-Length'] = chunksize;
      headers['Accept-Ranges'] = 'bytes';

      res.writeHead(206, headers);
      file.pipe(res);
    } else {
      // Full file download
      const file = fs.createReadStream(APK_CONFIG.filepath);
      res.writeHead(200, headers);
      file.pipe(res);
    }

    // Log download attempt
    console.log(`APK download initiated - File: ${APK_CONFIG.filename}, Size: ${fileSize} bytes`);

    // Handle stream errors
    file.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        sendError(res, 500, 'File transfer error');
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    sendError(res, 500, 'Download failed');
  }
}

function sendError(res, statusCode, message) {
  const errorResponse = {
    error: true,
    status: statusCode,
    message: message,
    timestamp: new Date().toISOString()
  };

  setHeaders(res, {
    ...CORS_HEADERS,
    'Content-Type': 'application/json'
  });

  res.writeHead(statusCode);
  res.end(JSON.stringify(errorResponse));
}

// Main export function for Vercel serverless function
module.exports = async (req, res) => {
  // Set CORS headers for preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return sendError(res, 405, 'Method not allowed');
  }

  // Handle the download
  handleDownload(req, res);
};

// For local development
if (require.main === module) {
  const http = require('http');
  const server = http.createServer((req, res) => {
    if (req.url === '/api/download' || req.url === '/download') {
      module.exports(req, res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Download API server running on port ${port}`);
  });
}