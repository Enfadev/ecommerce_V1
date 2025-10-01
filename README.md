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

### Option 1: Docker (Recommended)

Cara termudah untuk menjalankan aplikasi lengkap dengan database:

1. Pastikan Docker Desktop sudah terinstall dan berjalan
2. Copy environment variables:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Edit file `.env` sesuai kebutuhan
4. Jalankan dengan Docker Compose:

   ```powershell
   # Development mode dengan watch (hot reload)
   .\docker.ps1 dev:watch

   # Atau development biasa (background)
   .\docker.ps1 dev:up

   # Atau development (foreground dengan logs)
   docker compose up --build
   ```

5. Akses aplikasi di [http://localhost:3000](http://localhost:3000)

**Docker Commands:**

```powershell
.\docker.ps1 dev:up      # Start development (background)
.\docker.ps1 dev:watch   # Start dengan hot reload
.\docker.ps1 stop        # Stop containers
.\docker.ps1 logs        # Show logs
.\docker.ps1 migrate     # Run migrations
.\docker.ps1 seed        # Seed database
.\docker.ps1 studio      # Open Prisma Studio
.\docker.ps1 help        # Show all commands
```

Dokumentasi lengkap Docker: [DOCKER_SETUP.md](./DOCKER_SETUP.md)

### Option 2: Local Development

1. Install dependencies:
   ```bash
   npm install
   # atau
   yarn install
   ```
2. Setup database (lihat bagian "Database & Prisma" di bawah)
3. Jalankan development server:
   ```bash
   npm run dev
   # atau
   yarn dev
   ```
4. Buka [http://localhost:3000](http://localhost:3000) di browser.

## Database & Prisma (MySQL)

Project ini menggunakan Prisma dengan provider MySQL. Pastikan MySQL berjalan dan environment variable `DATABASE_URL` tersedia.

### 1) Siapkan Environment Variables

Pilih salah satu:

- Buat file `.env` di root project:

  ```bash
  DATABASE_URL="mysql://root:@localhost:3306/ecommerce_db_v1"
  NODE_ENV="development"
  JWT_SECRET="dev-secret-change-this"
  ```

- Atau set sementara di Windows (cmd) sebelum menjalankan perintah:

  ```bash
  set DATABASE_URL=mysql://root:@localhost:3306/ecommerce_db_v1
  ```

Catatan: Sesuaikan user/password/host/port/nama database dengan environment Anda. Jika perlu, buat database di MySQL: `CREATE DATABASE ecommerce_db_v1;`.

### 2) Skrip yang Tersedia

Berikut skrip npm untuk membantu proses Prisma:

- `npm run prisma:migrate:status` — melihat status migrasi di DB target
- `npm run prisma:migrate:dev` — (development) membuat migrasi baru dari perubahan schema dan menerapkannya
- `npm run prisma:migrate:deploy` — (deploy/production) menerapkan migrasi yang sudah ada tanpa membuat yang baru
- `npm run prisma:generate` — generate Prisma Client
- `npm run prisma:studio` — membuka Prisma Studio (GUI untuk data)
- `npm run prisma:reset` — reset database (drop + apply semua migrasi) lalu menjalankan seed

### 3) Jalankan Migrasi

Development (membuat & menerapkan migrasi baru jika ada perubahan pada `prisma/schema.prisma`):

```bash
npm run prisma:migrate:dev
```

Deploy/Production (hanya menerapkan migrasi yang sudah ada):

```bash
npm run prisma:migrate:deploy
```

Lihat status migrasi:

```bash
npm run prisma:migrate:status
```

### 4) Seed Data (opsional)

Project ini menyertakan `prisma/seed.js`:

```bash
npm run seed
```

Atau reset DB bersih lalu seed ulang:

```bash
npm run prisma:reset
```

### 5) Prisma Studio (opsional)

```bash
npm run prisma:studio
```

### Troubleshooting Cepat

- Missing `DATABASE_URL`: pastikan `.env` atau sudah `set DATABASE_URL=...` di terminal yang sama.
- Error koneksi (ECONNREFUSED/ER_ACCESS_DENIED_ERROR): cek host/port/user/password MySQL, dan pastikan database ada.
- Hak akses membuat skema/tabel: gunakan user MySQL dengan hak CREATE/ALTER/TABLE.

### Catatan Production

- Gunakan `npm run prisma:migrate:deploy` di lingkungan production/CI.
- Simpan environment variables melalui platform hosting (bukan file `.env`).
- Ganti `JWT_SECRET` dengan nilai kuat dan rahasiakan.

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
