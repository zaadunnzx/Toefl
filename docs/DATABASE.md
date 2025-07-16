# 🗄️ Database Schema Documentation

## Database Overview
- **Database Name**: `wa_db`
- **Database Engine**: PostgreSQL 15.x
- **ORM**: Sequelize 6.x
- **Connection Pool**: 5 max connections

## Tables Structure

### 1. Categories Table
Stores category information for organizing phone numbers.

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Columns Description
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique category identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Category name |
| `description` | TEXT | NULL | Category description |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Record last update timestamp |

#### Indexes
```sql
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_created_at ON categories(created_at);
```

#### Sample Data
```sql
INSERT INTO categories (name, description) VALUES 
('Pelanggan VIP', 'Pelanggan dengan tingkat prioritas tinggi'),
('Pelanggan VIP 2', 'Pelanggan dengan tingkat prioritas tinggi level 2'),
('Pelanggan Regular', 'Pelanggan dengan tingkat prioritas standar'),
('Prospek', 'Calon pelanggan yang berpotensi'),
('Lead', 'Calon pelanggan yang sudah menunjukkan minat');
```

---

### 2. Phone Numbers Table
Stores phone number information with category relationships.

```sql
CREATE TABLE phone_numbers (
    id SERIAL PRIMARY KEY,
    original_number VARCHAR(50) NOT NULL,
    normalized_number VARCHAR(20) NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_phone_numbers_category 
        FOREIGN KEY (category_id) 
        REFERENCES categories(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
);
```

#### Columns Description
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique phone number identifier |
| `original_number` | VARCHAR(50) | NOT NULL | Original phone number as entered |
| `normalized_number` | VARCHAR(20) | NOT NULL, UNIQUE | Normalized international format |
| `category_id` | INTEGER | NOT NULL, FOREIGN KEY | Reference to categories table |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Record last update timestamp |

#### Indexes
```sql
CREATE INDEX idx_phone_numbers_normalized ON phone_numbers(normalized_number);
CREATE INDEX idx_phone_numbers_category_id ON phone_numbers(category_id);
CREATE INDEX idx_phone_numbers_created_at ON phone_numbers(created_at);
```

#### Constraints
```sql
-- Foreign Key Constraint
ALTER TABLE phone_numbers 
ADD CONSTRAINT fk_phone_numbers_category 
FOREIGN KEY (category_id) REFERENCES categories(id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- Unique Constraint
ALTER TABLE phone_numbers 
ADD CONSTRAINT uk_phone_numbers_normalized 
UNIQUE (normalized_number);
```

---

## Database Relationships

### Entity Relationship Diagram
```
┌─────────────────┐         ┌─────────────────┐
│   Categories    │         │  Phone Numbers  │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄────────┤ id (PK)         │
│ name            │   1:N   │ original_number │
│ description     │         │ normalized_num  │
│ created_at      │         │ category_id(FK) │
│ updated_at      │         │ created_at      │
└─────────────────┘         │ updated_at      │
                            └─────────────────┘
```

### Relationship Details
- **One-to-Many**: One category can have many phone numbers
- **Foreign Key**: `phone_numbers.category_id` → `categories.id`
- **Cascade Actions**: 
  - `ON DELETE CASCADE`: Delete phone numbers when category is deleted
  - `ON UPDATE CASCADE`: Update phone numbers when category ID changes

---

## Database Operations

### Common Queries

#### Get All Phone Numbers with Categories
```sql
SELECT 
    pn.id,
    pn.original_number,
    pn.normalized_number,
    pn.created_at,
    c.name as category_name,
    c.description as category_description
FROM phone_numbers pn
LEFT JOIN categories c ON pn.category_id = c.id
ORDER BY pn.created_at DESC;
```

#### Get Category Statistics
```sql
SELECT 
    c.id,
    c.name,
    c.description,
    COUNT(pn.id) as phone_count
FROM categories c
LEFT JOIN phone_numbers pn ON c.id = pn.category_id
GROUP BY c.id, c.name, c.description
ORDER BY phone_count DESC;
```

#### Search Phone Numbers
```sql
SELECT 
    pn.id,
    pn.original_number,
    pn.normalized_number,
    c.name as category_name
FROM phone_numbers pn
LEFT JOIN categories c ON pn.category_id = c.id
WHERE 
    pn.original_number ILIKE '%search_term%' OR
    pn.normalized_number ILIKE '%search_term%' OR
    c.name ILIKE '%search_term%'
ORDER BY pn.created_at DESC;
```

#### Check for Duplicate Numbers
```sql
SELECT 
    id,
    original_number,
    normalized_number,
    category_id
FROM phone_numbers 
WHERE normalized_number = '+628134321695';
```

---

## Data Validation Rules

### Categories
- `name`: Required, 1-100 characters, must be unique
- `description`: Optional, max 65535 characters

### Phone Numbers
- `original_number`: Required, max 50 characters
- `normalized_number`: Required, max 20 characters, must be unique
- `category_id`: Required, must exist in categories table

### Phone Number Normalization
Before storing, phone numbers are normalized using these rules:

1. **Remove formatting characters**: spaces, dashes, parentheses, dots
2. **Handle Indonesian numbers**:
   - `08xxxxxxxxx` → `+628xxxxxxxxx`
   - `8xxxxxxxxx` → `+628xxxxxxxxx`
   - `62xxxxxxxxx` → `+62xxxxxxxxx`
3. **Validate format**: Must match `^\+\d{8,15}$`

---

## Performance Optimization

### Index Strategy
```sql
-- Primary indexes (automatically created)
CREATE INDEX idx_categories_pkey ON categories(id);
CREATE INDEX idx_phone_numbers_pkey ON phone_numbers(id);

-- Search optimization
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_phone_numbers_normalized ON phone_numbers(normalized_number);
CREATE INDEX idx_phone_numbers_original ON phone_numbers(original_number);

-- Foreign key optimization
CREATE INDEX idx_phone_numbers_category_id ON phone_numbers(category_id);

-- Time-based queries
CREATE INDEX idx_categories_created_at ON categories(created_at);
CREATE INDEX idx_phone_numbers_created_at ON phone_numbers(created_at);

-- Composite indexes for complex queries
CREATE INDEX idx_phone_numbers_category_created 
ON phone_numbers(category_id, created_at DESC);
```

### Query Optimization Tips
1. **Use normalized_number for duplicate checks** - it's indexed and unique
2. **Filter by category_id first** - it's indexed and reduces result set
3. **Use LIMIT for large datasets** - prevents memory issues
4. **Consider partitioning** - for very large datasets (>1M records)

---

## Backup and Recovery

### Database Backup
```bash
# Full database backup
pg_dump -h localhost -U postgres -d wa_db > backup_$(date +%Y%m%d).sql

# Schema only backup
pg_dump -h localhost -U postgres -d wa_db --schema-only > schema_backup.sql

# Data only backup
pg_dump -h localhost -U postgres -d wa_db --data-only > data_backup.sql
```

### Database Restore
```bash
# Restore full database
psql -h localhost -U postgres -d wa_db < backup_20240101.sql

# Restore specific table
pg_restore -h localhost -U postgres -d wa_db -t phone_numbers backup.sql
```

---

## Migration Scripts

### Initial Migration
```sql
-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create phone_numbers table
CREATE TABLE phone_numbers (
    id SERIAL PRIMARY KEY,
    original_number VARCHAR(50) NOT NULL,
    normalized_number VARCHAR(20) NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_phone_numbers_category 
        FOREIGN KEY (category_id) 
        REFERENCES categories(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_phone_numbers_normalized ON phone_numbers(normalized_number);
CREATE INDEX idx_phone_numbers_category_id ON phone_numbers(category_id);
CREATE INDEX idx_phone_numbers_created_at ON phone_numbers(created_at);
```

### Seed Data Migration
```sql
-- Insert default categories
INSERT INTO categories (name, description) VALUES 
('Pelanggan VIP', 'Pelanggan dengan tingkat prioritas tinggi'),
('Pelanggan VIP 2', 'Pelanggan dengan tingkat prioritas tinggi level 2'),
('Pelanggan Regular', 'Pelanggan dengan tingkat prioritas standar'),
('Prospek', 'Calon pelanggan yang berpotensi'),
('Lead', 'Calon pelanggan yang sudah menunjukkan minat');
```

---

## Database Monitoring

### Key Metrics to Monitor
- **Connection count**: Should not exceed pool size
- **Query performance**: Slow queries > 1 second
- **Table sizes**: Monitor growth rate
- **Index usage**: Ensure indexes are being used

### Useful Monitoring Queries
```sql
-- Check table sizes
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
WHERE mean_time > 1000
ORDER BY mean_time DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## Security Considerations

### Database Security
- **Use strong passwords** for database users
- **Limit database access** to specific IPs
- **Regular security updates** for PostgreSQL
- **Monitor database logs** for suspicious activity

### Application Security
- **Input validation** before database queries
- **Parameterized queries** to prevent SQL injection
- **Connection pooling** to prevent connection exhaustion
- **Rate limiting** for API endpoints

### Data Privacy
- **Phone number encryption** (optional for sensitive data)
- **Audit logging** for data access
- **Data retention policies** for old records
- **GDPR compliance** for European users