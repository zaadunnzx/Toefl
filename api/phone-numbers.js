const { createClient } = require('@supabase/supabase-js');

// Phone number utilities
function normalizePhoneNumber(phoneNumber) {
  if (!phoneNumber) return null;
  
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Handle various Indonesian formats
  if (cleaned.startsWith('08')) {
    // Indonesian local format (08xx) -> +62xx
    cleaned = '+62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8') && cleaned.length >= 9) {
    // Indonesian without leading 0 (8xx) -> +62xx
    cleaned = '+62' + cleaned;
  } else if (cleaned.startsWith('62') && !cleaned.startsWith('+62')) {
    // Indonesian country code without + (62xx) -> +62xx
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+') && cleaned.length >= 10) {
    // Assume international format without + -> +xx
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

function validatePhoneNumber(phoneNumber) {
  const normalized = normalizePhoneNumber(phoneNumber);
  if (!normalized) return false;
  
  // Check if it starts with + and has country code
  if (!normalized.startsWith('+')) return false;
  
  // Check length (minimum 10 digits after country code, maximum 15)
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

  try {
    switch (req.method) {
      case 'GET':
        const { data: phoneNumbers, error: getError } = await supabase
          .from('phone_numbers')
          .select(`
            *,
            categories (
              id,
              name,
              description
            )
          `)
          .order('created_at', { ascending: false });
        
        if (getError) throw getError;
        
        return res.status(200).json({
          success: true,
          data: phoneNumbers,
          message: 'Phone numbers retrieved successfully'
        });

      case 'POST':
        const { original_number, category_id } = req.body;
        
        if (!original_number || !category_id) {
          return res.status(400).json({
            success: false,
            message: 'Original number and category_id are required'
          });
        }

        // Validate phone number format
        if (!validatePhoneNumber(original_number)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid phone number format. Please use international format (e.g., +6281234567890)'
          });
        }

        const normalized_number = normalizePhoneNumber(original_number);

        // Check for duplicates
        const { data: existing } = await supabase
          .from('phone_numbers')
          .select('id')
          .eq('normalized_number', normalized_number)
          .single();

        if (existing) {
          return res.status(409).json({
            success: false,
            message: 'This phone number already exists in the database'
          });
        }

        // Verify category exists
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('id', category_id)
          .single();

        if (!category) {
          return res.status(400).json({
            success: false,
            message: 'Invalid category_id. Category does not exist'
          });
        }

        // Insert new phone number
        const { data: newNumber, error: postError } = await supabase
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
        
        if (postError) throw postError;
        
        return res.status(201).json({
          success: true,
          data: newNumber,
          message: 'Phone number added successfully'
        });

      case 'DELETE':
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'Phone number ID is required'
          });
        }

        const { error: deleteError } = await supabase
          .from('phone_numbers')
          .delete()
          .eq('id', id);
        
        if (deleteError) throw deleteError;
        
        return res.status(200).json({
          success: true,
          message: 'Phone number deleted successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Phone Numbers API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
