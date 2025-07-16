const { normalizePhoneNumber, validatePhoneNumber } = require('./utils/phoneUtils');

console.log('🧪 Testing phone number normalization with various formats...\n');

const testNumbers = [
  '+62 813-4321-6935',
  '+62 851-5917-7290',
  '+62 852-8240-8267',
  '+62 823-1622-8320',
  '+62 822-9719-2696',
  '+62 896-5750-5195',
  '+62 814-6223-8653',
  '+62 821-1774-8749',
  '+62-813-4321-6935',
  '+62.813.4321.6935',
  '62 813 4321 6935',
  '08134216935',
  '8134216935',
  '+628134216935'
];

console.log('Testing normalization:');
console.log('='.repeat(60));

testNumbers.forEach((number, index) => {
  const normalized = normalizePhoneNumber(number);
  const validation = validatePhoneNumber(number);
  
  console.log(`${index + 1}. "${number}"`);
  console.log(`   → Normalized: "${normalized}"`);
  console.log(`   → Valid: ${validation.isValid ? '✅' : '❌'} ${validation.message}`);
  console.log('');
});

console.log('🎉 Test completed!');

// Test bulk format
console.log('\n📱 Testing bulk import format:');
const bulkText = testNumbers.slice(0, 5).join('\n');
console.log('Input text:');
console.log(bulkText);

const lines = bulkText.split(/[\n\r,;]+/).map(line => line.trim()).filter(line => line.length > 0);
console.log('\nParsed lines:', lines.length);

const results = lines.map(line => {
  const validation = validatePhoneNumber(line);
  return {
    original: line,
    normalized: validation.normalized,
    valid: validation.isValid
  };
});

console.log('\nResults:');
results.forEach((result, i) => {
  console.log(`${i + 1}. ${result.original} → ${result.normalized} (${result.valid ? 'Valid' : 'Invalid'})`);
});