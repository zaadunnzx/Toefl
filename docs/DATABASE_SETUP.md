# 🗄️ Database Setup Guide

## Overview
This guide will help you set up PostgreSQL database for the WhatsApp Numbers Management System.

## Prerequisites
- PostgreSQL 12 or higher
- Administrative access to create databases and users
- Command line access (Terminal/Command Prompt)

---

## 🐘 PostgreSQL Installation

### Windows
1. **Download PostgreSQL:**
   - Visit [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
   - Download the Windows installer

2. **Install PostgreSQL:**
   - Run the installer as administrator
   - Follow installation wizard
   - **Remember the password** for the postgres user
   - Default port: 5432

3. **Verify Installation:**
   ```cmd
   psql --version
   ```

### macOS
1. **Using Homebrew:**
   ```bash
   brew install postgresql
   brew services start postgresql
   ```

2. **Using PostgreSQL.app:**
   - Download from [PostgreSQL.app](https://postgresapp.com/)
   - Drag to Applications folder
   - Open and click "Initialize"

3. **Verify Installation:**
   ```bash
   psql --version
   ```

### Linux (Ubuntu/Debian)
1. **Install PostgreSQL:**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. **Start PostgreSQL:**
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Verify Installation:**
   ```bash
   psql --version
   ```

---

## 🔧 Database Configuration

### 1. Access PostgreSQL
```bash
# Login as postgres user
sudo -u postgres psql

# Or on Windows
psql -U postgres
```

### 2. Create Database
```sql
-- Create the main database
CREATE DATABASE wa_db;

-- Create a dedicated user (optional but recommended)
CREATE USER wa_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE wa_db TO wa_user;

-- Exit PostgreSQL
\q
```

### 3. Verify Database Creation
```bash
# List all databases
psql -U postgres -l

# Connect to the database
psql -U postgres -d wa_db
```

---

## ⚙️ Environment Configuration

### 1. Create .env File
Create a `.env` file in the project root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wa_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: Connection Pool Settings
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
```

### 2. Update Database Credentials
Replace the following values with your actual credentials:
- `DB_PASSWORD`: Your PostgreSQL password
- `DB_USER`: Your PostgreSQL username (default: postgres)
- `DB_HOST`: Your database host (default: localhost)

---

## 🏗️ Database Schema

### Automatic Schema Creation
The application automatically creates tables when you first run it:

```bash
# Install dependencies
npm install

# Start the server (creates tables automatically)
npm start
```

### Manual Schema Creation
If you prefer to create tables manually:

```sql
-- Connect to the database
\c wa_db;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create phone_numbers table
CREATE TABLE phone_numbers (
    id SERIAL PRIMARY KEY,
    original_number VARCHAR(50) NOT NULL,
    normalized_number VARCHAR(20) NOT NULL UNIQUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_phone_numbers_category_id ON phone_numbers(category_id);
CREATE INDEX idx_phone_numbers_normalized ON phone_numbers(normalized_number);
CREATE INDEX idx_categories_name ON categories(name);
```

---

## 📊 Default Data

### Seed Categories
Run the seeding script to create default categories:

```bash
npm run seed
```

This creates the following categories:
1. **Pelanggan VIP** - Pelanggan dengan tingkat prioritas tinggi
2. **Pelanggan VIP 2** - Pelanggan dengan tingkat prioritas tinggi level 2
3. **Pelanggan Regular** - Pelanggan dengan tingkat prioritas standar
4. **Prospek** - Calon pelanggan yang berpotensi
5. **Lead** - Calon pelanggan yang sudah menunjukkan minat

### Manual Data Insertion
If you prefer to add data manually:

```sql
-- Insert categories
INSERT INTO categories (name, description) VALUES
('Pelanggan VIP', 'Pelanggan dengan tingkat prioritas tinggi'),
('Pelanggan Regular', 'Pelanggan dengan tingkat prioritas standar'),
('Prospek', 'Calon pelanggan yang berpotensi');

-- Insert sample phone numbers
INSERT INTO phone_numbers (original_number, normalized_number, category_id) VALUES
('+6281234567890', '+6281234567890', 1),
('08123456789', '+6281234567890', 2),
('+14155552671', '+14155552671', 1);
```

---

## 🔍 Database Verification

### Check Tables
```sql
-- Connect to database
\c wa_db;

-- List all tables
\dt

-- Check table structure
\d categories
\d phone_numbers

-- View data
SELECT * FROM categories;
SELECT * FROM phone_numbers;
```

### Test Application Connection
```bash
# Test database connection
npm run test

# Or check health endpoint
curl http://localhost:3000/api/health
```

---

## 🛠️ Database Maintenance

### Backup Database
```bash
# Create backup
pg_dump -U postgres -d wa_db > wa_db_backup.sql

# Restore backup
psql -U postgres -d wa_db < wa_db_backup.sql
```

### Monitor Database Performance
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('wa_db'));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check active connections
SELECT * FROM pg_stat_activity WHERE datname = 'wa_db';
```

### Clean Up Data
```sql
-- Delete old records (example: older than 1 year)
DELETE FROM phone_numbers 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Vacuum database for performance
VACUUM ANALYZE;
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
- Check if PostgreSQL is running: `sudo service postgresql status`
- Check if PostgreSQL is listening on port 5432: `netstat -an | grep 5432`
- Verify PostgreSQL configuration in `/etc/postgresql/*/main/postgresql.conf`

#### 2. Authentication Failed
```
Error: password authentication failed for user "postgres"
```

**Solutions:**
- Verify password in `.env` file
- Reset PostgreSQL password:
  ```bash
  sudo -u postgres psql
  ALTER USER postgres PASSWORD 'new_password';
  ```

#### 3. Database Does Not Exist
```
Error: database "wa_db" does not exist
```

**Solutions:**
- Create the database: `CREATE DATABASE wa_db;`
- Verify database name in `.env` file

#### 4. Permission Denied
```
Error: permission denied for database
```

**Solutions:**
- Grant permissions: `GRANT ALL PRIVILEGES ON DATABASE wa_db TO postgres;`
- Check user privileges: `\du`

#### 5. Port Already in Use
```
Error: Port 5432 is already in use
```

**Solutions:**
- Check what's using the port: `lsof -i :5432`
- Change PostgreSQL port in configuration
- Kill conflicting process

### Database Connection Test Script
Create a test script to verify connection:

```javascript
// test-db-connection.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('User:', process.env.DB_USER);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();
```

Run the test:
```bash
node test-db-connection.js
```

---

## 🔐 Security Best Practices

### 1. Database User Permissions
```sql
-- Create limited user for application
CREATE USER app_user WITH PASSWORD 'secure_password';

-- Grant only necessary permissions
GRANT CONNECT ON DATABASE wa_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

### 2. Connection Security
```env
# Use SSL in production
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

# Connection timeout
DB_CONNECT_TIMEOUT=60000
```

### 3. Password Security
- Use strong passwords (min 12 characters)
- Include uppercase, lowercase, numbers, and symbols
- Don't commit passwords to version control
- Use environment variables for sensitive data

### 4. Network Security
- Configure `pg_hba.conf` for connection restrictions
- Use SSL certificates in production
- Limit database access to application servers only

---

## 📈 Performance Optimization

### 1. Database Indexes
```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_phone_numbers_created_at ON phone_numbers(created_at);
CREATE INDEX CONCURRENTLY idx_categories_created_at ON categories(created_at);
CREATE INDEX CONCURRENTLY idx_phone_numbers_search ON phone_numbers USING gin(to_tsvector('english', original_number));
```

### 2. Connection Pooling
```javascript
// config/database.js
const sequelize = new Sequelize({
  // ... other config
  pool: {
    max: 10,        // maximum number of connections
    min: 0,         // minimum number of connections
    acquire: 30000, // maximum time to get connection
    idle: 10000     // maximum time connection can be idle
  }
});
```

### 3. Query Optimization
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM phone_numbers 
JOIN categories ON phone_numbers.category_id = categories.id 
WHERE categories.name = 'Pelanggan VIP';

-- Update table statistics
ANALYZE phone_numbers;
ANALYZE categories;
```

---

## 🔄 Migration Strategy

### Development to Production
1. **Backup production data**
2. **Test migrations on staging**
3. **Create migration scripts**
4. **Schedule maintenance window**
5. **Execute migrations**
6. **Verify data integrity**

### Database Versioning
```sql
-- Create migrations table
CREATE TABLE migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    executed_at TIMESTAMP DEFAULT NOW()
);

-- Track applied migrations
INSERT INTO migrations (version, description) 
VALUES ('001', 'Initial schema creation');
```

---

## 📞 Support

### Getting Help
- **Documentation**: Check this guide first
- **Logs**: Check PostgreSQL logs in `/var/log/postgresql/`
- **Community**: PostgreSQL community forums
- **Professional**: Consider PostgreSQL professional support

### Log Locations
- **Linux**: `/var/log/postgresql/postgresql-*.log`
- **Windows**: `C:\Program Files\PostgreSQL\*\data\log\`
- **macOS**: `/usr/local/var/log/postgresql.log`

---

## 📚 Additional Resources

### Documentation
- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Node.js PostgreSQL Best Practices](https://node-postgres.com/)

### Tools
- **pgAdmin**: Web-based PostgreSQL administration
- **DBeaver**: Universal database tool
- **DataGrip**: JetBrains database IDE
- **psql**: Command-line interface

### Monitoring
- **pg_stat_statements**: Query performance monitoring
- **pg_stat_activity**: Active connections monitoring
- **pgBadger**: PostgreSQL log analyzer