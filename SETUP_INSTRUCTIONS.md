# 🔧 Backend Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Database Setup

### 1. Install PostgreSQL
Make sure PostgreSQL is installed and running on your system.

### 2. Create Database
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create the database
CREATE DATABASE wa_db;

-- Create a user (optional, but recommended)
CREATE USER wa_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE wa_db TO wa_user;

-- Exit PostgreSQL
\q
```

### 3. Environment Configuration
Make sure your `.env` file in the root directory contains:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wa_db
DB_USER=postgres
DB_PASSWORD=zadun26

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Backend Startup

### 1. Install Dependencies
```bash
cd d:/Toefl
npm install
```

### 2. Start the Backend
```bash
npm start
# or
npm run dev
```

### 3. Verify Backend is Running
The backend should be available at: http://localhost:3000

Check these endpoints:
- Health Check: http://localhost:3000/api/health
- API Documentation: http://localhost:3000/api
- Root Endpoint: http://localhost:3000/

## Frontend Setup

### 1. Install Frontend Dependencies
```bash
cd d:/Toefl/frontend
npm install
```

### 2. Start Frontend
```bash
npm run dev
```

The frontend will be available at: http://localhost:5174/

## Testing with Postman

### 1. Import Collection
1. Open Postman
2. Click "Import"
3. Select the file: `d:/Toefl/WhatsApp_Numbers_API.postman_collection.json`

### 2. Import Environment
1. In Postman, go to Environments
2. Click "Import"
3. Select the file: `d:/Toefl/WhatsApp_Numbers_Environment.postman_environment.json`
4. Set the environment as active

### 3. Test Endpoints
- Start with "Health Check" to verify backend is running
- Test "Get All Categories" and "Get All Phone Numbers"
- Try creating, updating, and deleting data
- Test the duplicate phone number detection
- Test phone number normalization with different formats

## Database Schema
The backend will automatically create these tables:
- `Categories` (id, name, description, createdAt, updatedAt)
- `PhoneNumbers` (id, original_number, normalized_number, category_id, createdAt, updatedAt)

## Features to Test
1. **Categories Management**: Create, read, update, delete categories
2. **Phone Numbers Management**: Add, view, delete phone numbers
3. **Duplicate Detection**: Try adding the same number twice
4. **Phone Number Normalization**: Test with different formats:
   - `+6285476387234` (International format)
   - `08123456789` (Indonesian format)
   - `+ 62-865-453-765` (Formatted with spaces/dashes)
5. **Category Relationships**: Phone numbers linked to categories
6. **Error Handling**: Test with invalid data

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in .env file
- Ensure database exists
- Check firewall settings

### Port Conflicts
- Frontend default: 5174 (Vite will auto-increment if busy)
- Backend default: 3000
- Change ports in respective configuration files if needed

### Missing Dependencies
```bash
# Backend
cd d:/Toefl
npm install express cors helmet morgan sequelize pg pg-hstore dotenv

# Frontend  
cd d:/Toefl/frontend
npm install react react-dom vite @vitejs/plugin-react tailwindcss postcss autoprefixer framer-motion react-toastify axios
```

## API Endpoints Summary

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Phone Numbers
- `GET /api/phone-numbers` - Get all phone numbers
- `POST /api/phone-numbers` - Add phone number
- `PUT /api/phone-numbers/:id` - Update phone number
- `DELETE /api/phone-numbers/:id` - Delete phone number
- `GET /api/phone-numbers/check/:number` - Check if number exists

### System
- `GET /api/health` - Health check
- `GET /api/` - API documentation
- `GET /` - Root endpoint info