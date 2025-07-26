const { createClient } = require('@supabase/supabase-js');

// Phone number utilities (same as phone-numbers.js)
function normalizePhoneNumber(phoneNumber) {
  if (!phoneNumber) return null;
  
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('08')) {
    cleaned = '+62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8') && cleaned.length >= 9) {
    cleaned = '+62' + cleaned;
  } else if (cleaned.startsWith('62') && !cleaned.startsWith('+62')) {
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+') && cleaned.length >= 10) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

function validatePhoneNumber(phoneNumber) {
  const normalized = normalizePhoneNumber(phoneNumber);
  if (!normalized) return false;
  
  if (!normalized.startsWith('+')) return false;
  
  const digitsOnly = normalized.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { numbers } = req.body;
    
    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Numbers array is required and cannot be empty'
      });
    }

    if (numbers.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 1000 numbers allowed per bulk import'
      });
    }

    const results = [];
    const errors = [];

    // Process each number
    for (let i = 0; i < numbers.length; i++) {
      const { original_number, category_id } = numbers[i];
      
      try {
        // Validate required fields
        if (!original_number || !category_id) {
          errors.push({
            index: i,
            original_number: original_number || 'N/A',
            error: 'Original number and category_id are required'
          });
          continue;
        }

        // Validate phone number format
        if (!validatePhoneNumber(original_number)) {
          errors.push({
            index: i,
            original_number,
            error: 'Invalid phone number format'
          });
          continue;
        }

        const normalized_number = normalizePhoneNumber(original_number);

        // Check for duplicates in database
        const { data: existing } = await supabase
          .from('phone_numbers')
          .select('id')
          .eq('normalized_number', normalized_number)
          .single();

        if (existing) {
          errors.push({
            index: i,
            original_number,
            error: 'Phone number already exists'
          });
          continue;
        }

        // Check for duplicates in current batch
        const duplicateInBatch = results.find(r => r.normalized_number === normalized_number);
        if (duplicateInBatch) {
          errors.push({
            index: i,
            original_number,
            error: 'Duplicate number in current batch'
          });
          continue;
        }

        // Verify category exists
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('id', category_id)
          .single();

        if (!category) {
          errors.push({
            index: i,
            original_number,
            error: 'Invalid category_id'
          });
          continue;
        }

        // Insert the number
        const { data: newNumber, error: insertError } = await supabase
          .from('phone_numbers')
          .insert([{
            original_number: original_number.trim(),
            normalized_number,
            category_id: parseInt(category_id)
          }])
          .select(`
            *,
            categories (
              id,
              name,
              description
            )
          `)
          .single();

        if (insertError) throw insertError;
        
        results.push(newNumber);
        
      } catch (error) {
        console.error(`Error processing number ${i}:`, error);
        errors.push({
          index: i,
          original_number: original_number || 'N/A',
          error: error.message || 'Unknown error occurred'
        });
      }
    }

    // Return results
    const totalProcessed = results.length + errors.length;
    const successRate = ((results.length / totalProcessed) * 100).toFixed(1);

    return res.status(200).json({
      success: true,
      data: results,
      errors: errors,
      summary: {
        total_processed: totalProcessed,
        successful: results.length,
        failed: errors.length,
        success_rate: `${successRate}%`
      },
      message: `Bulk import completed. ${results.length} numbers imported successfully, ${errors.length} errors encountered.`
    });

  } catch (error) {
    console.error('Bulk Import Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during bulk import',
      error: error.message
    });
  }
}
