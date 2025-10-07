# Setup Google OAuth Login

Fitur login dengan Google telah berhasil diimplementasikan. Untuk mengaktifkannya, ikuti langkah-langkah berikut:

## 1. Setup Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Aktifkan Google+ API atau Google Identity API
4. Buka **Credentials** di menu sidebar
5. Klik **Create Credentials** > **OAuth 2.0 Client IDs**
6. Pilih **Web application**
7. Tambahkan authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

## 2. Konfigurasi Environment Variables

Update file `.env` dengan credentials Google OAuth:

```bash
# MySQL Database Configuration (Laragon)
DATABASE_URL="mysql://root:@localhost:3306/ecommerce_db_v1"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"

# NextAuth Secret (generate dengan: openssl rand -base64 32)
NEXTAUTH_SECRET="your-nextauth-secret-key-min-32-chars-long"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-for-development-min-32-chars"
JWT_EXPIRES_IN="7d"

# Security
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"

# Application
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
```

**Note**: File `.env.local` telah dihapus untuk menghindari duplikasi. Next.js sekarang hanya memuat file `.env` yang telah disatukan.

### Prioritas File Environment di Next.js:
1. `.env.local` (prioritas tertinggi - dihapus)
2. `.env.development`/`.env.production` (berdasarkan NODE_ENV)
3. `.env` (file utama yang kita gunakan)
4. `.env.example` (template, tidak dimuat)

Dengan menghapus `.env.local`, konfigurasi menjadi lebih sederhana dan terpusat di `.env`.

## 3. Database Migration

Jalankan migrasi database untuk menambahkan tabel NextAuth:

```bash
npx prisma db push
```

## 4. Fitur yang Telah Diimplementasikan

- ✅ Google OAuth Provider
- ✅ NextAuth.js integration
- ✅ Database sessions dengan Prisma
- ✅ Google Sign In button di halaman login
- ✅ Automatic user creation saat login pertama
- ✅ Role-based access (default: USER)
- ✅ Integration dengan existing auth context
- ✅ Logout dari Google session

## 5. Cara Kerja

1. User klik tombol "Continue with Google"
2. Redirect ke Google OAuth
3. Setelah authorize, user diarahkan kembali ke aplikasi
4. NextAuth.js membuat/update user di database
5. Session tersimpan di database
6. User masuk ke dashboard

## 6. Testing

1. Pastikan server berjalan: `npm run dev`
2. Buka `http://localhost:3000/signin`
3. Klik tombol "Continue with Google"
4. Login dengan akun Google
5. Seharusnya redirect ke homepage dengan user ter-login

## 7. Troubleshooting

### Error: invalid_client
- Pastikan GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET benar
- Cek authorized redirect URIs di Google Console

### Error: redirect_uri_mismatch
- Pastikan redirect URI di Google Console match dengan yang digunakan aplikasi
- Format: `http://localhost:3000/api/auth/callback/google`

### Database Error
- Pastikan koneksi database berfungsi
- Jalankan `npx prisma db push` untuk update schema

## 8. Customization

Untuk mengubah redirect setelah login, edit `GoogleSignInButton.tsx`:

```tsx
signIn("google", { 
  callbackUrl: "/dashboard" // Ubah sesuai kebutuhan
});
```

## 9. Production Deployment

1. Update NEXTAUTH_URL di production environment
2. Tambahkan production domain ke authorized redirect URIs
3. Pastikan NEXTAUTH_SECRET aman dan unik
4. Update CORS settings jika diperlukan
5. Ganti DATABASE_URL dengan production database
6. Set NODE_ENV="production"

**Note**: Untuk production, disarankan menggunakan environment variables di hosting platform daripada file `.env` untuk keamanan.
