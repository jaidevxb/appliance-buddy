const http = require('http');

console.log('Testing backend connectivity...');

// Function to test endpoint
function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    console.log(`\nTesting ${description}...`);

    const req = http.request(options, res => {
      console.log(`${description} Status Code: ${res.statusCode}`);
      
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`${description} response headers:`, res.headers);
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log(`${description} parsed JSON response:`, JSON.stringify(jsonData, null, 2));
          } catch (err) {
            console.error(`${description} failed to parse JSON:`, err.message);
            console.log(`${description} raw response:`, data.substring(0, 200) + '...');
          }
        } else {
          console.log(`${description} response:`, data.substring(0, 200) + '...');
        }
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', error => {
      console.error(`${description} not accessible:`, error.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.error(`${description} timeout - not responding`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test both endpoints with retries
async function testBackend() {
  console.log('Making request to backend...');
  
  // Try multiple times with delays
  for (let i = 0; i < 5; i++) {
    console.log(`\nAttempt ${i + 1}/5...`);
    
    // Test health endpoint
    const healthSuccess = await testEndpoint('/health', 'Health endpoint');
    
    if (healthSuccess) {
      console.log('\n✅ Backend is running successfully!');
      return;
    }
    
    // Wait before retrying
    if (i < 4) {
      console.log('Waiting 3 seconds before retry...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n⚠️  Backend is not accessible after 5 attempts, but continuing with startup...');
  // Don't exit with error code - just continue with nginx startup
  // process.exit(1); // This line should be commented out or removed
}

// Run the tests
testBackend();