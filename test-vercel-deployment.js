const axios = require('axios');

// Configuration
const BASE_URL = process.argv[2] || 'http://localhost:3000';
const API_URL = BASE_URL.includes('vercel.app') ? BASE_URL : `${BASE_URL}`;

console.log('🧪 Testing Vercel Deployment');
console.log('============================');
console.log(`📡 API URL: ${API_URL}`);
console.log('');

async function testAPI() {
  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      url: '/api/health',
      expected: 200
    },
    {
      name: 'Get Categories',
      method: 'GET',
      url: '/api/categories',
      expected: 200
    },
    {
      name: 'Create Category',
      method: 'POST',
      url: '/api/categories',
      data: { name: 'Test Category', description: 'Test Description' },
      expected: 201
    },
    {
      name: 'Get Phone Numbers',
      method: 'GET',
      url: '/api/phone-numbers',
      expected: 200
    },
    {
      name: 'Check Phone Number',
      method: 'POST',
      url: '/api/phone-numbers-check',
      data: { phone_number: '+6281234567890' },
      expected: 200
    },
    {
      name: 'Add Phone Number',
      method: 'POST',
      url: '/api/phone-numbers',
      data: { original_number: '+6281234567890', category_id: 1 },
      expected: [201, 409] // 201 for new, 409 if exists
    },
    {
      name: 'Bulk Import',
      method: 'POST',
      url: '/api/phone-numbers-bulk',
      data: {
        numbers: [
          { original_number: '+6281234567891', category_id: 1 },
          { original_number: '+6281234567892', category_id: 1 }
        ]
      },
      expected: 200
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`⏳ Testing: ${test.name}`);
      
      const config = {
        method: test.method,
        url: `${API_URL}${test.url}`,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      };

      if (test.data) {
        config.data = test.data;
      }

      const response = await axios(config);
      
      const expectedStatuses = Array.isArray(test.expected) ? test.expected : [test.expected];
      const isSuccess = expectedStatuses.includes(response.status);

      if (isSuccess) {
        console.log(`✅ ${test.name}: ${response.status} - ${response.data.message || 'OK'}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: Expected ${test.expected}, got ${response.status}`);
        failed++;
      }

    } catch (error) {
      console.log(`❌ ${test.name}: ${error.response?.status || 'ERROR'} - ${error.response?.data?.message || error.message}`);
      failed++;
    }

    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('');
  console.log('📊 Test Results');
  console.log('===============');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('');
    console.log('🎉 All tests passed! Your deployment is working correctly.');
  } else {
    console.log('');
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
}

// Run tests
testAPI().catch(console.error);
