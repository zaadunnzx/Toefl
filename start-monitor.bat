@echo off
title WhatsApp Numbers API Monitor
echo.
echo ====================================
echo   WhatsApp Numbers API Monitor
echo ====================================
echo.

echo Checking database connection...
npm run check-db

if %errorlevel% neq 0 (
    echo.
    echo ❌ Database connection failed!
    echo Please check your PostgreSQL service and .env configuration
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Database connection OK
echo.
echo Starting server with auto-restart...
echo Press Ctrl+C to stop
echo.

npm run monitor

pause