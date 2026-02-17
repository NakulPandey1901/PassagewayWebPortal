const http = require('http');

const data = JSON.stringify({
    name: 'Test User',
    email: 'test-contact@example.com',
    company: 'Test Corp',
    message: 'This is a test message for the contact form.',
    timestamp: new Date().toLocaleString()
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/contact',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    let responseData = '';
    res.on('data', (d) => {
        responseData += d;
    });

    res.on('end', () => {
        console.log('Response:', responseData);
    });
});

req.on('error', (error) => {
    console.error('Connection Error:', error);
});

req.write(data);
req.end();
