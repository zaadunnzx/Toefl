const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data dengan berbagai format nomor telepon
const testNumbers = [
  // Format dengan spasi dan dash
  '+62 813-4321-6935',
  '+62 851-5917-7290',
  '+62 852-8240-8267',
  '+62 823-1622-8320',
  '+62 822-9719-2696',
  '+62 896-5750-5195',
  '+62 814-6223-8653',
  '+62 821-1774-8749',
  
  // Format dengan spasi saja
  '+62 813 4321 6936',
  '+62 851 5917 7291',
  '+62 852 8240 8268',
  
  // Format tanpa formatting
  '+628134321937',
  '+628515917292',
  '+628528240869',
  
  // Format Indonesia lokal
  '08134321938',
  '08515917293',
  '08528240870',
  
  // Format tanpa leading zero
  '8134321939',
  '8515917294',
  '8528240871',
  
  // Format internasional lainnya
  '+1-555-123-4567',
  '+44 20 7946 0958',
  '+33 1 42 86 83 26',
  
  // Format dengan tanda kurung
  '+62 (813) 4321-6940',
  '+62 (851) 5917-7295',
  
  // Format dengan titik
  '+62.813.4321.6941',
  '+62.851.5917.7296'
];

const testBulkImport = async () => {
  try {
    console.log('🧪 Testing Bulk Import with Various Phone Number Formats\n');

    // Step 1: Get categories
    console.log('📋 Getting available categories...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/categories`);
    
    if (!categoriesResponse.data.success || categoriesResponse.data.data.length === 0) {
      console.log('❌ No categories found. Please run: npm run seed');
      return;
    }

    const categories = categoriesResponse.data.data;
    console.log(`✅ Found ${categories.length} categories`);
    categories.forEach(cat => {
      console.log(`   ${cat.id}. ${cat.name}`);
    });

    const firstCategoryId = categories[0].id;
    console.log(`\n🎯 Using category: ${categories[0].name} (ID: ${firstCategoryId})\n`);

    // Step 2: Test individual number validation
    console.log('🔍 Testing individual number validation...');
    let validNumbers = 0;
    let invalidNumbers = 0;

    for (let i = 0; i < testNumbers.length; i++) {
      const number = testNumbers[i];
      try {
        const checkResponse = await axios.post(`${BASE_URL}/api/phone-numbers/check`, {
          number: number
        });

        if (checkResponse.data.isValid) {
          validNumbers++;
          console.log(`✅ ${number.padEnd(20)} → ${checkResponse.data.normalized_number || 'Valid'}`);
        } else {
          invalidNumbers++;
          console.log(`❌ ${number.padEnd(20)} → ${checkResponse.data.message}`);
        }
      } catch (error) {
        invalidNumbers++;
        console.log(`❌ ${number.padEnd(20)} → Error: ${error.response?.data?.message || error.message}`);
      }
    }

    console.log(`\n📊 Validation Summary:`);
    console.log(`   ✅ Valid numbers: ${validNumbers}`);
    console.log(`   ❌ Invalid numbers: ${invalidNumbers}`);
    console.log(`   📱 Total numbers: ${testNumbers.length}\n`);

    // Step 3: Test bulk import
    console.log('📤 Testing bulk import...');
    const numbersToImport = testNumbers.map(number => ({
      original_number: number,
      category_id: firstCategoryId
    }));

    const bulkResponse = await axios.post(`${BASE_URL}/api/phone-numbers/bulk`, {
      numbers: numbersToImport
    });

    console.log(`\n📋 Bulk Import Results:`);
    console.log(`   ✅ Successfully imported: ${bulkResponse.data.data.length}`);
    console.log(`   ❌ Errors encountered: ${bulkResponse.data.errors.length}`);
    console.log(`   📝 Message: ${bulkResponse.data.message}\n`);

    // Show successful imports
    if (bulkResponse.data.data.length > 0) {
      console.log('✅ Successfully Imported Numbers:');
      bulkResponse.data.data.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.original_number} → ${record.normalized_number}`);
      });
      console.log('');
    }

    // Show errors
    if (bulkResponse.data.errors.length > 0) {
      console.log('❌ Import Errors:');
      bulkResponse.data.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.original_number} → ${error.error}`);
      });
      console.log('');
    }

    // Step 4: Test duplicate detection
    console.log('🔄 Testing duplicate detection...');
    
    // Try to import the first successful number again
    if (bulkResponse.data.data.length > 0) {
      const firstSuccess = bulkResponse.data.data[0];
      console.log(`   Testing duplicate for: ${firstSuccess.original_number}`);
      
      try {
        const duplicateResponse = await axios.post(`${BASE_URL}/api/phone-numbers`, {
          original_number: firstSuccess.original_number,
          category_id: firstCategoryId
        });
        
        console.log('   ❌ Duplicate detection failed - number was imported again!');
      } catch (error) {
        if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
          console.log('   ✅ Duplicate detection working correctly');
        } else {
          console.log(`   ❓ Unexpected error: ${error.response?.data?.message || error.message}`);
        }
      }
    }

    // Step 5: Get final count
    console.log('\n📊 Final Statistics:');
    const finalResponse = await axios.get(`${BASE_URL}/api/phone-numbers`);
    console.log(`   📱 Total phone numbers in database: ${finalResponse.data.data.length}`);

    // Show sample of numbers in database
    if (finalResponse.data.data.length > 0) {
      console.log('\n📝 Sample of numbers in database:');
      finalResponse.data.data.slice(0, 5).forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.original_number} → ${record.normalized_number} (${record.category.name})`);
      });
      if (finalResponse.data.data.length > 5) {
        console.log(`   ... and ${finalResponse.data.data.length - 5} more`);
      }
    }

    console.log('\n🎉 Bulk import test completed successfully!');
    console.log('\n🔗 Test your application:');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Backend API: http://localhost:3000/api');
    console.log('   Health Check: http://localhost:3000/api/health');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Server is running (npm start)');
    console.error('   2. Database is connected');
    console.error('   3. Categories are seeded (npm run seed)');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   4. Backend server is not running on port 3000');
    }
  }
};

// Additional test for extreme cases
const testEdgeCases = async () => {
  console.log('\n🔬 Testing Edge Cases...\n');
  
  const edgeCases = [
    // Empty and invalid inputs
    '',
    '   ',
    'invalid-number',
    'abc123',
    
    // Too short numbers
    '+62123',
    '123',
    
    // Too long numbers
    '+6281234567890123456789',
    
    // Special characters
    '+62-813-4321-6935!!!',
    '+62 (813) 4321-6935 ext. 123',
    
    // Multiple plus signs
    '++62813456789',
    
    // Numbers with letters
    '+62813ABCD789',
    
    // Valid but unusual formats
    '62.813.4321.6935',
    '(+62) 813-4321-6935',
    '+62  813  4321  6935'
  ];

  console.log('Testing edge cases validation:');
  
  for (const testCase of edgeCases) {
    try {
      const response = await axios.post(`${BASE_URL}/api/phone-numbers/check`, {
        number: testCase
      });
      
      const status = response.data.isValid ? '✅ Valid' : '❌ Invalid';
      const normalized = response.data.normalized_number || 'N/A';
      console.log(`   "${testCase}" → ${status} (${normalized})`);
    } catch (error) {
      console.log(`   "${testCase}" → ❌ Error: ${error.response?.data?.message || error.message}`);
    }
  }
};

// Run tests
const runAllTests = async () => {
  console.log('🚀 Starting comprehensive bulk import tests...\n');
  
  await testBulkImport();
  await testEdgeCases();
  
  console.log('\n✨ All tests completed!');
};

// Execute tests
runAllTests().catch(console.error);