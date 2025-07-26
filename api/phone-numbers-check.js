const { createClient } = require('@supabase/supabase-js');

// Phone number utilities
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
    const { phone_number } = req.body;
    
    if (!phone_number) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const normalized_number = normalizePhoneNumber(phone_number);
    
    if (!normalized_number) {
      return res.status(400).json({
        success: false,
        exists: false,
        message: 'Invalid phone number format'
      });
    }

    // Check if number exists in database
    const { data: existing, error } = await supabase
      .from('phone_numbers')
      .select(`
        id,
        original_number,
        normalized_number,
        created_at,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('normalized_number', normalized_number)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (existing) {
      return res.status(200).json({
        success: true,
        exists: true,
        data: existing,
        message: 'Phone number already exists in database'
      });
    } else {
      return res.status(200).json({
        success: true,
        exists: false,
        normalized_number,
        message: 'Phone number is available'
      });
    }

  } catch (error) {
    console.error('Check Phone Number Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
