# Brand Configuration Guide

Aplikasi ini telah dikonfigurasi untuk bisa dengan mudah diubah menjadi brand apapun. Berikut cara mengubah branding:

## 🏷️ Mengubah Brand Name dan Info

Edit file `src/components/ui/Brand.tsx`:

```typescript
// Brand configuration - easy to change for different businesses
const BRAND_CONFIG = {
  name: "YourBrandName",           // Nama brand Anda
  tagline: "Your brand tagline",   // Tagline/deskripsi singkat
  website: "https://yourdomain.com", // Website URL
  email: "hello@yourdomain.com"    // Email kontak
};
```

## 🎨 Mengubah Warna Primary

Edit file `src/app/globals.css` atau `tailwind.config.js`:

```css
:root {
  --primary: your-color-value;
  --primary-foreground: your-text-color;
}
```

## 📝 Mengubah Meta Tags SEO

Meta tags akan otomatis menggunakan brand config, tapi Anda bisa custom di `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: `${brandConfig.name} - Your Custom Title`,
  description: `Your custom description for ${brandConfig.name}.`,
};
```

## 🖼️ Mengubah Logo/Favicon

1. Ganti file favicon di `src/app/favicon.ico`
2. Jika ingin logo gambar, edit komponen Brand:

```tsx
// Dalam Brand component, ganti teks dengan Image
<Image src="/logo.png" alt={BRAND_CONFIG.name} width={150} height={40} />
```

## 📍 Penggunaan Brand Component

Brand component sudah digunakan di:
- ✅ Header (dengan link ke home)
- ✅ Footer (sebagai heading)
- ✅ Meta tags (otomatis)

Cara menggunakan:

```tsx
import { Brand } from "@/components/ui/Brand";

// Logo dengan link ke home
<Brand linkable size="lg" />

// Heading brand tanpa link
<Brand as="h1" size="xl" />

// Brand dengan kelas custom
<Brand className="text-center" />
```

## 🎯 Keuntungan Sistem Ini

1. **Centralized**: Semua brand info di satu tempat
2. **Consistent**: Styling konsisten di seluruh aplikasi  
3. **Universal**: Mudah diubah untuk brand apapun
4. **Scalable**: Bisa ditambah konfigurasi lain (alamat, sosmed, dll)
5. **SEO Friendly**: Meta tags otomatis update

## 📋 Checklist Rebranding

- [ ] Update `BRAND_CONFIG` di Brand.tsx
- [ ] Ganti favicon.ico
- [ ] Update warna primary (opsional)
- [ ] Test semua halaman
- [ ] Update README dan dokumentasi
- [ ] Update environment variables jika ada

Dengan sistem ini, aplikasi bisa dengan mudah diubah untuk brand apapun dalam hitungan menit! 🚀
