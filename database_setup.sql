-- WhatsApp Numbers Database Setup Script
-- Run this script to set up the database for the WhatsApp Numbers Management System

-- Connect to PostgreSQL as superuser first:
-- psql -U postgres

-- Create the database
CREATE DATABASE wa_db;

-- Connect to the new database
\c wa_db;

-- Create tables (Sequelize will handle this automatically, but here's the structure for reference)

-- Categories table
CREATE TABLE IF NOT EXISTS "Categories" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Phone Numbers table
CREATE TABLE IF NOT EXISTS "PhoneNumbers" (
    "id" SERIAL PRIMARY KEY,
    "original_number" VARCHAR(50) NOT NULL,
    "normalized_number" VARCHAR(50) NOT NULL UNIQUE,
    "category_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE CASCADE
);

-- Insert sample categories
INSERT INTO "Categories" ("name", "description", "createdAt", "updatedAt") VALUES
('Pelanggan', 'Nomor pelanggan aktif', NOW(), NOW()),
('Prospek', 'Calon pelanggan potensial', NOW(), NOW()),
('Vendor', 'Nomor vendor dan supplier', NOW(), NOW()),
('Tim Internal', 'Nomor tim internal perusahaan', NOW(), NOW())
ON CONFLICT ("name") DO NOTHING;

-- Insert sample phone numbers
INSERT INTO "PhoneNumbers" ("original_number", "normalized_number", "category_id", "createdAt", "updatedAt") VALUES
('+6285476387234', '+6285476387234', 1, NOW(), NOW()),
('+ 62-865-453-765', '+62865453765', 2, NOW(), NOW()),
('08123456789', '+62123456789', 1, NOW(), NOW()),
('+1234567890', '+1234567890', 3, NOW(), NOW())
ON CONFLICT ("normalized_number") DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_phone_numbers_category_id" ON "PhoneNumbers"("category_id");
CREATE INDEX IF NOT EXISTS "idx_phone_numbers_normalized" ON "PhoneNumbers"("normalized_number");
CREATE INDEX IF NOT EXISTS "idx_categories_name" ON "Categories"("name");

-- Display inserted data
SELECT 'Categories:' as info;
SELECT * FROM "Categories";

SELECT 'Phone Numbers:' as info;
SELECT pn.*, c.name as category_name 
FROM "PhoneNumbers" pn 
JOIN "Categories" c ON pn.category_id = c.id;

-- Success message
SELECT 'Database setup completed successfully!' as result;