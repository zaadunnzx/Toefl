# API Testing Guide

## Contoh Penggunaan API

### 1. Membuat Kategori Baru

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pelanggan",
    "description": "Nomor pelanggan aktif"
  }'
```

### 2. Melihat Semua Kategori

```bash
curl http://localhost:3000/api/categories
```

### 3. Menambah Nomor WhatsApp

```bash
# Format standar
curl -X POST http://localhost:3000/api/phone-numbers \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+6285476387234",
    "category_id": 1
  }'

# Format dengan spasi dan strip
curl -X POST http://localhost:3000/api/phone-numbers \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+ 62-865-453-765",
    "category_id": 1
  }'

# Format nomor lokal Indonesia
curl -X POST http://localhost:3000/api/phone-numbers \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "08123456789",
    "category_id": 1
  }'
```

### 4. Cek Apakah Nomor Sudah Ada

```bash
curl http://localhost:3000/api/phone-numbers/check/+6285476387234
```

### 5. Melihat Semua Nomor

```bash
curl http://localhost:3000/api/phone-numbers
```

### 6. Update Nomor

```bash
curl -X PUT http://localhost:3000/api/phone-numbers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+6285476387999",
    "category_id": 2
  }'
```

### 7. Hapus Nomor

```bash
curl -X DELETE http://localhost:3000/api/phone-numbers/1
```

## Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "original_number": "+ 62-865-453-765",
    "normalized_number": "+62865453765",
    "category_id": 1,
    "created_at": "2025-07-03T10:30:00.000Z",
    "updated_at": "2025-07-03T10:30:00.000Z",
    "category": {
      "id": 1,
      "name": "Pelanggan",
      "description": "Nomor pelanggan aktif"
    }
  },
  "message": "Phone number added successfully"
}
```

### Error Response (Duplicate)
```json
{
  "success": false,
  "message": "This phone number already exists in the system"
}
```

### Error Response (Invalid Format)
```json
{
  "success": false,
  "message": "Invalid phone number format. Must be a valid international number (e.g., +6285476387)"
}
```
