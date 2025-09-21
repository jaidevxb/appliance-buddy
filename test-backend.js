const http = require('http');

console.log('Testing backend connectivity...');

// Test if backend is running on port 3001
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET'
};

console.log('Making request to backend...');

const req = http.request(options, res => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response headers:', res.headers);
    console.log('Response body:', data);
    
    try {
      const jsonData = JSON.parse(data);
      console.log('Parsed JSON response:', jsonData);
    } catch (err) {
      console.error('Failed to parse JSON:', err.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', error => {
  console.error('Backend is not accessible:', error.message);
  console.error('Error details:', error);
});

req.setTimeout(5000, () => {
  console.error('Request timeout - backend not responding');
  req.destroy();
});

req.end();

// Also test the test endpoint
setTimeout(() => {
  console.log('\nTesting /test endpoint...');
  const testOptions = {
    hostname: 'localhost',
    port: 3001,
    path: '/test',
    method: 'GET'
  };
  
  const testReq = http.request(testOptions, res => {
    console.log(`Test endpoint Status Code: ${res.statusCode}`);
    
    let testData = '';
    res.on('data', chunk => {
      testData += chunk;
    });
    
    res.on('end', () => {
      console.log('Test endpoint response:', testData);
    });
  });
  
  testReq.on('error', error => {
    console.error('Test endpoint not accessible:', error.message);
  });
  
  testReq.end();
}, 2000);