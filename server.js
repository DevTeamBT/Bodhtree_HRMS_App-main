const http = require('http');
const fs = require('fs');
const path = require('path');

// Specify the range of ports to try
const startPort = 3000;
const endPort = 4000;

// Function to find an available port
function findAvailablePort(start, end, callback) {
  const port = start;
  const server = http.createServer();

  server.listen(port, () => {
    server.close(() => {
      callback(port);
    });
  });

  server.on('error', (err) => {
    if (port < end) {
      findAvailablePort(port + 1, end, callback);
    } else {
      throw new Error('No available ports');
    }
  });
}

// Use findAvailablePort to get a port and start server
findAvailablePort(startPort, endPort, (port) => {
  const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './HTML/login.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.svg': 'application/image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          fs.readFile('./404.html', (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        } else {
          res.writeHead(500);
          res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`);
          res.end();
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  server.listen(port, () => {
    console.log(`Server running at http://172.16.2.6:${port}/`);
  });
});
