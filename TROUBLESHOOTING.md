# 🚨 Troubleshooting Guide - Backend Server Issues

## Common Issues & Solutions

### 1. Server Keeps Crashing/Dying
**Symptoms:**
- Server starts but exits immediately
- "Server exited with code X" messages
- Process terminates unexpectedly

**Solutions:**
```bash
# Use the monitor script for auto-restart
npm run monitor

# Or use start-monitor.bat on Windows
start-monitor.bat

# Check for specific errors
npm run check-db
```

### 2. Database Connection Failures
**Symptoms:**
- "Unable to connect to database" errors
- PostgreSQL connection timeouts
- Database sync failures

**Solutions:**
```bash
# Test database connection
npm run check-db

# Check PostgreSQL service
# Windows:
net start postgresql-x64-14

# Linux/Mac:
sudo systemctl start postgresql

# Verify database exists
psql -U postgres -c "\l" | grep whatsapp_numbers
```

### 3. Port Already in Use
**Symptoms:**
- "EADDRINUSE" errors
- Port 3000 already in use

**Solutions:**
```bash
# Kill process using port 3000
npx kill-port 3000

# Or find and kill manually
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill
```

### 4. Memory Issues
**Symptoms:**
- High memory usage
- "Out of memory" errors
- Slow performance

**Solutions:**
```bash
# Monitor memory usage
npm run monitor

# Check current memory usage
curl http://localhost:3000/api/health
```

### 5. Uncaught Exceptions
**Symptoms:**
- "Uncaught Exception" errors
- Random server crashes
- Stack trace errors

**Solutions:**
The updated server.js now handles these gracefully without crashing. Check logs for specific error details.

## Monitoring Commands

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Database Status
```bash
npm run check-db
```

### Server Logs
```bash
# Start with verbose logging
NODE_ENV=development npm start

# Monitor with auto-restart
npm run monitor
```

## Environment Variables Check

Create/verify your `.env` file:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=whatsapp_numbers
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Emergency Procedures

### Complete Reset
```bash
# Stop all processes
npx kill-port 3000

# Check database
npm run check-db

# Restart PostgreSQL
# Windows:
net stop postgresql-x64-14
net start postgresql-x64-14

# Start with monitor
npm run monitor
```

### Database Recovery
```bash
# Recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS whatsapp_numbers;"
psql -U postgres -c "CREATE DATABASE whatsapp_numbers;"

# Reseed
npm run seed
```

## Logs & Debugging

### Server Logs
- Check console output for error messages
- Look for database connection errors
- Monitor memory usage in health check

### Database Logs
```bash
# PostgreSQL logs location (varies by OS)
# Windows: C:\Program Files\PostgreSQL\14\data\log\
# Linux: /var/log/postgresql/
```

### Common Error Patterns
- `ECONNREFUSED` - Database not running
- `EADDRINUSE` - Port already in use
- `TimeoutError` - Database connection timeout
- `SequelizeConnectionError` - Database credentials/config issue

## Performance Optimization

### Database Optimization
```sql
-- Check database performance
SELECT * FROM pg_stat_activity;

-- Check table sizes
SELECT schemaname,tablename,attname,n_distinct,correlation FROM pg_stats;
```

### Server Optimization
- Use `npm run monitor` for automatic restarts
- Monitor memory usage via `/api/health`
- Check database connection pooling

## Support

If issues persist:
1. Check all error logs
2. Verify PostgreSQL is running
3. Confirm .env configuration
4. Test database connection separately
5. Use monitor script for stability

---

**Remember:** The monitor script (`npm run monitor`) will automatically restart the server if it crashes, providing better stability.