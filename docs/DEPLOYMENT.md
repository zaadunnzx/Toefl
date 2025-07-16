# 🚀 Deployment Guide

## Production Deployment Options

### 1. Traditional VPS/Server Deployment
### 2. Docker Deployment
### 3. Cloud Platform Deployment (AWS, GCP, Azure)
### 4. Containerized Deployment (Kubernetes)

---

## Traditional VPS/Server Deployment

### Server Requirements
- **OS**: Ubuntu 20.04 LTS or newer
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 20GB SSD
- **CPU**: 2+ cores
- **Network**: Stable internet connection

### Step 1: Server Setup

#### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Node.js
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Install PostgreSQL
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

```sql
CREATE DATABASE wa_db;
CREATE USER wa_user WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE wa_db TO wa_user;
ALTER USER wa_user CREATEDB;
\q
```

#### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

#### Install Nginx (Web Server)
```bash
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 2: Deploy Application

#### Clone and Setup Backend
```bash
# Create application directory
sudo mkdir -p /var/www/whatsapp-numbers
sudo chown $USER:$USER /var/www/whatsapp-numbers
cd /var/www/whatsapp-numbers

# Clone repository
git clone <your-repository-url> .

# Install dependencies
npm install --production

# Create environment file
cp .env.example .env
nano .env
```

#### Environment Configuration
```bash
# Production .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wa_db
DB_USER=wa_user
DB_PASSWORD=secure_password_here
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

#### Setup Database
```bash
# Run migrations and seeding
npm run seed
```

#### Build and Deploy Frontend
```bash
cd frontend
npm install
npm run build

# Copy build files to nginx directory
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
```

### Step 3: Configure PM2

#### Create PM2 Configuration
```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'whatsapp-numbers-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/whatsapp-numbers/err.log',
    out_file: '/var/log/whatsapp-numbers/out.log',
    log_file: '/var/log/whatsapp-numbers/combined.log',
    time: true
  }]
};
EOF
```

#### Start Application with PM2
```bash
# Create log directory
sudo mkdir -p /var/log/whatsapp-numbers
sudo chown $USER:$USER /var/log/whatsapp-numbers

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### Step 4: Configure Nginx

#### Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/whatsapp-numbers
```

```nginx
upstream whatsapp_numbers_backend {
    server localhost:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration (will be set up with Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://whatsapp_numbers_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 5s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://whatsapp_numbers_backend/api/health;
    }
}
```

#### Enable Site and Test Configuration
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/whatsapp-numbers /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 5: Setup SSL with Let's Encrypt

#### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

#### Obtain SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Setup Auto-renewal
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Add cron job for auto-renewal
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Docker Deployment

### Step 1: Create Dockerfiles

#### Backend Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Docker Compose

#### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: wa_postgres
    environment:
      POSTGRES_DB: wa_db
      POSTGRES_USER: wa_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U wa_user -d wa_db"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: wa_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build: .
    container_name: wa_backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: wa_db
      DB_USER: wa_user
      DB_PASSWORD: secure_password
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    container_name: wa_frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: wa_nginx
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### Environment File (.env.docker)
```bash
# Database
POSTGRES_DB=wa_db
POSTGRES_USER=wa_user
POSTGRES_PASSWORD=secure_password

# Application
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com
```

### Step 3: Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale backend service
docker-compose up -d --scale backend=3

# Stop services
docker-compose down

# Update and redeploy
docker-compose pull
docker-compose up -d --build
```

---

## Cloud Platform Deployment

### AWS Deployment

#### Using AWS ECS (Elastic Container Service)

##### 1. Create ECS Cluster
```bash
# Install AWS CLI
aws configure

# Create ECS cluster
aws ecs create-cluster --cluster-name whatsapp-numbers-cluster
```

##### 2. Create Task Definition
```json
{
  "family": "whatsapp-numbers-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-ecr-repo/whatsapp-numbers-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "DB_HOST",
          "value": "your-rds-endpoint"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/whatsapp-numbers",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

##### 3. Create RDS Database
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier whatsapp-numbers-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username wa_user \
  --master-user-password secure_password \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxx
```

### Google Cloud Platform (GCP)

#### Using Cloud Run

##### 1. Build and Push Image
```bash
# Set project ID
export PROJECT_ID=your-gcp-project-id

# Build image
docker build -t gcr.io/$PROJECT_ID/whatsapp-numbers-backend .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/whatsapp-numbers-backend
```

##### 2. Deploy to Cloud Run
```bash
# Deploy backend
gcloud run deploy whatsapp-numbers-backend \
  --image gcr.io/$PROJECT_ID/whatsapp-numbers-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --set-env-vars NODE_ENV=production,DB_HOST=your-cloud-sql-ip

# Deploy frontend
gcloud run deploy whatsapp-numbers-frontend \
  --image gcr.io/$PROJECT_ID/whatsapp-numbers-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

---

## Kubernetes Deployment

### Step 1: Create Kubernetes Manifests

#### Namespace
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: whatsapp-numbers
```

#### ConfigMap
```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: whatsapp-numbers
data:
  NODE_ENV: "production"
  PORT: "3000"
  DB_HOST: "postgres-service"
  DB_PORT: "5432"
  DB_NAME: "wa_db"
```

#### Secret
```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: whatsapp-numbers
type: Opaque
data:
  DB_USER: d2FfdXNlcg==  # base64 encoded
  DB_PASSWORD: c2VjdXJlX3Bhc3N3b3Jk  # base64 encoded
```

#### PostgreSQL Deployment
```yaml
# postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: whatsapp-numbers
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_DB
          value: wa_db
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: DB_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: DB_PASSWORD
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: whatsapp-numbers
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

#### Backend Deployment
```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: whatsapp-numbers
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/whatsapp-numbers-backend:latest
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          limits:
            memory: "1Gi"
            cpu: "500m"
          requests:
            memory: "512Mi"
            cpu: "250m"
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: whatsapp-numbers
spec:
  selector:
    app: backend
  ports:
  - port: 3000
    targetPort: 3000
```

#### Ingress
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: whatsapp-numbers
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - yourdomain.com
    secretName: app-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 3000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

### Step 2: Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f namespace.yaml

# Apply all manifests
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f ingress.yaml

# Check deployment status
kubectl get pods -n whatsapp-numbers
kubectl get services -n whatsapp-numbers
kubectl get ingress -n whatsapp-numbers

# View logs
kubectl logs -f deployment/backend -n whatsapp-numbers

# Scale deployment
kubectl scale deployment backend --replicas=5 -n whatsapp-numbers
```

---

## Monitoring and Maintenance

### Health Monitoring Script
```bash
#!/bin/bash
# health-monitor.sh

URL="https://yourdomain.com/api/health"
WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"

response=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $response -ne 200 ]; then
    echo "Service is down! HTTP status: $response"
    
    # Send Slack notification
    curl -X POST -H 'Content-type: application/json' \
         --data '{"text":"🚨 WhatsApp Numbers API is down!"}' \
         $WEBHOOK_URL
    
    # Restart services (if using PM2)
    pm2 restart whatsapp-numbers-api
    
    # Or restart Docker containers
    # docker-compose restart backend
    
else
    echo "Service is healthy! HTTP status: $response"
fi
```

### Backup Script
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/whatsapp-numbers"
DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U wa_user -d wa_db > $DB_BACKUP_FILE

# Compress backup
gzip $DB_BACKUP_FILE

# Upload to S3 (optional)
aws s3 cp $DB_BACKUP_FILE.gz s3://your-backup-bucket/

# Clean old backups (keep only last 7 days)
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DB_BACKUP_FILE.gz"
```

### Log Rotation
```bash
# Setup logrotate
sudo nano /etc/logrotate.d/whatsapp-numbers
```

```
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
```

---

## Performance Optimization

### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_phone_numbers_category_created 
ON phone_numbers(category_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_phone_numbers_normalized_lower 
ON phone_numbers(LOWER(normalized_number));

-- Analyze tables
ANALYZE categories;
ANALYZE phone_numbers;
```

### Application Optimization
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Enable caching
const redis = require('redis');
const client = redis.createClient();

// Cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};

// Use cache for categories
app.get('/api/categories', cache(300), getAllCategories);
```

This deployment guide provides comprehensive instructions for deploying the WhatsApp Numbers Management System across various platforms and environments, from simple VPS setups to advanced Kubernetes deployments.