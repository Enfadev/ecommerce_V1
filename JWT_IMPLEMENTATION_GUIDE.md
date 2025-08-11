# JWT Authentication Implementation Guide

## 🔐 Implementasi Keamanan JWT

Implementasi ini menggantikan sistem autentikasi localStorage dengan JWT yang lebih aman menggunakan httpOnly cookies.

## 📂 File yang Ditambahkan/Dimodifikasi

### 1. JWT Utility (`src/lib/jwt.ts`)
- **Fungsi**: Sign dan verify JWT tokens
- **Fitur**: 
  - Token signing dengan HS256
  - Token verification
  - Cookie management
  - User authentication checks

### 2. Middleware (`middleware.ts`)
- **Fungsi**: Route protection dan API authentication
- **Protected Routes**: `/admin`, `/profile`, `/order-history`
- **Admin Routes**: `/admin` (requires ADMIN role)
- **Protected APIs**: Semua kecuali public endpoints

### 3. Updated API Routes

#### `/api/signin`
- Generate JWT token saat login berhasil
- Set httpOnly cookie dengan token
- Return user data tanpa password

#### `/api/register`
- Generate JWT token saat registrasi berhasil
- Set httpOnly cookie dengan token
- Validasi input yang lebih ketat

#### `/api/logout`
- Clear authentication cookie
- Logout yang aman

#### `/api/profile`
- Get user profile dari JWT token
- Protected endpoint

### 4. Updated Auth Context (`src/components/auth-context.tsx`)
- Menghapus localStorage usage
- Menggunakan httpOnly cookies
- Fetch user profile dari server
- Proper logout implementation

## 🔒 Keamanan yang Diterapkan

### 1. **JWT Tokens**
- HS256 algorithm
- 7 hari expiration
- Signed dengan secret key

### 2. **HttpOnly Cookies**
- Tidak dapat diakses JavaScript client-side
- Secure flag untuk production
- SameSite strict
- Automatic expiration

### 3. **Route Protection**
- Middleware untuk melindungi halaman
- Role-based access control
- Automatic redirect untuk unauthorized access

### 4. **API Security**
- Authentication required untuk protected endpoints
- Admin-only endpoints
- User context injection melalui headers

### 5. **Input Validation**
- Email format validation
- Password strength requirements
- SQL injection protection via Prisma ORM

## 🚀 Cara Penggunaan

### 1. Setup Environment Variables
```bash
# Copy .env.example ke .env.local
cp .env.example .env.local

# Edit .env.local dengan nilai yang sesuai
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
DATABASE_URL="mysql://user:password@localhost:3306/database"
```

### 2. Install Dependencies
```bash
npm install jsonwebtoken @types/jsonwebtoken jose
```

### 3. Run Application
```bash
npm run dev
```

## 🔧 Konfigurasi

### JWT Configuration
- **Secret**: Minimum 32 karakter
- **Expiration**: 7 hari (configurable)
- **Algorithm**: HS256

### Cookie Configuration
- **Name**: `auth-token`
- **HttpOnly**: true
- **Secure**: true (production only)
- **SameSite**: strict
- **Max Age**: 7 hari

## 🛡️ Security Improvements

### Sebelum (localStorage):
- ❌ Token disimpan di localStorage (accessible via JavaScript)
- ❌ Tidak ada expiration handling
- ❌ Vulnerable terhadap XSS attacks
- ❌ Tidak ada route protection
- ❌ API endpoints tidak terproteksi

### Sesudah (JWT + httpOnly cookies):
- ✅ Token disimpan di httpOnly cookies (tidak accessible via JavaScript)
- ✅ Automatic token expiration
- ✅ Protected dari XSS attacks
- ✅ Middleware route protection
- ✅ API endpoints terproteksi
- ✅ Role-based access control
- ✅ Proper session management

## 🔍 Testing

### 1. User Authentication Flow
1. Register/Login → JWT token dibuat dan disimpan di cookie
2. Access protected route → Middleware check token
3. API calls → Automatic token verification
4. Logout → Cookie dihapus

### 2. Admin Access Control
1. Login sebagai admin → Role ADMIN di JWT
2. Access admin route → Middleware check role
3. Admin API access → Role verification

### 3. Security Tests
- Try accessing admin routes tanpa login → Redirect ke signin
- Try accessing admin routes sebagai user → Redirect ke home
- Try accessing protected APIs tanpa token → 401 error
- Token expiration handling → Automatic logout

## 📝 Migration Notes

### Dari localStorage ke JWT:
1. User perlu login ulang (existing localStorage sessions akan invalid)
2. Role format berubah dari "admin"/"user" ke "ADMIN"/"USER"
3. User ID format konsisten sebagai string
4. Automatic session persistence via cookies

## 🚨 Security Checklist

- [x] JWT secret key yang kuat (>32 karakter)
- [x] HttpOnly cookies untuk token storage
- [x] Secure cookies untuk production
- [x] Route protection via middleware
- [x] API authentication
- [x] Role-based access control
- [x] Input validation
- [x] Password hashing dengan bcrypt (rounds: 12)
- [x] SQL injection protection via Prisma ORM
- [x] Proper error handling tanpa information leakage

## 🔄 Next Steps (Optional Improvements)

1. **Rate Limiting**: Implement rate limiting untuk API endpoints
2. **Refresh Tokens**: Implement refresh token mechanism
3. **Session Management**: Track active sessions
4. **Audit Logging**: Log authentication events
5. **2FA**: Two-factor authentication
6. **Password Policies**: Enforce stronger password policies
7. **Account Lockout**: Implement account lockout after failed attempts
