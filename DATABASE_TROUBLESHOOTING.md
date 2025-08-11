# Database Troubleshooting Guide

## 🚨 MySQL Authentication Plugin Error

Jika Anda mengalami error `Unknown authentication plugin 'sha256_password'`, ini disebabkan oleh perbedaan plugin autentikasi MySQL.

### Penyebab
- MySQL 8.0+ menggunakan `caching_sha2_password` sebagai default
- Versi client/driver mungkin hanya mendukung `mysql_native_password`

### ✅ Solusi 1: Update Connection String
Tambahkan parameter `authPlugin` ke DATABASE_URL:

```env
DATABASE_URL="mysql://root@localhost:3306/ecommerce_db_v1?authPlugin=mysql_native_password"
```

### ✅ Solusi 2: Update User MySQL
Login ke MySQL dan ubah plugin autentikasi user:

```sql
-- Login sebagai root
mysql -u root -p

-- Ubah plugin autentikasi untuk user
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';

-- Atau buat user baru dengan plugin yang tepat
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce_db_v1.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

### ✅ Solusi 3: Update MySQL Configuration
Edit file konfigurasi MySQL (`my.cnf` atau `my.ini`):

```ini
[mysqld]
default-authentication-plugin=mysql_native_password
```

Restart MySQL service setelah perubahan.

### ✅ Solusi 4: Regenerate Prisma Client
```bash
npx prisma generate
npx prisma db push
```

## 🧪 Testing JWT Tanpa Database

Jika masalah database masih persist, Anda bisa test implementasi JWT menggunakan:

### 1. Halaman Test JWT
Kunjungi: `http://localhost:3000/jwt-test`

Test accounts:
- **Admin**: admin@test.com / admin123
- **User**: user@test.com / user123

### 2. API Endpoints Development
- `POST /api/signin-dev` - Login dengan mock data
- `GET /api/profile-dev` - Get profile dengan JWT

### 3. Manual Testing Steps
1. **Test Login**:
   ```bash
   curl -X POST http://localhost:3000/api/signin-dev \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@test.com","password":"admin123"}' \
     -c cookies.txt
   ```

2. **Test Protected Route**:
   ```bash
   curl http://localhost:3000/api/profile-dev \
     -b cookies.txt
   ```

3. **Test Logout**:
   ```bash
   curl -X POST http://localhost:3000/api/logout \
     -b cookies.txt \
     -c cookies.txt
   ```

## 🔧 Database Setup (Jika Diperlukan)

### 1. Install MySQL
- Windows: Download dari https://dev.mysql.com/downloads/installer/
- macOS: `brew install mysql`
- Linux: `sudo apt install mysql-server`

### 2. Create Database
```sql
CREATE DATABASE ecommerce_db_v1;
USE ecommerce_db_v1;
```

### 3. Run Prisma Migrations
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

## 🏃‍♂️ Quick Start (Skip Database)

Untuk testing JWT langsung tanpa setup database:

1. **Start application**:
   ```bash
   npm run dev
   ```

2. **Open test page**:
   ```
   http://localhost:3000/jwt-test
   ```

3. **Test authentication flow**:
   - Login dengan test accounts
   - Check browser cookies (auth-token should be httpOnly)
   - Test protected routes
   - Test logout

## 🔍 Verifikasi JWT Implementation

### 1. Browser Developer Tools
1. Open DevTools (F12)
2. Go to Application > Cookies
3. Check for `auth-token` cookie with HttpOnly flag

### 2. Network Tab
1. Monitor login request
2. Check Set-Cookie header
3. Verify subsequent requests include cookie

### 3. Manual Cookie Check
```javascript
// This should return undefined (httpOnly protection)
document.cookie.includes('auth-token')
```

## 📝 Production Checklist

Sebelum production, pastikan:

- [x] Database connection working
- [x] JWT_SECRET set (minimum 32 characters)
- [x] HTTPS enabled for secure cookies
- [x] Environment variables configured
- [x] Prisma migrations run
- [x] Error logging configured
