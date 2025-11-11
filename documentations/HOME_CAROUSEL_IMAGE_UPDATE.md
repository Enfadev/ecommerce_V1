# Home Carousel Image Update

## Ringkasan Perubahan

Carousel di homepage telah diubah dari format text-based (dengan title, subtitle, description, button, dll) menjadi format image-based dengan **sistem upload langsung**, tidak lagi menggunakan URL manual.

## Perubahan yang Dilakukan

### 1. Interface HeroSlide

**Sebelum:**

```typescript
interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  badgeText: string;
  badgeIcon: string;
  bgGradient: string;
  rightIcon: string;
}
```

**Sesudah:**

```typescript
interface HeroSlide {
  imageUrl: string;
  alt?: string;
}
```

### 2. File yang Diubah

#### a. `/src/components/admin/AdminHomePageEditor.tsx`

- Interface `HeroSlide` disederhanakan
- Form input hanya untuk `imageUrl` dan `alt` text
- Validasi minimal 1 image carousel (tidak bisa dihapus jika hanya tersisa 1)
- Preview image ditambahkan di form editor
- Fitur error handling untuk image yang gagal dimuat

#### b. `/src/app/(customer)/page.tsx`

- Interface `HeroSlide` disesuaikan
- Carousel sekarang menampilkan full-width image
- Navigation arrows dan dot indicators hanya muncul jika ada lebih dari 1 slide
- Removed unused imports (Badge)

#### c. `/prisma/seed-pages.js`

- Data seeder diubah ke format image:
  ```javascript
  heroSlides: [
    {
      imageUrl: "/images/hero-slide-1.jpg",
      alt: "Flash sale up to 70% off",
    },
    {
      imageUrl: "/images/hero-slide-2.jpg",
      alt: "Free shipping across Indonesia",
    },
    {
      imageUrl: "/images/hero-slide-3.jpg",
      alt: "Special cashback for new members",
    },
  ];
  ```

### 3. Database Schema

Tidak ada perubahan pada schema database karena field `heroSlides` tetap menggunakan JSON type yang flexible.

## Fitur Baru

1. **Unlimited Carousel Images**: Admin bisa menambah carousel image sebanyak yang diinginkan (tidak terbatas 3 saja)
2. **Minimum Requirement**: Minimal harus ada 1 image di carousel
3. **Image Preview**: Preview image langsung di admin editor
4. **Alt Text Support**: Mendukung alt text untuk accessibility
5. **Error Handling**: Fallback ke placeholder jika image gagal dimuat
6. **Conditional Navigation**: Navigation arrows dan dot indicators hanya muncul jika ada lebih dari 1 slide

## Cara Menggunakan

### Admin Panel

1. Login sebagai admin
2. Buka **Home Page Editor**
3. Scroll ke section **Hero Carousel Slides**
4. Untuk menambah slide baru:
   - Klik tombol **"Add Slide"**
   - Masukkan URL image (bisa external URL atau path relatif)
   - Masukkan alt text (opsional tapi recommended untuk SEO)
   - Preview akan muncul otomatis
5. Untuk menghapus slide:
   - Klik icon trash pada slide yang ingin dihapus
   - Note: Tidak bisa menghapus jika hanya tersisa 1 slide
6. Klik **"Save Changes"** untuk menyimpan

### Format Image URL

Image URL bisa menggunakan:

- **Path Relatif**: `/images/hero-slide-1.jpg`
- **External URL**: `https://example.com/image.jpg`
- **Next.js Public Folder**: Letakkan image di folder `/public/images/`

### Recommended Image Specs

- **Resolusi**: Minimal 1920x1080px (Full HD)
- **Aspect Ratio**: 16:9 atau 21:9 untuk landscape
- **Format**: JPG, PNG, atau WebP
- **File Size**: Maksimal 500KB untuk performa optimal
- **Optimization**: Gunakan compressed/optimized images

## Migration Guide

Jika sudah ada data carousel dengan format lama di database:

1. Backup database terlebih dahulu
2. Jalankan seeder untuk update format:
   ```bash
   npm run seed
   # atau
   node prisma/seed-pages.js
   ```
3. Atau manual update via admin panel

## Testing

1. Pastikan database running (Docker atau local MySQL)
2. Jalankan seeder:
   ```bash
   npm run seed
   ```
3. Buka homepage dan verifikasi carousel menampilkan images
4. Test admin panel untuk add/edit/delete carousel images
5. Verify navigation arrows dan dots berfungsi dengan baik
6. Test responsive di mobile dan desktop

## Notes

- **Database**: Tidak perlu migrasi schema, karena JSON field flexible
- **API Route**: Tidak ada perubahan di `/api/home-page/route.ts`
- **SEO**: Alt text penting untuk SEO dan accessibility
- **Performance**: Consider lazy loading atau image optimization untuk carousel dengan banyak images
- **Lint Warning**: Ada warning untuk `<img>` tag, bisa consider menggunakan Next.js `<Image>` component untuk optimization lebih baik

## Future Improvements

1. Integrasi dengan image upload service
2. Image optimization otomatis
3. Drag & drop untuk reorder slides
4. Auto-play carousel dengan customizable duration
5. Transition effects customization
6. Link/CTA overlay di atas carousel image
7. Mobile-specific image variants

## Troubleshooting

### Image tidak muncul

- Cek URL image sudah benar
- Cek file ada di folder `/public/` jika menggunakan path relatif
- Cek CORS jika menggunakan external URL

### Carousel tidak bisa di-save

- Cek minimal ada 1 image
- Cek format data sudah benar
- Cek console browser untuk error

### Preview error di admin

- Fallback placeholder akan muncul otomatis
- Cek URL image valid dan accessible

## Related Files

- `/src/components/admin/AdminHomePageEditor.tsx`
- `/src/app/(customer)/page.tsx`
- `/prisma/seed-pages.js`
- `/src/app/api/home-page/route.ts`
