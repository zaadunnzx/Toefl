# 🚀 Installation Guide

## System Requirements

### Hardware Requirements
- **RAM**: Minimum 4GB, Recommended 8GB
- **Storage**: Minimum 10GB free space
- **CPU**: Modern multi-core processor
- **Network**: Stable internet connection

### Software Requirements
- **Node.js**: Version 18.x or higher
- **PostgreSQL**: Version 15.x or higher
- **Git**: Latest version
- **Code Editor**: VS Code (recommended)

---

## Step-by-Step Installation

### 1. Install Prerequisites

#### Windows
```bash
# Install Node.js
# Download from https://nodejs.org/

# Install PostgreSQL
# Download from https://www.postgresql.org/download/windows/

# Install Git
# Download from https://git-scm.com/download/win
```

#### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Install Git
brew install git
```

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Git
sudo apt install git
```

### 2. Setup PostgreSQL Database

#### Create Database and User
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE wa_db;

-- Create user (optional, for security)
CREATE USER wa_user WITH ENCRYPTED PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE wa_db TO wa_user;

-- Exit psql
\q
```

#### Verify Database Connection
```bash
# Test connection
psql -U postgres -d wa_db -c "SELECT version();"
```

### 3. Clone and Setup Project

#### Clone Repository
```bash
git clone <repository-url>
cd whatsapp-numbers-management
```

#### Setup Backend
```bash
# Install backend dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=wa_db
# DB_USER=postgres
# DB_PASSWORD=your_password
# PORT=3000
# NODE_ENV=development
```

#### Setup Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with API URL
# VITE_API_URL=http://localhost:3000
```

### 4. Initialize Database

#### Run Database Migrations and Seeding
```bash
# Go back to root directory
cd ..

# Create database tables and seed data
npm run seed
```

#### Verify Database Setup
```bash
# Check if tables were created
psql -U postgres -d wa_db -c "\dt"

# Check if categories were seeded
psql -U postgres -d wa_db -c "SELECT * FROM categories;"
```

### 5. Start the Application

#### Start Backend Server
```bash
# Start backend in development mode
npm run dev

# Or start in production mode
npm start
```

#### Start Frontend Server
```bash
# In a new terminal, navigate to frontend
cd frontend

# Start frontend development server
npm run dev
```

### 6. Verify Installation

#### Check Backend
```bash
# Test API health
curl http://localhost:3000/api/health

# Test categories endpoint
curl http://localhost:3000/api/categories
```

#### Check Frontend
- Open browser and navigate to: `http://localhost:5173`
- Verify that the application loads correctly
- Test basic functionality (add category, add phone number)

---

## Production Deployment

### 1. Environment Setup

#### Production Environment Variables
```bash
# Backend .env
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=wa_db_prod
DB_USER=wa_user
DB_PASSWORD=your_secure_password
PORT=3000
NODE_ENV=production

# Frontend .env.production
VITE_API_URL=https://your-api-domain.com
```

#### Build Frontend
```bash
cd frontend
npm run build
```

### 2. Database Setup

#### Production Database
```sql
-- Create production database
CREATE DATABASE wa_db_prod;

-- Create dedicated user
CREATE USER wa_user WITH ENCRYPTED PASSWORD 'very_secure_password';

-- Grant minimal required privileges
GRANT CONNECT ON DATABASE wa_db_prod TO wa_user;
GRANT USAGE ON SCHEMA public TO wa_user;
GRANT CREATE ON SCHEMA public TO wa_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO wa_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO wa_user;
```

### 3. Server Configuration

#### Using PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'whatsapp-numbers-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 auto-restart on system boot
pm2 startup
```

#### Using Docker (Alternative)
```dockerfile
# Dockerfile for backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```dockerfile
# Dockerfile for frontend
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: wa_db
      POSTGRES_USER: wa_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: wa_db
      DB_USER: wa_user
      DB_PASSWORD: your_password
      NODE_ENV: production

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 4. Reverse Proxy Setup (Nginx)

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL Configuration (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add line: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Error
```bash
# Error: database "wa_db" does not exist
psql -U postgres -c "CREATE DATABASE wa_db;"

# Error: password authentication failed
# Check your .env file credentials
# Ensure PostgreSQL is running
```

#### 2. Port Already in Use
```bash
# Error: EADDRINUSE :::3000
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port in .env
PORT=3001
```

#### 3. Permission Denied
```bash
# Error: permission denied for relation "categories"
# Grant proper permissions
psql -U postgres -d wa_db -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;"
```

#### 4. Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
# Should be 18.x or higher
```

#### 5. CORS Issues
```bash
# Add your frontend URL to CORS configuration in server.js
# Default: http://localhost:5173
```

### Debug Mode

#### Enable Debug Logging
```bash
# Backend debug
DEBUG=* npm run dev

# Database query logging
NODE_ENV=development npm run dev
```

#### Check Logs
```bash
# PM2 logs
pm2 logs

# Application logs
tail -f logs/application.log
```

---

## Performance Optimization

### Database Optimization
```sql
-- Analyze database performance
ANALYZE;

-- Update table statistics
VACUUM ANALYZE;

-- Check slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;
```

### Application Optimization
```bash
# Enable gzip compression
# Add to nginx configuration
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Enable caching
# Add cache headers for static files
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Monitoring and Maintenance

### Health Checks
```bash
# Create health check script
cat > health_check.sh << 'EOF'
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
if [ $response -eq 200 ]; then
    echo "API is healthy"
else
    echo "API is down - HTTP $response"
    # Restart application
    pm2 restart whatsapp-numbers-api
fi
EOF

chmod +x health_check.sh

# Add to crontab for regular checks
crontab -e
# Add line: */5 * * * * /path/to/health_check.sh
```

### Backup Strategy
```bash
# Database backup script
cat > backup_db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/path/to/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U wa_user -d wa_db > "$BACKUP_DIR/wa_db_backup_$TIMESTAMP.sql"
# Keep only last 7 days of backups
find $BACKUP_DIR -name "wa_db_backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup_db.sh

# Schedule daily backups
crontab -e
# Add line: 0 2 * * * /path/to/backup_db.sh
```

### Log Rotation
```bash
# Setup logrotate
sudo cat > /etc/logrotate.d/whatsapp-numbers << 'EOF'
/var/log/whatsapp-numbers/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

---

## Security Hardening

### Server Security
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

### Application Security
```bash
# Set secure file permissions
chmod 600 .env
chmod 755 server.js

# Use environment variables for secrets
# Never commit .env files to version control
echo ".env" >> .gitignore
```

### Database Security
```sql
-- Change default passwords
ALTER USER postgres PASSWORD 'new_secure_password';

-- Revoke unnecessary permissions
REVOKE ALL ON SCHEMA public FROM public;
GRANT USAGE ON SCHEMA public TO wa_user;
```

---

## Getting Help

### Documentation
- [API Documentation](./API.md)
- [Database Schema](./DATABASE.md)
- [Component Guide](./COMPONENTS.md)

### Community
- GitHub Issues: Report bugs and request features
- Discord: Join our community chat
- Email: support@whatsapp-numbers.com

### Professional Support
- Consulting services available
- Custom development
- Training and workshops

---

## Next Steps

After successful installation:

1. **Configure monitoring** - Set up health checks and alerts
2. **Implement backups** - Schedule regular database backups
3. **Security review** - Conduct security audit
4. **Performance testing** - Load test your application
5. **Documentation** - Document your customizations
6. **Training** - Train your team on the system

Congratulations! Your WhatsApp Numbers Management System is now ready to use! 🎉