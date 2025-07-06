const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const testAPI = async () => {
  try {
    console.log('🧪 Starting API tests...\n');

    // Test 1: Health Check
    console.log('1. Testing health check...');
    const health = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', health.data.message);

    // Test 2: Get Categories
    console.log('\n2. Testing get categories...');
    const categories = await axios.get(`${BASE_URL}/api/categories`);
    console.log('✅ Categories retrieved:', categories.data.data.length, 'categories found');
    
    if (categories.data.data.length === 0) {
      console.log('❌ No categories found. Please run: npm run seed');
      return;
    }

    const firstCategoryId = categories.data.data[0].id;
    console.log('📋 Using category ID:', firstCategoryId);

    // Test 3: Check Phone Number (should not exist)
    console.log('\n3. Testing check phone number...');
    const checkResponse = await axios.post(`${BASE_URL}/api/phone-numbers/check`, {
      number: '+6281234567890'
    });
    console.log('✅ Check response:', checkResponse.data.message);

    // Test 4: Add Single Phone Number
    console.log('\n4. Testing add single phone number...');
    try {
      const addResponse = await axios.post(`${BASE_URL}/api/phone-numbers`, {
        original_number: '+6281234567890',
        category_id: firstCategoryId
      });
      console.log('✅ Phone number added:', addResponse.data.data.original_number);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('ℹ️  Phone number already exists (expected if running multiple times)');
      } else {
        throw error;
      }
    }

    // Test 5: Check Phone Number (should exist now)
    console.log('\n5. Testing check phone number again...');
    const checkResponse2 = await axios.post(`${BASE_URL}/api/phone-numbers/check`, {
      number: '+6281234567890'
    });
    console.log('✅ Check response:', checkResponse2.data.message);

    // Test 6: Bulk Import
    console.log('\n6. Testing bulk import...');
    const bulkData = {
      numbers: [
        {
          original_number: '+6281234567891',
          category_id: firstCategoryId
        },
        {
          original_number: '08123456789',
          category_id: firstCategoryId
        },
        {
          original_number: '8123456790',
          category_id: firstCategoryId
        }
      ]
    };

    const bulkResponse = await axios.post(`${BASE_URL}/api/phone-numbers/bulk`, bulkData);
    console.log('✅ Bulk import completed:', bulkResponse.data.message);
    console.log('📊 Results:', bulkResponse.data.data.length, 'success,', bulkResponse.data.errors.length, 'errors');

    // Test 7: Get All Phone Numbers
    console.log('\n7. Testing get all phone numbers...');
    const allNumbers = await axios.get(`${BASE_URL}/api/phone-numbers`);
    console.log('✅ Phone numbers retrieved:', allNumbers.data.data.length, 'numbers found');

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📱 You can now test the frontend by running:');
    console.log('   cd frontend');
    console.log('   npm install');
    console.log('   npm run dev');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Server is running (npm start)');
    console.error('   2. Database is connected');
    console.error('   3. Categories are seeded (npm run seed)');
  }
};

// Run tests
testAPI();