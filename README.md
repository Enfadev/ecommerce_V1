# E-Commerce Test - Next.js

Ini adalah project e-commerce berbasis [Next.js](https://nextjs.org) dengan dark mode sebagai tema utama. Website ini memiliki beberapa fitur utama seperti katalog produk, wishlist, keranjang belanja, checkout, riwayat pesanan, dan halaman admin untuk pengelolaan produk.

## Daftar Halaman & Navigasi

- [Beranda](https://localhost:3000/) (`/`)
- [Produk](https://localhost:3000/product) (`/product`)
- [Detail Produk](https://localhost:3000/product/[id]) (`/product/[id]`)
- [Wishlist](https://localhost:3000/wishlist) (`/wishlist`)
- [Keranjang & Checkout](https://localhost:3000/checkout) (`/checkout`)
- [Riwayat Pesanan](https://localhost:3000/order-history) (`/order-history`)
- [Profil](https://localhost:3000/profile) (`/profile`)
- [Sign In](https://localhost:3000/signin) (`/signin`)
- [Register](https://localhost:3000/register) (`/register`)
- [Admin Produk](https://localhost:3000/admin/product) (`/admin/product`)
- [Tentang](https://localhost:3000/about) (`/about`)
- [FAQ](https://localhost:3000/faq) (`/faq`)
- [Kontak](https://localhost:3000/kontak) (`/kontak`)

## Fitur Utama

- Katalog produk dengan filter
- Wishlist produk
- Keranjang belanja & ringkasan pesanan
- Checkout dengan form validasi
- Riwayat pesanan
- Halaman admin untuk tambah/edit produk
- Dark mode sebagai default
- Responsive & modern UI

## Stack & Library

- Next.js App Router
- Tailwind CSS (dark mode enabled)
- Komponen UI: shadcn/ui (lihat di `src/components/ui/`)
- State management: Context API (cart, wishlist)
- Form: React Hook Form + Zod
- Data dummy: `src/data/products.ts`

## Cara Menjalankan

1. Install dependencies:
   ```bash
   npm install
   # atau
   yarn install
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   # atau
   yarn dev
   ```
3. Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Folder Penting

- `src/app/` - Routing & halaman utama
- `src/components/` - Komponen utama & UI
- `src/data/` - Data dummy produk
- `src/hooks/` - Custom hooks
- `src/lib/` - Utility functions

## Catatan

- Semua tampilan default dark mode.
- Silakan cek file `FITUR_FRONTEND_NEXT.md` untuk daftar fitur yang sedang/akan dikembangkan.

---

_Project ini dibuat untuk kebutuhan demo dan pengembangan fitur e-commerce modern berbasis Next.js._
