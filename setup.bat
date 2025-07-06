@echo off
echo ========================================
echo WhatsApp Numbers Management Setup
echo ========================================

echo.
echo 1. Installing dependencies...
call npm install

echo.
echo 2. Creating database tables and seeding categories...
call npm run seed

echo.
echo 3. Starting the server...
call npm start

pause