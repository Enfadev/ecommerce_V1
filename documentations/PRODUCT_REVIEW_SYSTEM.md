# Product Review System Implementation

## Overview
Sistem review produk yang terintegrasi dengan database yang memvalidasi pembelian pengguna dan mendukung opsi review anonim.

## Features Implemented

### 1. Database Schema
- **ProductReview Model**: Tabel untuk menyimpan review produk
  - `id`: Primary key
  - `productId`: Foreign key ke tabel Product
  - `userId`: Foreign key ke tabel User
  - `orderId`: Foreign key ke tabel Order (untuk validasi pembelian)
  - `rating`: Rating 1-5 bintang
  - `comment`: Komentar review
  - `isAnonymous`: Flag untuk review anonim
  - `isVerified`: Flag untuk pembelian terverifikasi
  - `helpfulCount`: Jumlah helpful votes (untuk future enhancement)
  - `createdAt`, `updatedAt`: Timestamps

### 2. API Endpoints

#### `/api/review` - GET & POST
- **GET**: Mengambil semua review untuk produk tertentu
- **POST**: Membuat review baru dengan validasi:
  - User harus login
  - User harus sudah membeli produk tersebut
  - Order harus berstatus "DELIVERED"
  - User belum pernah review produk dari order yang sama

#### `/api/review/eligible-orders` - GET
- Mengambil daftar order yang memenuhi syarat untuk review
- Filter order yang sudah "DELIVERED" dan belum di-review

#### `/api/review/stats` - GET
- Mengambil statistik review: rata-rata rating, total review, distribusi rating

### 3. UI Components

#### `ProductReviewSection.tsx`
- Komponen utama untuk menampilkan sistem review
- Terintegrasi dengan authentication
- Menampilkan form review hanya untuk user yang sudah membeli

#### `ProductReviewStats.tsx`
- Menampilkan statistik review
- Rating rata-rata dengan bintang
- Distribusi rating dalam bentuk bar chart

#### Review Form Features:
- **Order Selection**: Dropdown untuk memilih order yang memenuhi syarat
- **Star Rating**: Input rating 1-5 bintang
- **Comment**: Text area untuk komentar
- **Anonymous Option**: Checkbox untuk posting anonim
- **Validation**: Validasi form dan server-side

#### Review Display Features:
- **Verified Purchase Badge**: Menampilkan badge "Verified Purchase"
- **Anonymous Indicator**: Indikator untuk review anonim
- **Order Information**: Menampilkan nomor order
- **Rating Display**: Bintang rating
- **Timestamp**: Waktu review dibuat

### 4. Security & Validation

#### Server-side Validation:
- Authentication check menggunakan NextAuth session
- Verification bahwa user sudah membeli produk
- Check order status harus "DELIVERED"
- Prevent duplicate review untuk order yang sama
- Input validation untuk rating dan comment

#### Client-side Validation:
- Form validation sebelum submit
- Loading states dan error handling
- Conditional rendering berdasarkan login status

### 5. Database Relations
```prisma
User -> ProductReview (One to Many)
Product -> ProductReview (One to Many)  
Order -> ProductReview (One to Many)
```

## Usage

### 1. Menggunakan Review Component
```tsx
import ProductReviewSection from "@/components/product/ProductReviewSection";

// Di halaman detail produk
<ProductReviewSection productId={product.id} />
```

### 2. Menggunakan Review Stats Component
```tsx
import ProductReviewStats from "@/components/product/ProductReviewStats";

// Untuk menampilkan statistik saja
<ProductReviewStats productId={product.id} />
```

### 3. API Usage
```javascript
// Get reviews
const reviews = await fetch(`/api/review?productId=${productId}`);

// Submit review
const review = await fetch(`/api/review?productId=${productId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    rating: 5,
    comment: 'Great product!',
    isAnonymous: false,
    orderId: 123
  })
});

// Get eligible orders
const orders = await fetch(`/api/review/eligible-orders?productId=${productId}`);

// Get review statistics
const stats = await fetch(`/api/review/stats?productId=${productId}`);
```

## Business Rules

1. **Only Verified Purchasers Can Review**
   - User harus login
   - User harus punya order dengan status "DELIVERED"
   - Order harus mengandung produk yang akan di-review

2. **One Review Per Product Per Order**
   - User tidak bisa review produk yang sama dari order yang sama lebih dari sekali
   - User bisa review produk yang sama jika membeli di order berbeda

3. **Anonymous Reviews**
   - User bisa pilih untuk posting review secara anonim
   - Review tetap tersimpan dengan user ID untuk tracking
   - Nama user tidak ditampilkan jika anonymous

4. **Review Verification**
   - Semua review ditandai sebagai "Verified Purchase"
   - Badge "Verified Purchase" ditampilkan di review

## Database Migration
Jalankan migration untuk membuat tabel review:
```bash
npx prisma migrate dev --name "add-product-reviews"
npx prisma generate
```

## Future Enhancements
1. Helpful/Unhelpful votes untuk review
2. Review filtering dan sorting
3. Image upload untuk review
4. Reply to review (dari seller)
5. Review moderation system
6. Review summary dengan pros/cons
7. Email notification untuk review baru
