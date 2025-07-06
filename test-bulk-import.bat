@echo off
echo ========================================
echo WhatsApp Numbers Management - BULK IMPORT TEST
echo ========================================

echo.
echo 1. Installing dependencies...
call npm install

echo.
echo 2. Seeding categories...
call npm run seed

echo.
echo 3. Testing bulk import functionality...
call npm run test-bulk

echo.
echo 4. If bulk import works, starting the server...
call npm start