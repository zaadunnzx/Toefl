# 🚀 Quick Setup Guide

## ⚡ One-Click Setup (Windows)

1. **Run Setup Script**
   ```bash
   # Double click or run in command prompt
   setup.bat
   ```

2. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 📋 Manual Setup

### Step 1: Prerequisites
- ✅ Node.js v16+ installed
- ✅ PostgreSQL v12+ installed and running
- ✅ Git (optional)

### Step 2: Database Setup
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE wa_db;

-- Verify database created
\l
```

### Step 3: Backend Setup
```bash
# Navigate to project directory
cd d:\Toefl

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env file:
# DB_NAME=wa_db
# DB_PASSWORD=your_postgres_password

# Seed database
npm run seed

# Start backend server
npm start
```

### Step 4: Frontend Setup
```bash
# Open new terminal
cd d:\Toefl\frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

### Step 5: Verification
```bash
# Test backend
curl http://localhost:3000/api/health

# Test frontend - open browser
# http://localhost:5173
```

## 🔧 Environment Configuration

### .env File
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wa_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 📱 Default Categories

The system comes with 5 pre-configured categories:
1. **Pelanggan VIP** - High priority customers
2. **Pelanggan VIP 2** - High priority customers level 2
3. **Pelanggan Regular** - Standard priority customers
4. **Prospek** - Potential customers
5. **Lead** - Interested prospects

## ✅ Quick Test

### Test Bulk Import
1. Open http://localhost:5173
2. Navigate to "Phone Numbers"
3. Click "Bulk Import"
4. Select a category
5. Paste test numbers:
```
+62 813-4321-6935
+62 851-5917-7290
+62 852-8240-8267
08123456789
8123456790
```
6. Click "Import Numbers"

### Test Single Add
1. Click "Add Single Number"
2. Enter: `+62 896-5750-5195`
3. Select category
4. Click "Add Number"

## 🛠️ Troubleshooting

### Issue: Database Connection Failed
```bash
# Check PostgreSQL status
# Windows:
net start postgresql-x64-14

# Check if database exists
psql -U postgres -c "\l" | grep wa_db
```

### Issue: Port Already in Use
```bash
# Kill processes
npx kill-port 3000
npx kill-port 5173
```

### Issue: Categories Not Loading
```bash
# Re-run seeding
npm run seed
```

### Issue: CORS Error
Make sure both servers are running:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## 📊 Available Scripts

### Backend Scripts
| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server |
| `npm run seed` | Seed database with categories |
| `npm test` | Run API tests |

### Frontend Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🎯 Next Steps

After successful setup:

1. **Explore Features**
   - Try bulk import with different formats
   - Test duplicate detection
   - Create custom categories

2. **Customize**
   - Modify categories in database
   - Adjust phone number validation rules
   - Customize UI theme

3. **Deploy**
   - Configure for production environment
   - Set up proper database hosting
   - Deploy to cloud platform

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure PostgreSQL is running
4. Check the troubleshooting section
5. Review the logs in terminal

---

Happy coding! 🎉