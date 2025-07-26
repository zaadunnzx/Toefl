-- Supabase Database Schema Setup
-- Run this in Supabase SQL Editor

-- Create Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Phone Numbers table
CREATE TABLE phone_numbers (
  id SERIAL PRIMARY KEY,
  original_number VARCHAR(50) NOT NULL,
  normalized_number VARCHAR(20) NOT NULL UNIQUE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_phone_numbers_category_id ON phone_numbers(category_id);
CREATE INDEX idx_phone_numbers_normalized ON phone_numbers(normalized_number);
CREATE INDEX idx_categories_name ON categories(name);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Pelanggan VIP', 'Pelanggan dengan tingkat prioritas tinggi'),
('Pelanggan VIP 2', 'Pelanggan dengan tingkat prioritas tinggi level 2'),
('Pelanggan Regular', 'Pelanggan dengan tingkat prioritas standar'),
('Prospek', 'Calon pelanggan yang berpotensi'),
('Lead', 'Calon pelanggan yang sudah menunjukkan minat');

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now)
CREATE POLICY "Allow all operations on categories" ON categories 
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on phone_numbers" ON phone_numbers 
FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phone_numbers_updated_at 
    BEFORE UPDATE ON phone_numbers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
