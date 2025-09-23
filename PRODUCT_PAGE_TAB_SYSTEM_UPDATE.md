# Product Page SEO Settings Update - Tab System

## Ringkasan Perubahan

Telah diupdate pengaturan SEO untuk admin product page editor menggunakan sistem tabs yang konsisten dengan page management lainnya (seperti Contact Page Editor).

## Perubahan Frontend

### 1. AdminProductPageEditor.tsx - Update dengan Tab System

- **Import baru**:
  - Menambahkan import `Tabs, TabsContent, TabsList, TabsTrigger` untuk tab system
  - Menambahkan icon `Globe, Package` dari lucide-react
  - Tetap menggunakan `SeoSettingsCard` component
- **Interface SEO**: Menambahkan `SeoData` interface untuk type safety
- **Update ProductPageData**: Menambahkan SEO fields:

  - `metaTitle?: string`
  - `metaDescription?: string`
  - `metaKeywords?: string`
  - `ogTitle?: string`
  - `ogDescription?: string`
  - `ogImageUrl?: string`
  - `canonicalUrl?: string`
  - `noindex?: boolean`

- **Initial State**: Update state awal untuk include semua SEO fields
- **Handler**: `handleSeoFieldChange` untuk mengelola perubahan SEO fields

### 2. Struktur Tabs Baru

```tsx
<Tabs defaultValue="content" className="space-y-6">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="content" className="flex items-center gap-2">
      <Package className="w-4 h-4" />
      Content
    </TabsTrigger>
    <TabsTrigger value="seo" className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      SEO Settings
    </TabsTrigger>
  </TabsList>

  <TabsContent value="content" className="space-y-6">
    {/* Semua konten halaman product */}
  </TabsContent>

  <TabsContent value="seo">
    <SeoSettingsCard ... />
  </TabsContent>
</Tabs>
```

### 3. Tab Content Distribution

- **Tab "Content"**:

  - Hero Section
  - Promotional Banner
  - Featured Categories
  - Filter Options
  - Sort Options
  - SEO Content Blocks

- **Tab "SEO Settings"**:
  - Komponen `SeoSettingsCard` dengan semua field SEO

## Backend API (Sudah Ready)

### 1. API Route: `/api/product-page`

- **GET**: Mengambil data product page termasuk SEO fields
- **POST**: Membuat product page baru dengan SEO fields
- **PUT**: Update product page existing dengan SEO fields

### 2. Database Schema

Model `ProductPage` di Prisma sudah memiliki semua SEO fields yang diperlukan.

## Fitur SEO yang Tersedia

1. **Meta Title & Description**: Custom title dan description untuk search engine
2. **Meta Keywords**: Keywords untuk SEO (optional)
3. **Open Graph**: ogTitle, ogDescription, ogImageUrl untuk social media sharing
4. **Canonical URL**: URL canonical untuk mencegah duplicate content
5. **Noindex**: Option untuk mencegah indexing oleh search engine

## Cara Penggunaan

1. Buka admin panel → Settings → Product Page
2. **Pilih tab "SEO Settings"** di bagian atas (tab kedua)
3. Isi field SEO sesuai kebutuhan:

   - **Meta Title**: Title khusus untuk halaman product (50-60 karakter)
   - **Meta Description**: Deskripsi khusus untuk halaman product (150-160 karakter)
   - **Meta Keywords**: Keywords dipisah koma
   - **OG Title**: Title untuk social media sharing
   - **OG Description**: Deskripsi untuk social media sharing
   - **OG Image URL**: URL gambar untuk social media preview
   - **Canonical URL**: URL canonical (biasanya URL halaman itu sendiri)
   - **No Index**: Centang jika tidak ingin halaman di-index search engine

4. Klik "Save Changes" untuk menyimpan (button tetap di header)

## UI/UX Improvements

### Konsistensi Design

- **Pattern yang sama** dengan Contact Page Editor dan page management lainnya
- **Tab navigation** yang familiar untuk admin users
- **Clean separation** antara content management dan SEO settings

### User Experience

- **Organized interface**: Pemisahan yang jelas antara konten dan SEO
- **Better workflow**: Admin dapat fokus pada satu aspek (content atau SEO) tanpa scroll panjang
- **Icon indicators**: Package icon untuk Content, Globe icon untuk SEO Settings

### Navigation Benefits

- **Quick switching**: Mudah berpindah antara content editing dan SEO optimization
- **Reduced cognitive load**: Interface tidak overwhelming dengan terlalu banyak field sekaligus
- **Consistent experience**: Sama dengan page editor lainnya di sistem

## Fallback System

- Jika field SEO kosong, sistem akan menggunakan default SEO dari system settings
- Jika default system juga kosong, akan menggunakan hardcoded fallback

## Integrasi dengan Client-Side

Data SEO siap untuk diintegrasikan dengan halaman client-side product menggunakan:

1. `generateMetadata` function di Next.js
2. API endpoint `/api/product-page`
3. `seo-utils.ts` utility untuk generate metadata

## Status

✅ Tab system implementation completed
✅ SEO settings moved to dedicated tab
✅ UI consistency dengan page management lainnya
✅ Backend API ready dan terintegrasi
✅ Database schema ready
✅ Component integration done dengan tab structure
✅ User experience improved dengan organized interface

## Testing Checklist

1. ✅ Akses admin panel product page editor
2. ✅ Test navigasi antara tab "Content" dan "SEO Settings"
3. ⏳ Isi field SEO di tab "SEO Settings" dan verify save functionality
4. ⏳ Verifikasi data tersimpan di database dengan benar
5. ⏳ Test tampilan SEO metadata di halaman client-side product

## Next Steps

Untuk melengkapi implementasi:

1. Test save/load functionality untuk SEO data
2. Integrasikan dengan halaman client-side product layout
3. Verify SEO metadata muncul correctly di HTML head
4. Test social media preview dengan Open Graph data
