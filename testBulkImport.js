const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const testBulkImport = async () => {
  try {
    console.log('🧪 Testing Bulk Import API...\n');

    // Test 1: Get Categories first
    console.log('1. Getting categories...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/categories`);
    
    if (categoriesResponse.data.data.length === 0) {
      console.log('❌ No categories found. Please run: npm run seed');
      return;
    }

    const categoryId = categoriesResponse.data.data[0].id;
    console.log(`✅ Using category ID: ${categoryId}`);

    // Test 2: Test Bulk Import
    console.log('\n2. Testing bulk import...');
    
    const bulkData = {
      numbers: [
        {
          original_number: '+6281234567899',
          category_id: categoryId
        },
        {
          original_number: '08123456798',
          category_id: categoryId
        },
        {
          original_number: '8123456797',
          category_id: categoryId
        },
        {
          original_number: '+6281234567896',
          category_id: categoryId
        },
        {
          original_number: 'invalid-number', // This should fail
          category_id: categoryId
        }
      ]
    };

    console.log('Sending bulk import request with data:', JSON.stringify(bulkData, null, 2));

    const response = await axios.post(`${BASE_URL}/api/phone-numbers/bulk`, bulkData);
    
    console.log('\n✅ Bulk import response received:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Message:', response.data.message);
    console.log('Imported count:', response.data.data ? response.data.data.length : 0);
    console.log('Errors count:', response.data.errors ? response.data.errors.length : 0);
    
    if (response.data.errors && response.data.errors.length > 0) {
      console.log('\nErrors encountered:');
      response.data.errors.forEach(error => {
        console.log(`  - Index ${error.index}: ${error.error} (${error.original_number})`);
      });
    }

    if (response.data.data && response.data.data.length > 0) {
      console.log('\nSuccessfully imported numbers:');
      response.data.data.forEach(number => {
        console.log(`  - ${number.original_number} → ${number.normalized_number} (Category: ${number.category.name})`);
      });
    }

    // Test 3: Verify the numbers were actually saved
    console.log('\n3. Verifying saved numbers...');
    const allNumbersResponse = await axios.get(`${BASE_URL}/api/phone-numbers`);
    console.log(`✅ Total numbers in database: ${allNumbersResponse.data.data.length}`);

    console.log('\n🎉 Bulk import test completed successfully!');

  } catch (error) {
    console.error('\n❌ Bulk import test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

// Run test
testBulkImport();