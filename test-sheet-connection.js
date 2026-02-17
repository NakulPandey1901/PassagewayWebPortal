const http = require('http');

const data = JSON.stringify({
    email: 'test-script@example.com',
    interest: 'Test Connection',
    specificInterest: 'Debugging',
    timestamp: new Date().toLocaleString(),
    source: 'Test Script',
    page: '/debug-test'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/chat',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('Connection Error:', error);
});

req.write(data);
req.end();
