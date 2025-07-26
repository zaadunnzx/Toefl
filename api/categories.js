const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
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
        const { data: categories, error: getError } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (getError) throw getError;
        
        return res.status(200).json({
          success: true,
          data: categories,
          message: 'Categories retrieved successfully'
        });

      case 'POST':
        const { name, description } = req.body;
        
        if (!name || name.trim() === '') {
          return res.status(400).json({
            success: false,
            message: 'Category name is required'
          });
        }

        const { data: newCategory, error: postError } = await supabase
          .from('categories')
          .insert([{ 
            name: name.trim(), 
            description: description?.trim() || null 
          }])
          .select()
          .single();
        
        if (postError) {
          if (postError.code === '23505') {
            return res.status(409).json({
              success: false,
              message: 'Category name already exists'
            });
          }
          throw postError;
        }
        
        return res.status(201).json({
          success: true,
          data: newCategory,
          message: 'Category created successfully'
        });

      case 'PUT':
        const { id } = req.query;
        const { name: updateName, description: updateDescription } = req.body;
        
        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'Category ID is required'
          });
        }

        if (!updateName || updateName.trim() === '') {
          return res.status(400).json({
            success: false,
            message: 'Category name is required'
          });
        }

        const { data: updatedCategory, error: putError } = await supabase
          .from('categories')
          .update({ 
            name: updateName.trim(), 
            description: updateDescription?.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        
        if (putError) {
          if (putError.code === '23505') {
            return res.status(409).json({
              success: false,
              message: 'Category name already exists'
            });
          }
          throw putError;
        }

        if (!updatedCategory) {
          return res.status(404).json({
            success: false,
            message: 'Category not found'
          });
        }
        
        return res.status(200).json({
          success: true,
          data: updatedCategory,
          message: 'Category updated successfully'
        });

      case 'DELETE':
        const { id: deleteId } = req.query;
        
        if (!deleteId) {
          return res.status(400).json({
            success: false,
            message: 'Category ID is required'
          });
        }

        // Check if category has phone numbers
        const { data: phoneNumbers } = await supabase
          .from('phone_numbers')
          .select('id')
          .eq('category_id', deleteId)
          .limit(1);

        if (phoneNumbers && phoneNumbers.length > 0) {
          return res.status(409).json({
            success: false,
            message: 'Cannot delete category with existing phone numbers'
          });
        }

        const { error: deleteError } = await supabase
          .from('categories')
          .delete()
          .eq('id', deleteId);
        
        if (deleteError) throw deleteError;
        
        return res.status(200).json({
          success: true,
          message: 'Category deleted successfully'
        });

      default:
        return res.status(405).json({
          success: false,
          message: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('Categories API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
