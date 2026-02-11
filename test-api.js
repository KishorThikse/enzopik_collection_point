// Simple test script to verify the Revenue API endpoint
const http = require('http');

function testAPI(period = 'monthly') {
  const options = {
    hostname: 'localhost',
    port: 7078,
    path: `/api/Revenue?period=${period}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  console.log(`🔍 Testing Revenue API endpoint: ${options.hostname}:${options.port}${options.path}`);

  const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log(`✅ API Response for period "${period}":`);
        console.log(`📊 Data points: ${jsonData.length}`);
        if (jsonData.length > 0) {
          console.log(`📅 Sample data:`, jsonData[0]);
          console.log(`💰 Total revenue: ${jsonData.reduce((sum, item) => sum + item.amount, 0)}`);
        }
      } catch (error) {
        console.log('❌ Failed to parse JSON response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error(`❌ Request failed for ${period}:`, error.message);
  });

  req.end();
}

// Test different periods
console.log('🚀 Starting Revenue API tests...\n');
testAPI('monthly');
setTimeout(() => testAPI('yearly'), 1000);
setTimeout(() => testAPI('today'), 2000);
