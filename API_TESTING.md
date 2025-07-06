# API Testing Guide

## Prerequisites
1. Pastikan PostgreSQL sudah berjalan
2. Database `wa_db` sudah dibuat
3. Install dependencies: `npm install`
4. Jalankan seeding: `npm run seed`
5. Start server: `npm start`

## Test Endpoints

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. Get All Categories
```bash
curl http://localhost:3000/api/categories
```

### 3. Create Category (untuk testing)
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category",
    "description": "Category for testing"
  }'
```

### 4. Get All Phone Numbers
```bash
curl http://localhost:3000/api/phone-numbers
```

### 5. Add Single Phone Number
```bash
curl -X POST http://localhost:3000/api/phone-numbers \
  -H "Content-Type: application/json" \
  -d '{
    "original_number": "+6281234567890",
    "category_id": 1
  }'
```

### 6. Check Phone Number (Duplicate Detection)
```bash
curl -X POST http://localhost:3000/api/phone-numbers/check \
  -H "Content-Type: application/json" \
  -d '{
    "number": "+6281234567890"
  }'
```

### 7. Bulk Import Phone Numbers
```bash
curl -X POST http://localhost:3000/api/phone-numbers/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "numbers": [
      {
        "original_number": "+6281234567891",
        "category_id": 1
      },
      {
        "original_number": "08123456789",
        "category_id": 2
      },
      {
        "original_number": "8123456789",
        "category_id": 1
      }
    ]
  }'
```

## Common Issues & Solutions

### Issue 1: "Category not found"
**Solution**: Pastikan category_id yang digunakan ada di database. Jalankan GET /api/categories untuk melihat kategori yang tersedia.

### Issue 2: "Phone number already exists"
**Solution**: Sistem sudah berfungsi dengan benar. Nomor sudah ada di database.

### Issue 3: "Invalid phone number format"
**Solution**: Gunakan format yang valid:
- International: +6281234567890
- Indonesian: 08123456789
- Tanpa kode negara: 81234567890

### Issue 4: Database connection error
**Solution**: 
1. Pastikan PostgreSQL berjalan
2. Periksa kredensial di file .env
3. Pastikan database wa_db sudah dibuat

## Testing dengan Frontend

1. Pastikan backend berjalan di port 3000
2. Jalankan frontend di port 5173
3. Test fitur:
   - Add single number
   - Bulk import
   - Search & filter
   - Categories management

## Expected Responses

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Bulk Import Response
```json
{
  "success": true,
  "data": [ ... ],
  "errors": [ ... ],
  "message": "Bulk import completed. X numbers imported successfully, Y errors encountered."
}
```
