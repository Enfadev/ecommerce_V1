# Home Carousel Upload System

## 📌 Ringkasan

Sistem carousel homepage sekarang menggunakan **upload langsung**, bukan lagi input URL manual. Image akan otomatis dioptimasi dan disimpan di server.

## ✨ Fitur Utama

### 1. Direct File Upload

- Upload image langsung dari admin panel
- Drag & drop atau pilih file
- Real-time preview setelah upload

### 2. Auto Image Optimization

- **Auto resize**: 1920x1080px (16:9 aspect ratio)
- **Format conversion**: Otomatis convert ke WebP
- **Quality**: 85% (balance antara size dan quality)
- **Fit**: Cover (auto crop untuk aspect ratio)

### 3. Validation & Security

- **File type**: Only JPEG, PNG, WebP
- **File size**: Max 5MB per file
- **Filename**: Auto sanitization + random string
- **Error handling**: User-friendly error messages

### 4. Storage Management

- **Location**: `/public/uploads/carousel/`
- **Delete**: Hapus dari server saat tidak dipakai
- **Auto cleanup**: Slides tanpa image dihapus otomatis

## 🗂️ File Changes

### 1. New API: `/src/app/api/upload-carousel/route.ts`

```typescript
// POST - Upload carousel image
POST /api/upload-carousel
Content-Type: multipart/form-data
Body: { file: File }

Response: {
  url: "/uploads/carousel/carousel-123456789-x7k9m2-hero.webp",
  message: "Carousel image uploaded successfully"
}

// DELETE - Remove carousel image
DELETE /api/upload-carousel
Content-Type: application/json
Body: { imageUrl: "/uploads/carousel/..." }

Response: {
  message: "Image deleted successfully"
}
```

**Features:**

- Sharp library untuk image processing
- Auto create directory jika belum ada
- Filename format: `carousel-[timestamp]-[random]-[name].webp`
- Error handling untuk file operations

### 2. Updated: `/src/components/admin/AdminHomePageEditor.tsx`

**New Functions:**

```typescript
handleImageUpload(index, file)
- Upload file ke API
- Update state dengan URL hasil upload
- Show loading state
- Error handling

handleDeleteImage(index, imageUrl)
- Delete image dari server
- Clear imageUrl dari state
- Show success/error toast
```

**New UI Components:**

- File input untuk upload
- Upload progress indicator
- Remove image button
- File specs info (max size, format, etc)

**Validation:**

- Minimal 1 carousel image saat save
- Auto remove slides tanpa image
- File type dan size validation

### 3. Updated: `/src/app/(customer)/page.tsx`

- Tetap sama, hanya menggunakan imageUrl yang di-upload
- Conditional navigation (arrows/dots hanya jika >1 slide)

## 📖 Cara Menggunakan

### Di Admin Panel

1. **Login** sebagai admin
2. Buka menu **Dashboard > Home Page Editor**
3. Scroll ke **Hero Carousel Slides**

#### Menambah Slide Baru

1. Klik **"Add Slide"** button
2. Klik **"Choose File"** di input file
3. Pilih image dari komputer (JPEG/PNG/WebP, max 5MB)
4. Wait sampai upload selesai (ada loading indicator)
5. Preview akan muncul otomatis
6. Isi **Alt Text** (recommended untuk SEO)
7. Ulangi untuk slide berikutnya (unlimited)

#### Menghapus Image

1. Klik **"Remove Image"** di bawah preview
2. Image akan dihapus dari server
3. Slide akan kosong (bisa upload ulang atau hapus slide)

#### Menghapus Slide

1. Klik **trash icon** di header slide
2. Slide akan dihapus (tidak bisa jika hanya 1 slide dengan image)

#### Save Changes

1. Klik **"Save Changes"** di atas
2. Slides tanpa image akan auto dihapus
3. Minimal harus ada 1 image untuk bisa save

## 🎨 Image Specifications

### Accepted Formats

- ✅ JPEG / JPG
- ✅ PNG
- ✅ WebP

### File Size

- **Maximum**: 5MB
- **Recommended**: < 2MB untuk upload lebih cepat

### Dimensions

- **Input**: Any size (akan di-resize otomatis)
- **Output**: 1920x1080px (16:9)
- **Recommended**: Upload dengan ratio 16:9 untuk hasil terbaik

### Optimization

- Auto convert ke WebP (compression terbaik)
- Quality 85% (balance size vs quality)
- Cover fit (auto crop jika ratio berbeda)

## 📁 Storage Structure

```
public/
  uploads/
    carousel/
      carousel-1699702345678-x7k9m2-hero-banner.webp
      carousel-1699702456789-a3n5p8-flash-sale.webp
      carousel-1699702567890-b4q6r9-promo.webp
```

**Filename Format:**

```
carousel-[timestamp]-[random-9-chars]-[sanitized-name].webp
```

- `timestamp`: Untuk uniqueness
- `random`: Extra security
- `sanitized-name`: Nama file original (cleaned)
- `.webp`: Format final

## ⚠️ Important Notes

### 1. Minimum Requirement

- **Minimal 1 carousel image** harus ada
- Tidak bisa save jika semua slides kosong
- Validation error akan muncul

### 2. Image Deletion

- Hapus image via "Remove Image" button akan delete dari server
- Hapus slide akan delete image jika ada
- Old images tidak otomatis deleted saat update

### 3. Performance

- WebP format = smaller file size
- Auto optimization = faster page load
- Recommended max 5 carousel images untuk performa optimal

### 4. SEO

- **Selalu isi Alt Text** untuk SEO
- Alt text deskriptif (bukan generic)
- Example: "Flash sale banner 70% off electronics"

## 🔧 Technical Details

### Image Processing Pipeline

```
1. User selects file
   ↓
2. Client-side validation (type, size)
   ↓
3. FormData upload ke /api/upload-carousel
   ↓
4. Server validation
   ↓
5. Sharp processing:
   - Resize 1920x1080
   - Convert to WebP
   - Quality 85%
   ↓
6. Save to /public/uploads/carousel/
   ↓
7. Return URL ke client
   ↓
8. Update state dengan URL
   ↓
9. Show preview
```

### API Response Examples

**Success Upload:**

```json
{
  "url": "/uploads/carousel/carousel-1699702345678-x7k9m2-hero.webp",
  "message": "Carousel image uploaded successfully"
}
```

**Error - Invalid Type:**

```json
{
  "error": "Invalid file type. Only JPEG, PNG, and WebP images are allowed."
}
```

**Error - File Too Large:**

```json
{
  "error": "File too large. Maximum size is 5MB."
}
```

## 🧪 Testing

### Test Upload

1. Login sebagai admin
2. Buka Home Page Editor
3. Add Slide
4. Upload berbagai format (JPEG, PNG, WebP)
5. Verify preview muncul
6. Verify file tersimpan di `/public/uploads/carousel/`
7. Save dan cek homepage

### Test Validation

1. Upload file >5MB (should error)
2. Upload file non-image (should error)
3. Try save tanpa image (should error)
4. Upload 10+ images (should work)

### Test Delete

1. Upload image
2. Klik "Remove Image"
3. Verify file deleted dari `/public/uploads/carousel/`
4. Verify preview hilang

## 🔮 Future Improvements

1. **Drag & Drop Reorder**: Ubah urutan slides
2. **Bulk Upload**: Upload multiple images sekaligus
3. **Image Editor**: Crop, rotate, filter
4. **CDN Integration**: Upload ke CDN untuk performance
5. **Lazy Loading**: Optimize loading carousel
6. **Mobile Images**: Generate mobile-specific sizes
7. **Auto Delete**: Delete unused images otomatis
8. **Image Library**: Reuse uploaded images

## 🆘 Troubleshooting

### Upload Gagal

- Cek file size < 5MB
- Cek format (JPEG/PNG/WebP only)
- Cek koneksi internet
- Cek console untuk error

### Preview Tidak Muncul

- Wait beberapa detik untuk upload
- Refresh page
- Cek folder `/public/uploads/carousel/` ada file-nya

### Save Error

- Pastikan minimal 1 slide punya image
- Cek console browser untuk error detail
- Cek network tab untuk API call

### Image Tidak Muncul di Homepage

- Hard refresh (Ctrl+F5)
- Cek path image di database
- Cek file exists di server

## 📞 Related Files

- `/src/app/api/upload-carousel/route.ts` - Upload API
- `/src/components/admin/AdminHomePageEditor.tsx` - Admin UI
- `/src/app/(customer)/page.tsx` - Homepage display
- `/prisma/seed-pages.js` - Default data seeder

---

**Last Updated**: November 11, 2025  
**Version**: 2.0 (Upload System)
