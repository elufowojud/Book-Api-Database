const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Request received!');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'IT WORKS!' }));
});

server.listen(5000, '0.0.0.0', () => {
  console.log('✅ Test server running on http://localhost:5000');
});