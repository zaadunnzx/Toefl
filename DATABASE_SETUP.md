# Setup PostgreSQL Database

## Panduan Instalasi PostgreSQL

### 1. Install PostgreSQL di Windows

1. **Download PostgreSQL**: 
   - Kunjungi https://www.postgresql.org/download/windows/
   - Download PostgreSQL installer untuk Windows

2. **Install PostgreSQL**:
   - Jalankan installer
   - Ikuti wizard instalasi
   - **Catat password untuk user 'postgres'** yang Anda buat

3. **Verifikasi Instalasi**:
   ```powershell
   psql --version
   ```

### 2. Membuat Database

1. **Buka Command Prompt atau PowerShell**

2. **Login ke PostgreSQL**:
   ```powershell
   psql -U postgres -h localhost
   ```
   
3. **Buat Database**:
   ```sql
   CREATE DATABASE whatsapp_numbers_db;
   ```
   
4. **Keluar dari psql**:
   ```sql
   \q
   ```

### 3. Konfigurasi Environment

1. **Copy file .env.example ke .env**:
   ```powershell
   copy .env.example .env
   ```

2. **Edit file .env** dan sesuaikan dengan setting PostgreSQL Anda:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=whatsapp_numbers_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here
   ```

### 4. Setup Database Tables

```powershell
npm run setup
```

### 5. Jalankan Server

```powershell
npm run dev
```

## Troubleshooting

### Error: password authentication failed
- Pastikan password di file `.env` benar
- Pastikan PostgreSQL service berjalan
- Coba reset password PostgreSQL

### Error: database does not exist
- Buat database manual menggunakan psql
- Atau gunakan pgAdmin

### Error: connection refused
- Pastikan PostgreSQL service berjalan
- Check port 5432 tidak digunakan aplikasi lain

## Alternative: Menggunakan Docker (Optional)

Jika Anda menggunakan Docker:

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: whatsapp_numbers_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Jalankan dengan:
```powershell
docker-compose up -d
```
