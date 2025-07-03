# WhatsApp Numbers Backend System

Backend system untuk menyimpan dan mengelola data nomor WhatsApp dengan kategorisasi dinamis.

## Features

- ✅ Menyimpan nomor WhatsApp dengan validasi format
- ✅ Deteksi duplikasi nomor otomatis
- ✅ Kategori dinamis yang bisa dikelola
- ✅ Normalisasi format nomor (menghapus spasi, strip, tanda hubung)
- ✅ REST API lengkap untuk CRUD operations
- ✅ PostgreSQL database
- ✅ Validasi nomor internasional

## Database Schema

### Categories Table
- `id` (Primary Key, Auto Increment)
- `name` (String, Unique)
- `description` (String, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Phone Numbers Table
- `id` (Primary Key, Auto Increment)
- `original_number` (String) - Nomor asli yang diinput
- `normalized_number` (String, Unique) - Nomor yang sudah dinormalisasi
- `category_id` (Foreign Key ke Categories)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Phone Numbers
- `GET /api/phone-numbers` - Get all phone numbers with categories
- `POST /api/phone-numbers` - Add new phone number
- `PUT /api/phone-numbers/:id` - Update phone number
- `DELETE /api/phone-numbers/:id` - Delete phone number
- `GET /api/phone-numbers/check/:number` - Check if number exists

## Setup Instructions

### Prerequisites
- Node.js (v16 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm atau yarn

### Installation Steps

1. **Clone/Download project ini**

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Setup PostgreSQL Database**:
   - Lihat panduan lengkap di [DATABASE_SETUP.md](DATABASE_SETUP.md)
   - Buat database `whatsapp_numbers_db`
   - Copy `.env.example` ke `.env` dan sesuaikan konfigurasi

4. **Setup database tables**:
   ```powershell
   npm run setup
   ```

5. **Start development server**:
   ```powershell
   npm run dev
   ```

6. **Test API**:
   - Buka http://localhost:3000/api untuk dokumentasi
   - Lihat contoh penggunaan di [API_TESTING.md](API_TESTING.md)

## Example Phone Number Formats Supported

- `+6285476387` 
- `+ 62-865-453-765`
- `+ 62 654 876 543`
- `+1234567890` (international)
- `08123456789` (local Indonesia)

Semua format akan dinormalisasi menjadi format standar untuk deteksi duplikasi.

## Technologies Used

- Node.js + Express.js
- PostgreSQL
- Sequelize ORM
- Cors, Helmet, Morgan untuk middleware
- dotenv untuk environment configuration
