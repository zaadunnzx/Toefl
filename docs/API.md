# 📡 API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format
All API responses follow this consistent format:

```json
{
  "success": boolean,
  "data": object|array|null,
  "message": string,
  "error": string (optional)
}
```

## HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

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
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Categories retrieved successfully"
}
```

### Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "New Category",
  "description": "Category description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "New Category",
    "description": "Category description",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Category created successfully"
}
```

### Update Category
```http
PUT /api/categories/:id
Content-Type: application/json

{
  "name": "Updated Category",
  "description": "Updated description"
}
```

### Delete Category
```http
DELETE /api/categories/:id
```

---

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
      "normalized_number": "+628134321695",
      "category_id": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
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

{
  "original_number": "+62 813-4321-6935",
  "category_id": 1
}
```

**Supported Phone Number Formats:**
- `+62 813-4321-6935` (Indonesian with spaces and dashes)
- `+628134321695` (Indonesian international)
- `08134321695` (Indonesian local)
- `8134321695` (Indonesian without leading zero)
- `+1-555-123-4567` (International with dashes)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "original_number": "+62 813-4321-6935",
    "normalized_number": "+628134321695",
    "category_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
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
      "normalized_number": "+628134321695",
      "category_id": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Pelanggan VIP",
        "description": "Pelanggan dengan tingkat prioritas tinggi"
      }
    }
  ],
  "errors": [
    {
      "index": 2,
      "original_number": "invalid_number",
      "error": "Invalid phone number format"
    }
  ],
  "message": "Bulk import completed. 2 numbers imported successfully, 1 errors encountered."
}
```

### Check Phone Number (Duplicate Detection)
```http
POST /api/phone-numbers/check
Content-Type: application/json

{
  "number": "+62 813-4321-6935"
}
```

**Response (Number exists):**
```json
{
  "success": true,
  "exists": true,
  "isValid": true,
  "existingNumber": {
    "id": 1,
    "original_number": "+62 813-4321-6935",
    "normalized_number": "+628134321695",
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

**Response (Number available):**
```json
{
  "success": true,
  "exists": false,
  "isValid": true,
  "normalized_number": "+628134321695",
  "message": "Phone number is available"
}
```

### Update Phone Number
```http
PUT /api/phone-numbers/:id
Content-Type: application/json

{
  "phone_number": "+62 813-4321-6935",
  "category_id": 2
}
```

### Delete Phone Number
```http
DELETE /api/phone-numbers/:id
```

---

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
  "timestamp": "2024-01-01T00:00:00.000Z",
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

---

## 🧪 Testing with cURL

### Test Health Check
```bash
curl http://localhost:3000/api/health
```

### Test Get Categories
```bash
curl http://localhost:3000/api/categories
```

### Test Create Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category",
    "description": "This is a test category"
  }'
```

### Test Add Phone Number
```bash
curl -X POST http://localhost:3000/api/phone-numbers \
  -H "Content-Type: application/json" \
  -d '{
    "original_number": "+62 813-4321-6935",
    "category_id": 1
  }'
```

### Test Bulk Import
```bash
curl -X POST http://localhost:3000/api/phone-numbers/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "numbers": [
      {
        "original_number": "+62 813-4321-6935",
        "category_id": 1
      },
      {
        "original_number": "+62 851-5917-7290",
        "category_id": 1
      }
    ]
  }'
```

### Test Check Duplicate
```bash
curl -X POST http://localhost:3000/api/phone-numbers/check \
  -H "Content-Type: application/json" \
  -d '{
    "number": "+62 813-4321-6935"
  }'
```

---

## ⚠️ Error Handling

### Validation Errors
```json
{
  "success": false,
  "message": "Phone number is required",
  "error": "Validation failed"
}
```

### Duplicate Number Error
```json
{
  "success": false,
  "message": "This phone number already exists in the system",
  "error": "SequelizeUniqueConstraintError"
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Phone number not found",
  "error": "Resource not found"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

---

## 📱 Phone Number Normalization

The API automatically normalizes phone numbers to international format:

| Input Format | Normalized Output | Description |
|-------------|------------------|-------------|
| `+62 813-4321-6935` | `+628134321695` | Indonesian with formatting |
| `08134321695` | `+628134321695` | Indonesian local format |
| `8134321695` | `+628134321695` | Indonesian without leading 0 |
| `+1-555-123-4567` | `+15551234567` | International with formatting |
| `+44 20 7946 0958` | `+442079460958` | UK number with spaces |

### Supported Characters
The normalization process removes these characters:
- Spaces: ` `
- Dashes: `-`
- Parentheses: `(` `)`
- Dots: `.`
- Plus signs (except leading): `+`

### Validation Rules
- Minimum length: 8 digits
- Maximum length: 15 digits
- Must start with `+` after normalization
- Must contain only digits after `+`