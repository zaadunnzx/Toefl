# 📡 API Documentation

## Base Information
- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **Authentication**: None (for development)

## Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "data": object|array,
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### Bulk Import Response
```json
{
  "success": true,
  "data": [array_of_imported_numbers],
  "errors": [array_of_errors],
  "message": "Bulk import completed. X numbers imported successfully, Y errors encountered."
}
```

## 📋 Categories API

### Get All Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pelanggan VIP",
      "description": "Pelanggan dengan tingkat prioritas tinggi",
      "created_at": "2023-12-01T10:00:00.000Z",
      "updated_at": "2023-12-01T10:00:00.000Z"
    }
  ],
  "message": "Categories retrieved successfully"
}
```

### Create Category
```http
POST /api/categories
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "VIP Customers",
  "description": "High priority customers"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "VIP Customers",
    "description": "High priority customers",
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-01T10:00:00.000Z"
  },
  "message": "Category created successfully"
}
```

### Update Category
```http
PUT /api/categories/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

### Delete Category
```http
DELETE /api/categories/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## 📱 Phone Numbers API

### Get All Phone Numbers
```http
GET /api/phone-numbers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "original_number": "+62 813-4321-6935",
      "normalized_number": "+6281343216935",
      "category_id": 1,
      "created_at": "2023-12-01T10:00:00.000Z",
      "updated_at": "2023-12-01T10:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Pelanggan VIP",
        "description": "Pelanggan dengan tingkat prioritas tinggi"
      }
    }
  ],
  "message": "Phone numbers retrieved successfully"
}
```

### Add Single Phone Number
```http
POST /api/phone-numbers
Content-Type: application/json
```

**Request Body:**
```json
{
  "original_number": "+62 813-4321-6935",
  "category_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "original_number": "+62 813-4321-6935",
    "normalized_number": "+6281343216935",
    "category_id": 1,
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-01T10:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Pelanggan VIP",
      "description": "Pelanggan dengan tingkat prioritas tinggi"
    }
  },
  "message": "Phone number added successfully"
}
```

### Bulk Import Phone Numbers
```http
POST /api/phone-numbers/bulk
Content-Type: application/json
```

**Request Body:**
```json
{
  "numbers": [
    {
      "original_number": "+62 813-4321-6935",
      "category_id": 1
    },
    {
      "original_number": "+62 851-5917-7290",
      "category_id": 2
    },
    {
      "original_number": "08123456789",
      "category_id": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "original_number": "+62 813-4321-6935",
      "normalized_number": "+6281343216935",
      "category_id": 1,
      "created_at": "2023-12-01T10:00:00.000Z",
      "updated_at": "2023-12-01T10:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Pelanggan VIP",
        "description": "Pelanggan dengan tingkat prioritas tinggi"
      }
    }
  ],
  "errors": [
    {
      "index": 1,
      "original_number": "+62 851-5917-7290",
      "error": "This phone number already exists in the system"
    }
  ],
  "message": "Bulk import completed. 2 numbers imported successfully, 1 errors encountered."
}
```

### Check Phone Number (Duplicate Detection)
```http
POST /api/phone-numbers/check
Content-Type: application/json
```

**Request Body:**
```json
{
  "number": "+62 813-4321-6935"
}
```

**Response (Number Exists):**
```json
{
  "success": true,
  "exists": true,
  "isValid": true,
  "existingNumber": {
    "id": 1,
    "original_number": "+62 813-4321-6935",
    "normalized_number": "+6281343216935",
    "category_id": 1,
    "category": {
      "id": 1,
      "name": "Pelanggan VIP",
      "description": "Pelanggan dengan tingkat prioritas tinggi"
    }
  },
  "message": "Phone number already exists in the system"
}
```

**Response (Number Available):**
```json
{
  "success": true,
  "exists": false,
  "isValid": true,
  "normalized_number": "+6281343216935",
  "message": "Phone number is available"
}
```

**Response (Invalid Number):**
```json
{
  "success": true,
  "exists": false,
  "isValid": false,
  "message": "Invalid phone number format. Use international format (+country_code + number)"
}
```

### Update Phone Number
```http
PUT /api/phone-numbers/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "original_number": "+62 813-4321-6935",
  "category_id": 2
}
```

### Delete Phone Number
```http
DELETE /api/phone-numbers/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Phone number deleted successfully"
}
```

## 🏥 System API

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2023-12-01T10:00:00.000Z",
  "database": "connected"
}
```

### API Documentation
```http
GET /api/
```

**Response:**
```json
{
  "success": true,
  "message": "WhatsApp Numbers API",
  "version": "1.0.0",
  "endpoints": {
    "categories": {
      "GET /api/categories": "Get all categories",
      "POST /api/categories": "Create new category",
      "PUT /api/categories/:id": "Update category",
      "DELETE /api/categories/:id": "Delete category"
    },
    "phoneNumbers": {
      "GET /api/phone-numbers": "Get all phone numbers",
      "POST /api/phone-numbers": "Add new phone number",
      "POST /api/phone-numbers/bulk": "Bulk import phone numbers",
      "POST /api/phone-numbers/check": "Check if phone number exists",
      "PUT /api/phone-numbers/:id": "Update phone number",
      "DELETE /api/phone-numbers/:id": "Delete phone number"
    },
    "system": {
      "GET /api/health": "Health check",
      "GET /api/": "API documentation"
    }
  }
}
```

## 📱 Phone Number Formats

The API supports various phone number formats and automatically normalizes them:

### Supported Input Formats

#### Indonesian Numbers
- `+6281234567890` - International format
- `+62 813-4321-6935` - International with spaces and dashes
- `+62 (813) 4321-6935` - International with parentheses
- `08123456789` - Local format with leading zero
- `8123456789` - Local format without leading zero
- `62123456789` - Country code without plus

#### International Numbers
- `+1234567890` - Any international format
- `+1 234-567-890` - With spaces and dashes
- `+44 20 7123 4567` - UK format
- `+33 1 23 45 67 89` - French format

### Normalization Rules

1. **Remove Formatting**: All spaces, dashes, parentheses, and dots are removed
2. **Add Plus Sign**: If missing, `+` is added to the beginning
3. **Indonesian Conversion**: 
   - `08xxx` → `+628xxx`
   - `8xxx` → `+628xxx` (if length >= 10)
   - `62xxx` → `+62xxx`
4. **Validation**: Final format must match `^\+\d{8,15}$`

### Examples

| Input | Normalized | Valid |
|-------|------------|-------|
| `+62 813-4321-6935` | `+6281343216935` | ✅ |
| `08123456789` | `+628123456789` | ✅ |
| `8123456789` | `+628123456789` | ✅ |
| `62123456789` | `+62123456789` | ✅ |
| `+1 234-567-8900` | `+12345678900` | ✅ |
| `123` | `+123` | ❌ (too short) |
| `abc123` | - | ❌ (invalid chars) |

## ❌ Error Codes

### HTTP Status Codes
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Messages

#### Phone Number Errors
- `"Phone number is required"`
- `"Invalid phone number format. Use international format (+country_code + number)"`
- `"Phone number must be at least 8 digits long"`
- `"This phone number already exists in the system"`

#### Category Errors
- `"Category is required"`
- `"Category not found"`
- `"Category name already exists"`
- `"Category name cannot be empty"`

#### Bulk Import Errors
- `"Numbers array is required and cannot be empty"`
- `"Category with ID X not found"`
- Each number can have individual errors in the `errors` array

## 🧪 Testing Examples

### Using curl

#### Add Single Number
```bash
curl -X POST http://localhost:3000/api/phone-numbers \
  -H "Content-Type: application/json" \
  -d '{
    "original_number": "+62 813-4321-6935",
    "category_id": 1
  }'
```

#### Bulk Import
```bash
curl -X POST http://localhost:3000/api/phone-numbers/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "numbers": [
      {"original_number": "+62 813-4321-6935", "category_id": 1},
      {"original_number": "+62 851-5917-7290", "category_id": 2}
    ]
  }'
```

#### Check Duplicate
```bash
curl -X POST http://localhost:3000/api/phone-numbers/check \
  -H "Content-Type: application/json" \
  -d '{"number": "+62 813-4321-6935"}'
```

### Using JavaScript (Frontend)
```javascript
// Add single number
const response = await fetch('/api/phone-numbers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    original_number: '+62 813-4321-6935',
    category_id: 1
  })
});

const result = await response.json();
console.log(result);
```

## 🔧 Rate Limiting

Currently, there are no rate limits implemented. For production use, consider implementing:
- Rate limiting per IP address
- Authentication and authorization
- Request throttling for bulk operations

## 📊 Performance Notes

- Bulk import processes numbers sequentially to maintain data integrity
- Database queries are optimized with proper indexing
- Duplicate detection is performed at the database level for accuracy
- Category validation is cached during bulk operations

---

For more information, see the main [README.md](README.md) file.