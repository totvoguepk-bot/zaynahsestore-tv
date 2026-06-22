const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/revalidate?tag=settings&secret=supersecret',
  method: 'GET'
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});
req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});
req.end();
