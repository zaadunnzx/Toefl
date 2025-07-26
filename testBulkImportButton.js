const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testBulkImportButton() {
  console.log('🧪 Testing Bulk Import Button Debug\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.message);
    
    // Test 2: Check categories
    console.log('\n2. Testing categories endpoint...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/categories`);
    console.log('✅ Categories loaded:', categoriesResponse.data.data.length);
    
    if (categoriesResponse.data.data.length === 0) {
      console.log('⚠️  No categories found. Run: npm run seed');
      return;
    }
    
    // Test 3: Test phone number validation
    console.log('\n3. Testing phone number validation...');
    const testNumber = '+62 813-4321-6935';
    const validateResponse = await axios.post(`${BASE_URL}/api/phone-numbers/check`, {
      number: testNumber
    });
    console.log('✅ Validation working:', validateResponse.data.isValid);
    
    // Test 4: Test minimal bulk import
    console.log('\n4. Testing minimal bulk import...');
    const categoryId = categoriesResponse.data.data[0].id;
    const testData = {
      numbers: [
        {
          original_number: '+62 813-4321-6935',
          category_id: categoryId
        }
      ]
    };
    
    const bulkResponse = await axios.post(`${BASE_URL}/api/phone-numbers/bulk`, testData);
    console.log('✅ Bulk import working:', bulkResponse.data.success);
    console.log('   Imported:', bulkResponse.data.data.length);
    console.log('   Errors:', bulkResponse.data.errors.length);
    
    console.log('\n🎉 All backend tests passed!');
    console.log('\n💡 If button still not working, check:');
    console.log('   1. Frontend is running (npm run dev)');
    console.log('   2. Check browser console for errors');
    console.log('   3. Verify categories are loaded in frontend');
    console.log('   4. Check phone number parsing in frontend');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Server not running. Start with: npm start');
    } else if (error.response?.status === 500) {
      console.error('\n💡 Database connection issue. Check PostgreSQL');
    }
  }
}

// Test frontend scenarios
async function testFrontendScenarios() {
  console.log('\n🎨 Frontend Debugging Scenarios\n');
  
  console.log('Check these in browser console:');
  console.log('1. Categories loaded?');
  console.log('   - categories.length > 0');
  console.log('   - selectedCategory not empty');
  console.log('');
  
  console.log('2. Phone numbers parsed?');
  console.log('   - parsedNumbers.length > 0');
  console.log('   - validNumbers.length > 0');
  console.log('   - validCount > 0');
  console.log('');
  
  console.log('3. Button conditions:');
  console.log('   - importing === false');
  console.log('   - selectedCategory !== ""');
  console.log('   - validCount > 0');
  console.log('');
  
  console.log('4. Test these phone numbers:');
  console.log('   +62 813-4321-6935');
  console.log('   +62 851-5917-7290');
  console.log('   08123456789');
  console.log('   8123456789');
}

// Run tests
testBulkImportButton().then(() => {
  testFrontendScenarios();
}).catch(console.error);