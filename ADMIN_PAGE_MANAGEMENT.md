# Admin Page Management System

## Overview
Sistem Page Management untuk admin memungkinkan pengelolaan konten untuk semua halaman utama website e-commerce. Admin dapat mengedit konten halaman Home, About, Products, Events, dan Contact melalui interface yang user-friendly.

## Fitur yang Telah Diimplementasi

### 1. Database Models
Telah ditambahkan model database baru untuk setiap halaman:
- `HomePage` - Konten halaman beranda
- `AboutPage` - Konten halaman tentang kami
- `EventPage` - Konten halaman event dan promosi
- `ProductPage` - Konten halaman produk
- `ContactPage` - Konten halaman kontak (sudah ada sebelumnya)

### 2. API Routes
API endpoints untuk setiap halaman:
- `/api/home-page` - CRUD operations untuk halaman beranda
- `/api/about-page` - CRUD operations untuk halaman tentang kami
- `/api/event-page` - CRUD operations untuk halaman event
- `/api/product-page` - CRUD operations untuk halaman produk
- `/api/contact-page` - CRUD operations untuk halaman kontak (sudah ada)

### 3. Admin Components
#### AdminPageManager (`/src/components/AdminPageManager.tsx`)
Komponen utama yang menggabungkan semua editor halaman dalam interface tab yang mudah digunakan.

#### Editor Components:
- `AdminHomePageEditor` - Editor untuk halaman beranda
- `AdminAboutPageEditor` - Editor untuk halaman tentang kami
- `AdminEventPageEditor` - Editor untuk halaman event
- `AdminProductPageEditor` - Editor untuk halaman produk
- `AdminContactPageEditor` - Editor untuk halaman kontak (sudah ada)

### 4. Admin Navigation
Menu "Page Management" telah ditambahkan ke sidebar admin dengan ikon FileText.

### 5. Data Seeding
File seeder (`prisma/seed-pages.js`) untuk mengisi data default semua halaman.

## Cara Menggunakan

### 1. Akses Page Management
1. Login ke admin panel
2. Klik menu "Page Management" di sidebar
3. Pilih halaman yang ingin diedit dari tab yang tersedia

### 2. Edit Konten Halaman
Setiap editor halaman memiliki section yang dapat diedit:

#### Home Page Editor:
- **Hero Section**: Title, subtitle, description
- **Hero Carousel Slides**: Multiple promotional slides
- **Features Section**: Fitur-fitur utama website
- **Statistics Section**: Data statistik perusahaan

#### About Page Editor:
- **Hero Section**: Title, subtitle, description
- **Company Information**: Story, mission, vision
- **Company Values**: Nilai-nilai perusahaan
- **Statistics**: Data statistik
- **Team Members**: Informasi tim
- **Company Timeline**: Sejarah perusahaan

#### Event Page Editor:
- **Hero Section**: Title, subtitle, description
- **Active Events**: Event yang sedang berjalan
- **Upcoming Events**: Event yang akan datang
- **Past Events**: Event yang sudah selesai
- **Event Categories**: Kategori event

#### Product Page Editor:
- **Hero Section**: Title, subtitle, description
- **Promotional Banner**: Banner promosi
- **Featured Categories**: Kategori unggulan
- **Sort Options**: Opsi pengurutan produk
- **SEO Content**: Konten SEO

#### Contact Page Editor:
- **Hero Section**: Title, subtitle, description
- **Contact Methods**: Metode kontak
- **Office Locations**: Lokasi kantor
- **Business Hours**: Jam operasional
- **Social Media**: Media sosial

### 3. Menyimpan Perubahan
1. Setelah mengedit konten, klik tombol "Save Changes"
2. Sistem akan menyimpan perubahan ke database
3. Notifikasi sukses akan muncul jika berhasil

## Struktur File

```
src/
├── app/
│   ├── admin/
│   │   └── page-management/
│   │       └── page.tsx
│   └── api/
│       ├── home-page/
│       ├── about-page/
│       ├── event-page/
│       └── product-page/
├── components/
│   ├── AdminPageManager.tsx
│   ├── AdminHomePageEditor.tsx
│   ├── AdminAboutPageEditor.tsx
│   ├── AdminEventPageEditor.tsx
│   ├── AdminProductPageEditor.tsx
│   └── AdminContactPageEditor.tsx
└── prisma/
    ├── schema.prisma
    └── seed-pages.js
```

## Database Schema

### HomePage
- `heroTitle`, `heroSubtitle`, `heroDescription`: Hero section content
- `heroSlides`: JSON array of carousel slides
- `features`: JSON array of features
- `statsData`: JSON array of statistics
- `aboutPreview`: JSON object for about preview
- `testimonialsData`: JSON array of testimonials

### AboutPage
- `heroTitle`, `heroSubtitle`, `heroDescription`: Hero section content
- `companyStory`, `mission`, `vision`: Company information
- `values`: JSON array of company values
- `statistics`: JSON array of statistics
- `features`: JSON array of features
- `teamMembers`: JSON array of team members
- `timeline`: JSON array of company history

### EventPage
- `heroTitle`, `heroSubtitle`, `heroDescription`: Hero section content
- `activeEvents`: JSON array of active events
- `upcomingEvents`: JSON array of upcoming events
- `pastEvents`: JSON array of past events
- `eventCategories`: JSON array of event categories

### ProductPage
- `heroTitle`, `heroSubtitle`, `heroDescription`: Hero section content
- `featuredCategories`: JSON array of featured categories
- `promotionalBanner`: JSON object for promotional banner
- `filterOptions`: JSON array of filter options
- `sortOptions`: JSON array of sort options
- `seoContent`: JSON array of SEO content blocks

## Teknologi yang Digunakan
- **Next.js 15** - React framework
- **Prisma** - ORM untuk database
- **MySQL** - Database
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Lucide React** - Icons

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Generate Prisma client
npx prisma generate

# Push database changes
npx prisma db push

# Seed page data
node prisma/seed-pages.js
```

## Notes
- Semua data konten disimpan dalam format JSON untuk fleksibilitas
- Editor menggunakan form validation untuk memastikan data yang valid
- Interface responsive dan user-friendly
- Real-time save dengan loading indicators
- Error handling untuk semua operasi database

Sistem ini memberikan kontrol penuh kepada admin untuk mengelola konten website tanpa perlu mengubah kode.
