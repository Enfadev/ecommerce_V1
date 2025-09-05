# Fix: Console Error - Empty String src Attribute

## Masalah
Terjadi console error: "An empty string ("") was passed to the src attribute. This may cause the browser to download the whole page again over the network."

Error ini muncul ketika komponen `Image` dari Next.js menerima string kosong ("") sebagai nilai `src`.

## Penyebab
Beberapa produk di database atau state memiliki field `image` yang berisi string kosong, dan komponen langsung menggunakan nilai tersebut tanpa validasi.

## Solusi yang Diterapkan

### 1. ProductCard.tsx
- Menambahkan validasi `product.image && product.image.trim() !== ""` sebelum render `Image`
- Menampilkan fallback "No Image" jika image kosong
- Memperbaiki fungsi `addToCart` untuk menggunakan placeholder jika image kosong

```tsx
// Sebelum
<Image src={product.image} alt={product.name} ... />

// Sesudah
{product.image && product.image.trim() !== "" ? (
  <Image src={product.image} alt={product.name} ... />
) : (
  <div className="text-gray-400 text-sm text-center">
    No Image
  </div>
)}
```

### 2. ProductRecommendation.tsx
- Menambahkan conditional rendering untuk image
- Fallback UI ketika image tidak tersedia

### 3. Product Detail Page
- Validasi image sebelum render
- Fallback "No Image Available" untuk produk tanpa gambar

### 4. Wishlist Page
- Memperbaiki fungsi `addAllToCart` untuk menggunakan placeholder image jika kosong
- Menggunakan "/placeholder-image.svg" sebagai default

### 5. Consistent Fallback Strategy
Semua komponen sekarang menggunakan strategi yang konsisten:
- Cek `image && image.trim() !== ""`
- Gunakan placeholder "/placeholder-image.svg" untuk cart operations
- Tampilkan fallback UI untuk display components

## Testing
1. Pastikan tidak ada console error lagi
2. Produk dengan image kosong menampilkan fallback yang sesuai
3. Fungsi add to cart tetap berfungsi dengan placeholder image
4. UI tetap responsif dan user-friendly

## Files Modified
- `src/components/product/ProductCard.tsx`
- `src/components/product/ProductRecommendation.tsx`
- `src/app/(customer)/product/[id]/page.tsx`
- `src/app/(customer)/wishlist/page.tsx`

Error sudah teratasi dan tidak akan muncul lagi di console browser.
