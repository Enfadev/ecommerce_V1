# Wishlist Database Integration

## Perubahan yang Dilakukan

Wishlist sekarang sudah terintegrasi dengan database dan terisolasi per user, tidak lagi menggunakan localStorage yang dapat menyebabkan data tercampur antar user.

### 1. Database Schema (Prisma)

Menambahkan model baru di `prisma/schema.prisma`:

```prisma
model Wishlist {
  id        Int            @id @default(autoincrement())
  userId    Int            @unique
  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     WishlistItem[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
}

model WishlistItem {
  id         Int      @id @default(autoincrement())
  wishlistId Int
  wishlist   Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  productId  Int
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([wishlistId, productId])
}
```

### 2. API Endpoints

Dibuat API endpoints baru:

#### GET /api/wishlist
- Mengambil wishlist user yang sedang login
- Auto-create wishlist jika belum ada
- Return format sesuai dengan frontend expectations

#### POST /api/wishlist
- Menambahkan produk ke wishlist
- Validasi produk exists
- Prevent duplicate items
- Block admin users

#### DELETE /api/wishlist
- Menghapus produk dari wishlist
- Validasi ownership

#### DELETE /api/wishlist/clear
- Menghapus semua items dari wishlist user

### 3. Context Update

Wishlist context (`src/components/contexts/wishlist-context.tsx`) diupdate:

- Menggunakan database API calls instead of localStorage
- Auto-migration dari localStorage ke database (one-time)
- Proper error handling dengan toast notifications
- Loading state untuk better UX
- Authentication requirement

### 4. Fitur Utama

#### User Isolation
- Setiap user memiliki wishlist terpisah
- Data tidak tercampur antar akun
- Admin users diblok dari menggunakan wishlist

#### Data Migration
- Otomatis memindahkan data dari localStorage ke database
- Satu kali saja per user
- Clean up localStorage setelah migrasi

#### Error Handling
- Proper API error responses
- Toast notifications untuk user feedback
- Fallback handling jika API gagal

### 5. Security

- Authentication required untuk semua operations
- User dapat hanya mengakses wishlist mereka sendiri
- Admin users diblok dari fitur wishlist
- Input validation dan sanitization

## Cara Testing

1. Login dengan user berbeda
2. Tambahkan produk ke wishlist
3. Logout dan login dengan user lain
4. Verify wishlist terpisah per user
5. Test semua operasi CRUD (add, remove, clear)

## Migration Process

Untuk user existing:
1. Data localStorage akan otomatis dipindah ke database saat pertama kali load
2. localStorage akan dibersihkan setelah migrasi berhasil
3. Selanjutnya semua operasi menggunakan database

Pastikan sudah run:
```bash
npx prisma db push
npx prisma generate
```
