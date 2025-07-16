# 📱 WhatsApp Numbers Management System

## 🌟 Overview

Sistem manajemen nomor WhatsApp yang powerful dengan fitur bulk import, kategorisasi dinamis, dan deteksi duplikasi real-time. Sistem ini terdiri dari backend Node.js/Express dan frontend React dengan tema dark yang elegan.

## ✨ Key Features

### 📊 Backend Features
- **Phone Number Management**: CRUD operations untuk nomor telepon
- **Category Management**: Sistem kategorisasi yang fleksibel
- **Bulk Import**: Import multiple nomor sekaligus dengan validasi
- **Duplicate Detection**: Deteksi duplikasi otomatis
- **Phone Normalization**: Normalisasi format nomor internasional
- **Format Support**: Mendukung berbagai format nomor (+62 813-4321-6935, +628134216935, 08134216935, dll)
- **PostgreSQL Database**: Database yang robust dengan Sequelize ORM
- **RESTful API**: API yang konsisten dengan dokumentasi lengkap

### 🎨 Frontend Features
- **Modern UI**: Interface modern dengan tema dark glassmorphism
- **Real-time Validation**: Validasi nomor secara real-time
- **Bulk Import Modal**: Interface yang user-friendly untuk bulk import
- **Search & Filter**: Pencarian dan filter berdasarkan kategori
- **Responsive Design**: Optimal untuk desktop dan mobile
- **WhatsApp Integration**: Link langsung ke WhatsApp
- **Copy to Clipboard**: Fitur copy nomor dengan satu klik

## 🏗️ Architecture

```
WhatsApp Numbers Management System
├── Backend (Node.js + Express + PostgreSQL)
│   ├── API Routes (/api/categories, /api/phone-numbers)
│   ├── Database Models (Category, PhoneNumber)
│   ├── Validation & Normalization
│   └── Error Handling
└── Frontend (React + Vite)
    ├── Components (BulkImport, PhoneNumberList, etc.)
    ├── Services (API integration)
    ├── Utils (Phone validation)
    └── Styling (CSS with CSS Variables)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm atau yarn

### Backend Setup

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd whatsapp-numbers-management
   npm install
   ```

2. **Database Setup**
   ```sql
   -- Buat database PostgreSQL
   CREATE DATABASE wa_db;
   
   -- Buat user (opsional)
   CREATE USER wa_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE wa_db TO wa_user;
   ```

3. **Environment Configuration**
   ```bash
   # Copy .env.example ke .env
   cp .env.example .env
   
   # Edit .env sesuai konfigurasi database Anda
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=wa_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3000
   NODE_ENV=development
   ```

4. **Seed Database**
   ```bash
   npm run seed
   ```

5. **Start Backend**
   ```bash
   npm start
   # atau untuk development
   npm run dev
   ```

### Frontend Setup

1. **Navigate to Frontend**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Frontend**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Categories Endpoints

#### Get All Categories
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

#### Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "name": "New Category",
  "description": "Category description"
}
```

#### Update Category
```http
PUT /api/categories/:id
Content-Type: application/json

{
  "name": "Updated Category",
  "description": "Updated description"
}
```

#### Delete Category
```http
DELETE /api/categories/:id
```

### Phone Numbers Endpoints

#### Get All Phone Numbers
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

#### Add Single Phone Number
```http
POST /api/phone-numbers
Content-Type: application/json

{
  "original_number": "+62 813-4321-6935",
  "category_id": 1
}
```

#### Bulk Import Phone Numbers
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
      "original_number": "08134216936",
      "category_id": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": [...], // Successfully imported numbers
  "errors": [...], // Any errors encountered
  "message": "Bulk import completed. 2 numbers imported successfully, 0 errors encountered."
}
```

#### Check Duplicate
```http
POST /api/phone-numbers/check
Content-Type: application/json

{
  "number": "+62 813-4321-6935"
}
```

**Response:**
```json
{
  "success": true,
  "exists": true,
  "isValid": true,
  "existingNumber": { ... },
  "message": "Phone number already exists in the system"
}
```

#### Delete Phone Number
```http
DELETE /api/phone-numbers/:id
```

## 📱 Phone Number Format Support

Sistem mendukung berbagai format nomor telepon:

### Supported Formats
```
+62 813-4321-6935    → +6281343216935
+62-813-4321-6935    → +6281343216935
+62.813.4321.6935    → +6281343216935
+628134216935        → +6281343216935
62 813 4321 6935     → +6281343216935
08134216935          → +6281343216935
8134216935           → +6281343216935
```

### Normalization Rules
1. **Remove all non-digit characters** except `+`
2. **Indonesian numbers starting with 08** → Convert to +62
3. **Numbers starting with 8** (without +) → Convert to +628
4. **Numbers starting with 62** (without +) → Add + prefix
5. **International format validation** → Must match `+\d{10,15}`

## 🎨 Frontend Components

### 1. BulkImport Component
Modal component untuk bulk import dengan fitur:
- **Category selection dropdown**
- **Multi-line textarea** untuk input nomor
- **Real-time validation** dan preview
- **Duplicate detection** sebelum import
- **Progress tracking** dan error handling

### 2. PhoneNumberList Component
Komponen untuk menampilkan daftar nomor:
- **Search functionality**
- **Category filtering**
- **Copy to clipboard**
- **WhatsApp integration**
- **Delete confirmation**

### 3. PhoneNumberForm Component
Form untuk tambah nomor single:
- **Real-time validation**
- **Format normalization**
- **Category selection**
- **Duplicate warning**

### 4. Categories Management
Interface untuk mengelola kategori:
- **CRUD operations**
- **Search functionality**
- **Usage statistics**

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wa_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=development

# CORS (auto-configured)
# Frontend URLs: http://localhost:5173, http://localhost:5174
```

### Frontend Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

## 🧪 Testing

### Backend Testing
```bash
# Test semua endpoints
npm test

# Test format nomor telepon
npm run test-formats

# Test health check
curl http://localhost:3000/api/health
```

### Frontend Testing
```bash
cd frontend
npm run dev
# Access http://localhost:5173
```

### Manual Testing Checklist
- [ ] Add single phone number
- [ ] Bulk import dengan berbagai format
- [ ] Duplicate detection
- [ ] Search dan filter
- [ ] Categories CRUD
- [ ] WhatsApp integration
- [ ] Copy to clipboard
- [ ] Responsive design

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
❌ Unable to connect to the database
```
**Solution:**
- Pastikan PostgreSQL berjalan
- Periksa credentials di .env
- Pastikan database wa_db sudah dibuat

#### 2. Categories Not Loading
```bash
❌ Categories array is empty
```
**Solution:**
```bash
npm run seed
```

#### 3. Bulk Import Not Working
```bash
❌ Numbers array is required
```
**Solution:**
- Pastikan format payload benar
- Check network tab di browser
- Verify API endpoint tersedia

#### 4. Phone Number Validation Fails
```bash
❌ Invalid phone number format
```
**Solution:**
- Check format nomor (minimal 8 digit)
- Pastikan menggunakan format yang didukung
- Test dengan `npm run test-formats`

### Debug Mode
```bash
# Backend dengan debug logs
NODE_ENV=development npm run dev

# Frontend dengan console logs
# Buka browser dev tools → Console tab
```

## 📊 Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Phone Numbers Table
```sql
CREATE TABLE phone_numbers (
  id SERIAL PRIMARY KEY,
  original_number VARCHAR(50) NOT NULL,
  normalized_number VARCHAR(20) NOT NULL UNIQUE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships
- `categories` 1:N `phone_numbers`
- Foreign key: `phone_numbers.category_id → categories.id`
- Cascade delete: Deleting category requires moving/deleting phone numbers first

## 🔒 Security

### Input Validation
- **Phone number format validation**
- **SQL injection prevention** (Sequelize ORM)
- **XSS protection** (Input sanitization)
- **CORS configuration** (Whitelist origins)

### Error Handling
- **Graceful error responses**
- **Detailed logging** (development mode)
- **User-friendly error messages**
- **Stack trace hiding** (production mode)

## 🚀 Deployment

### Production Setup

#### Backend Deployment
```bash
# Environment
NODE_ENV=production

# Database
# Use production PostgreSQL instance

# Process Management
pm2 start server.js --name "whatsapp-api"

# Or Docker
docker build -t whatsapp-api .
docker run -p 3000:3000 whatsapp-api
```

#### Frontend Deployment
```bash
# Build production
npm run build

# Serve static files
# Upload dist/ folder to web server
# Configure nginx/apache for SPA routing
```

### Environment-specific Configurations
```bash
# Development
NODE_ENV=development
DB_NAME=wa_db_dev

# Testing
NODE_ENV=test
DB_NAME=wa_db_test

# Production
NODE_ENV=production
DB_NAME=wa_db_prod
```

## 📈 Performance

### Optimization Tips
- **Database indexing** pada normalized_number
- **Pagination** untuk large datasets
- **Connection pooling** (sudah dikonfigurasi)
- **Caching** untuk categories (Redis optional)
- **Compression** untuk API responses

### Monitoring
- **Health check endpoint**: `/api/health`
- **Database connection status**
- **Error rate monitoring**
- **Response time tracking**

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch
3. Make changes
4. Run tests
5. Submit pull request

### Code Standards
- **ESLint** configuration
- **Prettier** for formatting
- **JSDoc** comments
- **Error handling** best practices
- **RESTful API** conventions

## 📝 License

MIT License - Feel free to use for personal or commercial projects.

## 📞 Support

Untuk pertanyaan atau dukungan:
- Create GitHub issue
- Check troubleshooting section
- Review API documentation
- Run test scripts untuk debugging

---

**Made with ❤️ for efficient WhatsApp number management**
